"use client";

import { useState, useCallback, useRef } from "react";
import { BOTTOM_SHEET_HEIGHTS } from "@/constants/app";

export type BottomSheetState = "collapsed" | "half" | "full";

export function useBottomSheet(initial: BottomSheetState = "half") {
  const [sheetState, setSheetState] = useState<BottomSheetState>(initial);
  const startY = useRef<number>(0);
  const startState = useRef<BottomSheetState>(initial);

  const collapse = useCallback(() => setSheetState("collapsed"), []);
  const expand = useCallback(() => setSheetState("half"), []);
  const fullExpand = useCallback(() => setSheetState("full"), []);

  const handleDragStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      startY.current = clientY;
      startState.current = sheetState;
    },
    [sheetState]
  );

  const handleDragEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientY =
        "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
      const delta = startY.current - clientY;
      const threshold = 60;

      if (delta > threshold) {
        if (startState.current === "collapsed") setSheetState("half");
        else if (startState.current === "half") setSheetState("full");
      } else if (delta < -threshold) {
        if (startState.current === "full") setSheetState("half");
        else if (startState.current === "half") setSheetState("collapsed");
      }
    },
    []
  );

  const getHeightValue = useCallback(
    (windowHeight: number) => {
      switch (sheetState) {
        case "collapsed":
          return BOTTOM_SHEET_HEIGHTS.collapsed;
        case "half":
          return Math.round(windowHeight * BOTTOM_SHEET_HEIGHTS.half);
        case "full":
          return Math.round(windowHeight * BOTTOM_SHEET_HEIGHTS.full);
      }
    },
    [sheetState]
  );

  return {
    sheetState,
    setSheetState,
    collapse,
    expand,
    fullExpand,
    handleDragStart,
    handleDragEnd,
    getHeightValue,
  };
}
