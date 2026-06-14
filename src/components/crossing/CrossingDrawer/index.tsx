"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Clock, TrendingUp, Zap } from "lucide-react";
import { useCrossingStore } from "@/stores/crossing.store";
import { useCrossing } from "@/hooks/useCrossings";
import { CrossingStatusIndicator } from "../CrossingStatus";
import { CrossingDrawerSkeleton } from "@/components/shared/Skeleton";
import { cn, formatDelay, formatConfidence, getRiskColor } from "@/lib/utils";

export function CrossingDrawer() {
  const { selectedCrossingId, isDrawerOpen, setDrawerOpen } = useCrossingStore();
  const { data: crossing, isLoading } = useCrossing(selectedCrossingId);

  const close = () => setDrawerOpen(false);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            className={cn(
              "fixed z-50 bg-white border border-zinc-100 shadow-2xl",
              // Desktop: side panel
              "md:bottom-6 md:left-[calc(30%+24px)] md:top-6 md:w-80 md:rounded-2xl",
              // Mobile: bottom sheet
              "bottom-0 left-0 right-0 rounded-t-2xl max-h-[70dvh] overflow-y-auto"
            )}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle - mobile only */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-8 h-1 rounded-full bg-zinc-200" />
            </div>

            {isLoading ? (
              <CrossingDrawerSkeleton />
            ) : crossing ? (
              <CrossingDrawerContent crossing={crossing} onClose={close} />
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

type Crossing = {
  id: string;
  name: string;
  status: "open" | "closing" | "closed" | "uncertain";
  closingInMinutes: number | null;
  openingInMinutes: number | null;
  confidence: number;
  expectedDelay: number;
  riskScore: number;
  affectedRoutes: string[];
  lastUpdated: string;
};

function CrossingDrawerContent({
  crossing,
  onClose,
}: {
  crossing: Crossing;
  onClose: () => void;
}) {
  const riskColor = getRiskColor(crossing.riskScore);

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase mb-1">
            {crossing.id}
          </p>
          <h2 className="text-lg font-bold text-ink leading-tight">{crossing.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-colors"
          aria-label="Close crossing details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Status */}
      <CrossingStatusIndicator
        status={crossing.status}
        closingInMinutes={crossing.closingInMinutes}
        openingInMinutes={crossing.openingInMinutes}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Expected delay"
          value={formatDelay(crossing.expectedDelay)}
          accent={crossing.expectedDelay > 0 ? "#EF4444" : "#22C55E"}
        />
        <StatCard
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          label="Confidence"
          value={formatConfidence(crossing.confidence)}
          accent="#0A0A0A"
        />
        <StatCard
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          label="Risk score"
          value={`${crossing.riskScore}/100`}
          accent={riskColor}
        />
        <StatCard
          icon={<Zap className="w-3.5 h-3.5" />}
          label="Affected routes"
          value={`${crossing.affectedRoutes.length} route${crossing.affectedRoutes.length !== 1 ? "s" : ""}`}
          accent="#0A0A0A"
        />
      </div>

      {/* Risk bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-zinc-500">Risk level</span>
          <span className="text-xs font-semibold" style={{ color: riskColor }}>
            {crossing.riskScore < 30
              ? "Low"
              : crossing.riskScore < 60
              ? "Medium"
              : crossing.riskScore < 80
              ? "High"
              : "Critical"}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: riskColor }}
            initial={{ width: 0 }}
            animate={{ width: `${crossing.riskScore}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Footer */}
      <p className="text-[10px] text-zinc-400">
        Updated {new Date(crossing.lastUpdated).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="bg-zinc-50 rounded-xl p-3 space-y-1.5">
      <div className="flex items-center gap-1.5 text-zinc-400">{icon}</div>
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
