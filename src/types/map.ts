export type MapViewport = {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
};

export type MapMode = "default" | "route-selection" | "time-machine" | "crossing-focus";

export type MapLayerId =
  | "crossings"
  | "routes"
  | "predictions"
  | "future-state"
  | "selected-route";

export type SelectedFeature = {
  type: "crossing" | "route";
  id: string;
  coordinates: [number, number];
};
