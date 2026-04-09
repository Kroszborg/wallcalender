# Wall Calendar Component

A production-quality interactive wall calendar built for a frontend engineering internship evaluation. Features a realistic physical calendar aesthetic with spiral binding rings, month-specific Unsplash photography, and smooth micro-interactions.

## Features

### Core Functionality
- **Date Range Selection** — 3-click state machine (start → end → confirm) with visual feedback
- **Notes System** — Attach notes to date ranges with full CRUD operations
- **localStorage Persistence** — Notes survive page refreshes
- **Keyboard Navigation** — Arrow keys for months, Escape to clear selection
- **Responsive Design** — Desktop card layout with physical calendar aesthetic

### Premium Polish
- **Physical Wall Calendar Aesthetic** — Realistic spiral binding strip with metallic rings, subtle tilt, layered shadows
- **Dynamic Hero Images** — Month-specific Unsplash photos with gradient overlays and subtle zoom on hover
- **Animated Range Bands** — Clean date range visualization with smooth transitions
- **Today Indicator** — Small accent dot on current date
- **Dark Mode Support** — Full theme inversion with adjusted accent colors
- **Film Grain Texture** — Subtle texture overlay for authentic feel

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2.2 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Date Utils | date-fns v4 |
| UI Components | @base-ui/react (Shadcn primitives) |
| Icons | @hugeicons/react + @hugeicons/core-free-icons |
| Storage | localStorage (client-side) |

## Getting Started

### Prerequisites

- Node.js 20+ or Bun 1.0+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wallcalender

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Architecture

### Component Structure

```
components/calendar/
├── Calendar.tsx        # Root orchestrator — owns all state
├── CalendarGrid.tsx    # 7-column grid renderer
├── DayCell.tsx         # Individual day with range visualization
├── HeroImage.tsx       # Hero photo + spiral binding
├── MonthNavigator.tsx  # Prev/next month buttons
└── NotesPanel.tsx      # Notes CRUD interface

lib/
├── calendar-utils.ts   # Pure date-fns functions
└── holidays.ts         # Static US holiday data
```

### State Management

All state lives in `Calendar.tsx` and is passed down as props:

```typescript
const [currentMonth, setCurrentMonth] = useState<Date>()
const [selectionPhase, setSelectionPhase] = useState<SelectionPhase>("idle" | "selecting" | "selected")
const [rangeStart, setRangeStart] = useState<Date | null>()
const [rangeEnd, setRangeEnd] = useState<Date | null>()
const [hoverDate, setHoverDate] = useState<Date | null>()
const [notes, setNotes] = useState<CalendarNote[]>([])
const [animationDirection, setAnimationDirection] = useState<"left" | "right">()
```

### 3-Click Selection State Machine

```
┌──────┐  Click 1  ┌───────────┐  Click 2  ┌─────────┐
│ idle │ ─────────>│ selecting │ ─────────>│ selected│
└──────┘           └───────────┘           └─────────┘
    ^                                         │
    │           Click 3                       │
    └─────────────────────────────────────────┘
```

### localStorage Schema

```typescript
// Key: "wall-calendar-notes-v1"
// Value: CalendarNote[]

interface CalendarNote {
  id: string           // crypto.randomUUID()
  rangeStart: string   // "yyyy-MM-dd"
  rangeEnd: string     // "yyyy-MM-dd"
  content: string
  createdAt: string    // ISO timestamp
  updatedAt: string
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous month |
| `→` | Next month |
| `Esc` | Clear selection |

## Bonus Features Implemented

1. **Month Navigation Animation** — Slide-in from left/right on month change using `tw-animate-css`
2. **Hover Range Preview** — Real-time range visualization while selecting (50% opacity)
3. **Keyboard Navigation** — Full arrow key + Escape support
4. **Physical Calendar Aesthetic** — Spiral binding, film grain, subtle tilt for authentic feel

## Design Tokens

```css
:root {
  --cal-accent: #6366f1;        /* Primary accent (indigo-500) */
  --cal-accent-light: #e0e7ff;  /* Range bands (indigo-100) */
  --cal-accent-mid: #a5b4fc;    /* Secondary indicators (indigo-300) */
  --cal-accent-rgb: 99, 102, 241;
}
```

## Project Structure

```
wallcalender/
├── app/
│   ├── globals.css       # Theme config + animations
│   ├── layout.tsx        # Root layout + providers
│   └── page.tsx          # Background + Calendar mount
├── components/
│   ├── calendar/         # Calendar components
│   └── ui/               # Shadcn primitives
├── lib/
│   ├── calendar-utils.ts # Date helpers
│   ├── holidays.ts       # Holiday data
│   └── utils.ts          # cn() helper
└── README.md
```

## Assignment Completion

This project fulfills the frontend engineering challenge requirements:

- ✅ Wall calendar UI with hero, grid, and notes sections
- ✅ Date range selection with visual states
- ✅ Notes attached to date ranges with localStorage persistence
- ✅ Fully responsive design
- ✅ Premium Dribbble-level polish
- ✅ Smooth animations and micro-interactions
- ✅ Keyboard navigation support
- ✅ Clean TypeScript architecture

---

Built with ❤️ for the frontend internship evaluation.
