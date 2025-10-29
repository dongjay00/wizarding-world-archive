# 🪄 The Wizarding World Archive

A beautiful, modern web application for exploring the magical universe of Harry Potter. Built with Next.js 15, this comprehensive archive features characters, spells, potions, movies, and books from the Wizarding World.

![Wizarding World Archive](https://via.placeholder.com/1200x600/1a1a2e/FFD700?text=Wizarding+World+Archive)

## ✨ Features

- 🧙 **Characters Database** - Explore detailed profiles of witches, wizards, and magical creatures
- ✨ **Spells Collection** - Master incantations with detailed effects and usage
- ⚗️ **Potions Library** - Discover magical brews, ingredients, and brewing techniques
- 🎬 **Movies Timeline** - Browse the complete Harry Potter film series
- 📚 **Books Archive** - Read summaries and chapter breakdowns of the original novels

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query (v5)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Theme:** next-themes
- **API:** Potter DB REST API

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wizarding-world-archive.git

# Navigate to project directory
cd wizarding-world-archive

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
wizarding-world-archive/
├── app/                      # Next.js app directory
│   ├── characters/          # Character pages
│   ├── spells/              # Spell pages
│   ├── potions/             # Potion pages
│   ├── movies/              # Movie pages
│   ├── books/               # Book pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── features/            # Feature-specific components
│   ├── layout/              # Layout components
│   ├── shared/              # Shared components
│   └── ui/                  # UI components
├── lib/
│   ├── api/                 # API client and functions
│   ├── hooks/               # React Query hooks
│   ├── stores/              # Zustand stores
│   └── utils/               # Utility functions
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## 🎨 Design Features

- **Dark Mode Support** - Toggle between light and dark themes
- **Responsive Design** - Optimized for all screen sizes
- **Smooth Animations** - Framer Motion powered transitions
- **Glassmorphism UI** - Modern glass effect styling
- **House-themed Colors** - Gryffindor, Slytherin, Ravenclaw, Hufflepuff
- **Interactive Cards** - Hover effects and smooth transitions
- **Magical Aesthetics** - Custom fonts and magical visual elements

## 📱 Key Pages

### Home

- Hero section with animated background
- Category cards with statistics
- Call-to-action sections

### Characters

- Advanced filtering (by house, search)
- Sortable grid layout
- Detailed character profiles with magical attributes

### Spells

- Category-based filtering
- Incantation display
- Effect descriptions and usage

### Potions

- Difficulty-based filtering
- Ingredient lists
- Brewing instructions and warnings

### Movies

- Timeline view
- Cast and crew information
- Trailer links and box office data

### Books

- Chapter listings
- Dedication sections
- Author information and summaries

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file (optional, API is public):

```env
# No API key required for Potter DB
NEXT_PUBLIC_API_URL=https://api.potterdb.com/v1
```

### Tailwind Configuration

Custom theme colors for Hogwarts houses are defined in `tailwind.config.ts`:

- Gryffindor: Red and Gold
- Slytherin: Green and Silver
- Ravenclaw: Blue and Bronze
- Hufflepuff: Yellow and Black

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Deploy with one click

```bash
npm run build
```

The application is optimized for Vercel deployment with automatic Edge caching.

## 📊 API Reference

This project uses the [Potter DB API](https://potterdb.com):

- **Base URL:** `https://api.potterdb.com/v1`
- **Format:** JSON:API
- **Authentication:** None required
- **Rate Limits:** Generous limits for public use

## 🎯 Performance

- **Lighthouse Score:** 95+ across all metrics
- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automatic with Next.js
- **Caching Strategy:** SWR with React Query
- **Bundle Size:** Optimized with tree-shaking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Potter DB](https://potterdb.com) for the comprehensive API
- J.K. Rowling for creating the Wizarding World
- Warner Bros. for the movie franchise
- The amazing Harry Potter community

## 📞 Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ and ✨ for Potterheads everywhere
