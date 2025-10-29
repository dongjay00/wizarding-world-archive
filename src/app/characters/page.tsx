"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useCharacters } from "@/lib/hooks/useCharacters";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/shared/Pagination";
import CharacterCard from "@/components/features/CharacterCard";
import { HOUSE_COLORS } from "@/lib/utils/constants";

const houses = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];

export default function CharactersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  // API 호출 옵션
  const apiOptions = useMemo(() => {
    const filter: Record<string, string> = {};

    if (searchQuery) {
      filter.name_cont = searchQuery;
    }

    if (selectedHouse) {
      filter.house_eq = selectedHouse;
    }

    return {
      page: currentPage,
      pageSize,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      sort: "name",
    };
  }, [searchQuery, selectedHouse, currentPage]);

  const { data, isLoading, error } = useCharacters(apiOptions);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleHouseFilter = (house: string | null) => {
    setSelectedHouse(house);
    setCurrentPage(1);
  };

  const characters = data?.data || [];
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
          <Users className="w-12 h-12 text-amber-500" />
          <h1 className="text-5xl font-magic font-bold">Characters</h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Discover the witches, wizards, and magical creatures of the Wizarding
          World
        </p>
      </motion.div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search characters by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-500 transition-all"
          />
        </div>

        {/* House Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="w-4 h-4" />
            <span>Filter by House:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleHouseFilter(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedHouse === null
                  ? "bg-amber-500 text-white"
                  : "glass hover:bg-white/10"
              }`}
            >
              All Houses
            </button>
            {houses.map((house) => (
              <button
                key={house}
                onClick={() => handleHouseFilter(house)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedHouse === house
                    ? `bg-gradient-to-r ${
                        HOUSE_COLORS[house as keyof typeof HOUSE_COLORS]
                          .gradient
                      } text-white`
                    : "glass hover:bg-white/10"
                }`}
              >
                {house}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <FullPageLoader />
      ) : error ? (
        <ErrorMessage message="Failed to load characters" />
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6 text-gray-400">
            Found{" "}
            <span className="text-amber-400 font-semibold">
              {data?.meta?.pagination?.records || 0}
            </span>{" "}
            characters
          </div>

          {/* Characters Grid */}
          {characters.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-magic font-bold mb-2">
                No Characters Found
              </h3>
              <p className="text-gray-400">
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
                {characters.map((character, idx) => (
                  <motion.div
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <CharacterCard character={character} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
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
