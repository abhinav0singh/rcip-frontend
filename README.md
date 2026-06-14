# RailCache Crossing Intelligence Platform — Frontend

> Know Before The Gates Close.

Production-grade frontend for RCIP — a predictive navigation platform that surfaces railway crossing disruptions before they happen and recommends better routes in real time.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript |
| Styling | TailwindCSS + custom design tokens |
| Map | Mapbox GL JS (real, not simulated) |
| Visualization | Deck.gl (layer system) |
| State | Zustand (domain-separated stores) |
| Data Fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout + metadata
│   ├── page.tsx                   # Landing page
│   ├── providers.tsx              # TanStack Query provider
│   └── route-intelligence/
│       └── page.tsx               # Main app (dynamic imported)
│
├── components/
│   ├── shared/                    # Reusable UI primitives
│   │   ├── Badge/
│   │   └── Skeleton/
│   ├── landing/                   # Landing page sections
│   │   ├── Hero/                  # Hero map + headline
│   │   ├── StorySection/          # How it works
│   │   ├── TimeMachineShowcase/   # Interactive TM preview
│   │   └── CTASection/
│   ├── map/
│   │   └── MapView/
│   │       ├── index.tsx                     # Core Mapbox map
│   │       ├── RouteIntelligenceWorkspace.tsx # Main app layout
│   │       └── MobileBottomSheet.tsx         # Mobile gesture sheet
│   ├── crossing/
│   │   ├── CrossingDrawer/        # Crossing detail panel
│   │   └── CrossingStatus/        # Status indicator
│   ├── route/
│   │   ├── RoutePlanner/          # Origin/dest input + search
│   │   ├── RouteCard/             # Premium route option card
│   │   └── RouteList/             # Route results list
│   ├── time-machine/
│   │   ├── TimeSlider/            # Offset selector (+0/5/10/15)
│   │   └── FutureStateIndicator/  # Active TM banner
│   └── activity/
│       └── ActivityFeed/          # Live crossing alerts
│
├── hooks/
│   ├── useCrossings.ts            # TanStack Query crossing hooks
│   ├── useRoutes.ts               # Route optimization mutation
│   ├── useTimeMachine.ts          # Time machine state + data
│   ├── useBottomSheet.ts          # Mobile gesture state
│   └── useWindowSize.ts           # SSR-safe window dimensions
│
├── services/
│   └── api/
│       ├── client.ts              # Base fetch client + error handling
│       ├── crossings.ts           # Crossing API calls
│       ├── routing.ts             # Route optimization API calls
│       └── predictions.ts         # Future state API calls
│
├── stores/
│   ├── map.store.ts               # Viewport, mode, selected feature
│   ├── crossing.store.ts          # Selected crossing, drawer state
│   ├── route.store.ts             # Routes, selection, search state
│   └── timeline.store.ts          # Time machine offset + future state
│
├── types/
│   ├── crossing.ts
│   ├── route.ts
│   ├── prediction.ts
│   ├── map.ts
│   └── api.ts
│
├── lib/
│   ├── mock/
│   │   ├── crossings.ts           # Dev crossing data
│   │   ├── routes.ts              # Dev route data
│   │   └── future-states.ts       # Dev time machine data
│   └── utils/
│       └── index.ts               # cn(), formatting, risk utils
│
├── constants/
│   ├── map.ts                     # Viewport, styles, colors
│   ├── api.ts                     # Endpoints, query keys, stale times
│   └── app.ts                     # Brand copy, labels
│
└── styles/
    └── globals.css                # Tailwind + CSS variables + Mapbox overrides

public/
└── data/
    ├── mumbai-crossings.geojson   # 20 real Mumbai crossing positions
    └── mumbai-railways.geojson    # Western, Central, Harbour lines
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Required — get a free token at mapbox.com
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiY...

# Optional — defaults to light-v11
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/light-v11

# Optional — backend API (mocked by default)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture Decisions

### Feature flags — mock vs real backend

All API services have a `USE_MOCK` flag at the top:

```ts
// src/services/api/crossings.ts
const USE_MOCK = true; // ← flip to false when backend is ready
```

No frontend refactoring required when connecting to real APIs.

### State separation

Each domain has its own Zustand store. No giant global store.

| Store | Owns |
|---|---|
| `map.store` | Viewport, map mode, selected feature |
| `crossing.store` | Crossing list, selection, drawer open state |
| `route.store` | Route results, selection, search state |
| `timeline.store` | Time Machine offset, active state, future data |

### Map as a first-class citizen

The map is never wrapped inside React render trees. It's initialized imperatively in `useEffect`, avoiding re-render churn. GeoJSON sources are updated via `source.setData()` rather than re-mounting layers.

### Time Machine — pure rendering

The frontend never predicts anything. `useTimeMachine` fetches `GET /api/network/future?offset=N` and the store propagates the data. All crossing markers, route cards, and insights re-render from the future state data.

---

## Backend Integration

When the backend is ready:

1. Set `USE_MOCK = false` in each service file
2. Set `NEXT_PUBLIC_API_URL` to the backend URL
3. Ensure the backend returns the documented shapes (see `src/types/`)

### Expected API contracts

```
POST /api/routes/optimize
GET  /api/routes/:id
GET  /api/crossings
GET  /api/crossings/:id
GET  /api/crossings/:id/predictions
GET  /api/network/future?offset=0|5|10|15
GET  /api/insights
```

All error responses must follow:
```json
{ "code": "ROUTE_NOT_FOUND", "message": "Unable to calculate route" }
```

---

## GeoJSON Data

Real crossing positions from Mumbai's railway network:

- `public/data/mumbai-crossings.geojson` — 20 level crossings
- `public/data/mumbai-railways.geojson` — Western, Central, Harbour lines

Coordinate system: WGS84 / EPSG:4326

---

## Performance

- Map initialized once, updated via GeoJSON source mutations
- Mapbox component dynamically imported (`ssr: false`) to prevent server-side crash
- TanStack Query caching: crossings refetch every 30s, predictions every 45s
- Zustand stores use selector-based subscriptions to minimize re-renders
- Bottom sheet uses `useMotionValue` to avoid React re-renders on drag

---

## Mobile

The mobile experience is built around a Framer Motion bottom sheet with three states:

- **Collapsed** — 88px handle visible
- **Half** — 52% of screen height
- **Full** — 92% of screen height

Gesture thresholds: 60px drag distance or 500px/s velocity to snap states.

---

## Deployment

```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy

# Or export static (no API routes needed)
npm run build && npm run start
```

Environment variables must be set in your deployment platform.
