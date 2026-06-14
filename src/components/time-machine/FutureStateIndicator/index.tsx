"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, X } from "lucide-react";
import { useTimelineStore } from "@/stores/timeline.store";

export function FutureStateIndicator() {
  const { isTimeMachineActive, offset, setTimeMachineActive } = useTimelineStore();

  return (
    <AnimatePresence>
      {isTimeMachineActive && offset > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-ink/95 text-white rounded-full text-xs font-semibold shadow-lg pointer-events-auto">
            <Zap className="w-3 h-3 text-signal-amber" />
            <span>Viewing +{offset}min prediction</span>
            <button
              onClick={() => setTimeMachineActive(false)}
              className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Exit Time Machine"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
