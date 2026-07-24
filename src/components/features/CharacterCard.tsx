"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Sparkles } from "lucide-react";
import type { PotterCharacter } from "@/types/potter";
import { HOUSE_COLORS } from "@/lib/utils/constants";
import FavoriteToggleButton from "@/components/shared/FavoriteToggleButton";
import { favoriteFromCharacter } from "@/lib/utils/favorites";

interface CharacterCardProps {
  character: PotterCharacter;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const { attributes } = character;
  const house = attributes.house as keyof typeof HOUSE_COLORS | null;
  const houseColor = house ? HOUSE_COLORS[house] : null;

  return (
    <div className="group relative overflow-hidden rounded-xl glass hover-lift card-shine h-full">
      <FavoriteToggleButton
        item={favoriteFromCharacter(character)}
        className="absolute left-3 top-3 z-20 h-10 w-10"
      />
      <Link href={`/characters/${character.id}`} className="block h-full">
        {/* House Gradient Background */}
        {houseColor && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${houseColor.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          />
        )}

        {/* Image */}
        <div className="relative h-64 bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden">
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
              <Sparkles className="w-16 h-16 text-gray-700" />
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5 relative z-10">
          <h3 className="text-xl font-magic font-bold mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
            {attributes.name}
          </h3>

          {/* Info Grid */}
          <div className="space-y-2 text-sm">
            {attributes.house && (
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-muted" />
                <span
                  className="font-semibold"
                  style={{ color: houseColor?.secondary }}
                >
                  {attributes.house}
                </span>
              </div>
            )}

            {attributes.species && (
              <div className="text-muted">
                <span className="text-subtle">Species:</span>{" "}
                {attributes.species}
              </div>
            )}

            {attributes.born && (
              <div className="text-muted">
                <span className="text-subtle">Born:</span> {attributes.born}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {attributes.patronus && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                Patronus: {attributes.patronus}
              </span>
            )}
            {attributes.wands.length > 0 && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs">
                Has Wand
              </span>
            )}
          </div>
        </div>
    </Link>
    </div>
  );
}
