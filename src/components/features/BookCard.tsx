"use client";

import Image from "next/image";
import { BookOpen, Calendar, FileText } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { PotterBook } from "@/types/potter";
import FavoriteToggleButton from "@/components/shared/FavoriteToggleButton";
import { favoriteFromBook } from "@/lib/utils/favorites";

interface BookCardProps {
  book: PotterBook;
}

export default function BookCard({ book }: BookCardProps) {
  const t = useTranslations("books");
  const format = useFormatter();
  const { attributes } = book;

  return (
    <div className="group relative overflow-hidden rounded-2xl glass hover-lift card-shine h-full">
      <FavoriteToggleButton
        item={favoriteFromBook(book)}
        className="absolute left-3 top-3 z-20 h-10 w-10"
      />
      <Link href={`/books/${book.id}`} className="block h-full">
        {/* Cover */}
        <div className="relative h-[450px] bg-gradient-to-b from-amber-900/50 to-gray-900 overflow-hidden">
          {attributes.cover ? (
            <Image
              src={attributes.cover}
              alt={attributes.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-20 h-20 text-amber-500/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

          {/* Pages Badge */}
          {attributes.pages && (
            <div className="absolute top-4 right-4 px-3 py-1 glass rounded-full text-xs font-semibold flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {t("pagesCount", { count: attributes.pages })}
            </div>
          )}

          {/* Title Overlay (스크림 위 — 양 테마 흰색 고정) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-magic font-bold mb-2 group-hover:text-amber-400 transition-colors">
              {attributes.title}
            </h3>

            <div className="text-sm text-white/80 mb-2">
              {t("by", { name: attributes.author })}
            </div>

            {attributes.release_date && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calendar className="w-4 h-4" />
                <span>
                  {format.dateTime(new Date(attributes.release_date), {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {attributes.summary && (
          <div className="p-5">
            <p className="text-sm text-muted line-clamp-3">
              {attributes.summary}
            </p>
          </div>
        )}
    </Link>
    </div>
  );
}
