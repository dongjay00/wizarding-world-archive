"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FavoriteCard from "@/components/features/FavoriteCard";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";
import { useFavoritesStore } from "@/lib/stores/favoritesStore";

export default function FavoritesPage() {
  const t = useTranslations("favorites");
  const items = useFavoritesStore((state) => state.items);
  const hasHydrated = useFavoritesStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <FullPageLoader />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-12 w-12 fill-amber-500 text-amber-500" />
          <h1 className="text-5xl font-magic font-bold">{t("title")}</h1>
        </div>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          {items.length === 0
            ? t("summaryEmpty")
            : t("summaryCount", { count: items.length })}
        </p>
      </motion.div>

      {items.length === 0 ? (
        <div className="mx-auto max-w-2xl text-center py-20">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
              <Sparkles className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mb-3 text-3xl font-magic font-bold">
            {t("emptyTitle")}
          </h2>
          <p className="mb-8 text-muted">{t("emptyBody")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/characters"
              className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white transition-all hover:bg-amber-600"
            >
              {t("browseCharacters")}
            </Link>
            <Link
              href="/spells"
              className="rounded-lg glass px-5 py-3 font-semibold transition-all hover:bg-surface/10"
            >
              {t("browseSpells")}
            </Link>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {items.map((item, idx) => (
            <motion.div
              key={`${item.type}:${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <FavoriteCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
