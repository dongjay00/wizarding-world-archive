import { apiClient, FetchOptions } from "./client";
import type {
  PotterCharactersResponse,
  PotterCharacter,
  PotterSpellListResponse,
  PotterSpell,
  PotterPotionListResponse,
  PotterPotion,
  PotterMovieListResponse,
  PotterMovie,
  PotterBookListResponse,
  PotterBook,
  PotterChaptersResponse,
  PotterChapter,
} from "@/types/potter";

// Characters API
export const charactersAPI = {
  getAll: (options?: FetchOptions) =>
    apiClient.fetch<PotterCharactersResponse>("/characters", options),

  getById: (id: string) =>
    apiClient.fetchById<{ data: PotterCharacter }>("/characters", id),
};

// Spells API
export const spellsAPI = {
  getAll: (options?: FetchOptions) =>
    apiClient.fetch<PotterSpellListResponse>("/spells", options),

  getById: (id: string) =>
    apiClient.fetchById<{ data: PotterSpell }>("/spells", id),
};

// Potions API
export const potionsAPI = {
  getAll: (options?: FetchOptions) =>
    apiClient.fetch<PotterPotionListResponse>("/potions", options),

  getById: (id: string) =>
    apiClient.fetchById<{ data: PotterPotion }>("/potions", id),
};

// Movies API
export const moviesAPI = {
  getAll: (options?: FetchOptions) =>
    apiClient.fetch<PotterMovieListResponse>("/movies", options),

  getById: (id: string) =>
    apiClient.fetchById<{ data: PotterMovie }>("/movies", id),
};

// Books API
export const booksAPI = {
  getAll: (options?: FetchOptions) =>
    apiClient.fetch<PotterBookListResponse>("/books", options),

  getById: (id: string) =>
    apiClient.fetchById<{ data: PotterBook }>("/books", id),

  getChapters: (bookId: string, options?: FetchOptions) =>
    apiClient.fetch<PotterChaptersResponse>(
      `/books/${bookId}/chapters`,
      options
    ),

  getChapterById: (bookId: string, chapterId: string) =>
    apiClient.fetch<{ data: PotterChapter }>(
      `/books/${bookId}/chapters/${chapterId}`
    ),
};
