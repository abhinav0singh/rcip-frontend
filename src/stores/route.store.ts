import { create } from "zustand";
import type { RouteOption, RouteWaypoint } from "@/types/route";

type RouteState = {
  routes: RouteOption[];
  selectedRouteId: string | null;
  origin: RouteWaypoint | null;
  destination: RouteWaypoint | null;
  isSearching: boolean;
  hasResults: boolean;

  setRoutes: (routes: RouteOption[]) => void;
  selectRoute: (id: string | null) => void;
  setOrigin: (waypoint: RouteWaypoint | null) => void;
  setDestination: (waypoint: RouteWaypoint | null) => void;
  setSearching: (searching: boolean) => void;
  clearResults: () => void;
  getSelectedRoute: () => RouteOption | undefined;
  getRecommendedRoute: () => RouteOption | undefined;
};

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  selectedRouteId: null,
  origin: null,
  destination: null,
  isSearching: false,
  hasResults: false,

  setRoutes: (routes) =>
    set({
      routes,
      hasResults: routes.length > 0,
      selectedRouteId: routes.find((r) => r.recommended)?.id ?? routes[0]?.id ?? null,
    }),

  selectRoute: (selectedRouteId) => set({ selectedRouteId }),

  setOrigin: (origin) => set({ origin }),

  setDestination: (destination) => set({ destination }),

  setSearching: (isSearching) => set({ isSearching }),

  clearResults: () =>
    set({
      routes: [],
      selectedRouteId: null,
      hasResults: false,
      isSearching: false,
    }),

  getSelectedRoute: () => {
    const { routes, selectedRouteId } = get();
    return routes.find((r) => r.id === selectedRouteId);
  },

  getRecommendedRoute: () => {
    const { routes } = get();
    return routes.find((r) => r.recommended);
  },
}));
