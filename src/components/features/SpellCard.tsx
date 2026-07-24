"use client";

import Link from "next/link";
import Image from "next/image";
import { Wand2, Lightbulb } from "lucide-react";
import type { PotterSpell } from "@/types/potter";

interface SpellCardProps {
  spell: PotterSpell;
}

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

export default function SpellCard({ spell }: SpellCardProps) {
  const { attributes } = spell;
  const categoryGradient = attributes.category
    ? categoryColors[attributes.category] || "from-purple-600 to-pink-600"
    : "from-purple-600 to-pink-600";

  return (
    <Link href={`/spells/${spell.id}`}>
      <div className="group relative overflow-hidden rounded-xl glass hover-lift card-shine h-full">
        {/* Category Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        />

        {/* Image or Icon */}
        <div className="relative h-48 bg-gradient-to-b from-purple-900/50 to-gray-900 overflow-hidden">
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
              <Wand2 className="w-16 h-16 text-purple-500/30 group-hover:rotate-12 transition-transform" />
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

          {/* Light Effect */}
          {attributes.light && (
            <div className="absolute top-4 right-4 px-3 py-1 glass rounded-full text-xs flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              {attributes.light}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 relative z-10">
          <h3 className="text-xl font-magic font-bold mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
            {attributes.name}
          </h3>

          {/* Incantation */}
          {attributes.incantation && (
            <div className="mb-3 px-3 py-2 bg-purple-500/10 rounded-lg">
              <div className="text-xs text-muted mb-1">Incantation</div>
              <div className="font-magic text-purple-300 italic">
                &quot;{attributes.incantation}&quot;
              </div>
            </div>
          )}

          {/* Effect */}
          {attributes.effect && (
            <p className="text-sm text-muted mb-3 line-clamp-2">
              {attributes.effect}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-subtle">
            {/* Category Badge */}
            {attributes.category && (
              <span
                className={`px-3 py-1 bg-gradient-to-r ${categoryGradient} rounded-full text-xs font-semibold`}
              >
                {attributes.category}
              </span>
            )}

            {/* Creator */}
            {attributes.creator && (
              <div className="text-xs text-subtle truncate max-w-[120px]">
                by {attributes.creator}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
