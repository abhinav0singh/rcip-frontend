"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { QUERY_KEYS, STALE_TIMES } from "@/constants/api";
import { fetchCrossings, fetchCrossing } from "@/services/api/crossings";
import { useCrossingStore } from "@/stores/crossing.store";

export function useCrossings() {
  const setCrossings = useCrossingStore((s) => s.setCrossings);

  const query = useQuery({
    queryKey: QUERY_KEYS.crossings,
    queryFn: fetchCrossings,
    staleTime: STALE_TIMES.crossings,
    refetchInterval: STALE_TIMES.crossings,
  });

  useEffect(() => {
    if (query.data) {
      setCrossings(query.data);
    }
  }, [query.data, setCrossings]);

  return query;
}

export function useCrossing(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.crossing(id ?? ""),
    queryFn: () => fetchCrossing(id!),
    enabled: id !== null,
    staleTime: STALE_TIMES.crossings,
  });
}
