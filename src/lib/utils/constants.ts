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
export const NAVIGATION = [
  { name: "Home", href: "/", icon: "🏰" },
  { name: "Characters", href: "/characters", icon: "🧙" },
  { name: "Spells", href: "/spells", icon: "✨" },
  { name: "Potions", href: "/potions", icon: "⚗️" },
  { name: "Movies", href: "/movies", icon: "🎬" },
  { name: "Books", href: "/books", icon: "📚" },
  { name: "Favorites", href: "/favorites", icon: "♡" },
];

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
