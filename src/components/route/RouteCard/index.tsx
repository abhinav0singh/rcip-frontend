"use client";

import { motion } from "framer-motion";
import { Clock, Navigation, AlertTriangle, Star, TrendingDown } from "lucide-react";
import { cn, formatEta, formatDistance, formatDelay, getRiskColor, formatTimeSaved } from "@/lib/utils";
import { Badge } from "@/components/shared/Badge";
import type { RouteOption } from "@/types/route";

const ROUTE_TYPE_CONFIG = {
  fastest: {
    label: "Fastest",
    description: "Standard crossing risk",
    accentClass: "bg-zinc-900",
  },
  "avoid-crossings": {
    label: "Avoid Crossings",
    description: "Maximum safety",
    accentClass: "bg-emerald-600",
  },
  balanced: {
    label: "Balanced",
    description: "Speed & safety",
    accentClass: "bg-blue-600",
  },
} as const;

type RouteCardProps = {
  route: RouteOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
};

export function RouteCard({ route, isSelected, onSelect, index }: RouteCardProps) {
  const config = ROUTE_TYPE_CONFIG[route.type];
  const riskColor = getRiskColor(route.crossingRisk);
  const timeSaved = formatTimeSaved(route.timeSaved);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onClick={() => onSelect(route.id)}
      className={cn(
        "w-full text-left rounded-2xl border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
        isSelected
          ? "border-ink bg-ink text-white shadow-lg scale-[1.01]"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
      )}
      aria-pressed={isSelected}
      aria-label={`Select ${config.label} route, ${formatEta(route.eta)}`}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn(
                "text-sm font-bold tracking-tight",
                isSelected ? "text-white" : "text-ink"
              )}>
                {config.label}
              </span>
              {route.recommended && (
                <Badge
                  variant={isSelected ? "muted" : "recommended"}
                  className={isSelected ? "bg-white/20 text-white" : ""}
                >
                  <Star className="w-2.5 h-2.5 mr-0.5" />
                  Best
                </Badge>
              )}
            </div>
            <span className={cn(
              "text-[11px]",
              isSelected ? "text-white/60" : "text-zinc-400"
            )}>
              {config.description}
            </span>
          </div>

          {/* ETA */}
          <div className="text-right">
            <div className={cn(
              "text-2xl font-black leading-none tracking-tight",
              isSelected ? "text-white" : "text-ink"
            )}>
              {route.eta}
            </div>
            <div className={cn(
              "text-[10px] font-medium",
              isSelected ? "text-white/50" : "text-zinc-400"
            )}>
              min
            </div>
          </div>
        </div>

        {/* Metrics row */}
        <div className={cn(
          "flex items-center gap-4 pt-3 border-t text-[11px]",
          isSelected ? "border-white/10" : "border-zinc-100"
        )}>
          <MetricItem
            icon={<Navigation className="w-3 h-3" />}
            value={formatDistance(route.distance)}
            isSelected={isSelected}
          />
          <MetricItem
            icon={<Clock className="w-3 h-3" />}
            value={formatDelay(route.expectedDelay)}
            valueColor={route.expectedDelay > 0
              ? (isSelected ? "#FCA5A5" : "#EF4444")
              : (isSelected ? "#86EFAC" : "#22C55E")
            }
            isSelected={isSelected}
          />
          <MetricItem
            icon={<AlertTriangle className="w-3 h-3" />}
            value={`${route.crossingRisk}% risk`}
            valueColor={isSelected ? undefined : riskColor}
            isSelected={isSelected}
          />
          {timeSaved && (
            <div className="ml-auto flex items-center gap-1">
              <TrendingDown className={cn(
                "w-3 h-3",
                isSelected ? "text-green-300" : "text-emerald-600"
              )} />
              <span className={cn(
                "font-semibold",
                isSelected ? "text-green-300" : "text-emerald-600"
              )}>
                {timeSaved}
              </span>
            </div>
          )}
        </div>

        {/* Confidence bar */}
        <div className={cn(
          "mt-3 h-0.5 rounded-full overflow-hidden",
          isSelected ? "bg-white/10" : "bg-zinc-100"
        )}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              isSelected ? "bg-white/60" : "bg-zinc-400"
            )}
            style={{ width: `${route.confidence}%` }}
          />
        </div>
        <div className={cn(
          "text-[9px] mt-1",
          isSelected ? "text-white/40" : "text-zinc-300"
        )}>
          {route.confidence}% confidence
        </div>
      </div>
    </motion.button>
  );
}

function MetricItem({
  icon,
  value,
  valueColor,
  isSelected,
}: {
  icon: React.ReactNode;
  value: string;
  valueColor?: string;
  isSelected: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className={isSelected ? "text-white/40" : "text-zinc-400"}>{icon}</span>
      <span
        className={cn("font-medium", isSelected ? "text-white/70" : "text-zinc-600")}
        style={valueColor && !isSelected ? { color: valueColor } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
