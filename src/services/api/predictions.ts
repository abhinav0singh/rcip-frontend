import { API_ENDPOINTS } from "@/constants/api";
import { MOCK_FUTURE_STATES } from "@/lib/mock/future-states";
import type { FutureNetworkState, TimeOffset } from "@/types/prediction";
import { apiGet } from "./client";

const USE_MOCK = true;

export async function fetchFutureNetworkState(
  offset: TimeOffset
): Promise<FutureNetworkState> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_FUTURE_STATES[offset];
  }
  return apiGet<FutureNetworkState>(API_ENDPOINTS.network.future, {
    offset,
  });
}
