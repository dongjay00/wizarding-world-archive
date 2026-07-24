"use client";

import { Heart } from "lucide-react";
import type { MouseEvent } from "react";
import type { FavoriteItemInput } from "@/lib/stores/favoritesStore";
import { useFavoritesStore } from "@/lib/stores/favoritesStore";

interface FavoriteToggleButtonProps {
  item: FavoriteItemInput;
  className?: string;
  showLabel?: boolean;
}

export default function FavoriteToggleButton({
  item,
  className = "",
  showLabel = false,
}: FavoriteToggleButtonProps) {
  const hasHydrated = useFavoritesStore((state) => state.hasHydrated);
  const isFavorite = useFavoritesStore((state) =>
    state.isFavorite(item.type, item.id)
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const label = isFavorite ? "Remove from favorites" : "Add to favorites";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (hasHydrated) {
      toggleFavorite(item);
    }
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isFavorite}
      title={label}
      disabled={!hasHydrated}
      onClick={handleClick}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-amber-400/30 bg-slate-950/70 text-amber-300 shadow-lg backdrop-blur transition-all hover:bg-amber-500 hover:text-white disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      <Heart
        className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
        aria-hidden="true"
      />
      {showLabel && <span>{isFavorite ? "Favorited" : "Favorite"}</span>}
    </button>
  );
}
