// API 응답 타입 정의

// 공통 타입
export interface PaginationMeta {
  current: number;
  next?: number;
  last: number;
  records: number;
}

export interface Links {
  self: string;
  current: string;
  next?: string;
  last: string;
}

// Character Types
export interface PotterCharacterAttributes {
  slug: string;
  alias_names: string[];
  animagus: string | null;
  blood_status: string | null;
  boggart: string | null;
  born: string | null;
  died: string | null;
  eye_color: string | null;
  family_members: string[];
  gender: string | null;
  hair_color: string | null;
  height: string | null;
  house: string | null;
  image: string | null;
  jobs: string[];
  marital_status: string | null;
  name: string;
  nationality: string | null;
  patronus: string | null;
  romances: string[];
  skin_color: string | null;
  species: string | null;
  titles: string[];
  wands: string[];
  weight: string | null;
  wiki: string | null;
}

export interface PotterCharacter {
  id: string;
  type: "character";
  attributes: PotterCharacterAttributes;
  links: {
    self: string;
  };
}

export interface PotterCharactersResponse {
  data: PotterCharacter[];
  meta: {
    pagination: PaginationMeta;
    copyright: string;
    generated_at: string;
  };
  links: Links;
}

// Spell Types
export interface PotterSpellAttributes {
  slug: string;
  category: string | null;
  creator: string | null;
  effect: string | null;
  hand: string | null;
  image: string | null;
  incantation: string | null;
  light: string | null;
  name: string;
  wiki: string | null;
}

export interface PotterSpell {
  id: string;
  type: "spell";
  attributes: PotterSpellAttributes;
  links: {
    self: string;
  };
}

export interface PotterSpellListResponse {
  data: PotterSpell[];
  meta: {
    pagination: PaginationMeta;
    copyright: string;
    generated_at: string;
  };
  links: Links;
}

// Potion Types
export interface PotterPotionAttributes {
  slug: string;
  characteristics: string | null;
  difficulty: string | null;
  effect: string | null;
  image: string | null;
  inventors: string | null;
  ingredients: string | null;
  manufacturers: string | null;
  name: string;
  side_effects: string | null;
  time: string | null;
  wiki: string | null;
}

export interface PotterPotion {
  id: string;
  type: "potion";
  attributes: PotterPotionAttributes;
  links: {
    self: string;
  };
}

export interface PotterPotionListResponse {
  data: PotterPotion[];
  meta: {
    pagination: PaginationMeta;
    copyright: string;
    generated_at: string;
  };
  links: Links;
}

// Movie Types
export interface PotterMovieAttributes {
  slug: string;
  box_office: string | null;
  budget: string | null;
  cinematographers: string[];
  directors: string[];
  distributors: string[];
  editors: string[];
  music_composers: string[];
  poster: string | null;
  producers: string[];
  rating: string | null;
  release_date: string | null;
  running_time: string | null;
  screenwriters: string[];
  summary: string | null;
  title: string;
  trailer: string | null;
  wiki: string | null;
}

export interface PotterMovie {
  id: string;
  type: "movie";
  attributes: PotterMovieAttributes;
  links: {
    self: string;
  };
}

export interface PotterMovieListResponse {
  data: PotterMovie[];
  meta: {
    pagination: PaginationMeta;
    copyright: string;
    generated_at: string;
  };
  links: Links;
}

// Book Types
export interface PotterBookAttributes {
  slug: string;
  author: string;
  cover: string;
  dedication: string | null;
  pages: number | null;
  release_date: string | null;
  summary: string | null;
  title: string;
  wiki: string | null;
}

export interface PotterBook {
  id: string;
  type: "book";
  attributes: PotterBookAttributes;
  relationships?: {
    chapters?: {
      data: {
        id: string;
        type: "chapter";
      }[];
    };
  };
  links?: {
    self: string;
  };
}

export interface PotterBookListResponse {
  data: PotterBook[];
  meta?: {
    pagination?: {
      total?: number;
      count?: number;
      per_page?: number;
      current_page?: number;
      total_pages?: number;
    };
  };
}

// Chapter Types
export interface PotterChapterAttributes {
  slug: string;
  order: number;
  summary: string;
  title: string;
}

export interface PotterChapter {
  id: string;
  type: "chapter";
  attributes: PotterChapterAttributes;
  relationships: {
    book: {
      data: {
        id: string;
        type: "book";
      };
    };
  };
  links: {
    self: string;
  };
}

export interface PotterChaptersResponse {
  data: PotterChapter[];
  meta: {
    pagination: {
      current: number;
      records: number;
    };
    copyright: string;
    generated_at: string;
  };
  links: {
    self: string;
    current: string;
  };
}
