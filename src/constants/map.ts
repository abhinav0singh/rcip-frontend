import type { MapViewport } from "@/types/map";

export const MUMBAI_DEFAULT_VIEWPORT: MapViewport = {
  latitude: 19.0760,
  longitude: 72.8777,
  zoom: 11.5,
  bearing: 0,
  pitch: 0,
};

export const MAPBOX_STYLES = {
  streets: "mapbox://styles/mapbox/streets-v12",
  navigationNight: "mapbox://styles/mapbox/navigation-night-v1",
  navigationDay: "mapbox://styles/mapbox/navigation-day-v1",
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
} as const;

export const DEFAULT_MAPBOX_STYLE = MAPBOX_STYLES.light;

export const CROSSING_STATUS_COLORS = {
  open: "#22C55E",
  closing: "#F59E0B",
  closed: "#EF4444",
  uncertain: "#71717A",
} as const;

export const CROSSING_STATUS_LABELS = {
  open: "Open",
  closing: "Closing Soon",
  closed: "Closed",
  uncertain: "Uncertain",
} as const;

export const TIME_OFFSETS = [0, 5, 10, 15] as const;

export const MAP_ZOOM_LEVELS = {
  city: 11,
  district: 13,
  street: 15,
  crossing: 17,
} as const;
