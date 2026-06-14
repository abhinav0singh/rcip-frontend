export type CrossingStatus = "open" | "closing" | "closed" | "uncertain";

export type Crossing = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: CrossingStatus;
  closingInMinutes: number | null;
  openingInMinutes: number | null;
  confidence: number;
  expectedDelay: number;
  riskScore: number;
  affectedRoutes: string[];
  lastUpdated: string;
};

export type CrossingPrediction = {
  crossingId: string;
  timestamp: string;
  predictedStatus: CrossingStatus;
  confidence: number;
  estimatedDuration: number;
};

export type CrossingFeature = GeoJSON.Feature<
  GeoJSON.Point,
  {
    id: string;
    name: string;
    status: CrossingStatus;
    confidence: number;
    riskScore: number;
  }
>;

export type CrossingFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  CrossingFeature["properties"]
>;
