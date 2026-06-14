export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiResponse<T> = {
  data: T;
  meta?: {
    requestId: string;
    timestamp: string;
  };
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type InsightItem = {
  id: string;
  type: "delay-alert" | "route-recommendation" | "crossing-alert" | "optimization";
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  affectedRoutes?: string[];
  affectedCrossings?: string[];
  timestamp: string;
  read: boolean;
};

export type InsightsResponse = {
  routeRecommendations: InsightItem[];
  delayAlerts: InsightItem[];
  crossingAlerts: InsightItem[];
  optimizationSuggestions: InsightItem[];
};
