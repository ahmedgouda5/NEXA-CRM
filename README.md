<div align="center">

# NEXA CRM

**Customer relationships, organized intelligently.**

A production-grade CRM front-end — contacts, companies, leads, pipeline, tasks, calendar, inbox, reports, automations and an AI assistant — built on React 19, TypeScript and a token-driven design system.

`React 19` · `TypeScript` · `Vite 7` · `Tailwind CSS 4` · `shadcn/ui` · `Zustand` · `Zod`

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
4. [Folder Structure](#folder-structure)
5. [Architecture](#architecture)
6. [Design System & Colors](#design-system--colors)
7. [App Guidelines](#app-guidelines)
8. [Conventions & Best Practices](#conventions--best-practices)
9. [Roadmap](#roadmap)

---

## Overview

NEXA is a single-page CRM workspace shell. It is intentionally **front-end only** — all data comes from typed seed constants in `src/domains/crm/crm.data.ts` and lives in Zustand stores, so the app runs instantly with zero backend setup. Swapping the seed layer for an API client is the only change needed to go live.

**What is included**

| Area | Views |
| --- | --- |
| Workspace | Overview · Inbox · Contacts · Companies |
| Sales | Leads · Pipeline (Kanban with drag & drop) |
| Productivity | Activity · Tasks · Calendar |
| Insights | Reports · Automations · Integrations |
| Global | Command palette (`⌘K`) · Entity drawers · Create dialogs · AI assistant · Light/Dark theme |

---

## Technology Stack

### Core

| Technology | Version | Purpose |
| --- | --- | --- |
| **React** | 19.2 | UI runtime, concurrent features |
| **TypeScript** | 5.9 | Strict types, `noUnusedLocals`, `noUncheckedSideEffectImports` |
| **Vite** | 7.1 | Dev server, build, HMR |
| **Tailwind CSS** | 4.1 | Utility-first styling via `@tailwindcss/vite` plugin |

### UI & Design System

| Technology | Version | Purpose |
| --- | --- | --- |
| **shadcn/ui** (`radix-nova`) | 4.21 | Headless component registry, `radix-ui` primitives |
| **Radix UI** | 1.6 | Accessible primitives (dialog, select, popover, tooltip, tabs…) |
| **class-variance-authority** | 0.7 | Typed variant recipes for shared UI |
| **tailwind-merge** (`cn`) | 0.4 | Conflict-free class composition |
| **lucide-react** | 1.48 | Icon set (tree-shakeable) |
| **cmdk** | 1.1 | Command palette engine |
| **sonner** | 2.0 | Toast notifications |
| **tw-animate-css** | 1.4 | Animation utilities |

### State, Forms & Validation

| Technology | Version | Purpose |
| --- | --- | --- |
| **Zustand** | 5.0 | Store-based state for CRM, navigation and AI |
| **Zod** | 3.25 | Schema validation for all forms |
| **react-hook-form** | 7.89 | Form state management |
| **@hookform/resolvers** | 5.9 | Zod ↔ react-hook-form bridge |

### Fonts

Loaded from Google Fonts in `index.html`:

- **Inter** — UI / body (400 · 500 · 600 · 700 · 800)
- **JetBrains Mono** — numerals, IDs, timestamps, KPIs

> No router or data-fetching library is installed. Navigation is a typed store (`useNavigationStore`) and data is local — see [Architecture](#architecture).

---

## Getting Started

**Prerequisites:** Node.js 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Type-check the project
npm run typecheck

# 4. Production build (type-check + bundle to dist/)
npm run build

# 5. Preview the production build
npm run preview
```

### Adding a shadcn/ui component

The project aliases are configured in `components.json` — components land in `src/shared/ui`, not the default `ui/` folder.

```bash
npx shadcn@latest add accordion
# → src/shared/ui/accordion.tsx
```

---

## Folder Structure

```
nexa-crm/
├── index.html                     # HTML shell, font preload, no-flash theme script
├── vite.config.ts                 # Vite + React + Tailwind plugins, "@" alias
├── components.json                # shadcn/ui config (aliases → src/shared/*)
├── tsconfig.json                  # Solution-style tsconfig
├── tsconfig.app.json              # App compiler options (strict, path aliases)
├── tsconfig.node.json             # Vite config compiler options
├── dist/                          # Production output (build artifact)
└── src/
    ├── main.tsx                   # Entry point: mounts <App/> + global stylesheet
    │
    ├── app/                       # ── APPLICATION SHELL ─────────────────
    │   ├── App.tsx                # Layout composition
    │   ├── AppProviders.tsx       # Theme, tooltip and toast providers
    │   └── shell/
    │       ├── sidebar.tsx        # Nav, workspace switcher, favorites, profile
    │       ├── topbar.tsx         # Search, notifications, messages, theme toggle
    │       ├── view-router.tsx    # Maps active ViewId → view component
    │       ├── command-menu.tsx   # ⌘K / Ctrl+K command palette
    │       ├── create-dialogs.tsx # New contact / deal / company / lead / task
    │       └── entity-drawers.tsx # Contact & deal detail sheets
    │
    ├── domains/                   # ── BUSINESS DOMAINS ──────────────────
    │   │
    │   ├── crm/                   # Core domain
    │   │   ├── crm.types.ts       # Entity + union types (source of truth)
    │   │   ├── crm.data.ts        # Seed data + STAGES color map
    │   │   ├── crm.store.ts       # Zustand store + selectors
    │   │   ├── crm.utils.ts       # stageColor, matches, sortBy, weightedValue
    │   │   ├── components/
    │   │   │   └── crm-primitives.tsx  # Shared CRM building blocks
    │   │   │
    │   │   ├── overview/          # Dashboard: KPIs, charts, pipeline, activity
    │   │   ├── inbox/             # 3-pane mail + thread reader
    │   │   ├── contacts/          #   contact.schema.ts (Zod) + contact-form
    │   │   ├── companies/         # Account list + health
    │   │   ├── leads/             # Inbound/outbound prospects, intent score
    │   │   ├── deals/             # Kanban pipeline, drag between stages
    │   │   ├── activities/        # Grouped event timeline
    │   │   ├── tasks/             # Today / Upcoming / Overdue buckets
    │   │   ├── calendar/          # Month grid with typed events
    │   │   ├── reports/           # Revenue, conversion, forecast charts
    │   │   ├── automations/       # Rule toggles
    │   │   └── integrations/      # Connected-tool toggles
    │   │
    │   ├── navigation/            # ViewId union, NAV_GROUPS, VIEW_TITLES, store
    │   └── ai/                    # AI assistant panel + deterministic answers
    │
    ├── shared/                    # ── CROSS-CUTTING ──────────────────────
    │   ├── ui/                    # shadcn primitives (button, dialog, table…)
    │   ├── lib/
    │   │   ├── utils.ts           # cn() class merge helper
    │   │   └── format.ts          # fmtMoney, fmtPercent, initials, colorFor
    │   ├── hooks/                 # Reusable hooks
    │   ├── config/                # Static configuration
    │   └── theme/                 # ★ DESIGN SYSTEM CORE
    │       ├── palette.css        # Every color in the product (source of truth)
    │       ├── tailwind.css       # CSS vars → Tailwind token map + base layer
    │       ├── theme.ts           # Theme constants + JS color mirror
    │       ├── theme-provider.tsx # ThemeContext, persistence, no-flash apply
    │       └── theme-toggle.tsx   # Light/dark switch
    │
    └── styles/
        ├── globals.css            # Import order: tailwind → shadcn → theme → components
        └── components.css         # Reusable design-system classes (bento, kanban, table…)
```

**Directory rules**

- `app/` knows about domains, **never the reverse** — domains import nothing from `app/`.
- `domains/*` never import from `shared/ui` internals directly; they compose domain-local `components/`.
- `shared/` never imports from `app/` or `domains/`.
- A new view = one folder under `domains/crm/<view>/components/` + one entry in `navigation.config.ts` + one line in `view-router.tsx`.

---

## Architecture

### State — three independent Zustand stores

| Store | File | Owns |
| --- | --- | --- |
| `useCrmStore` | `domains/crm/crm.store.ts` | Entities, selection, dialog/drawer state, mutations |
| `useNavigationStore` | `domains/navigation/navigation.store.ts` | Active view, sidebar rail, mobile nav, command palette, favorites |
| `useAiStore` | `domains/ai/ai.store.ts` | Assistant open state and message thread |

Selectors are used to subscribe to the narrowest slice possible:

```ts
const activeView = useNavigationStore((s) => s.activeView)
const deals = useCrmStore((s) => s.deals)
```

Mutations are **intent-named actions**, not raw setters — `moveDeal(id, stage)`, `toggleTask(id)`, `addContact(values)`, `openCreate('deal')`.

### Navigation — no router

`ViewId` is a closed string union. `NAV_GROUPS` drives the sidebar, `VIEW_TITLES` drives the topbar heading, and `view-router.tsx` holds the `ViewId → component` map. Adding a view touches exactly three files.

### Data flow

```
crm.data.ts (seed)  →  crm.store.ts (state)  →  *-view.tsx (read + dispatch actions)
                                    ↑
                        zod schema → react-hook-form → action payload
```

### Theming — three layers, one source

`palette.css` defines every color. `tailwind.css` maps those CSS variables to Tailwind tokens. Components consume **tokens only**, so light/dark is a pure token swap driven by `<html data-theme="…">`.

An inline script in `index.html` applies the stored theme before React mounts, which eliminates the dark-mode flash.

---

## Design System & Colors

NEXA's palette is built on a **blue → violet** brand gradient over a warm-neutral light theme and a deep charcoal dark theme. Status colors are shared across both themes so a red always reads as "at risk".

### Brand gradient

The signature of the product. Used for the logo mark, primary buttons, active nav rail, toggles-on, funnel bars and the selected pager.

```css
--accent-grad: linear-gradient(135deg, #4c7dff 0%, #8b6cff 100%);
```

| Role | Light | Dark | Usage |
| --- | --- | --- | --- |
| **Accent Blue** | `#4C7DFF` | `#4C7DFF` | Primary actions, focus ring, active states, links |
| **Accent Violet** | `#8B6CFF` | `#8B6CFF` | Gradient end, selection, feature surfaces, chart 2 |
| **Success** | `#2FD498` | `#2FD498` | Won deals, healthy accounts, positive deltas, completed |
| **Warning** | `#F5B94A` | `#F5B94A` | At-risk accounts, overdue soon, medium priority |
| **Danger** | `#F2555F` | `#F2555F` | Lost deals, destructive actions, high priority |

### Surfaces & text

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `bg` | `#F3F1EC` | `#0A0B0E` | App background |
| `bg-2` | `#EAE8E2` | `#0F1013` | Secondary background |
| `surface` | `#FFFFFF` | `#16171C` | Cards, panels, tables |
| `surface-2` | `#F7F6F2` | `#1C1E25` | Kanban columns, message bubbles |
| `surface-3` | `#EFEDE7` | `#22242C` | Badges, segmented active, chips |
| `glass` | `rgba(255,255,255,.55)` | `rgba(255,255,255,.045)` | Blurred chrome (sidebar, search) |
| `border` | `rgba(20,20,25,.09)` | `rgba(255,255,255,.08)` | Default stroke |
| `border-strong` | `rgba(20,20,25,.16)` | `rgba(255,255,255,.14)` | Hover / emphasis stroke |
| `text` | `#16171B` | `#F3F2EF` | Primary content |
| `text-dim` | `#5B5D66` | `#A5A7B1` | Secondary content |
| `text-faint` | `#8B8D96` | `#6E7079` | Labels, timestamps, placeholders |

### Elevation

`shadow-sm` (cards) · `shadow-md` (hover lift) · `shadow-lg` (dropdowns, drawers) — all theme-scoped in `palette.css`.

### Avatar / logo rotation

Deterministic brand colors derived from any name seed via `colorFor(seed)` in `shared/lib/format.ts`:

| # | Color | # | Color |
| --- | --- | --- | --- |
| 1 | `#4C7DFF` | 5 | `#F2555F` |
| 2 | `#8B6CFF` | 6 | `#3FB8D9` |
| 3 | `#2FD498` | 7 | `#E06AC4` |
| 4 | `#F5B94A` | | |

### Deal stage colors

Driven by `STAGES` in `crm.data.ts` and resolved by `stageColor()`:

| Stage | Color | | Stage | Color |
| --- | --- | --- | --- | --- |
| Lead | `#6E7079` | | Negotiation | `#F5B94A` |
| Qualified | `#4C7DFF` | | Won | `#2FD498` |
| Proposal | `#8B6CFF` | | Lost | `#F2555F` |

### Color usage rules

1. **Never hardcode a hex value in a component.** Use a token — `bg-surface`, `text-text-dim`, `border-line`, `text-success`, `bg-danger-bg`.
2. **Exceptions only** where JS must supply the color: SVG chart strokes, avatar backgrounds. Use `BRAND` / `AVATAR_COLORS` from `shared/theme/theme.ts`.
3. **Status = hue + tinted background.** A `.status-pill` pairs a solid dot with a 12%-alpha background (`--success-bg`, `--warning-bg`, `--danger-bg`).
4. **Light and dark differ only in layer 2.** Never add a `[data-theme='dark']` rule inside a component or inside `components.css`.
5. **Accent gradient = one action per screen.** Gradients mark primary buttons, active nav and the logo. Do not sprinkle them on cards.

### Motion & shape

| Token | Value |
| --- | --- |
| `--ease-nexa` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--animate-fade-up` | fade + 6px rise, 220ms — view mount |
| `--animate-nexa-in` | fade + 10px rise + 0.98 scale, 220ms — overlays |
| `--radius` | `0.875rem` (14px) |
| Card radius | 20px · Button 10px · Pills 99px · Icon tiles 8–10px |

Standard timing: **120ms** for hover/press color changes, **220ms** for transforms and entrances.

---

## App Guidelines

### Adding a new view

1. **Types** — add the entity shape to `domains/crm/crm.types.ts`; add a `ViewId` member to `navigation.types.ts`.
2. **Seed** — add a `*_SEED` array in `crm.data.ts`.
3. **State** — add the collection to `crm.store.ts` with intent-named actions.
4. **View** — create `domains/crm/<view>/components/<view>-view.tsx`, export a single `<ViewName>View`.
5. **Register** — add the `NAV_GROUPS` entry + `VIEW_TITLES` copy in `navigation.config.ts`, then map the id to the component in `view-router.tsx`.
6. **Styling** — compose existing classes from `styles/components.css`; add a new shared class only if the pattern appears in 2+ views.

### Component conventions

- One component per file. Suffix view files with `-view.tsx`, primitives with no suffix.
- Named exports, no default exports.
- Read from the store through a selector; never subscribe to the whole state object.
- Local UI state (`useState`) belongs in the component; shared or cross-view state belongs in a store.
- Derive, don't duplicate — compute totals with `totalBy`, `weightedValue`, `openPipeline` instead of storing them.
- Use `cn()` to merge conditional classes.
- Lucide icons only, sized through the parent class (`.btn svg`, `.tool-icon svg`).
- Use `key={entity.id}` in every list; never use the array index.

### Form conventions

- One Zod schema per entity, colocated with its feature folder (`contacts/contact.schema.ts`).
- Infer types from the schema: `z.infer<typeof contactFormSchema>`. Never hand-write a parallel interface.
- `z.coerce.number()` for numeric inputs; `z.enum(COLLECTION, { message: '…' })` for selects.
- Wire with `useForm` + `zodResolver`; surface messages through the shared `Form` primitives.
- Reset to `*_DEFAULTS` on submit and on dialog close.

### Theming guidelines

- To add a **new color**, declare it in `palette.css` (primitives → semantics → shadcn roles), then map it in `tailwind.css`. Two edits, in that order.
- If both themes need a different value, override the semantic variable inside `[data-theme='dark']`. The shadcn role layer inherits automatically.
- Keep the JS mirror in `theme.ts` in sync whenever a brand primitive's hex changes.

### Accessibility

- Every interactive element is a real `<button>`, `<a>` or form control.
- Buttons inherit the document font (`.btn`, `.nav-item`, `.chip` etc. are listed in `components.css`).
- Focus is visible globally: 2px accent outline with 2px offset.
- Drawers and dialogs come from Radix — keep `aria-label` / `title` on icon-only buttons.
- Status is never color-only: pills always pair the dot/hue with text.

### Performance

- Derive lists with `useMemo` when the computation is heavier than a simple filter.
- Charts are inline SVG driven by the store — no chart library dependency.
- Icons are imported individually from `lucide-react` so Vite tree-shakes them.
- `data-active` / `data-rail` / `data-dragover` attributes drive styling so state never needs a parallel boolean class.

---

## Conventions & Best Practices

| Concern | Rule |
| --- | --- |
| Types | `verbatimModuleSyntax` — use `import type { … }` for type-only imports |
| Strictness | `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are all on |
| Path alias | Always `@/…`, never relative traversal |
| CSS | Global design-system classes in `components.css`; layout utilities inline in the component |
| Styling approach | Tokens only — no raw hex, no inline `style={{ color }}` for themed colors |
| Accessibility | Semantic elements, labelled icon buttons, visible focus |
| Data | Seeded constants; no network calls |
| Typecheck | Run `npm run typecheck` before every commit |
| Build | `npm run build` must pass cleanly |

---

## Roadmap

- [ ] Replace `crm.data.ts` with a typed API/data layer
- [ ] Add URL-synced routing (deep links to views and records)
- [ ] Persist store state and favorites to `localStorage`
- [ ] Virtualize long tables (contacts, activity)
- [ ] Real charting instead of inline SVG sparklines
- [ ] Recharts or equivalent for the reports view
- [ ] Keyboard-first command palette: entity creation and quick navigation
- [ ] Test suite (Vitest + Testing Library)

---

<div align="center">

**NEXA CRM** — Built with React 19, TypeScript, Vite and Tailwind CSS 4.
Design tokens live in `src/shared/theme/palette.css`.

</div>
