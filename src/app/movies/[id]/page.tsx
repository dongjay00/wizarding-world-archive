"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Users,
  Film,
  Music,
  Video,
  ExternalLink,
} from "lucide-react";
import { useMovie } from "@/lib/hooks/useMovies";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import FavoriteToggleButton from "@/components/shared/FavoriteToggleButton";
import { favoriteFromMovie } from "@/lib/utils/favorites";

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useMovie(id);

  if (isLoading) return <FullPageLoader />;
  if (error || !data) return <ErrorMessage message="Movie not found" />;

  const movie = data.data;
  const { attributes } = movie;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Poster */}
      <div className="relative h-[70vh] overflow-hidden">
        {attributes.poster && (
          <>
            <Image
              src={attributes.poster}
              alt={attributes.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          </>
        )}

        <div className="absolute top-8 left-8 z-10">
          <Link
            href="/movies"
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-surface/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-6xl md:text-7xl font-magic font-bold magic-text mb-4">
                {attributes.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-lg">
                {attributes.release_date && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {new Date(attributes.release_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {attributes.running_time && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="w-5 h-5" />
                    <span>{attributes.running_time}</span>
                  </div>
                )}
                {attributes.rating && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                    <Star className="w-5 h-5 fill-yellow-400" />
                    <span className="font-semibold">{attributes.rating}</span>
                  </div>
                )}
              </div>
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
              <FavoriteToggleButton
                item={favoriteFromMovie(movie)}
                showLabel
                className="w-full px-4 py-3 font-semibold"
              />

              {/* Box Office */}
              {(attributes.box_office || attributes.budget) && (
                <div>
                  <h3 className="text-lg font-magic font-bold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Financial
                  </h3>
                  <div className="space-y-3">
                    {attributes.budget && (
                      <div>
                        <div className="text-muted text-sm mb-1">Budget</div>
                        <div className="font-semibold text-lg">
                          {attributes.budget}
                        </div>
                      </div>
                    )}
                    {attributes.box_office && (
                      <div>
                        <div className="text-muted text-sm mb-1">
                          Box Office
                        </div>
                        <div className="font-semibold text-lg text-green-400">
                          {attributes.box_office}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="space-y-3">
                {attributes.trailer && (
                  <a
                    href={attributes.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                  >
                    <Video className="w-4 h-4" />
                    <span>Watch Trailer</span>
                  </a>
                )}
                {attributes.wiki && (
                  <a
                    href={attributes.wiki}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Wiki</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Summary */}
            {attributes.summary && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Film className="w-6 h-6 text-blue-500" />
                  Synopsis
                </h2>
                <p className="text-muted leading-relaxed text-lg">
                  {attributes.summary}
                </p>
              </div>
            )}

            {/* Cast & Crew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Directors */}
              {attributes.directors.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-magic font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Directors
                  </h3>
                  <div className="space-y-2">
                    {attributes.directors.map((director, idx) => (
                      <div key={idx} className="text-muted">
                        {director}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Producers */}
              {attributes.producers.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-magic font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Producers
                  </h3>
                  <div className="space-y-2">
                    {attributes.producers.slice(0, 5).map((producer, idx) => (
                      <div key={idx} className="text-muted">
                        {producer}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Screenwriters */}
            {attributes.screenwriters.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-magic font-bold mb-4">
                  Screenwriters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attributes.screenwriters.map((writer, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg"
                    >
                      {writer}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Music Composers */}
            {attributes.music_composers.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-500" />
                  Music
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attributes.music_composers.map((composer, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg"
                    >
                      {composer}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Distributors */}
            {attributes.distributors.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-magic font-bold mb-4">
                  Distributors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attributes.distributors.map((distributor, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg"
                    >
                      {distributor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
