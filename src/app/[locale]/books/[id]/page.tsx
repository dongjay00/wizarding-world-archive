"use client";

import { use } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useFormatter, useTranslations } from "next-intl";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FileText,
  User,
  Heart,
  List,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useBook, useChapters } from "@/lib/hooks/useBooks";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import FavoriteToggleButton from "@/components/shared/FavoriteToggleButton";
import { favoriteFromBook } from "@/lib/utils/favorites";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("books");
  const tc = useTranslations("common");
  const format = useFormatter();
  const {
    data: bookData,
    isLoading: bookLoading,
    error: bookError,
  } = useBook(id);
  const { data: chaptersData, isLoading: chaptersLoading } = useChapters(id);

  if (bookLoading) return <FullPageLoader />;
  if (bookError || !bookData) return <ErrorMessage message={t("notFound")} />;

  const book = bookData.data;
  const { attributes } = book;
  const chapters = chaptersData?.data || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-gray-900" />
        {attributes.cover && (
          <>
            <Image
              src={attributes.cover}
              alt={attributes.title}
              fill
              className="object-cover opacity-20 blur-sm"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          </>
        )}

        <div className="absolute top-8 left-8 z-10">
          <Link
            href="/books"
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-surface/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("backToList")}</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-6xl font-magic font-bold magic-text mb-4">
                {attributes.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-lg text-white/80">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{attributes.author}</span>
                </div>
                {attributes.release_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {format.dateTime(new Date(attributes.release_date), {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {attributes.pages && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span>{t("pagesCount", { count: attributes.pages })}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6 sticky top-24 space-y-6">
              {/* Cover */}
              {attributes.cover && (
                <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={attributes.cover}
                    alt={attributes.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              <FavoriteToggleButton
                item={favoriteFromBook(book)}
                showLabel
                className="w-full px-4 py-3 font-semibold"
              />

              {/* Quick Info */}
              <div className="space-y-4">
                <div>
                  <div className="text-muted text-sm mb-1">{t("author")}</div>
                  <div className="font-semibold text-amber-300">
                    {attributes.author}
                  </div>
                </div>

                {attributes.pages && (
                  <div>
                    <div className="text-muted text-sm mb-1">{t("pages")}</div>
                    <div className="font-semibold">{attributes.pages}</div>
                  </div>
                )}

                {attributes.release_date && (
                  <div>
                    <div className="text-muted text-sm mb-1">
                      {t("published")}
                    </div>
                    <div className="font-semibold">
                      {format.dateTime(new Date(attributes.release_date), {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Wiki Link */}
              {attributes.wiki && (
                <a
                  href={attributes.wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{tc("viewWiki")}</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Summary */}
            {attributes.summary && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-amber-500" />
                  {t("summaryTitle")}
                </h2>
                <p className="text-muted leading-relaxed text-lg">
                  {attributes.summary}
                </p>
              </div>
            )}

            {/* Dedication */}
            {attributes.dedication && (
              <div className="glass rounded-2xl p-8 border-2 border-pink-500/20">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2 text-pink-400">
                  <Heart className="w-6 h-6" />
                  {t("dedicationTitle")}
                </h2>
                <p className="text-pink-200 italic text-lg leading-relaxed">
                  {attributes.dedication}
                </p>
              </div>
            )}

            {/* Chapters */}
            {chapters.length > 0 && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-magic font-bold mb-6 flex items-center gap-2">
                  <List className="w-6 h-6 text-amber-500" />
                  {t("chapters", { count: chapters.length })}
                </h2>
                {chaptersLoading ? (
                  <div className="text-center py-8 text-muted">
                    {t("loadingChapters")}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="p-4 bg-surface/5 hover:bg-surface/10 rounded-lg transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center font-bold text-amber-400">
                            {chapter.attributes.order}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-magic font-semibold text-lg group-hover:text-amber-400 transition-colors mb-1">
                              {chapter.attributes.title}
                            </h3>
                            <p className="text-sm text-muted line-clamp-2">
                              {chapter.attributes.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
