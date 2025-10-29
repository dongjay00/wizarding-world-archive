const BASE_URL = "https://api.potterdb.com/v1";

export interface FetchOptions {
  page?: number;
  pageSize?: number;
  filter?: Record<string, string>;
  sort?: string;
}

export class PotterAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private buildQueryString(options?: FetchOptions): string {
    if (!options) return "";

    // 1. 페이지네이션 파라미터 처리 (인코딩 방지)
    const params: string[] = [];

    if (options.page) {
      // 대괄호가 인코딩되지 않은 형태로 직접 추가
      params.push(`page[number]=${options.page}`);
    }

    if (options.pageSize) {
      // 대괄호가 인코딩되지 않은 형태로 직접 추가
      params.push(`page[size]=${options.pageSize}`);
    }

    // 2. 필터 및 기타 파라미터 처리 (안전을 위해 인코딩 적용)
    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        // key에 대괄호가 포함되므로 key와 value를 각각 인코딩
        const encodedKey = `filter[${key}]`; // 필터 키는 API 문서에 따라 대괄호 사용
        const encodedValue = encodeURIComponent(value);
        params.push(`${encodedKey}=${encodedValue}`);
      });
    }

    if (options.sort) {
      params.push(`sort=${encodeURIComponent(options.sort)}`);
    }

    const query = params.join("&");
    return query ? `?${query}` : "";
  }

  async fetch<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const queryString = this.buildQueryString(options);
    const url = `${this.baseUrl}${endpoint}${queryString}`;

    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Fetch Error:", error);
      throw error;
    }
  }

  async fetchById<T>(endpoint: string, id: string): Promise<T> {
    return this.fetch<T>(`${endpoint}/${id}`);
  }
}

export const apiClient = new PotterAPIClient();
