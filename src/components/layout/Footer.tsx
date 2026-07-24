"use client";

import { useTranslations } from "next-intl";
import { Heart, Github } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="glass-dark border-t border-amber-500/20 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-magic font-semibold text-amber-400 mb-3">
              {t("aboutTitle")}
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              {t.rich("aboutBody", {
                link: (chunks) => (
                  <a
                    href="https://potterdb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-magic font-semibold text-amber-400 mb-3">
              {t("quickLinksTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/characters"
                  className="text-muted hover:text-amber-400 transition-colors"
                >
                  🧙 {tNav("characters")}
                </Link>
              </li>
              <li>
                <Link
                  href="/spells"
                  className="text-muted hover:text-amber-400 transition-colors"
                >
                  ✨ {tNav("spells")}
                </Link>
              </li>
              <li>
                <Link
                  href="/potions"
                  className="text-muted hover:text-amber-400 transition-colors"
                >
                  ⚗️ {tNav("potions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/movies"
                  className="text-muted hover:text-amber-400 transition-colors"
                >
                  🎬 {tNav("movies")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h3 className="text-lg font-magic font-semibold text-amber-400 mb-3">
              {t("creditsTitle")}
            </h3>
            <p className="text-muted text-sm mb-4">{t("creditsBody")}</p>
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
            {t.rich("madeWith", {
              heart: () => (
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              ),
            })}
          </p>
          <p className="text-subtle text-xs mt-2">
            {t("rights", { year: String(new Date().getFullYear()) })}
          </p>
        </div>
      </div>
    </footer>
  );
}
