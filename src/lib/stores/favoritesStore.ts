"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FavoriteEntityType =
  | "character"
  | "spell"
  | "potion"
  | "movie"
  | "book";

export interface FavoriteItem {
  id: string;
  type: FavoriteEntityType;
  title: string;
  subtitle?: string;
  image?: string | null;
  href: string;
  savedAt: number;
}

export type FavoriteItemInput = Omit<FavoriteItem, "savedAt">;

interface FavoritesState {
  items: FavoriteItem[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  toggleFavorite: (item: FavoriteItemInput) => void;
  removeFavorite: (type: FavoriteEntityType, id: string) => void;
  isFavorite: (type: FavoriteEntityType, id: string) => boolean;
}

function favoriteKey(type: FavoriteEntityType, id: string) {
  return `${type}:${id}`;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      toggleFavorite: (item) => {
        const key = favoriteKey(item.type, item.id);
        const exists = get().items.some(
          (favorite) => favoriteKey(favorite.type, favorite.id) === key
        );

        if (exists) {
          set({
            items: get().items.filter(
              (favorite) => favoriteKey(favorite.type, favorite.id) !== key
            ),
          });
          return;
        }

        set({
          items: [{ ...item, savedAt: Date.now() }, ...get().items],
        });
      },
      removeFavorite: (type, id) =>
        set({
          items: get().items.filter(
            (favorite) =>
              favoriteKey(favorite.type, favorite.id) !== favoriteKey(type, id)
          ),
        }),
      isFavorite: (type, id) =>
        get().items.some(
          (favorite) =>
            favoriteKey(favorite.type, favorite.id) === favoriteKey(type, id)
        ),
    }),
    {
      name: "wizarding-world-favorites",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
