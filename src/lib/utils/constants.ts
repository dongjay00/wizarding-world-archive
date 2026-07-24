// 호그와트 기숙사 색상
export const HOUSE_COLORS = {
  Gryffindor: {
    primary: "#740001",
    secondary: "#D3A625",
    gradient: "from-red-900 via-red-800 to-amber-600",
  },
  Slytherin: {
    primary: "#1A472A",
    secondary: "#5D5D5D",
    gradient: "from-green-900 via-green-800 to-gray-700",
  },
  Ravenclaw: {
    primary: "#0E1A40",
    secondary: "#946B2D",
    gradient: "from-blue-900 via-blue-800 to-amber-700",
  },
  Hufflepuff: {
    primary: "#ECB939",
    secondary: "#000000",
    gradient: "from-yellow-600 via-yellow-500 to-gray-900",
  },
};

// 네비게이션 메뉴
// 표시 라벨은 카탈로그 `nav.*` 키로 소비한다(C-S7: chrome 하드코딩 영문 금지, SDD/i18n §6).
// href·icon은 불변, name 하드코딩 대신 key로 nav 카탈로그를 참조한다.
export const NAVIGATION = [
  { key: "home", href: "/", icon: "🏰" },
  { key: "characters", href: "/characters", icon: "🧙" },
  { key: "spells", href: "/spells", icon: "✨" },
  { key: "potions", href: "/potions", icon: "⚗️" },
  { key: "movies", href: "/movies", icon: "🎬" },
  { key: "books", href: "/books", icon: "📚" },
  { key: "favorites", href: "/favorites", icon: "♡" },
] as const;

// 주문 카테고리
export const SPELL_CATEGORIES = [
  "Charm",
  "Transfiguration",
  "Curse",
  "Hex",
  "Jinx",
  "Spell",
  "Counter-spell",
  "Healing spell",
];

// 마법약 난이도
export const POTION_DIFFICULTIES = [
  "Beginner",
  "Moderate",
  "Advanced",
  "Very Advanced",
];

// 페이지 크기 옵션
export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

// 정렬 옵션
export const SORT_OPTIONS = {
  characters: [
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
    { value: "born", label: "Birth Date (Old-New)" },
    { value: "-born", label: "Birth Date (New-Old)" },
  ],
  spells: [
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
    { value: "category", label: "Category" },
  ],
  potions: [
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
    { value: "difficulty", label: "Difficulty" },
  ],
  movies: [
    { value: "release_date", label: "Release Date (Old-New)" },
    { value: "-release_date", label: "Release Date (New-Old)" },
    { value: "title", label: "Title (A-Z)" },
  ],
  books: [
    { value: "release_date", label: "Release Date (Old-New)" },
    { value: "-release_date", label: "Release Date (New-Old)" },
    { value: "title", label: "Title (A-Z)" },
  ],
};
