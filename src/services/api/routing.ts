import { API_ENDPOINTS } from "@/constants/api";
import { MOCK_ROUTES } from "@/lib/mock/routes";
import { MOCK_CROSSINGS } from "@/lib/mock/crossings";
import { useRouteStore } from "@/stores/route.store";
import type { Crossing } from "@/types/crossing";
import type { RouteOption, RouteOptimizeRequest, RouteOptimizeResponse } from "@/types/route";
import { apiGet, apiPost } from "./client";

// true = no backend yet: routes are computed client-side (OSRM + crossing check)
const USE_MOCK = true;

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";
const CROSSING_RADIUS_M = 250; // tune: how close a crossing must be to count as "on the route"
const DETOUR_DEG = 0.015; // ~1.6 km sideways detour to force alternative routes

const STATUS_WEIGHT: Record<string, number> = {
  closed: 1,
  closing: 0.8,
  uncertain: 0.5,
  open: 0,
};

type LngLat = [number, number];
type Point = { lat: number; lng: number };
type OsrmRoute = { geometry: GeoJSON.LineString; distance: number; duration: number };
type OsrmResponse = { code: string; routes?: OsrmRoute[] };

type Candidate = {
  geometry: GeoJSON.LineString;
  distanceKm: number;
  baseMin: number;
  delay: number;
  eta: number;
  hits: Crossing[];
  risk: number;
  confidence: number;
};

const cache = new Map<string, RouteOption[]>();
const round1 = (n: number) => Math.round(n * 10) / 10;

async function fetchOsrm(points: LngLat[], alternatives: boolean): Promise<OsrmRoute[]> {
  const path = points.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const url = `${OSRM_BASE}/${path}?overview=full&geometries=geojson&alternatives=${alternatives}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM ${res.status}`);
  const data = (await res.json()) as OsrmResponse;
  if (data.code !== "Ok" || !data.routes) return [];
  return data.routes;
}

function detourPoints(o: Point, d: Point): [LngLat, LngLat] {
  const midLat = (o.lat + d.lat) / 2;
  const midLng = (o.lng + d.lng) / 2;
  const cos = Math.cos((midLat * Math.PI) / 180);
  const dx = (d.lng - o.lng) * cos;
  const dy = d.lat - o.lat;
  const len = Math.hypot(dx, dy) || 1;
  const off = Math.min(DETOUR_DEG, len * 0.35);
  const px = (-dy / len) * off;
  const py = (dx / len) * off;
  return [
    [midLng + px / cos, midLat + py],
    [midLng - px / cos, midLat - py],
  ];
}

function minDistanceToLineM(line: LngLat[], p: LngLat): number {
  const mx = 111320 * Math.cos((p[1] * Math.PI) / 180);
  const my = 110540;
  let min = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    const ax = (line[i][0] - p[0]) * mx;
    const ay = (line[i][1] - p[1]) * my;
    const bx = (line[i + 1][0] - p[0]) * mx;
    const by = (line[i + 1][1] - p[1]) * my;
    const dx = bx - ax;
    const dy = by - ay;
    const l2 = dx * dx + dy * dy;
    const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / l2));
    const dist = Math.hypot(ax + t * dx, ay + t * dy);
    if (dist < min) min = dist;
  }
  return min;
}

function scoreRoute(r: OsrmRoute, crossings: Crossing[]): Candidate {
  const coords = r.geometry.coordinates as LngLat[];
  const hits = crossings.filter(
    (c) => minDistanceToLineM(coords, [c.longitude, c.latitude]) <= CROSSING_RADIUS_M
  );
  const delay = hits.reduce((s, c) => s + c.expectedDelay * (STATUS_WEIGHT[c.status] ?? 0), 0);
  const baseMin = r.duration / 60;
  return {
    geometry: r.geometry,
    distanceKm: r.distance / 1000,
    baseMin,
    delay,
    eta: Math.round(baseMin + delay),
    hits,
    risk: hits.length ? Math.max(...hits.map((c) => c.riskScore)) : 0,
    confidence: hits.length
      ? Math.round(hits.reduce((s, c) => s + c.confidence, 0) / hits.length)
      : 95,
  };
}

