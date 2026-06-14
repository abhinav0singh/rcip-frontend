"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, MapPin, Navigation, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouteOptimization } from "@/hooks/useRoutes";
import { useRouteStore } from "@/stores/route.store";

const MUMBAI_PRESETS = [
  { label: "CST / Bori Bunder", lat: 18.9398, lng: 72.8356 },
  { label: "Bandra Terminus", lat: 19.0596, lng: 72.8361 },
  { label: "Andheri Station", lat: 19.1197, lng: 72.8347 },
  { label: "Dadar Station", lat: 19.0178, lng: 72.8430 },
  { label: "Kurla Station", lat: 19.0728, lng: 72.8788 },
  { label: "Borivali Station", lat: 19.2289, lng: 72.8561 },
];

const schema = z.object({
  originLabel: z.string().min(1, "Enter an origin"),
  destinationLabel: z.string().min(1, "Enter a destination"),
});

type FormValues = z.infer<typeof schema>;

export function RoutePlanner() {
  const [originFocus, setOriginFocus] = useState(false);
  const [destFocus, setDestFocus] = useState(false);
  const [originPreset, setOriginPreset] = useState<typeof MUMBAI_PRESETS[0] | null>(null);
  const [destPreset, setDestPreset] = useState<typeof MUMBAI_PRESETS[0] | null>(null);

  const { optimize, isLoading } = useRouteOptimization();
  const { setOrigin, setDestination } = useRouteStore();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const originVal = watch("originLabel");
  const destVal = watch("destinationLabel");

  const onSubmit = (values: FormValues) => {
    if (!originPreset || !destPreset) return;
    setOrigin({ lat: originPreset.lat, lng: originPreset.lng, label: values.originLabel });
    setDestination({ lat: destPreset.lat, lng: destPreset.lng, label: values.destinationLabel });
    optimize({
      origin: { lat: originPreset.lat, lng: originPreset.lng },
      destination: { lat: destPreset.lat, lng: destPreset.lng },
      departureTime: new Date().toISOString(),
    });
  };

  const swapLocations = () => {
    const tempPreset = originPreset;
    const tempVal = originVal;
    setOriginPreset(destPreset);
    setDestPreset(tempPreset);
    setValue("originLabel", destVal ?? "");
    setValue("destinationLabel", tempVal ?? "");
  };

  const showOriginSuggestions = originFocus && (!originPreset || originVal !== originPreset.label);
  const showDestSuggestions = destFocus && (!destPreset || destVal !== destPreset.label);

  const filteredOrigin = MUMBAI_PRESETS.filter(
    (p) => !originVal || p.label.toLowerCase().includes(originVal.toLowerCase())
  );
  const filteredDest = MUMBAI_PRESETS.filter(
    (p) => !destVal || p.label.toLowerCase().includes(destVal.toLowerCase())
  );

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Inputs container */}
        <div className="relative">
          <div className="space-y-2">
            {/* Origin */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <div className="w-2 h-2 rounded-full border-2 border-current" />
              </div>
              <input
                {...register("originLabel")}
                placeholder="Where from?"
                className={cn(
                  "w-full pl-8 pr-4 py-3 text-sm rounded-xl border bg-white",
                  "focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink",
                  "placeholder:text-zinc-400 transition-all",
                  errors.originLabel ? "border-red-300" : "border-zinc-200"
                )}
                onFocus={() => setOriginFocus(true)}
                onBlur={() => setTimeout(() => setOriginFocus(false), 150)}
                autoComplete="off"
              />

              {/* Origin suggestions */}
              {showOriginSuggestions && filteredOrigin.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  {filteredOrigin.slice(0, 4).map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 text-left transition-colors"
                      onMouseDown={() => {
                        setValue("originLabel", preset.label);
                        setOriginPreset(preset);
                        setOriginFocus(false);
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="text-sm text-ink">{preset.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Destination */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Navigation className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <input
                {...register("destinationLabel")}
                placeholder="Where to?"
                className={cn(
                  "w-full pl-8 pr-4 py-3 text-sm rounded-xl border bg-white",
                  "focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink",
                  "placeholder:text-zinc-400 transition-all",
                  errors.destinationLabel ? "border-red-300" : "border-zinc-200"
                )}
                onFocus={() => setDestFocus(true)}
                onBlur={() => setTimeout(() => setDestFocus(false), 150)}
                autoComplete="off"
              />

              {showDestSuggestions && filteredDest.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  {filteredDest.slice(0, 4).map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 text-left transition-colors"
                      onMouseDown={() => {
                        setValue("destinationLabel", preset.label);
                        setDestPreset(preset);
                        setDestFocus(false);
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="text-sm text-ink">{preset.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Swap button */}
          <button
            type="button"
            onClick={swapLocations}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors"
            aria-label="Swap origin and destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-600" />
          </button>
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={isLoading || !originPreset || !destPreset}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl",
            "text-sm font-semibold transition-all duration-200",
            "bg-ink text-white hover:bg-zinc-800",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
          )}
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              Finding best routes…
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Find routes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
