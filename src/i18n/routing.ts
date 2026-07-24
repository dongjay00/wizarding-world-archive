import { defineRouting } from "next-intl/routing";

// 로케일 라우팅 단일 출처 (SDD/i18n §1, ADR-0011).
// 확장: locales 배열에 코드를 추가하는 것만으로 새 언어가 열린다.
// 어떤 코드도 'en'|'ko' 리터럴을 하드코딩하지 않고 이 routing.locales를 참조한다.
export const routing = defineRouting({
  locales: ["en", "ko"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
