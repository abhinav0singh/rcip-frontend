import type { CrossingStatus } from "./crossing";

export type TimeOffset = 0 | 5 | 10 | 15;

export type FutureStateCrossing = {
  id: string;
  status: CrossingStatus;
  confidence: number;
  predictedDelay: number;
};

export type FutureStateRoute = {
  id: string;
  eta: number;
  expectedDelay: number;
  crossingRisk: number;
  recommended: boolean;
};

export type FutureStateInsight = {
  id: string;
  type: "delay-alert" | "route-recommendation" | "crossing-alert" | "optimization";
  message: string;
  severity: "info" | "warning" | "critical";
  affectedRoutes?: string[];
  affectedCrossings?: string[];
};

export type FutureNetworkState = {
  offset: TimeOffset;
  crossings: FutureStateCrossing[];
  routes: FutureStateRoute[];
  insights: FutureStateInsight[];
  predictions: PredictionEntry[];
  generatedAt: string;
};

export type PredictionEntry = {
  crossingId: string;
  offsetMinutes: number;
  predictedStatus: CrossingStatus;
  confidence: number;
  estimatedClosureDuration: number;
};
