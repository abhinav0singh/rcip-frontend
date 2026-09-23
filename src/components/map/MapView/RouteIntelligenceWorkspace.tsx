"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Layers, SlidersHorizontal } from "lucide-react";

import { RoutePlanner } from "@/components/route/RoutePlanner";
import { RouteList } from "@/components/route/RouteList";
import { TimeSlider } from "@/components/time-machine/TimeSlider";
import { FutureStateIndicator } from "@/components/time-machine/FutureStateIndicator";
import { CrossingDrawer } from "@/components/crossing/CrossingDrawer";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { MapView } from ".";

import { useCrossings } from "@/hooks/useCrossings";
import { useIsDesktop } from "@/hooks/useIsDesktop";

export function RouteIntelligenceWorkspace() {
  useCrossings();
  const isDesktop = useIsDesktop();

  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-paper">
      <div className="hidden md:flex flex-1 overflow-hidden">
        <motion.div
          animate={{ width: isSidebarCollapsed ? 0 : 360 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="relative flex-shrink-0 h-full overflow-hidden"
        >
          <div className="w-[360px] h-full flex flex-col bg-paper border-r border-zinc-100 overflow-y-auto">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-zinc-100">
              <Link href="/" className="flex items-center gap-2 group">
                <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-ink transition-colors" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm font-bold">RailCache</span>
                </div>
              </Link>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
                aria-label="Collapse sidebar"
              >
                <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <RoutePlanner />

            <div className="mx-4 h-px bg-zinc-100" />

            <RouteList />

            <TimeSlider />

            <div className="mx-4 h-px bg-zinc-100" />

            <ActivityFeed />
          </div>
        </motion.div>

        <AnimatePresence>
          {isSidebarCollapsed && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => setSidebarCollapsed(false)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-zinc-200 rounded-xl shadow-lg flex items-center justify-center hover:bg-zinc-50 transition-colors"
              aria-label="Expand sidebar"
            >
              <Layers className="w-4 h-4 text-zinc-600" />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="relative flex-1">
          {isDesktop === true && <MapView className="absolute inset-0" />}
          <FutureStateIndicator />
        </div>
      </div>

      <div className="md:hidden flex-1 relative overflow-hidden">
        {isDesktop === false && <MapView className="absolute inset-0" />}
        <FutureStateIndicator />

        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
          <Link
            href="/"
            className="w-9 h-9 bg-white/90 backdrop-blur-sm border border-zinc-200 rounded-xl shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-700" />
          </Link>
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-zinc-200 rounded-xl px-3 py-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-ink">RailCache</span>
          </div>
        </div>

        <MobileBottomSheet />
      </div>

      <CrossingDrawer />
    </div>
  );
}