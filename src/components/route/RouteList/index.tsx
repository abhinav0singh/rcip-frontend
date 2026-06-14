"use client";

import { RouteCard } from "../RouteCard";
import { RouteCardSkeleton } from "@/components/shared/Skeleton";
import { useRouteStore } from "@/stores/route.store";

export function RouteList() {
  const { routes, selectedRouteId, isSearching, selectRoute } = useRouteStore();

  if (isSearching) {
    return (
      <div className="space-y-3 p-4">
        {[0, 1, 2].map((i) => (
          <RouteCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (routes.length === 0) return null;

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Route Options
        </h3>
        <span className="text-xs text-zinc-400">{routes.length} routes</span>
      </div>
      {routes.map((route, i) => (
        <RouteCard
          key={route.id}
          route={route}
          isSelected={selectedRouteId === route.id}
          onSelect={selectRoute}
          index={i}
        />
      ))}
    </div>
  );
}
