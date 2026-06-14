import { cn } from "@/lib/utils";
import type { CrossingStatus } from "@/types/crossing";
import { CROSSING_STATUS_LABELS } from "@/constants/map";

type BadgeVariant = "default" | "open" | "closing" | "closed" | "uncertain" | "recommended" | "muted";

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-zinc-100 text-zinc-700",
  open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  closing: "bg-amber-50 text-amber-700 border border-amber-200",
  closed: "bg-red-50 text-red-700 border border-red-200",
  uncertain: "bg-zinc-100 text-zinc-500 border border-zinc-200",
  recommended: "bg-ink text-white",
  muted: "bg-zinc-100 text-zinc-500",
};

export function Badge({ variant = "default", children, className, size = "sm" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium tracking-tight rounded",
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function CrossingStatusBadge({
  status,
  className,
}: {
  status: CrossingStatus;
  className?: string;
}) {
  return (
    <Badge variant={status} className={className}>
      {CROSSING_STATUS_LABELS[status]}
    </Badge>
  );
}