async function computeRoutesClientSide(req: RouteOptimizeRequest): Promise<RouteOption[]> {
  const { origin: o, destination: d } = req;
  const key = `${o.lat.toFixed(4)},${o.lng.toFixed(4)}|${d.lat.toFixed(4)},${d.lng.toFixed(4)}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const start: LngLat = [o.lng, o.lat];
  const end: LngLat = [d.lng, d.lat];
  const [viaA, viaB] = detourPoints(o, d);

  const settled = await Promise.allSettled([
    fetchOsrm([start, end], true),
    fetchOsrm([start, viaA, end], false),
    fetchOsrm([start, viaB, end], false),
  ]);
  const raw = settled.flatMap((s) => (s.status === "fulfilled" ? s.value : []));
  if (raw.length === 0) throw new Error("No routes returned");

  // dedupe near-identical routes
  const seen = new Set<string>();
  const unique = raw.filter((r) => {
    const k = `${Math.round(r.distance / 100)}-${Math.round(r.duration / 30)}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  let scored = unique.map((r) => scoreRoute(r, MOCK_CROSSINGS));
  const shortest = Math.min(...scored.map((s) => s.distanceKm));
  scored = scored.filter((s) => s.distanceKm <= shortest * 1.6); // drop silly detours

  const fastest = [...scored].sort((a, b) => a.baseMin - b.baseMin)[0];
  const best = [...scored].sort((a, b) => a.eta - b.eta || a.risk - b.risk)[0];
  const balanced = scored
    .filter((s) => s !== fastest && s !== best)
    .sort((a, b) => a.eta + a.risk / 20 - (b.eta + b.risk / 20))[0];

  const toOption = (
    c: Candidate,
    id: string,
    type: RouteOption["type"],
    recommended: boolean
  ): RouteOption => ({
    id,
    type,
    eta: c.eta,
    distance: round1(c.distanceKm),
    expectedDelay: round1(c.delay),
    crossingRisk: c.risk,
    confidence: c.confidence,
    timeSaved: Math.max(0, round1(fastest.eta - c.eta)),
    polyline: "",
    crossings: c.hits.map((h) => h.id),
    recommended,
    geometry: c.geometry,
  });

  const out: RouteOption[] = [toOption(fastest, "route-fastest", "fastest", best === fastest)];
  if (best !== fastest) out.push(toOption(best, "route-avoid-crossings", "avoid-crossings", true));
  if (balanced) out.push(toOption(balanced, "route-balanced", "balanced", false));

  console.info("[routing]", out.map((r) => `${r.id}: ${r.eta}min, crossings=[${r.crossings.join(",")}]`));
  cache.set(key, out);
  return out;
}

export async function optimizeRoutes(
  request: RouteOptimizeRequest
): Promise<RouteOptimizeResponse> {
  if (USE_MOCK) {
    try {
      const routes = await computeRoutesClientSide(request);
      return {
        routes,
        requestId: `local-${Date.now()}`,
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn("[routing] OSRM failed, falling back to mock routes", err);
      await new Promise((r) => setTimeout(r, 400));
      return {
        routes: MOCK_ROUTES,
        requestId: `mock-${Date.now()}`,
        generatedAt: new Date().toISOString(),
      };
    }
  }
  return apiPost<RouteOptimizeResponse>(API_ENDPOINTS.routes.optimize, request);
}

export async function fetchRoute(id: string): Promise<RouteOption> {
  if (USE_MOCK) {
    const local = useRouteStore.getState().routes.find((r) => r.id === id);
    if (local) return local;
    const route = MOCK_ROUTES.find((r) => r.id === id);
    if (!route) throw new Error(`Route ${id} not found`);
    return route;
  }
  return apiGet<RouteOption>(API_ENDPOINTS.routes.detail(id));
}