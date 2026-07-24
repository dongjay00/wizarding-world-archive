"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useBooks } from "@/lib/hooks/useBooks";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import BookCard from "@/components/features/BookCard";

export default function BooksPage() {
  const t = useTranslations("books");
  const { data, isLoading, error } = useBooks({ sort: "release_date" });

  if (isLoading) return <FullPageLoader />;
  if (error) return <ErrorMessage message={t("error")} />;

  const books = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-12 h-12 text-amber-500" />
          <h1 className="text-5xl font-magic font-bold">{t("title")}</h1>
        </div>
        <p className="text-muted text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
      </motion.div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-magic font-bold mb-2">
            {t("emptyTitle")}
          </h3>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {books.map((book, idx) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
