"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Home,
  Heart,
  Sparkles,
  Users,
  Eye,
  Calendar,
  Award,
  ExternalLink,
} from "lucide-react";
import { useCharacter } from "@/lib/hooks/useCharacters";
import { FullPageLoader, ErrorMessage } from "@/components/ui/LoadingSpinner";
import { HOUSE_COLORS } from "@/lib/utils/constants";

export default function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useCharacter(id);

  if (isLoading) return <FullPageLoader />;
  if (error || !data) return <ErrorMessage message="Character not found" />;

  const character = data.data;
  const { attributes } = character;
  const house = attributes.house as keyof typeof HOUSE_COLORS | null;
  const houseColor = house ? HOUSE_COLORS[house] : null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        {/* Background Image */}
        {attributes.image && (
          <>
            <Image
              src={attributes.image}
              alt={attributes.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          </>
        )}

        {/* Back Button */}
        <div className="absolute top-8 left-8 z-10">
          <Link
            href="/characters"
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Characters</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6 sticky top-24">
              {/* Profile Image */}
              <div className="relative h-80 rounded-xl overflow-hidden mb-6 bg-gradient-to-b from-gray-800 to-gray-900">
                {attributes.image ? (
                  <Image
                    src={attributes.image}
                    alt={attributes.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-20 h-20 text-gray-700" />
                  </div>
                )}
              </div>

              {/* House Badge */}
              {house && houseColor && (
                <div
                  className={`mb-6 p-4 rounded-xl bg-gradient-to-r ${houseColor.gradient} text-center`}
                >
                  <Home className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-magic font-bold text-lg">{house}</div>
                </div>
              )}

              {/* Quick Info */}
              <div className="space-y-3 text-sm">
                {attributes.species && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Species:</span>
                    <span className="font-medium">{attributes.species}</span>
                  </div>
                )}
                {attributes.gender && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gender:</span>
                    <span className="font-medium">{attributes.gender}</span>
                  </div>
                )}
                {attributes.blood_status && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blood Status:</span>
                    <span className="font-medium">
                      {attributes.blood_status}
                    </span>
                  </div>
                )}
              </div>

              {/* Wiki Link */}
              {attributes.wiki && (
                <a
                  href={attributes.wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-all"
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
            {/* Name & Aliases */}
            <div className="glass rounded-2xl p-8">
              <h1 className="text-5xl font-magic font-bold mb-4 magic-text">
                {attributes.name}
              </h1>
              {attributes.alias_names.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attributes.alias_names.map((alias, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Life Info */}
            {(attributes.born || attributes.died) && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-amber-500" />
                  Life
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attributes.born && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Born</div>
                      <div className="text-lg font-medium">
                        {attributes.born}
                      </div>
                    </div>
                  )}
                  {attributes.died && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Died</div>
                      <div className="text-lg font-medium">
                        {attributes.died}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Physical Appearance */}
            {(attributes.eye_color ||
              attributes.hair_color ||
              attributes.height) && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-amber-500" />
                  Physical Appearance
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {attributes.eye_color && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Eyes</div>
                      <div className="font-medium">{attributes.eye_color}</div>
                    </div>
                  )}
                  {attributes.hair_color && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Hair</div>
                      <div className="font-medium">{attributes.hair_color}</div>
                    </div>
                  )}
                  {attributes.height && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Height</div>
                      <div className="font-medium">{attributes.height}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Magical Attributes */}
            {(attributes.patronus ||
              attributes.boggart ||
              attributes.animagus ||
              attributes.wands.length > 0) && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  Magical Attributes
                </h2>
                <div className="space-y-4">
                  {attributes.patronus && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Patronus</div>
                      <div className="text-lg font-medium text-purple-400">
                        {attributes.patronus}
                      </div>
                    </div>
                  )}
                  {attributes.boggart && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Boggart</div>
                      <div className="font-medium">{attributes.boggart}</div>
                    </div>
                  )}
                  {attributes.animagus && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Animagus</div>
                      <div className="font-medium">{attributes.animagus}</div>
                    </div>
                  )}
                  {attributes.wands.length > 0 && (
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Wands</div>
                      <div className="space-y-2">
                        {attributes.wands.map((wand, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 bg-amber-500/10 rounded-lg text-amber-300"
                          >
                            {wand}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Jobs & Titles */}
            {(attributes.jobs.length > 0 || attributes.titles.length > 0) && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  Occupation & Titles
                </h2>
                <div className="space-y-4">
                  {attributes.jobs.length > 0 && (
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Jobs</div>
                      <div className="flex flex-wrap gap-2">
                        {attributes.jobs.map((job, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg"
                          >
                            {job}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {attributes.titles.length > 0 && (
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Titles</div>
                      <div className="flex flex-wrap gap-2">
                        {attributes.titles.map((title, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg"
                          >
                            {title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Family & Relationships */}
            {(attributes.family_members.length > 0 ||
              attributes.romances.length > 0) && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-2xl font-magic font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-amber-500" />
                  Family & Relationships
                </h2>
                <div className="space-y-4">
                  {attributes.family_members.length > 0 && (
                    <div>
                      <div className="text-gray-400 text-sm mb-2">
                        Family Members
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {attributes.family_members.map((member, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {attributes.romances.length > 0 && (
                    <div>
                      <div className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Romances
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {attributes.romances.map((romance, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-lg"
                          >
                            {romance}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
