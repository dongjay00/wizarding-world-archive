import { useQuery } from "@tanstack/react-query";
import { booksAPI } from "@/lib/api";
import type { FetchOptions } from "@/lib/api/client";

export function useBooks(options?: FetchOptions) {
  return useQuery({
    queryKey: ["books", options],
    queryFn: () => booksAPI.getAll(options),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => booksAPI.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useChapters(bookId: string, options?: FetchOptions) {
  return useQuery({
    queryKey: ["chapters", bookId, options],
    queryFn: () => booksAPI.getChapters(bookId, options),
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000,
  });
}
