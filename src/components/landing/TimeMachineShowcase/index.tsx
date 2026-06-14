"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimeOffset } from "@/types/prediction";
import { MOCK_FUTURE_STATES } from "@/lib/mock/future-states";
import { CROSSING_STATUS_COLORS, CROSSING_STATUS_LABELS } from "@/constants/map";

const OFFSETS: { value: TimeOffset; label: string }[] = [
  { value: 0, label: "Now" },
  { value: 5, label: "+5 min" },
  { value: 10, label: "+10 min" },
  { value: 15, label: "+15 min" },
];

export function TimeMachineShowcase() {
  const [offset, setOffset] = useState<TimeOffset>(0);
  const state = MOCK_FUTURE_STATES[offset];

  return (
    <section className="py-24 px-6 bg-ink text-white">
      <div className="max-w-screen-sm mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-signal-amber" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-white/40">
              Time Machine
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight leading-tight mb-4">
            See the future.<br />Take a better route.
          </h2>
          <p className="text-sm text-white/50 leading-relaxed max-w-sm">
            Preview how the railway network will look in 5, 10, or 15 minutes.
            RailCache updates every route recommendation in real time.
          </p>
        </div>

        {/* Time selector */}
        <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-2xl">
          {OFFSETS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setOffset(value)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                offset === value
                  ? "bg-white text-ink shadow"
                  : "text-white/50 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Crossing state grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={offset}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-2 mb-8"
          >
            {state.crossings.slice(0, 5).map((crossing) => {
              const color = CROSSING_STATUS_COLORS[crossing.status];
              const label = CROSSING_STATUS_LABELS[crossing.status];
              return (
                <div
                  key={crossing.id}
                  className="flex items-center justify-between py-3 border-b border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-white/80 font-medium">{crossing.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">{crossing.confidence}% confidence</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{
                        color,
                        backgroundColor: `${color}20`,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Insight */}
        <AnimatePresence mode="wait">
          {state.insights[0] && (
            <motion.div
              key={`insight-${offset}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "p-4 rounded-2xl border",
                state.insights[0].severity === "critical"
                  ? "bg-red-500/10 border-red-500/20"
                  : state.insights[0].severity === "warning"
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-white/5 border-white/10"
              )}
            >
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <p className="text-sm text-white/70">{state.insights[0].message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
