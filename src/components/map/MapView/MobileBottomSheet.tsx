"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useWindowSize } from "@/hooks/useWindowSize";
import { RoutePlanner } from "@/components/route/RoutePlanner";
import { RouteList } from "@/components/route/RouteList";
import { TimeSlider } from "@/components/time-machine/TimeSlider";
import { ActivityFeed } from "@/components/activity/ActivityFeed";

type SheetState = "collapsed" | "half" | "full";

const COLLAPSED_HEIGHT = 88;
const HALF_RATIO = 0.52;
const FULL_RATIO = 0.92;

export function MobileBottomSheet() {
  const { height: windowHeight } = useWindowSize();
  const [sheetState, setSheetState] = useState<SheetState>("half");
  const y = useMotionValue(0);
  const dragStartY = useRef(0);
  const dragStartState = useRef<SheetState>("half");

  const halfHeight = Math.round((windowHeight ?? 800) * HALF_RATIO);
  const fullHeight = Math.round((windowHeight ?? 800) * FULL_RATIO);

  const getTargetY = (state: SheetState) => {
    switch (state) {
      case "collapsed": return (windowHeight ?? 800) - COLLAPSED_HEIGHT;
      case "half": return (windowHeight ?? 800) - halfHeight;
      case "full": return (windowHeight ?? 800) - fullHeight;
    }
  };

  const snapToState = (state: SheetState) => {
    setSheetState(state);
    animate(y, getTargetY(state), {
      type: "spring",
      damping: 30,
      stiffness: 300,
    });
  };

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    const delta = info.offset.y;
    const velocity = info.velocity.y;

    if (velocity < -500 || delta < -60) {
      // Swipe up
      if (dragStartState.current === "collapsed") snapToState("half");
      else snapToState("full");
    } else if (velocity > 500 || delta > 60) {
      // Swipe down
      if (dragStartState.current === "full") snapToState("half");
      else snapToState("collapsed");
    } else {
      // Snap back
      snapToState(dragStartState.current);
    }
  };

  // Pill opacity
  const pillOpacity = useTransform(y, [getTargetY("full"), getTargetY("half")], [0.3, 1]);

  return (
    <motion.div
      className="absolute left-0 right-0 bottom-0 bg-white rounded-t-[24px] shadow-[0_-4px_40px_rgba(0,0,0,0.12)] z-30 overflow-hidden"
      style={{ y, top: 0 }}
      initial={{ y: getTargetY("half") }}
      drag="y"
      dragConstraints={{ top: getTargetY("full"), bottom: getTargetY("collapsed") }}
      dragElastic={0.08}
      onDragStart={() => {
        dragStartState.current = sheetState;
      }}
      onDragEnd={handleDragEnd}
    >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
        <motion.div
          className="w-9 h-1 rounded-full bg-zinc-300"
          style={{ opacity: pillOpacity }}
        />
      </div>

      {/* Content — scrollable inner */}
      <div
        className="overflow-y-auto overscroll-contain"
        style={{ maxHeight: fullHeight - 24 }}
      >
        <RoutePlanner />
        <div className="mx-4 h-px bg-zinc-100" />
        <RouteList />
        <TimeSlider />
        <div className="mx-4 h-px bg-zinc-100" />
        <ActivityFeed />
        <div className="h-8" />
      </div>
    </motion.div>
  );
}
