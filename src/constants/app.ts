export const APP_NAME = "RailCache";
export const APP_TAGLINE = "Know Before The Gates Close.";
export const APP_DESCRIPTION =
  "Predict railway crossing closures before they happen. Get there faster, without the wait.";

export const STATS = {
  crossingsMonitored: 2847,
  citiesCovered: 1,
  averageDelaySaved: 6.4,
  activePredictions: 312,
} as const;

export const ROUTE_TYPE_LABELS = {
  fastest: "Fastest",
  "avoid-crossings": "Avoid Crossings",
  balanced: "Balanced",
} as const;

export const ROUTE_TYPE_DESCRIPTIONS = {
  fastest: "Shortest time, standard crossing risk",
  "avoid-crossings": "Maximum crossing avoidance, slightly longer",
  balanced: "Optimal blend of speed and safety",
} as const;

export const BOTTOM_SHEET_HEIGHTS = {
  collapsed: 80,
  half: 0.45,   // 45% of screen
  full: 0.92,   // 92% of screen
} as const;
