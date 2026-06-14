"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, Route, Zap } from "lucide-react";

const STEPS = [
  {
    icon: AlertTriangle,
    eyebrow: "The problem",
    headline: "Gates close without warning.",
    body: "Railway crossings block Mumbai's roads for 4–8 minutes at a time, dozens of times a day. You don't know until you're already stuck.",
    accent: "#EF4444",
  },
  {
    icon: Zap,
    eyebrow: "The intelligence",
    headline: "We see it coming 15 minutes out.",
    body: "RailCache fuses train telemetry, timetable data, and historical patterns to predict when every crossing will close — before it happens.",
    accent: "#F59E0B",
  },
  {
    icon: Route,
    eyebrow: "The result",
    headline: "You take a better route.",
    body: "We surface the smarter path before you even reach the gate. Average time saved: 6.4 minutes per trip.",
    accent: "#22C55E",
  },
];

export function StorySection() {
  return (
    <section className="py-24 px-6 bg-paper">
      <div className="max-w-screen-sm mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-16">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">
            How it works
          </span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <div className="space-y-20">
          {STEPS.map((step, i) => (
            <StepItem key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({
  step,
  index,
}: {
  step: (typeof STEPS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative pl-16"
    >
      {/* Icon */}
      <div
        className="absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${step.accent}15`, border: `1px solid ${step.accent}30` }}
      >
        <Icon className="w-5 h-5" style={{ color: step.accent }} />
      </div>

      {/* Connector line */}
      {index < STEPS.length - 1 && (
        <div className="absolute left-5 top-10 w-px h-20 bg-zinc-100" />
      )}

      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-2"
          style={{ color: step.accent }}>
          {step.eyebrow}
        </p>
        <h3 className="text-2xl font-black tracking-tight text-ink mb-3 leading-tight">
          {step.headline}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
          {step.body}
        </p>
      </div>
    </motion.div>
  );
}
