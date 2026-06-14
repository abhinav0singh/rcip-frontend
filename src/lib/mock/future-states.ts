import type { FutureNetworkState } from "@/types/prediction";
import type { TimeOffset } from "@/types/prediction";

export const MOCK_FUTURE_STATES: Record<TimeOffset, FutureNetworkState> = {
  0: {
    offset: 0,
    crossings: [
      { id: "LC-01", status: "open", confidence: 91, predictedDelay: 0 },
      { id: "LC-02", status: "closing", confidence: 87, predictedDelay: 4.2 },
      { id: "LC-03", status: "closed", confidence: 95, predictedDelay: 6.1 },
      { id: "LC-06", status: "closing", confidence: 79, predictedDelay: 3.8 },
      { id: "LC-09", status: "closed", confidence: 91, predictedDelay: 7.5 },
      { id: "LC-18", status: "closed", confidence: 94, predictedDelay: 5.9 },
    ],
    routes: [
      { id: "route-fastest", eta: 28, expectedDelay: 4.2, crossingRisk: 72, recommended: false },
      { id: "route-avoid-crossings", eta: 31, expectedDelay: 0.4, crossingRisk: 12, recommended: true },
      { id: "route-balanced", eta: 29, expectedDelay: 1.8, crossingRisk: 38, recommended: false },
    ],
    insights: [
      {
        id: "i-001",
        type: "crossing-alert",
        message: "Vile Parle Crossing closing in 2 minutes",
        severity: "warning",
        affectedCrossings: ["LC-02"],
        affectedRoutes: ["route-fastest"],
      },
    ],
    predictions: [],
    generatedAt: new Date().toISOString(),
  },
  5: {
    offset: 5,
    crossings: [
      { id: "LC-01", status: "open", confidence: 88, predictedDelay: 0 },
      { id: "LC-02", status: "closed", confidence: 91, predictedDelay: 5.8 },
      { id: "LC-03", status: "open", confidence: 89, predictedDelay: 0 },
      { id: "LC-06", status: "closed", confidence: 82, predictedDelay: 5.2 },
      { id: "LC-09", status: "open", confidence: 85, predictedDelay: 0 },
      { id: "LC-18", status: "open", confidence: 90, predictedDelay: 0 },
    ],
    routes: [
      { id: "route-fastest", eta: 34, expectedDelay: 8.1, crossingRisk: 85, recommended: false },
      { id: "route-avoid-crossings", eta: 31, expectedDelay: 0.2, crossingRisk: 8, recommended: true },
      { id: "route-balanced", eta: 33, expectedDelay: 4.1, crossingRisk: 55, recommended: false },
    ],
    insights: [
      {
        id: "i-002",
        type: "route-recommendation",
        message: "Fastest route will face heavy crossing delays in 5 minutes",
        severity: "critical",
        affectedCrossings: ["LC-02", "LC-06"],
        affectedRoutes: ["route-fastest"],
      },
    ],
    predictions: [],
    generatedAt: new Date().toISOString(),
  },
  10: {
    offset: 10,
    crossings: [
      { id: "LC-01", status: "closing", confidence: 76, predictedDelay: 3.1 },
      { id: "LC-02", status: "open", confidence: 84, predictedDelay: 0 },
      { id: "LC-03", status: "closing", confidence: 71, predictedDelay: 4.0 },
      { id: "LC-06", status: "open", confidence: 80, predictedDelay: 0 },
      { id: "LC-09", status: "closing", confidence: 78, predictedDelay: 3.8 },
      { id: "LC-18", status: "closing", confidence: 83, predictedDelay: 4.5 },
    ],
    routes: [
      { id: "route-fastest", eta: 30, expectedDelay: 2.5, crossingRisk: 48, recommended: false },
      { id: "route-avoid-crossings", eta: 32, expectedDelay: 0.3, crossingRisk: 11, recommended: true },
      { id: "route-balanced", eta: 30, expectedDelay: 1.2, crossingRisk: 29, recommended: false },
    ],
    insights: [
      {
        id: "i-003",
        type: "optimization",
        message: "Network improving — crossing risk dropping across Western line",
        severity: "info",
        affectedRoutes: ["route-fastest", "route-balanced"],
      },
    ],
    predictions: [],
    generatedAt: new Date().toISOString(),
  },
  15: {
    offset: 15,
    crossings: [
      { id: "LC-01", status: "closed", confidence: 82, predictedDelay: 6.5 },
      { id: "LC-02", status: "open", confidence: 90, predictedDelay: 0 },
      { id: "LC-03", status: "open", confidence: 88, predictedDelay: 0 },
      { id: "LC-06", status: "open", confidence: 85, predictedDelay: 0 },
      { id: "LC-09", status: "closed", confidence: 79, predictedDelay: 5.2 },
      { id: "LC-18", status: "open", confidence: 87, predictedDelay: 0 },
    ],
    routes: [
      { id: "route-fastest", eta: 35, expectedDelay: 6.5, crossingRisk: 61, recommended: false },
      { id: "route-avoid-crossings", eta: 31, expectedDelay: 0.1, crossingRisk: 7, recommended: true },
      { id: "route-balanced", eta: 31, expectedDelay: 0.8, crossingRisk: 22, recommended: false },
    ],
    insights: [
      {
        id: "i-004",
        type: "crossing-alert",
        message: "Andheri Crossing predicted to close in 15 minutes",
        severity: "warning",
        affectedCrossings: ["LC-01"],
        affectedRoutes: ["route-fastest", "route-balanced"],
      },
    ],
    predictions: [],
    generatedAt: new Date().toISOString(),
  },
};
