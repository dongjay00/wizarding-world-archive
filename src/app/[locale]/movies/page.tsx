"use client";

import { Suspense } from "react";
import { Search, Film } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMovies } from "@/lib/hooks/useMovies";
import { useListFilters, type ListFiltersConfig } from "@/lib/hooks/useListFilters";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/shared/Pagination";
import MovieCard from "@/components/features/MovieCard";

const FILTERS_CONFIG: ListFiltersConfig = {
  searchFilterKey: "title_cont",
  sort: "release_date",
  pageSize: 12,
};

export default function MoviesPage() {
  // useListFilters(useSearchParams) 는 App Router에서 Suspense 경계를 요구한다.
  return (
    <Suspense fallback={<FullPageLoader />}>
      <MoviesPageContent />
    </Suspense>
  );
}

function MoviesPageContent() {
  const t = useTranslations("movies");
  const {
    search,
    setSearch,
    page: currentPage,
    setPage: setCurrentPage,
    fetchOptions,
  } = useListFilters(FILTERS_CONFIG);

  const { data, isLoading, error } = useMovies(fetchOptions);

  const movies = data?.data || [];
  const totalPages = data?.meta?.pagination?.last || 1;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Film className="w-12 h-12 text-blue-500" />
          <h1 className="text-5xl font-magic font-bold">{t("title")}</h1>
        </div>
        <p className="text-muted text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
      </motion.div>

      {/* Search Bar */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface/5 border border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-content placeholder-subtle transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <FullPageLoader />
      ) : error ? (
        <ErrorMessage message={t("error")} />
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6 text-muted">
            {t.rich("found", {
              count: data?.meta?.pagination?.records || 0,
              em: (chunks) => (
                <span className="text-blue-400 font-semibold">{chunks}</span>
              ),
            })}
          </div>

          {/* Movies Grid */}
          {movies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-magic font-bold mb-2">
                {t("emptyTitle")}
              </h3>
              <p className="text-muted">{t("emptyHint")}</p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {movies.map((movie, idx) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </motion.div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
