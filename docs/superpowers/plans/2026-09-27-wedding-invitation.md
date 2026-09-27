# Wedding Invitation Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic, responsive Vietnamese wedding invitation website for Linh Đan and Duy Phúc with centrally editable content and graceful empty-image placeholders.

**Architecture:** `src/content.ts` is the only owner of replaceable copy, dates, links, and image paths. `src/App.vue` renders semantic sections and owns the countdown and local RSVP state, while `src/styles.css` owns the responsive editorial presentation and motion preferences.

**Tech Stack:** Vue 3 Composition API, TypeScript, Vite, CSS, Biome

## Global Constraints

- All visitor-facing text and date formatting must be Vietnamese.
- Use the wedding date 06/12/2026 and Minh Toàn Galaxy Hotel in Đà Nẵng.
- Keep every replaceable image path and content value in `src/content.ts`.
- Empty image paths must render styled placeholders, never broken images.
- Do not add runtime dependencies, backend persistence, routing, or state management.
- The page must be mobile-first, keyboard accessible, and reduced-motion aware.

---

### Task 1: Central wedding content

**Files:**
- Create: `src/content.ts`

**Interfaces:**
- Produces: `weddingContent`, a readonly object containing `couple`, `wedding`, `navigation`, `hero`, `welcome`, `story`, `events`, `gallery`, `location`, `rsvp`, `closing`, and `images`.

- [ ] **Step 1: Create the typed content object**

Define the complete editable contract and values in one module:

```ts
export const weddingContent = {
	couple: { bride: "Phạm Nguyễn Linh Đan", groom: "Lê Đàm Duy Phúc" },
	wedding: { isoDate: "2026-12-06T09:00:00+07:00", displayDate: "06 . 12 . 2026" },
	navigation: [
		{ label: "Chuyện tình yêu", href: "#story" },
		{ label: "Sự kiện", href: "#events" },
		{ label: "Thư viện", href: "#gallery" },
		{ label: "Xác nhận", href: "#rsvp" },
	],
	images: { hero: "", story: "", gallery: ["", "", "", "", "", ""] },
} as const;
```

Every string rendered by the page, including labels and alternative text, belongs in this object. Use an external Google Maps search URL for Minh Toàn Galaxy Hotel and clearly mark the street address as editable copy.

- [ ] **Step 2: Verify TypeScript accepts the module**

Run: `bun run type-check`

Expected: exit code 0.

- [ ] **Step 3: Commit the content contract**

```bash
git add src/content.ts
git commit -m "feat: add centralized wedding content"
```

### Task 2: Semantic page and interactions

**Files:**
- Modify: `src/App.vue`
- Modify: `src/main.ts`

**Interfaces:**
- Consumes: `weddingContent` from `src/content.ts`.
- Produces: hero, welcome, story, countdown, event, gallery, location, RSVP, and closing landmarks; live countdown; local RSVP confirmation.

- [ ] **Step 1: Replace the starter component with the wedding page**

Use Vue Composition API state for the countdown and RSVP:

```ts
const remaining = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
const submitted = ref(false);

function updateCountdown() {
	const distance = Math.max(0, new Date(content.wedding.isoDate).getTime() - Date.now());
	remaining.value = {
		days: Math.floor(distance / 86_400_000),
		hours: Math.floor((distance / 3_600_000) % 24),
		minutes: Math.floor((distance / 60_000) % 60),
		seconds: Math.floor((distance / 1_000) % 60),
	};
}
```

Start the one-second timer on mount and clear it on unmount. Render `<img>` only when its configured path is non-empty; otherwise render an accessible decorative placeholder. Submit RSVP with `@submit.prevent="submitted = true"` and replace the form with an in-page Vietnamese success message.

- [ ] **Step 2: Import the global stylesheet**

Update `src/main.ts`:

```ts
import { createApp } from "vue";
import App from "./App.vue";
import "./styles.css";

createApp(App).mount("#app");
```

- [ ] **Step 3: Verify template and script types**

Run: `bun run type-check`

Expected: exit code 0 with no Vue template diagnostics.

- [ ] **Step 4: Commit page behavior**

```bash
git add src/App.vue src/main.ts
git commit -m "feat: build wedding invitation page"
```

### Task 3: Cinematic editorial styling and metadata

**Files:**
- Create: `src/styles.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: semantic class names and section IDs from `src/App.vue`.
- Produces: responsive ivory, burgundy, and champagne presentation at mobile and desktop widths.

- [ ] **Step 1: Add global visual foundations**

Define color and type tokens, reset rules, focus treatment, smooth scrolling, and reusable editorial treatments:

```css
:root {
	--ivory: #f7f1e7;
	--paper: #fffaf2;
	--burgundy: #681f2b;
	--wine: #40151c;
	--gold: #b58b55;
	--ink: #332624;
}

html { scroll-behavior: smooth; }
body { margin: 0; background: var(--ivory); color: var(--ink); }
:focus-visible { outline: 2px solid var(--burgundy); outline-offset: 4px; }
```

Style a full-height hero, sticky translucent navigation, framed invitation blocks, ornamental botanical pseudo-elements, timeline, countdown grid, event cards, masonry-inspired gallery, location panel, RSVP controls, and closing section. Expand compositions with media queries while preventing horizontal overflow.

- [ ] **Step 2: Add reduced-motion handling**

```css
@media (prefers-reduced-motion: reduce) {
	*, *::before, *::after {
		scroll-behavior: auto !important;
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}
```

- [ ] **Step 3: Set Vietnamese document metadata**

Set `lang="vi"`, title `Linh Đan & Duy Phúc | 06.12.2026`, a Vietnamese description, and `theme-color` in `index.html`.

- [ ] **Step 4: Run static verification**

Run: `bun run check && bun run build`

Expected: Biome, Vue type checking, and Vite production build all exit 0.

- [ ] **Step 5: Run and inspect the page**

Run: `bun run dev -- --host 0.0.0.0`

Capture and inspect a desktop screenshot near 1440 px and a mobile screenshot near 390 px. Verify empty image placeholders, typography, section spacing, no horizontal overflow, navigation targets, countdown output, map target, and RSVP confirmation.

- [ ] **Step 6: Commit presentation and metadata**

```bash
git add src/styles.css index.html
git commit -m "feat: style cinematic wedding invitation"
```
