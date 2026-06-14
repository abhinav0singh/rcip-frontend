import type { Metadata } from "next";
import RouteIntelligenceClient from "@/components/map/MapView/RouteIntelligenceClient";

export const metadata: Metadata = {
  title: "Route Intelligence",
  description: "Plan your route and avoid railway crossing delays in real time.",
};

export default function RouteIntelligencePage() {
  return <RouteIntelligenceClient />;
}