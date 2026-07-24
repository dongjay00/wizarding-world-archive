"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import type { FetchOptions } from "@/lib/api/client";

/**
 * 이산(단일 선택) 필터 차원 config.
 * - `param`: URL 쿼리 파라미터명 (예: "house") — 공유/북마크 URL에 노출.
 * - `filterKey`: PotterDB API filter 키 (예: "house_eq").
 */
export interface DiscreteFilterConfig {
  readonly param: string;
  readonly filterKey: string;
}

/**
 * 목록 페이지별 필터 차원 config.
 * 공통 규칙(clearOnDefault·page=1 리셋·history:replace·검색 디바운스)은
 * `useListFilters` 내부에 중앙화되어 있고, 페이지 차이만 여기로 주입한다.
 */
export interface ListFiltersConfig {
  /** 검색어 API filter 키 (예: "name_cont" | "title_cont"). URL 파라미터명은 항상 `q`. */
  readonly searchFilterKey: string;
  /** 이산 필터 차원. 없는 페이지(movies)는 생략. */
  readonly discreteFilter?: DiscreteFilterConfig;
  /** API 정렬 키 (예: "name" | "release_date"). */
  readonly sort: string;
  /** 페이지 크기. */
  readonly pageSize: number;
}

export interface ListFilters {
  /** 검색 input에 바인딩할 순간값(타이핑 즉시 반영, transient view 상태). */
  readonly search: string;
  /** 검색어 커밋: local 순간값 즉시 갱신 + 디바운스 후 URL `q` 커밋(+page=1). */
  readonly setSearch: (value: string) => void;
  /** 현재 이산 필터 값. 미선택 시 "". */
  readonly discreteValue: string;
  /** 이산 필터 즉시 커밋(+page=1). null 또는 ""이면 미선택으로 URL 미부착. */
  readonly setDiscreteValue: (value: string | null) => void;
  /** 현재 페이지(URL 소유, 기본 1). */
  readonly page: number;
  /** 페이지 즉시 커밋. */
  readonly setPage: (page: number) => void;
  /** URL 상태에서 파생한 TanStack Query용 옵션. */
  readonly fetchOptions: FetchOptions;
}

const SEARCH_DEBOUNCE_MS = 300;

/**
 * 필터 상태 단일 소유 = URL searchParams (ADR-0007, SDD/state-management).
 * nuqs `useQueryStates` 기반 공용 팩토리. 공통 규칙을 한 곳에 중앙화:
 * - `clearOnDefault: true` — 기본값(빈 q·미선택 필터·page=1)은 URL 미부착.
 * - 필터·검색 setter는 `page`를 1로 리셋.
 * - `history: 'replace'` — 히스토리 오염 방지.
 * - 검색어: local 순간값 미러 + 디바운스 후 URL 커밋(즉각 반응 유지, URL이 유일 지속 출처).
 */
export function useListFilters(config: ListFiltersConfig): ListFilters {
  const { searchFilterKey, sort, pageSize } = config;
  const discreteParam = config.discreteFilter?.param;
  const discreteFilterKey = config.discreteFilter?.filterKey;

  const parsers = useMemo(() => {
    const map: Parameters<typeof useQueryStates>[0] = {
      q: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
    };
    if (discreteParam) {
      map[discreteParam] = parseAsString.withDefault("");
    }
    return map;
  }, [discreteParam]);

  const [urlState, setUrlState] = useQueryStates(parsers, {
    history: "replace",
    clearOnDefault: true,
  });

  const urlSearch = String(urlState.q ?? "");
  const page = Number(urlState.page ?? 1);
  const discreteValue = discreteParam
    ? String(urlState[discreteParam] ?? "")
    : "";

  // 검색 순간값 미러(transient view 상태). URL이 유일 지속 출처이므로 C-S2 위반 아님.
  const [search, setSearchLocal] = useState(urlSearch);
  const [syncedUrlSearch, setSyncedUrlSearch] = useState(urlSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 외부발 URL 변경(하이드레이션·공유 링크 진입)을 local 미러에 반영 —
  // React 권장 "렌더 중 상태 조정" 패턴(effect-내 setState 회피). 디바운스는
  // 항상 최신 키입력만 커밋하므로(clearTimeout) 타이핑 중 clobber 없음.
  if (urlSearch !== syncedUrlSearch) {
    setSyncedUrlSearch(urlSearch);
    setSearchLocal(urlSearch);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const setSearch = useCallback(
    (value: string) => {
      setSearchLocal(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        setUrlState({ q: value || null, page: 1 });
      }, SEARCH_DEBOUNCE_MS);
    },
    [setUrlState]
  );

  const setDiscreteValue = useCallback(
    (value: string | null) => {
      if (!discreteParam) return;
      const update: Record<string, string | number | null> = { page: 1 };
      update[discreteParam] = value || null;
      setUrlState(update);
    },
    [discreteParam, setUrlState]
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setUrlState({ page: nextPage });
    },
    [setUrlState]
  );

  const fetchOptions = useMemo<FetchOptions>(() => {
    const filter: Record<string, string> = {};
    if (urlSearch) {
      filter[searchFilterKey] = urlSearch;
    }
    if (discreteFilterKey && discreteValue) {
      filter[discreteFilterKey] = discreteValue;
    }
    return {
      page,
      pageSize,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      sort,
    };
  }, [
    urlSearch,
    discreteValue,
    page,
    searchFilterKey,
    discreteFilterKey,
    pageSize,
    sort,
  ]);

  return {
    search,
    setSearch,
    discreteValue,
    setDiscreteValue,
    page,
    setPage,
    fetchOptions,
  };
}
