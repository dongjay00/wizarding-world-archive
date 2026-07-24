"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FlaskConical,
  Clock,
  AlertTriangle,
  Sparkles,
  User,
  Package,
  ExternalLink,
  ListChecks,
} from "lucide-react";
import { usePotion } from "@/lib/hooks/usePotions";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import FavoriteToggleButton from "@/components/shared/FavoriteToggleButton";
import { favoriteFromPotion } from "@/lib/utils/favorites";

const difficultyColors: Record<string, string> = {
  Beginner: "from-green-600 to-emerald-600",
  Moderate: "from-yellow-600 to-orange-600",
  Advanced: "from-orange-600 to-red-600",
  "Very Advanced": "from-red-600 to-purple-600",
};

export default function PotionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = usePotion(id);

  if (isLoading) return <FullPageLoader />;
  if (error || !data) return <ErrorMessage message="Potion not found" />;

  const potion = data.data;
  const { attributes } = potion;
  const difficultyGradient = attributes.difficulty
    ? difficultyColors[attributes.difficulty] || "from-green-600 to-emerald-600"
    : "from-green-600 to-emerald-600";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${difficultyGradient} opacity-20`}
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

        <div className="absolute top-8 left-8 z-10">
          <Link
            href="/potions"
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-surface/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Potions</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {attributes.difficulty && (
                <span
                  className={`inline-block px-4 py-2 bg-gradient-to-r ${difficultyGradient} rounded-full text-sm font-semibold mb-4`}
                >
                  {attributes.difficulty}
                </span>
              )}
              <h1 className="text-6xl font-magic font-bold magic-text">
                {attributes.name}
              </h1>
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

              <FavoriteToggleButton
                item={favoriteFromPotion(potion)}
                showLabel
                className="w-full px-4 py-3 font-semibold"
              />

              <div className="space-y-4">
                {attributes.time && (
                  <div>
                    <div className="flex items-center gap-2 text-muted text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>Brewing Time</span>
                    </div>
                    <div className="font-medium text-green-300">
                      {attributes.time}
                    </div>
                  </div>
                )}

                {attributes.inventors && (
                  <div>
                    <div className="flex items-center gap-2 text-muted text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Inventor</span>
                    </div>
                    <div className="font-medium">{attributes.inventors}</div>
                  </div>
                )}

                {attributes.manufacturers && (
                  <div>
                    <div className="flex items-center gap-2 text-muted text-sm mb-2">
                      <Package className="w-4 h-4" />
                      <span>Manufacturer</span>
                    </div>
                    <div className="font-medium">
                      {attributes.manufacturers}
                    </div>
                  </div>
                )}
              </div>

              {attributes.wiki && (
                <a
                  href={attributes.wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all"
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
            className="lg:col-span-2 space-y-6"
          >
            {/* Effect */}
            {attributes.effect && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-green-500" />
                  Effect
                </h2>
                <p className="text-muted leading-relaxed text-lg">
                  {attributes.effect}
                </p>
              </div>
            )}

            {/* Characteristics */}
            {attributes.characteristics && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <FlaskConical className="w-6 h-6 text-green-500" />
                  Characteristics
                </h2>
                <p className="text-muted leading-relaxed">
                  {attributes.characteristics}
                </p>
              </div>
            )}

            {/* Ingredients */}
            {attributes.ingredients && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <ListChecks className="w-6 h-6 text-green-500" />
                  Ingredients
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted whitespace-pre-line">
                    {attributes.ingredients}
                  </p>
                </div>
              </div>
            )}

            {/* Side Effects */}
            {attributes.side_effects && (
              <div className="glass rounded-2xl p-8 border-2 border-amber-500/20">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-6 h-6" />
                  Side Effects
                </h2>
                <div className="bg-amber-500/10 rounded-xl p-6">
                  <p className="text-amber-200 leading-relaxed">
                    {attributes.side_effects}
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
