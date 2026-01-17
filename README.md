# Macroeconomic Simulation Web App

An interactive, game-first web application for undergraduate economics students to learn macroeconomics through decision-making simulations. No login required, fully client-side, and optimized for learning through choices and consequences.

## Features

- **No Authentication** - Start playing immediately, no accounts needed
- **Stateful Simulations** - Each decision affects future outcomes
- **Narrative-Driven** - Story-first approach, not quiz-first
- **Game-Like UX** - Smooth animations, micro-interactions, and engaging feedback
- **Educational** - Concept mapping, discussion prompts, and real-world connections
- **Shareable** - QR codes and shareable links for easy access
- **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Animations**: Framer Motion + CSS
- **QR Codes**: qrcode.react
- **Icons**: Iconify (Solar icon set)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── simulation/
│   │   └── [id]/          # Dynamic simulation routes
│   │       ├── page.tsx   # Simulation start page
│   │       ├── play/      # In-simulation screen
│   │       └── results/   # Results screen
├── components/
│   ├── ui/                # Reusable UI components
│   ├── simulation/        # Simulation-specific components
│   └── charts/            # Chart components
├── lib/
│   ├── simulation/        # Simulation engine & logic
│   └── utils/             # Utility functions
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## Simulation Flow

1. **Landing Page** - Browse available simulations
2. **Simulation Info Modal** - View details, QR code, and share link
3. **Simulation Start** - Context narrative and reference materials
4. **Decision Steps** - Make policy choices with real-time state updates
5. **Results Screen** - Animated charts, concept mapping, and reflection

## State Management

The application uses **localStorage** to persist simulation state, allowing users to:
- Refresh the page without losing progress
- Resume simulations later
- Share state via URL (can be extended)

## Adding New Simulations

To add a new simulation:

1. Create a new simulation definition in `lib/simulation/` (similar to `macrosim.ts`)
2. Export it and add it to the simulations registry
3. The UI will automatically pick it up

## License

MIT
