"use client";

import { useEffect, useRef, useState } from "react";

import { useMapStore } from "@/stores/map.store";
import { useCrossingStore } from "@/stores/crossing.store";
import { useRouteStore } from "@/stores/route.store";
import { useTimelineStore } from "@/stores/timeline.store";
import {
  CROSSING_STATUS_COLORS,
  MUMBAI_DEFAULT_VIEWPORT,
} from "@/constants/map";
import type { Crossing, CrossingStatus } from "@/types/crossing";
import type { RouteOption } from "@/types/route";

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const ROUTE_COLORS: Record<string, string> = {
  "route-fastest": "#0A0A0A",
  "route-avoid-crossings": "#22C55E",
  "route-balanced": "#3B82F6",
};

type MapViewProps = {
  className?: string;
  interactive?: boolean;
  onCrossingClick?: (id: string) => void;
};

type RailwayFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  {
    id?: string;
    name?: string;
    line?: string;
    color?: string;
  }
>;

type CrossingFeatureProps = {
  id: string;
  name: string;
  status: CrossingStatus;
  confidence: number;
  riskScore: number;
  line?: string;
};

type LeafletModule = typeof import("leaflet");

export function MapView({
  className = "",
  interactive = true,
  onCrossingClick,
}: MapViewProps) {
  const [railways, setRailways] = useState<RailwayFeatureCollection | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const railwayLayerRef = useRef<import("leaflet").GeoJSON | null>(null);
  const crossingsLayerRef = useRef<import("leaflet").GeoJSON | null>(null);
  const routesLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const hasFittedRef = useRef(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const crossings = useCrossingStore((s) => s.crossings);
  const selectedCrossingId = useCrossingStore((s) => s.selectedCrossingId);
  const routes = useRouteStore((s) => s.routes);
  const selectedRouteId = useRouteStore((s) => s.selectedRouteId);
  const { futureState, isTimeMachineActive } = useTimelineStore();
  const setMapLoaded = useMapStore((s) => s.setMapLoaded);

  const selectedCrossing =
    crossings.find((c) => c.id === selectedCrossingId) ?? null;

  useEffect(() => {
    let isMounted = true;

    fetch("/data/mumbai-railways.geojson")
      .then((res) => res.json())
      .then((data: RailwayFeatureCollection) => {
        if (isMounted) setRailways(data);
      })
      .catch(() => {
        if (isMounted) setRailways(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = await import("leaflet");
      if (cancelled) return;

      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        center: [
          MUMBAI_DEFAULT_VIEWPORT.latitude,
          MUMBAI_DEFAULT_VIEWPORT.longitude,
        ],
        zoom: MUMBAI_DEFAULT_VIEWPORT.zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        touchZoom: interactive,
        keyboard: interactive,
        attributionControl: true,
      });

      L.tileLayer(OSM_TILE_URL, {
        attribution: OSM_ATTRIBUTION,
      }).addTo(map);

      mapRef.current = map;
      setMapLoaded(true);

      if (mapContainerRef.current && "ResizeObserver" in window) {
        resizeObserverRef.current = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserverRef.current.observe(mapContainerRef.current);
      }
    };

    void init();

    return () => {
      cancelled = true;

      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;

      railwayLayerRef.current?.remove();
      railwayLayerRef.current = null;

      crossingsLayerRef.current?.remove();
      crossingsLayerRef.current = null;

      routesLayerRef.current?.remove();
      routesLayerRef.current = null;

      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      setMapLoaded(false);
    };
  }, [interactive, setMapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !railways || !L) return;

    railwayLayerRef.current?.remove();

    railwayLayerRef.current = L.geoJSON(railways, {
      style: (feature) => {
        const props = (feature?.properties ?? {}) as {
          color?: string;
        };

        return {
          color: props.color ?? "#0A0A0A",
          weight: 2.5,
          opacity: 0.45,
          lineCap: "round",
          lineJoin: "round",
        };
      },
    }).addTo(map);
  }, [railways]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    crossingsLayerRef.current?.remove();

    const features: GeoJSON.Feature<GeoJSON.Point, CrossingFeatureProps>[] =
      crossings.map((c) => {
        const future = isTimeMachineActive
          ? futureState?.crossings.find((f) => f.id === c.id)
          : null;

        return {
          type: "Feature",
          properties: {
            id: c.id,
            name: c.name,
            status: (future?.status ?? c.status) as CrossingStatus,
            confidence: future?.confidence ?? c.confidence,
            riskScore: c.riskScore,
            line: (c as Crossing & { line?: string }).line,
          },
          geometry: {
            type: "Point",
            coordinates: [c.longitude, c.latitude],
          },
        };
      });

    const collection: GeoJSON.FeatureCollection<
      GeoJSON.Point,
      CrossingFeatureProps
    > = {
      type: "FeatureCollection",
      features,
    };

    crossingsLayerRef.current = L.geoJSON(collection, {
      pointToLayer: (feature, latlng) => {
        const props = feature.properties as CrossingFeatureProps;
        const isSelected = props.id === selectedCrossingId;
        const fillColor = CROSSING_STATUS_COLORS[props.status];

        return L.circleMarker(latlng, {
          radius: isSelected ? 7 : 5,
          color: "#ffffff",
          weight: 2,
          fillColor,
          fillOpacity: 1,
        });
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties as CrossingFeatureProps;

        if ("bindTooltip" in layer) {
          (layer as import("leaflet").CircleMarker).bindTooltip(props.name, {
            direction: "top",
            offset: [0, -8],
            opacity: 1,
            sticky: true,
          });
        }

        layer.on("click", () => {
          useCrossingStore.getState().selectCrossing(props.id);
          onCrossingClick?.(props.id);
        });
      },
    }).addTo(map);

    if (!hasFittedRef.current && crossings.length > 0) {
      const points = crossings
        .filter((c) => Number.isFinite(c.latitude) && Number.isFinite(c.longitude))
        .map((c) => [c.latitude, c.longitude] as [number, number]);

      if (points.length === 1) {
        map.setView(points[0], 12);
      } else if (points.length > 1) {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, {
          paddingTopLeft: [40, 40],
          paddingBottomRight: [40, 140],
          maxZoom: 12.8,
          animate: true,
        });
      }

      hasFittedRef.current = true;
    }
  }, [
    crossings,
    futureState,
    interactive,
    isTimeMachineActive,
    onCrossingClick,
    selectedCrossingId,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    routesLayerRef.current?.remove();
    routesLayerRef.current = L.layerGroup().addTo(map);

    const orderedRoutes = [
      ...routes.filter((route) => route.id !== selectedRouteId),
      ...routes.filter((route) => route.id === selectedRouteId),
    ];

    orderedRoutes.forEach((route) => {
      if (!route.geometry) return;

      const positions = route.geometry.coordinates.map(
        ([lng, lat]) => [lat, lng] as [number, number]
      );

      const isSelected = route.id === selectedRouteId;

      L.polyline(positions, {
        color: ROUTE_COLORS[route.id] ?? "#0A0A0A",
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.95 : 0.3,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(routesLayerRef.current!);
    });
  }, [routes, selectedRouteId]);

  useEffect(() => {
    const crossing = selectedCrossing;
    if (!crossing) return;

    const map = mapRef.current;
    if (!map) return;

    map.flyTo([crossing.latitude, crossing.longitude], Math.max(map.getZoom(), 15), {
      duration: 0.7,
    });
  }, [selectedCrossing]);

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full ${className}`}
      aria-label="Railway crossing map of Mumbai"
      role="application"
    />
  );
}
