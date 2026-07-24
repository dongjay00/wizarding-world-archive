"use client";

import Image from "next/image";
import { Heart, Sparkles, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { FavoriteItem } from "@/lib/stores/favoritesStore";
import { useFavoritesStore } from "@/lib/stores/favoritesStore";

// FavoriteItem.type(소문자) → domain.entity 카탈로그 키(en canonical). ko 표기는 R-6(build-logic T7).
const entityKey: Record<FavoriteItem["type"], string> = {
  character: "Character",
  spell: "Spell",
  potion: "Potion",
  movie: "Movie",
  book: "Book",
};

interface FavoriteCardProps {
  item: FavoriteItem;
}

export default function FavoriteCard({ item }: FavoriteCardProps) {
  const t = useTranslations("favorites");
  const tEntity = useTranslations("domain.entity");
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  return (
    <div className="group relative overflow-hidden rounded-xl glass hover-lift card-shine h-full">
      <button
        type="button"
        aria-label={t("remove", { title: item.title })}
        onClick={() => removeFavorite(item.type, item.id)}
        className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-red-400/30 bg-slate-950/70 text-red-300 shadow-lg backdrop-blur transition-all hover:bg-red-500 hover:text-white"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <Link href={item.href} className="block h-full">
        <div className="relative h-48 bg-gradient-to-b from-amber-900/40 to-gray-900 overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-14 w-14 text-amber-500/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200">
            <Heart className="h-3 w-3 fill-current" />
            {tEntity(entityKey[item.type])}
          </div>
        </div>

        <div className="p-5">
          <h3 className="mb-2 line-clamp-1 text-xl font-magic font-bold group-hover:text-amber-400 transition-colors">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="line-clamp-2 text-sm text-muted">{item.subtitle}</p>
          )}
        </div>
      </Link>
    </div>
  );
}
