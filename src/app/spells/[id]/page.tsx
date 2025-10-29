"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wand2,
  Sparkles,
  User,
  Hand,
  Lightbulb,
  Tag,
  ExternalLink,
} from "lucide-react";
import { useSpell } from "@/lib/hooks/useSpells";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";

const categoryColors: Record<string, string> = {
  Charm: "from-blue-600 to-cyan-600",
  Transfiguration: "from-purple-600 to-pink-600",
  Curse: "from-red-600 to-orange-600",
  Hex: "from-orange-600 to-yellow-600",
  Jinx: "from-green-600 to-emerald-600",
  Spell: "from-indigo-600 to-blue-600",
  "Counter-spell": "from-teal-600 to-cyan-600",
  "Healing spell": "from-pink-600 to-rose-600",
};

export default function SpellDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useSpell(id);

  if (isLoading) return <FullPageLoader />;
  if (error || !data) return <ErrorMessage message="Spell not found" />;

  const spell = data.data;
  const { attributes } = spell;
  const categoryGradient = attributes.category
    ? categoryColors[attributes.category] || "from-purple-600 to-pink-600"
    : "from-purple-600 to-pink-600";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        {/* Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} opacity-20`}
        />
        {attributes.image && (
          <>
            <Image
              src={attributes.image}
              alt={attributes.name}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          </>
        )}

        {/* Floating Sparkles */}
        <motion.div
          className="absolute top-20 left-20 text-purple-400/30"
          animate={{ y: [0, -20, 0], rotate: [0, 360] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-20 text-purple-400/30"
          animate={{ y: [0, 20, 0], rotate: [0, -360] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Sparkles className="w-16 h-16" />
        </motion.div>

        {/* Back Button */}
        <div className="absolute top-8 left-8 z-10">
          <Link
            href="/spells"
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Spells</span>
          </Link>
        </div>

        {/* Title Section */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {attributes.category && (
                <span
                  className={`inline-block px-4 py-2 bg-gradient-to-r ${categoryGradient} rounded-full text-sm font-semibold mb-4`}
                >
                  {attributes.category}
                </span>
              )}
              <h1 className="text-6xl font-magic font-bold magic-text mb-2">
                {attributes.name}
              </h1>
              {attributes.incantation && (
                <p className="text-2xl text-purple-300 font-magic italic">
                  &quot;{attributes.incantation}&quot;
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6 sticky top-24 space-y-6">
              {/* Visual */}
              {attributes.image && (
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <Image
                    src={attributes.image}
                    alt={attributes.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              {/* Quick Info */}
              <div className="space-y-4">
                {attributes.creator && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Creator</span>
                    </div>
                    <div className="font-medium text-purple-300">
                      {attributes.creator}
                    </div>
                  </div>
                )}

                {attributes.light && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <Lightbulb className="w-4 h-4" />
                      <span>Light Color</span>
                    </div>
                    <div className="font-medium">{attributes.light}</div>
                  </div>
                )}

                {attributes.hand && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <Hand className="w-4 h-4" />
                      <span>Wand Movement</span>
                    </div>
                    <div className="font-medium">{attributes.hand}</div>
                  </div>
                )}
              </div>

              {/* Wiki Link */}
              {attributes.wiki && (
                <a
                  href={attributes.wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Wiki</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Incantation Card */}
            {attributes.incantation && (
              <div className="glass rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-purple-500" />
                  Incantation
                </h2>
                <div className="text-center py-8">
                  <div className="text-5xl font-magic magic-text mb-2">
                    {attributes.incantation}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Speak clearly while performing the wand movement
                  </p>
                </div>
              </div>
            )}

            {/* Effect Card */}
            {attributes.effect && (
              <div className="glass rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  Effect
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {attributes.effect}
                </p>
              </div>
            )}

            {/* Category Info */}
            {attributes.category && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-6 h-6 text-purple-500" />
                  Category Information
                </h2>
                <div
                  className={`p-6 rounded-xl bg-gradient-to-r ${categoryGradient} text-center`}
                >
                  <div className="text-3xl font-magic font-bold mb-2">
                    {attributes.category}
                  </div>
                  <p className="text-sm opacity-90">
                    {getCategoryDescription(attributes.category)}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    Charm:
      "Charms are spells that add or change properties of an object or person.",
    Transfiguration:
      "Transfiguration is magic that changes one object into another.",
    Curse: "Curses are dark spells intended to cause harm or control others.",
    Hex: "Hexes are spells that cause moderate harm or discomfort.",
    Jinx: "Jinxes are minor spells that cause temporary inconvenience.",
    Spell: "General magical incantations for various purposes.",
    "Counter-spell": "Spells designed to counter or reverse other spells.",
    "Healing spell": "Spells used to heal injuries and cure ailments.",
  };
  return (
    descriptions[category] || "A magical incantation from the Wizarding World."
  );
}
