"use client";

import Link from "next/link";
import {
  Sparkles,
  Users,
  Wand2,
  FlaskConical,
  Film,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Characters",
    description: "Discover witches, wizards, and magical creatures",
    icon: Users,
    href: "/characters",
    gradient: "from-red-900 to-amber-600",
    count: "1000+",
  },
  {
    title: "Spells",
    description: "Master the incantations of the wizarding world",
    icon: Wand2,
    href: "/spells",
    gradient: "from-purple-900 to-pink-600",
    count: "300+",
  },
  {
    title: "Potions",
    description: "Explore magical brews and their effects",
    icon: FlaskConical,
    href: "/potions",
    gradient: "from-green-900 to-emerald-600",
    count: "100+",
  },
  {
    title: "Movies",
    description: "Relive the cinematic journey through time",
    icon: Film,
    href: "/movies",
    gradient: "from-blue-900 to-cyan-600",
    count: "8 Films",
  },
  {
    title: "Books",
    description: "Dive into the original magical tales",
    icon: BookOpen,
    href: "/books",
    gradient: "from-amber-900 to-yellow-600",
    count: "7 Books",
  },
];

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
              The Wizarding World
            </h1>
            <p className="text-xl md:text-2xl text-muted mb-8 max-w-3xl mx-auto">
              Explore the complete archive of characters, spells, potions, and
              more from the magical universe of Harry Potter
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/characters"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-full transition-all duration-300 magic-glow"
              >
                <Sparkles className="w-5 h-5" />
                Begin Your Journey
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
            {[
              { label: "Characters", value: "1000+" },
              { label: "Spells", value: "300+" },
              { label: "Potions", value: "100+" },
              { label: "Movies", value: "8" },
            ].map((stat, idx) => (
              <div key={idx} className="glass p-6 rounded-xl">
                <div className="text-3xl font-bold text-amber-400">
                  {stat.value}
                </div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
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
            Explore the Archive
          </h2>
          <p className="text-muted text-lg">
            Choose your path through the magical world
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div key={idx} variants={item}>
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
                          {category.count}
                        </span>
                      </div>

                      <h3 className="text-2xl font-magic font-bold mb-2 group-hover:text-amber-400 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted text-sm">
                        {category.description}
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
              Ready to Cast Your First Spell?
            </h2>
            <p className="text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of wizards and witches exploring the most
              comprehensive Harry Potter database
            </p>
            <Link
              href="/spells"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-full transition-all duration-300"
            >
              <Wand2 className="w-5 h-5" />
              Explore Spells
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
