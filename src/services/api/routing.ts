import { API_ENDPOINTS } from "@/constants/api";
import { MOCK_ROUTES } from "@/lib/mock/routes";
import type { RouteOption, RouteOptimizeRequest, RouteOptimizeResponse } from "@/types/route";
import { apiGet, apiPost } from "./client";

const USE_MOCK = true;

export async function optimizeRoutes(
  request: RouteOptimizeRequest
): Promise<RouteOptimizeResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return {
      routes: MOCK_ROUTES,
      requestId: `req-${Date.now()}`,
      generatedAt: new Date().toISOString(),
    };
  }
  return apiPost<RouteOptimizeResponse>(API_ENDPOINTS.routes.optimize, request);
}

export async function fetchRoute(id: string): Promise<RouteOption> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    const route = MOCK_ROUTES.find((r) => r.id === id);
    if (!route) throw new Error(`Route ${id} not found`);
    return route;
  }
  return apiGet<RouteOption>(API_ENDPOINTS.routes.detail(id));
}
