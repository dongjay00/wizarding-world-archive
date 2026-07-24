"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * 라이트/다크 2-state 토글 (ADR-0008).
 * 테마 상태 소유는 next-themes 단일. 아이콘은 CSS(`dark:` 변형 = .dark 클래스)로 전환 →
 * useEffect/useState 없이 하이드레이션 불일치를 피한다(양 아이콘 모두 마크업에 존재, CSS가 택일).
 */
export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle light/dark theme"
      className="p-2 rounded-lg hover:bg-surface/10 transition-colors text-amber-400"
    >
      <Sun className="w-6 h-6 hidden dark:block" />
      <Moon className="w-6 h-6 block dark:hidden" />
    </button>
  );
}
