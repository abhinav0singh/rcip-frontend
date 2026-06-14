"use client";

import { useMutation } from "@tanstack/react-query";
import { optimizeRoutes } from "@/services/api/routing";
import { useRouteStore } from "@/stores/route.store";
import type { RouteOptimizeRequest } from "@/types/route";

export function useRouteOptimization() {
  const { setRoutes, setSearching, clearResults } = useRouteStore();

  const mutation = useMutation({
    mutationFn: (request: RouteOptimizeRequest) => optimizeRoutes(request),
    onMutate: () => {
      setSearching(true);
      clearResults();
    },
    onSuccess: (data) => {
      setRoutes(data.routes);
      setSearching(false);
    },
    onError: () => {
      setSearching(false);
    },
  });

  return {
    optimize: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
