"use client";

import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimeMachine } from "@/hooks/useTimeMachine";
import type { TimeOffset } from "@/types/prediction";

const OFFSETS: { value: TimeOffset; label: string }[] = [
  { value: 0, label: "Now" },
  { value: 5, label: "+5m" },
  { value: 10, label: "+10m" },
  { value: 15, label: "+15m" },
];

export function TimeSlider() {
  const { offset, isActive, isLoading, activate, deactivate, changeOffset } = useTimeMachine();

  const handleOffsetChange = (value: TimeOffset) => {
    if (!isActive) activate();
    changeOffset(value);
  };

  return (
    <div className="px-4 pb-4">
      <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center",
              isActive ? "bg-ink" : "bg-zinc-200"
            )}>
              <Zap className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-zinc-500")} />
            </div>
            <div>
              <span className="text-xs font-bold text-ink">Time Machine</span>
              {isLoading && (
                <span className="text-[10px] text-zinc-400 ml-1.5">Loading…</span>
              )}
            </div>
          </div>

          {isActive && (
            <button
              onClick={deactivate}
              className="text-[10px] text-zinc-400 hover:text-ink transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Offset selector */}
        <div className="flex gap-1.5">
          {OFFSETS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleOffsetChange(value)}
              className={cn(
                "flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-200 relative",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
                offset === value && isActive
                  ? "bg-ink text-white shadow-sm"
                  : value === 0 && !isActive
                  ? "bg-ink text-white"
                  : "bg-white text-zinc-500 hover:text-ink hover:bg-zinc-100 border border-zinc-200"
              )}
              aria-pressed={offset === value && (isActive || value === 0)}
              aria-label={value === 0 ? "Current time" : `${value} minutes from now`}
            >
              {label}
              {offset === value && isActive && value !== 0 && (
                <motion.span
                  layoutId="time-active-dot"
                  className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-signal-amber"
                />
              )}
            </button>
          ))}
        </div>

        {/* Active state info */}
        {isActive && offset > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2.5 pt-2.5 border-t border-zinc-200"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-zinc-400" />
              <span className="text-[11px] text-zinc-500">
                Showing predicted state in <strong className="text-ink">{offset} minutes</strong>
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
