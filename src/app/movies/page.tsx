"use client";

import { useState, useMemo } from "react";
import { Search, Film } from "lucide-react";
import { motion } from "framer-motion";
import { useMovies } from "@/lib/hooks/useMovies";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/shared/Pagination";
import MovieCard from "@/components/features/MovieCard";

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const apiOptions = useMemo(() => {
    const filter: Record<string, string> = {};

    if (searchQuery) {
      filter.title_cont = searchQuery;
    }

    return {
      page: currentPage,
      pageSize,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      sort: "release_date",
    };
  }, [searchQuery, currentPage]);

  const { data, isLoading, error } = useMovies(apiOptions);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

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
          <h1 className="text-5xl font-magic font-bold">Movies</h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Experience the magical journey through the Harry Potter film series
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <FullPageLoader />
      ) : error ? (
        <ErrorMessage message="Failed to load movies" />
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6 text-gray-400">
            Found{" "}
            <span className="text-blue-400 font-semibold">
              {data?.meta?.pagination?.records || 0}
            </span>{" "}
            movies
          </div>

          {/* Movies Grid */}
          {movies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-magic font-bold mb-2">
                No Movies Found
              </h3>
              <p className="text-gray-400">Try adjusting your search</p>
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
