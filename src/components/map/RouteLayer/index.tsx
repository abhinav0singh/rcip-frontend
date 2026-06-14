"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { RouteOption } from "@/types/route";

type RouteLayerProps = {
  map: mapboxgl.Map | null;
  routes: RouteOption[];
  selectedRouteId: string | null;
};

const ROUTE_COLORS = {
  "route-fastest": "#0A0A0A",
  "route-avoid-crossings": "#22C55E",
  "route-balanced": "#3B82F6",
} as Record<string, string>;

export function useRouteLayer(
  map: mapboxgl.Map | null,
  routes: RouteOption[],
  selectedRouteId: string | null
) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!map) return;

    const init = () => {
      if (initialized.current) return;

      routes.forEach((route) => {
        const sourceId = `route-${route.id}`;
        const layerId = `route-line-${route.id}`;

        if (!map.getSource(sourceId) && route.geometry) {
          map.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: { routeId: route.id, type: route.type },
              geometry: route.geometry,
            },
          });

          map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": ROUTE_COLORS[route.id] ?? "#0A0A0A",
              "line-width": route.id === selectedRouteId ? 5 : 3,
              "line-opacity": route.id === selectedRouteId ? 0.9 : 0.35,
            },
          },
          // Insert below crossings
          "crossings-pulse"
          );
        }
      });

      initialized.current = true;
    };

    if (map.isStyleLoaded()) {
      init();
    } else {
      map.once("load", init);
    }

    return () => {
      if (initialized.current && map.isStyleLoaded()) {
        routes.forEach((route) => {
          const sourceId = `route-${route.id}`;
          const layerId = `route-line-${route.id}`;
          if (map.getLayer(layerId)) map.removeLayer(layerId);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        });
        initialized.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, routes]);

  // Update selected route styling
  useEffect(() => {
    if (!map || !initialized.current) return;
    routes.forEach((route) => {
      const layerId = `route-line-${route.id}`;
      if (map.getLayer(layerId)) {
        const isSelected = route.id === selectedRouteId;
        map.setPaintProperty(layerId, "line-width", isSelected ? 5 : 3);
        map.setPaintProperty(layerId, "line-opacity", isSelected ? 0.9 : 0.35);
      }
    });
  }, [map, routes, selectedRouteId]);
}
