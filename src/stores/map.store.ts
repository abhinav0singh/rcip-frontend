import { create } from "zustand";
import { MUMBAI_DEFAULT_VIEWPORT } from "@/constants/map";
import type { MapViewport, MapMode, SelectedFeature } from "@/types/map";

type MapState = {
  viewport: MapViewport;
  mode: MapMode;
  selectedFeature: SelectedFeature | null;
  mapStyle: string;
  isMapLoaded: boolean;

  setViewport: (viewport: Partial<MapViewport>) => void;
  flyTo: (latitude: number, longitude: number, zoom?: number) => void;
  setMode: (mode: MapMode) => void;
  setSelectedFeature: (feature: SelectedFeature | null) => void;
  setMapStyle: (style: string) => void;
  setMapLoaded: (loaded: boolean) => void;
};

export const useMapStore = create<MapState>((set) => ({
  viewport: MUMBAI_DEFAULT_VIEWPORT,
  mode: "default",
  selectedFeature: null,
  mapStyle:
    process.env.NEXT_PUBLIC_MAPBOX_STYLE ??
    "mapbox://styles/mapbox/light-v11",
  isMapLoaded: false,

  setViewport: (viewport) =>
    set((state) => ({ viewport: { ...state.viewport, ...viewport } })),

  flyTo: (latitude, longitude, zoom) =>
    set((state) => ({
      viewport: {
        ...state.viewport,
        latitude,
        longitude,
        zoom: zoom ?? state.viewport.zoom,
      },
    })),

  setMode: (mode) => set({ mode }),

  setSelectedFeature: (selectedFeature) => set({ selectedFeature }),

  setMapStyle: (mapStyle) => set({ mapStyle }),

  setMapLoaded: (isMapLoaded) => set({ isMapLoaded }),
}));
