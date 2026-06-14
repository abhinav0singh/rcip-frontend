import { create } from "zustand";
import type { TimeOffset, FutureNetworkState } from "@/types/prediction";

type TimelineState = {
  offset: TimeOffset;
  isTimeMachineActive: boolean;
  futureState: FutureNetworkState | null;
  isLoading: boolean;

  setOffset: (offset: TimeOffset) => void;
  setTimeMachineActive: (active: boolean) => void;
  setFutureState: (state: FutureNetworkState | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useTimelineStore = create<TimelineState>((set) => ({
  offset: 0,
  isTimeMachineActive: false,
  futureState: null,
  isLoading: false,

  setOffset: (offset) => set({ offset }),

  setTimeMachineActive: (isTimeMachineActive) =>
    set((state) => ({
      isTimeMachineActive,
      offset: isTimeMachineActive ? state.offset : 0,
      futureState: isTimeMachineActive ? state.futureState : null,
    })),

  setFutureState: (futureState) => set({ futureState }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      offset: 0,
      isTimeMachineActive: false,
      futureState: null,
      isLoading: false,
    }),
}));
