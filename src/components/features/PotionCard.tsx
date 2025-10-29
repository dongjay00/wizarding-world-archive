"use client";

import Link from "next/link";
import Image from "next/image";
import { FlaskConical, Clock, AlertTriangle } from "lucide-react";
import type { PotterPotion } from "@/types/potter";

interface PotionCardProps {
  potion: PotterPotion;
}

const difficultyColors: Record<string, string> = {
  Beginner: "from-green-600 to-emerald-600",
  Moderate: "from-yellow-600 to-orange-600",
  Advanced: "from-orange-600 to-red-600",
  "Very Advanced": "from-red-600 to-purple-600",
};

export default function PotionCard({ potion }: PotionCardProps) {
  const { attributes } = potion;
  const difficultyGradient = attributes.difficulty
    ? difficultyColors[attributes.difficulty] || "from-green-600 to-emerald-600"
    : "from-green-600 to-emerald-600";

  return (
    <Link href={`/potions/${potion.id}`}>
      <div className="group relative overflow-hidden rounded-xl glass hover-lift card-shine h-full">
        {/* Difficulty Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${difficultyGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        />

        {/* Image */}
        <div className="relative h-48 bg-gradient-to-b from-green-900/50 to-gray-900 overflow-hidden">
          {attributes.image ? (
            <Image
              src={attributes.image}
              alt={attributes.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FlaskConical className="w-16 h-16 text-green-500/30 group-hover:rotate-12 transition-transform" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

          {/* Difficulty Badge */}
          {attributes.difficulty && (
            <div
              className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${difficultyGradient} rounded-full text-xs font-semibold`}
            >
              {attributes.difficulty}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 relative z-10">
          <h3 className="text-xl font-magic font-bold mb-2 group-hover:text-green-400 transition-colors line-clamp-1">
            {attributes.name}
          </h3>

          {/* Effect */}
          {attributes.effect && (
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {attributes.effect}
            </p>
          )}

          {/* Meta Info */}
          <div className="space-y-2 text-xs">
            {attributes.time && (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{attributes.time}</span>
              </div>
            )}

            {attributes.side_effects && (
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                <span className="line-clamp-1">Side effects</span>
              </div>
            )}
          </div>

          {/* Characteristics Badge */}
          {attributes.characteristics && (
            <div className="mt-3 px-3 py-1 bg-green-500/10 text-green-300 rounded text-xs line-clamp-1">
              {attributes.characteristics}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
