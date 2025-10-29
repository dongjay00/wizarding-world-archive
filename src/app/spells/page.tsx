"use client";

import { useState, useMemo } from "react";
import { Search, Wand2, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useSpells } from "@/lib/hooks/useSpells";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/shared/Pagination";
import SpellCard from "@/components/features/SpellCard";
import { SPELL_CATEGORIES } from "@/lib/utils/constants";

export default function SpellsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const apiOptions = useMemo(() => {
    const filter: Record<string, string> = {};

    if (searchQuery) {
      filter.name_cont = searchQuery;
    }

    if (selectedCategory) {
      filter.category_eq = selectedCategory;
    }

    return {
      page: currentPage,
      pageSize,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      sort: "name",
    };
  }, [searchQuery, selectedCategory, currentPage]);

  const { data, isLoading, error } = useSpells(apiOptions);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (isLoading) return <FullPageLoader />;
  if (error) return <ErrorMessage message="Failed to load spells" />;

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
          <h1 className="text-5xl font-magic font-bold">Spells</h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Master the incantations and magical spells of the Wizarding World
        </p>
      </motion.div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search spells by name or incantation..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="w-4 h-4" />
            <span>Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === null
                  ? "bg-purple-500 text-white"
                  : "glass hover:bg-white/10"
              }`}
            >
              All Categories
            </button>
            {SPELL_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "glass hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-gray-400">
        Found{" "}
        <span className="text-purple-400 font-semibold">
          {data?.meta?.pagination?.records || 0}
        </span>{" "}
        spells
      </div>

      {/* Spells Grid */}
      {spells.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔮</div>
          <h3 className="text-2xl font-magic font-bold mb-2">
            No Spells Found
          </h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
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
    </div>
  );
}
