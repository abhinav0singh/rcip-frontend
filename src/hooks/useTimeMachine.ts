"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { QUERY_KEYS, STALE_TIMES } from "@/constants/api";
import { fetchFutureNetworkState } from "@/services/api/predictions";
import { useTimelineStore } from "@/stores/timeline.store";
import { useCrossingStore } from "@/stores/crossing.store";
import { useRouteStore } from "@/stores/route.store";
import type { TimeOffset } from "@/types/prediction";

export function useTimeMachine() {
  const { offset, isTimeMachineActive, setOffset, setTimeMachineActive, setFutureState } =
    useTimelineStore();
  const setCrossings = useCrossingStore((s) => s.setCrossings);
  const { setRoutes } = useRouteStore();

  const query = useQuery({
    queryKey: QUERY_KEYS.networkFuture(offset),
    queryFn: () => fetchFutureNetworkState(offset as TimeOffset),
    enabled: isTimeMachineActive,
    staleTime: STALE_TIMES.networkFuture,
  });

  useEffect(() => {
    if (query.data && isTimeMachineActive) {
      setFutureState(query.data);
    }
  }, [query.data, isTimeMachineActive, setFutureState]);

  const activate = () => setTimeMachineActive(true);
  const deactivate = () => setTimeMachineActive(false);
  const changeOffset = (newOffset: TimeOffset) => setOffset(newOffset);

  return {
    offset,
    isActive: isTimeMachineActive,
    futureState: query.data,
    isLoading: query.isLoading,
    activate,
    deactivate,
    changeOffset,
  };
}
