import { API_ENDPOINTS } from "@/constants/api";
import { MOCK_CROSSINGS } from "@/lib/mock/crossings";
import type { Crossing, CrossingPrediction } from "@/types/crossing";
import { apiGet } from "./client";

const USE_MOCK = true; // Toggle when backend is ready

export async function fetchCrossings(): Promise<Crossing[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_CROSSINGS;
  }
  return apiGet<Crossing[]>(API_ENDPOINTS.crossings.list);
}

export async function fetchCrossing(id: string): Promise<Crossing> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    const crossing = MOCK_CROSSINGS.find((c) => c.id === id);
    if (!crossing) throw new Error(`Crossing ${id} not found`);
    return crossing;
  }
  return apiGet<Crossing>(API_ENDPOINTS.crossings.detail(id));
}

export async function fetchCrossingPredictions(
  id: string
): Promise<CrossingPrediction[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  return apiGet<CrossingPrediction[]>(API_ENDPOINTS.crossings.predictions(id));
}
