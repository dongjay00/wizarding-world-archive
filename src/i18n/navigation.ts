import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// 로케일 인지 네비게이션의 단일 출처 (SDD/i18n §6).
// 컴포넌트/페이지는 next/link·next/navigation 직수입 대신 이 래퍼를 쓴다.
export const { Link, usePathname, useRouter, redirect, getPathname } =
  createNavigation(routing);
