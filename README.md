# GitSpace 3D 🌌

A premium GitHub repository visualization platform. Explore your repositories as planets in an interactive 3D universe.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Engine:** Three.js + React Three Fiber + Drei
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/              # Next.js App Router pages & layout
├── components/
│   ├── layout/       # Navbar, Footer
│   ├── landing/      # Landing page sections
│   └── three/        # 3D scene components
└── lib/              # Utilities and constants
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
