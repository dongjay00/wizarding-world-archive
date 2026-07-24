"use client";

import Link from "next/link";
import { Heart, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-dark border-t border-amber-500/20 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-magic font-semibold text-amber-400 mb-3">
              About This Archive
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              A comprehensive database of the Wizarding World, powered by{" "}
              <a
                href="https://potterdb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                Potter DB API
              </a>
              . Explore characters, spells, potions, movies, and books from the
              magical universe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-magic font-semibold text-amber-400 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/characters"
                  className="text-muted hover:text-amber-400 transition-colors"
                >
                  🧙 Characters
                </Link>
              </li>
              <li>
                <Link
                  href="/spells"
                  className="text-muted hover:text-amber-400 transition-colors"
                >
                  ✨ Spells
                </Link>
              </li>
              <li>
                <Link
                  href="/potions"
                  className="text-muted hover:text-amber-400 transition-colors"
                >
                  ⚗️ Potions
                </Link>
              </li>
              <li>
                <Link
                  href="/movies"
                  className="text-muted hover:text-amber-400 transition-colors"
                >
                  🎬 Movies
                </Link>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h3 className="text-lg font-magic font-semibold text-amber-400 mb-3">
              Made with Magic
            </h3>
            <p className="text-muted text-sm mb-4">
              Built with Next.js 15, React Query, Zustand, and Tailwind CSS.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-amber-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-subtle text-center">
          <p className="text-subtle text-sm flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
            for Potterheads
          </p>
          <p className="text-subtle text-xs mt-2">
            © {new Date().getFullYear()} Wizarding World Archive. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
