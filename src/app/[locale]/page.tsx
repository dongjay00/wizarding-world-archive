"use client";

import {
  Sparkles,
  Users,
  Wand2,
  FlaskConical,
  Film,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// 표시 문자열(제목·설명·통계)은 카탈로그 `home.*`/`nav.*`에서 소비한다(C-S7).
// icon·href·gradient만 하드코딩 유지.
const categories = [
  {
    key: "characters",
    icon: Users,
    href: "/characters",
    gradient: "from-red-900 to-amber-600",
  },
  {
    key: "spells",
    icon: Wand2,
    href: "/spells",
    gradient: "from-purple-900 to-pink-600",
  },
  {
    key: "potions",
    icon: FlaskConical,
    href: "/potions",
    gradient: "from-green-900 to-emerald-600",
  },
  {
    key: "movies",
    icon: Film,
    href: "/movies",
    gradient: "from-blue-900 to-cyan-600",
  },
  {
    key: "books",
    icon: BookOpen,
    href: "/books",
    gradient: "from-amber-900 to-yellow-600",
  },
] as const;

const statKeys = ["characters", "spells", "potions", "movies"] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function HomePage() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
        <motion.div
          className="absolute top-20 left-10 text-amber-500/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-amber-500/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-20 h-20" />
        </motion.div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-magic font-bold mb-6 magic-text">
              {t("heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-muted mb-8 max-w-3xl mx-auto">
              {t("heroSubtitle")}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/characters"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-full transition-all duration-300 magic-glow"
              >
                <Sparkles className="w-5 h-5" />
                {t("cta")}
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {statKeys.map((key) => (
              <div key={key} className="glass p-6 rounded-xl">
                <div className="text-3xl font-bold text-amber-400">
                  {t(`stats.${key}`)}
                </div>
                <div className="text-sm text-muted mt-1">{tNav(key)}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-magic font-bold mb-4">
            {t("exploreTitle")}
          </h2>
          <p className="text-muted text-lg">{t("exploreSubtitle")}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.key} variants={item}>
                <Link href={category.href}>
                  <div className="group relative overflow-hidden rounded-2xl glass p-8 hover-lift card-shine h-full">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-4 rounded-xl bg-gradient-to-br ${category.gradient} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-amber-400">
                          {t(`cards.${category.key}.count`)}
                        </span>
                      </div>

                      <h3 className="text-2xl font-magic font-bold mb-2 group-hover:text-amber-400 transition-colors">
                        {tNav(category.key)}
                      </h3>
                      <p className="text-muted text-sm">
                        {t(`cards.${category.key}.description`)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl glass p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-purple-500/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-magic font-bold mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-muted mb-8 max-w-2xl mx-auto">
              {t("ctaSubtitle")}
            </p>
            <Link
              href="/spells"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-full transition-all duration-300"
            >
              <Wand2 className="w-5 h-5" />
              {t("ctaButton")}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
