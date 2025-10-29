import { useQuery } from "@tanstack/react-query";
import { moviesAPI } from "@/lib/api";
import type { FetchOptions } from "@/lib/api/client";

export function useMovies(options?: FetchOptions) {
  return useQuery({
    queryKey: ["movies", options],
    queryFn: () => moviesAPI.getAll(options),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMovie(id: string) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => moviesAPI.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
