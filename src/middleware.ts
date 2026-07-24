import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// i18n 미들웨어 (SDD/i18n §5, AC-21).
// next-intl 기본 거동으로 로케일 협상을 처리한다:
//   1. NEXT_LOCALE 쿠키 우선 — 있으면 그 로케일로 라우팅(감지보다 우선).
//   2. 쿠키 부재 시 Accept-Language 헤더로 초기 로케일 감지.
//   3. 스위처로 로케일 진입 시 NEXT_LOCALE 쿠키 갱신(새로고침·재방문 유지).
//   4. as-needed 프리픽스 정규화(ADR-0011): en 무프리픽스, ko는 /ko/.
// 무프리픽스 `/` 접근이 감지된 로케일로 서빙되는 경로가 여기서 열린다.
export default createMiddleware(routing);

export const config = {
  // 정적 자산·_next 내부 요청·API·확장자 포함 파일 경로를 제외한다.
  // (리다이렉트 루프·불필요한 로케일 협상 방지 — SDD/i18n §5)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
