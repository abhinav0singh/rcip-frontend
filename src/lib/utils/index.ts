import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CrossingStatus } from "@/types/crossing";
import { CROSSING_STATUS_COLORS } from "@/constants/map";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEta(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)} km`;
}

export function formatDelay(minutes: number): string {
  if (minutes === 0) return "No delay";
  if (minutes < 1) return `${Math.round(minutes * 60)}s delay`;
  return `+${minutes.toFixed(1)} min`;
}

export function formatConfidence(score: number): string {
  return `${score}%`;
}

export function getCrossingStatusColor(status: CrossingStatus): string {
  return CROSSING_STATUS_COLORS[status];
}

export function getRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score < 30) return "low";
  if (score < 60) return "medium";
  if (score < 80) return "high";
  return "critical";
}

export function getRiskColor(score: number): string {
  const level = getRiskLevel(score);
  switch (level) {
    case "low": return "#22C55E";
    case "medium": return "#F59E0B";
    case "high": return "#EF4444";
    case "critical": return "#DC2626";
  }
}

export function formatTimeSaved(minutes: number): string {
  if (minutes <= 0) return "";
  return `Save ${minutes.toFixed(0)} min`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
