import { useQuery } from "@tanstack/react-query";
import { spellsAPI } from "@/lib/api";
import type { FetchOptions } from "@/lib/api/client";

export function useSpells(options?: FetchOptions) {
  return useQuery({
    queryKey: ["spells", options],
    queryFn: () => spellsAPI.getAll(options),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpell(id: string) {
  return useQuery({
    queryKey: ["spell", id],
    queryFn: () => spellsAPI.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
