"use client";

import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAVIGATION } from "@/lib/utils/constants";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <header className="sticky top-0 z-50 glass-dark border-b border-amber-500/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="w-8 h-8 text-amber-500 group-hover:animate-spin transition-transform" />
            <span className="text-2xl font-magic font-bold magic-text hidden sm:block">
              {tc("brand")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                    isActive
                      ? "bg-amber-500/20 text-amber-400 magic-glow"
                      : "hover:bg-surface/10 text-muted hover:text-content"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {t(item.key)}
                </Link>
              );
            })}
          </div>

          {/* Actions: 언어 스위처 + 테마 토글 + 모바일 메뉴 */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg hover:bg-surface/10 transition-colors"
              aria-label={tc("toggleMenu")}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 pb-4 space-y-2 animate-slide-up">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-amber-500/20 text-amber-400"
                      : "hover:bg-surface/10 text-muted"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {t(item.key)}
                </Link>
              );
            })}
            {/* 모바일: 언어 스위처 미러링 (U-10) */}
            <div className="px-4 pt-2 sm:hidden">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
