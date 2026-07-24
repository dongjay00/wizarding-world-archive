"use client";

import { Suspense } from "react";
import { Search, FlaskConical, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { usePotions } from "@/lib/hooks/usePotions";
import { useListFilters, type ListFiltersConfig } from "@/lib/hooks/useListFilters";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/shared/Pagination";
import PotionCard from "@/components/features/PotionCard";
import { POTION_DIFFICULTIES } from "@/lib/utils/constants";

const FILTERS_CONFIG: ListFiltersConfig = {
  searchFilterKey: "name_cont",
  discreteFilter: { param: "difficulty", filterKey: "difficulty_eq" },
  sort: "name",
  pageSize: 24,
};

export default function PotionsPage() {
  // useListFilters(useSearchParams) 는 App Router에서 Suspense 경계를 요구한다.
  return (
    <Suspense fallback={<FullPageLoader />}>
      <PotionsPageContent />
    </Suspense>
  );
}

function PotionsPageContent() {
  const {
    search,
    setSearch,
    discreteValue: selectedDifficulty,
    setDiscreteValue: setSelectedDifficulty,
    page: currentPage,
    setPage: setCurrentPage,
    fetchOptions,
  } = useListFilters(FILTERS_CONFIG);

  const { data, isLoading, error } = usePotions(fetchOptions);

  const potions = data?.data || [];
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
          <FlaskConical className="w-12 h-12 text-green-500" />
          <h1 className="text-5xl font-magic font-bold">Potions</h1>
        </div>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Explore magical brews, their ingredients, and powerful effects
        </p>
      </motion.div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search potions by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface/5 border border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-content placeholder-subtle transition-all"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Filter className="w-4 h-4" />
            <span>Filter by Difficulty:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedDifficulty === ""
                  ? "bg-green-500 text-white"
                  : "glass hover:bg-surface/10"
              }`}
            >
              All Levels
            </button>
            {POTION_DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDifficulty === difficulty
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    : "glass hover:bg-surface/10"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <FullPageLoader />
      ) : error ? (
        <ErrorMessage message="Failed to load potions" />
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6 text-muted">
            Found{" "}
            <span className="text-green-400 font-semibold">
              {data?.meta?.pagination?.records || 0}
            </span>{" "}
            potions
          </div>

          {/* Potions Grid */}
          {potions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🧪</div>
              <h3 className="text-2xl font-magic font-bold mb-2">
                No Potions Found
              </h3>
              <p className="text-muted">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {potions.map((potion, idx) => (
                  <motion.div
                    key={potion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <PotionCard potion={potion} />
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
