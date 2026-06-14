"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCrossingStore } from "@/stores/crossing.store";

const ICON_MAP = {
  open: CheckCircle,
  closing: Clock,
  closed: AlertTriangle,
  uncertain: Zap,
} as const;

const COLOR_MAP = {
  open: "text-emerald-600",
  closing: "text-amber-600",
  closed: "text-red-600",
  uncertain: "text-zinc-500",
} as const;

const BG_MAP = {
  open: "bg-emerald-50",
  closing: "bg-amber-50",
  closed: "bg-red-50",
  uncertain: "bg-zinc-50",
} as const;

export function ActivityFeed() {
  const crossings = useCrossingStore((s) => s.crossings);
  const selectCrossing = useCrossingStore((s) => s.selectCrossing);

  const activeCrossings = crossings.filter(
    (c) => c.status !== "open"
  ).slice(0, 6);

  if (activeCrossings.length === 0) return null;

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Active Alerts
        </h3>
        <span className="text-xs text-zinc-400">{activeCrossings.length} crossings</span>
      </div>

      <div className="space-y-2">
        {activeCrossings.map((crossing, i) => {
          const Icon = ICON_MAP[crossing.status];
          const colorClass = COLOR_MAP[crossing.status];
          const bgClass = BG_MAP[crossing.status];

          return (
            <motion.button
              key={crossing.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => selectCrossing(crossing.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left",
                "hover:brightness-95 transition-all",
                bgClass
              )}
            >
              <div className={cn("shrink-0", colorClass)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink truncate">
                  {crossing.name}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {crossing.status === "closing" && crossing.closingInMinutes != null
                    ? `Closing in ${crossing.closingInMinutes} min · ${crossing.expectedDelay} min delay`
                    : crossing.status === "closed" && crossing.openingInMinutes != null
                    ? `Opens in ${crossing.openingInMinutes} min`
                    : crossing.status === "uncertain"
                    ? `${crossing.confidence}% confidence`
                    : "Status update"}
                </p>
              </div>
              <span className="text-[10px] font-medium text-zinc-400 shrink-0">
                {crossing.id}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
