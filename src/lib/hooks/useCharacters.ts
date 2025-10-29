import { useQuery } from "@tanstack/react-query";
import { charactersAPI } from "@/lib/api";
import type { FetchOptions } from "@/lib/api/client";

export function useCharacters(options?: FetchOptions) {
  return useQuery({
    queryKey: ["characters", options],
    queryFn: () => charactersAPI.getAll(options),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

export function useCharacter(id: string) {
  return useQuery({
    queryKey: ["character", id],
    queryFn: () => charactersAPI.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10분
  });
}
