"use client";

import Image from "next/image";
import { Film, Calendar, Clock, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PotterMovie } from "@/types/potter";
import FavoriteToggleButton from "@/components/shared/FavoriteToggleButton";
import { favoriteFromMovie } from "@/lib/utils/favorites";

interface MovieCardProps {
  movie: PotterMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { attributes } = movie;

  return (
    <div className="group relative overflow-hidden rounded-2xl glass hover-lift card-shine h-full">
      <FavoriteToggleButton
        item={favoriteFromMovie(movie)}
        className="absolute left-3 top-3 z-20 h-10 w-10"
      />
      <Link href={`/movies/${movie.id}`} className="block h-full">
        {/* Poster */}
        <div className="relative h-[500px] bg-gradient-to-b from-blue-900/50 to-gray-900 overflow-hidden">
          {attributes.poster ? (
            <Image
              src={attributes.poster}
              alt={attributes.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="w-20 h-20 text-blue-500/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

          {/* Rating Badge */}
          {attributes.rating && (
            <div className="absolute top-4 right-4 px-3 py-1 glass rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {attributes.rating}
            </div>
          )}

          {/* Title Overlay (스크림 위 — 양 테마 흰색 고정) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-magic font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {attributes.title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-white/80">
              {attributes.release_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(attributes.release_date).getFullYear()}</span>
                </div>
              )}
              {attributes.running_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{attributes.running_time}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Info */}
        {attributes.summary && (
          <div className="p-5">
            <p className="text-sm text-muted line-clamp-3">
              {attributes.summary}
            </p>
          </div>
        )}
    </Link>
    </div>
  );
}
