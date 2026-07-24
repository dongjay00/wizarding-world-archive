"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * 컴팩트 언어 스위처 (EN/KO) — UIUX U-10, SDD/i18n §9.
 * 현재 경로·쿼리(필터·페이지)를 유지한 채 locale만 교체한다(useRouter().replace).
 * 쿠키 갱신은 미들웨어/next-intl 몫(AC-21). 시각 언어는 ThemeToggle 계열을 따른다.
 */
export default function LanguageSwitcher() {
  const t = useTranslations("switcher");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-subtle p-1"
      role="group"
      aria-label={t("label")}
    >
      <Languages className="mx-1 h-4 w-4 text-amber-400" aria-hidden="true" />
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <button
            key={locale}
            type="button"
            aria-pressed={isActive}
            onClick={() => router.replace(pathname, { locale })}
            className={`rounded-md px-2 py-1 text-xs font-semibold transition-all ${
              isActive
                ? "bg-amber-500/20 text-amber-400"
                : "text-muted hover:bg-surface/10 hover:text-content"
            }`}
          >
            {t(locale)}
          </button>
        );
      })}
    </div>
  );
}
