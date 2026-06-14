import { cn } from "@/lib/utils";
import type { CrossingStatus as CrossingStatusType } from "@/types/crossing";

type CrossingStatusProps = {
  status: CrossingStatusType;
  closingInMinutes?: number | null;
  openingInMinutes?: number | null;
  className?: string;
};

const STATUS_CONFIG = {
  open: {
    label: "Open",
    dotClass: "bg-signal-green",
    textClass: "text-emerald-700",
    pulseClass: "",
  },
  closing: {
    label: "Closing Soon",
    dotClass: "bg-signal-amber",
    textClass: "text-amber-700",
    pulseClass: "crossing-pulse-closing",
  },
  closed: {
    label: "Closed",
    dotClass: "bg-signal-red",
    textClass: "text-red-700",
    pulseClass: "crossing-pulse-closed",
  },
  uncertain: {
    label: "Uncertain",
    dotClass: "bg-zinc-400",
    textClass: "text-zinc-500",
    pulseClass: "",
  },
} as const;

export function CrossingStatusIndicator({
  status,
  closingInMinutes,
  openingInMinutes,
  className,
}: CrossingStatusProps) {
  const config = STATUS_CONFIG[status];

  const sublabel =
    status === "closing" && closingInMinutes != null
      ? `in ${closingInMinutes} min`
      : status === "closed" && openingInMinutes != null
      ? `Opens in ${openingInMinutes} min`
      : null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "relative flex h-2.5 w-2.5 rounded-full shrink-0",
          config.dotClass,
          config.pulseClass
        )}
        aria-hidden="true"
      />
      <div>
        <span className={cn("text-sm font-semibold", config.textClass)}>
          {config.label}
        </span>
        {sublabel && (
          <span className="text-xs text-zinc-500 ml-1.5">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
