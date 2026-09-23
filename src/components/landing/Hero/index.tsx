"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { STATS } from "@/constants/app";
import { MapView } from "@/components/map/MapView";
import { useCrossings } from "@/hooks/useCrossings";

export function Hero() {
  useCrossings();

  return (
    <section className="relative h-dvh min-h-[640px] overflow-hidden bg-zinc-50">
      {/* Map background */}
      <div className="absolute inset-0 opacity-70 pointer-events-none"><MapView interactive={false} className="absolute inset-0" /></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-paper/40 to-transparent" />

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">RailCache</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-zinc-600 hover:text-ink transition-colors px-3 py-1.5">
            Sign in
          </button>
          <Link
            href="/route-intelligence"
            className="text-sm font-semibold bg-ink text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            Plan a route
          </Link>
        </div>
      </nav>

      {/* Live ticker */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-ink/90 backdrop-blur-sm py-1.5 overflow-hidden">
        <div className="ticker-animate">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 pr-6 shrink-0">
              <span className="text-[11px] text-white/50 font-mono">
                <span className="text-signal-green">●</span>{" "}
                {STATS.crossingsMonitored.toLocaleString()} CROSSINGS MONITORED · MUMBAI
              </span>
              <span className="text-[11px] text-white/30">◆</span>
              <span className="text-[11px] text-white/50 font-mono">
                Andheri Crossing closing in 2 min
              </span>
              <span className="text-[11px] text-white/30">◆</span>
              <span className="text-[11px] text-white/50 font-mono">
                Average delay saved: {STATS.averageDelaySaved} min
              </span>
              <span className="text-[11px] text-white/30">◆</span>
              <span className="text-[11px] text-white/50 font-mono">
                {STATS.activePredictions} active predictions
              </span>
              <span className="text-[11px] text-white/30">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 pt-16 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main headline */}
          <h1
            className="font-black uppercase leading-[0.88] tracking-[-0.04em] mb-6"
            style={{ fontSize: "clamp(4.5rem, 15vw, 10rem)" }}
          >
            <motion.span
              className="block"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              KNOW
            </motion.span>
            <motion.span
              className="block"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              BEFORE
            </motion.span>
            <motion.span
              className="block"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              THE
            </motion.span>
            <motion.span
              className="block"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.72 }}
            >
              GATES
            </motion.span>
            <motion.span
              className="block"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.84 }}
            >
              CLOSE.
            </motion.span>
          </h1>

          <motion.p
            className="text-base text-zinc-600 max-w-xs mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            Predict railway crossing closures before they happen. Get there faster, without the wait.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col gap-3 max-w-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25 }}
          >
            <Link
              href="/route-intelligence"
              className="flex items-center justify-center gap-2 bg-ink text-white font-semibold text-sm px-6 py-4 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Plan my route
            </Link>
            <button className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm text-ink font-medium text-sm px-6 py-4 rounded-xl border border-zinc-200 hover:bg-white transition-colors">
              See how it works
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom stats */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-ink/90 backdrop-blur-sm flex items-center gap-6 px-6 py-3 overflow-x-auto">
        <StatItem label="Crossings monitored" value={STATS.crossingsMonitored.toLocaleString()} />
        <div className="w-px h-4 bg-white/20 shrink-0" />
        <StatItem label="Avg delay saved" value={`${STATS.averageDelaySaved} min`} />
        <div className="w-px h-4 bg-white/20 shrink-0" />
        <StatItem label="Active predictions" value={String(STATS.activePredictions)} />
      </div>
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="shrink-0">
      <div className="text-white font-bold text-sm">{value}</div>
      <div className="text-white/50 text-[10px]">{label}</div>
    </div>
  );
}
