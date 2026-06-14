import { create } from "zustand";
import type { Crossing } from "@/types/crossing";

type CrossingState = {
  crossings: Crossing[];
  selectedCrossingId: string | null;
  isDrawerOpen: boolean;

  setCrossings: (crossings: Crossing[]) => void;
  selectCrossing: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  getCrossingById: (id: string) => Crossing | undefined;
};

export const useCrossingStore = create<CrossingState>((set, get) => ({
  crossings: [],
  selectedCrossingId: null,
  isDrawerOpen: false,

  setCrossings: (crossings) => set({ crossings }),

  selectCrossing: (id) =>
    set({ selectedCrossingId: id, isDrawerOpen: id !== null }),

  setDrawerOpen: (isDrawerOpen) =>
    set((state) => ({
      isDrawerOpen,
      selectedCrossingId: !isDrawerOpen ? null : state.selectedCrossingId,
    })),

  getCrossingById: (id) => get().crossings.find((c) => c.id === id),
}));
