"use client";

import { Suspense } from "react";
import { Search, Wand2, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSpells } from "@/lib/hooks/useSpells";
import { useListFilters, type ListFiltersConfig } from "@/lib/hooks/useListFilters";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/shared/Pagination";
import SpellCard from "@/components/features/SpellCard";
import { SPELL_CATEGORIES } from "@/lib/utils/constants";

const FILTERS_CONFIG: ListFiltersConfig = {
  searchFilterKey: "name_cont",
  discreteFilter: { param: "category", filterKey: "category_eq" },
  sort: "name",
  pageSize: 24,
};

export default function SpellsPage() {
  // useListFilters(useSearchParams) 는 App Router에서 Suspense 경계를 요구한다.
  return (
    <Suspense fallback={<FullPageLoader />}>
      <SpellsPageContent />
    </Suspense>
  );
}

function SpellsPageContent() {
  const t = useTranslations("spells");
  const {
    search,
    setSearch,
    discreteValue: selectedCategory,
    setDiscreteValue: setSelectedCategory,
    page: currentPage,
    setPage: setCurrentPage,
    fetchOptions,
  } = useListFilters(FILTERS_CONFIG);

  const { data, isLoading, error } = useSpells(fetchOptions);

  const spells = data?.data || [];
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
          <Wand2 className="w-12 h-12 text-purple-500" />
          <h1 className="text-5xl font-magic font-bold">{t("title")}</h1>
        </div>
        <p className="text-muted text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
      </motion.div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface/5 border border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-content placeholder-subtle transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Filter className="w-4 h-4" />
            <span>{t("filterByCategory")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === ""
                  ? "bg-purple-500 text-white"
                  : "glass hover:bg-surface/10"
              }`}
            >
              {t("allCategories")}
            </button>
            {SPELL_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "glass hover:bg-surface/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
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
                <span className="text-purple-400 font-semibold">{chunks}</span>
              ),
            })}
          </div>

          {/* Spells Grid */}
          {spells.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔮</div>
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {spells.map((spell, idx) => (
                  <motion.div
                    key={spell.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <SpellCard spell={spell} />
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
