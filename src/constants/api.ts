export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const API_ENDPOINTS = {
  routes: {
    list: "/api/routes",
    optimize: "/api/routes/optimize",
    detail: (id: string) => `/api/routes/${id}`,
  },
  crossings: {
    list: "/api/crossings",
    detail: (id: string) => `/api/crossings/${id}`,
    predictions: (id: string) => `/api/crossings/${id}/predictions`,
  },
  predictions: {
    list: "/api/predictions",
  },
  network: {
    future: "/api/network/future",
  },
  insights: "/api/insights",
} as const;

export const QUERY_KEYS = {
  crossings: ["crossings"] as const,
  crossing: (id: string) => ["crossings", id] as const,
  crossingPredictions: (id: string) => ["crossings", id, "predictions"] as const,
  routes: ["routes"] as const,
  route: (id: string) => ["routes", id] as const,
  networkFuture: (offset: number) => ["network", "future", offset] as const,
  insights: ["insights"] as const,
} as const;

export const STALE_TIMES = {
  crossings: 30_000,       // 30s - crossings update frequently
  routes: 60_000,          // 1m
  predictions: 60_000,     // 1m
  networkFuture: 45_000,   // 45s
  insights: 30_000,        // 30s
} as const;
