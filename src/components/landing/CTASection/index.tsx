"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-32 px-6 bg-paper">
      <div className="max-w-screen-sm mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-black uppercase tracking-tight leading-none mb-8"
            style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
          >
            Ready to stop waiting?
          </h2>
          <p className="text-sm text-zinc-500 mb-10 max-w-xs mx-auto leading-relaxed">
            Join thousands of Mumbai commuters who never get caught at a gate again.
          </p>
          <Link
            href="/route-intelligence"
            className="inline-flex items-center gap-2 bg-ink text-white font-semibold text-sm px-8 py-4 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Plan my first route
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="font-semibold">RailCache</span>
        <span>© 2025 · Mumbai</span>
      </div>
    </section>
  );
}
