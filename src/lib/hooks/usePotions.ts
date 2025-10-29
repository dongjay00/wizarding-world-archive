import { useQuery } from "@tanstack/react-query";
import { potionsAPI } from "@/lib/api";
import type { FetchOptions } from "@/lib/api/client";

export function usePotions(options?: FetchOptions) {
  return useQuery({
    queryKey: ["potions", options],
    queryFn: () => potionsAPI.getAll(options),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePotion(id: string) {
  return useQuery({
    queryKey: ["potion", id],
    queryFn: () => potionsAPI.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
