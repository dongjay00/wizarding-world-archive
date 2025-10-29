import { create } from "zustand";

interface FilterState {
  searchQuery: string;
  selectedHouse: string | null;
  selectedCategory: string | null;
  sortBy: string;
  currentPage: number;

  setSearchQuery: (query: string) => void;
  setSelectedHouse: (house: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sort: string) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  selectedHouse: null,
  selectedCategory: null,
  sortBy: "name",
  currentPage: 1,

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setSelectedHouse: (house) => set({ selectedHouse: house, currentPage: 1 }),
  setSelectedCategory: (category) =>
    set({ selectedCategory: category, currentPage: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: () =>
    set({
      searchQuery: "",
      selectedHouse: null,
      selectedCategory: null,
      sortBy: "name",
      currentPage: 1,
    }),
}));
