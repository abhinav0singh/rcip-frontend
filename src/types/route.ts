export type RouteType = "fastest" | "avoid-crossings" | "balanced";

export type RouteOption = {
  id: string;
  type: RouteType;
  eta: number;
  distance: number;
  expectedDelay: number;
  crossingRisk: number;
  confidence: number;
  timeSaved: number;
  polyline: string;
  crossings: string[];
  recommended: boolean;
  geometry?: GeoJSON.LineString;
};

export type RouteOptimizeRequest = {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  departureTime: string;
};

export type RouteOptimizeResponse = {
  routes: RouteOption[];
  requestId: string;
  generatedAt: string;
};

export type RouteWaypoint = {
  lat: number;
  lng: number;
  label?: string;
};
