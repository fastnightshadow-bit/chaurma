# Shawarma No. 1 Halal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved single-page mobile-first website for "Шаурма №1 Халял" with menu, persistent cart, location switching, order presentation, route section, SEO, accessibility, and performance safeguards.

**Architecture:** Next.js 16 App Router statically renders all business content. Interactive behavior is isolated in client components backed by React Context and a reducer; editable business data stays in typed centralized files and is validated at build time.

**Tech Stack:** Next.js 16, React, TypeScript strict, CSS Modules, Vitest, Testing Library, Playwright, axe-core, Zod, lucide-react, pnpm.

## Global Constraints

- One page only: Hero, Menu, Cart, Map.
- No payment, delivery, registration, account, backend, database, analytics, service worker, or additional product features.
- Mobile first for 360-430 px; desktop is secondary.
- Exact closed-location CTA: "Позвонить и уточнить".
- Cart persists in localStorage; stale carts require explicit user choice and are never auto-cleared.
- Hero is the first rendered content and has no artificial display delay.
- All unknown business data must be visibly marked as temporary in `src/data`.
- Server Components by default; client JavaScript only for interaction, state, and browser APIs.
- Performance budgets: LCP <= 2.2 s, INP <= 150 ms, CLS <= 0.05, initial JS <= 120 KB gzip, CSS <= 35 KB gzip, map 0 KB initially.

---

### Task 1: Project and quality foundation

**Files:**

- Create: `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**

- Produces a runnable Next.js 16 application with `dev`, `build`, `lint`, `typecheck`, `test`, and `test:e2e` commands.

- [ ] Install pinned runtime and development dependencies with pnpm.
- [ ] Configure TypeScript strict mode and import alias `@/*`.
- [ ] Configure ESLint flat config, Prettier, Vitest/jsdom, and Playwright mobile projects.
- [ ] Add the minimal root layout and page shell required for tests and build.
- [ ] Run lint, typecheck, unit tests, and production build; expect success.

### Task 2: Typed data and build validation

**Files:**

- Create: `src/types/menu.ts`, `src/types/location.ts`, `src/types/cart.ts`, `src/types/config.ts`, `src/types/map.ts`
- Create: `src/data/menu.ts`, `src/data/locations.ts`, `src/data/siteConfig.ts`
- Create: `src/utils/validateConfig.ts`
- Test: `tests/unit/validateConfig.test.ts`

**Interfaces:**

- Produces typed readonly business data and `validateProjectData()` that throws descriptive errors for invalid IDs, prices, references, schedules, coordinates, phones, and image metadata.

- [ ] Write failing validation tests for duplicate IDs, negative prices, missing categories, invalid coordinates, and the valid temporary dataset.
- [ ] Run the focused test and confirm the expected missing-module failure.
- [ ] Implement the domain types, explicitly marked temporary data, and validation schemas.
- [ ] Run focused and full tests; expect success.

### Task 3: Business services and cart reducer

**Files:**

- Create: `src/services/businessStatus.ts`, `src/services/routeBuilder.ts`, `src/services/cartStorage.ts`, `src/services/wakeLock.ts`
- Create: `src/state/initialState.ts`, `src/state/actions.ts`, `src/state/appReducer.ts`
- Test: `tests/unit/businessStatus.test.ts`, `tests/unit/routeBuilder.test.ts`, `tests/unit/cartStorage.test.ts`, `tests/unit/appReducer.test.ts`

**Interfaces:**

- Produces deterministic status calculation, coordinate route URLs, versioned cart serialization, stale-cart detection, and reducer actions for cart/location/modal/section state.

- [ ] Write failing tests for open/closed/unknown status and route URL construction.
- [ ] Run tests and confirm expected failures.
- [ ] Implement minimal status and route services; rerun to green.
- [ ] Write failing tests for 24-hour stale detection, corrupt storage, add/update/remove/clear cart, and location changes.
- [ ] Implement storage and reducer behavior without auto-clearing stale carts.
- [ ] Run all tests; expect success.

### Task 4: Application state and shell navigation

**Files:**

- Create: `src/components/app/AppStateProvider.tsx`
- Create: `src/hooks/useActiveSection.ts`, `src/hooks/useCartStorage.ts`, `src/hooks/useBusinessStatus.ts`, `src/hooks/useWakeLock.ts`
- Create: `src/components/layout/TopBar.tsx`, `src/components/layout/BottomNavigation.tsx`
- Create: `src/components/progress/ShawarmaProgress.tsx`
- Test: `tests/integration/app-shell.test.tsx`

**Interfaces:**

- Produces synchronized active-section, location, cart, compact TopBar, bottom badge, clickable progress, and reduced-motion behavior.

- [ ] Write failing interaction tests for navigation, compact TopBar copy, cart badge, progress activation, and reduced motion.
- [ ] Run tests and confirm expected failures.
- [ ] Implement provider, hooks, shell controls, and progress with minimal client boundaries.
- [ ] Run focused and full tests; expect success.

### Task 5: Hero and menu experience

**Files:**

- Create: `src/components/hero/HeroSection.tsx`
- Create: `src/components/menu/MenuSection.tsx`, `src/components/menu/CategoryNavigation.tsx`, `src/components/menu/MenuItemCard.tsx`, `src/components/menu/ItemOptions.tsx`, `src/components/menu/QuantityControl.tsx`
- Create: `src/components/ui/Toast.tsx`, `src/components/ui/FoodPlaceholder.tsx`
- Test: `tests/integration/menu.test.tsx`

**Interfaces:**

- Produces the poster-style Hero, category filtering, stable 124-128 px food placeholders, add/stepper interaction, sold-out states, and one coalesced notification.

- [ ] Write failing tests for category changes, adding, rapid additions, sold-out items, long text, and notification coalescing.
- [ ] Run tests and confirm expected failures.
- [ ] Implement Hero and menu behavior using approved copy and honest visual placeholders.
- [ ] Run focused and full tests; expect success.

### Task 6: Cart, location confirmation, and order presentation

**Files:**

- Create: `src/components/cart/CartSection.tsx`, `src/components/cart/CartItem.tsx`, `src/components/cart/CartSummary.tsx`, `src/components/cart/ClearCartButton.tsx`, `src/components/cart/OrderPresentationModal.tsx`
- Create: `src/components/map/LocationSwitcher.tsx`
- Create: `src/components/ui/Modal.tsx`, `src/components/ui/ConfirmDialog.tsx`, `src/components/ui/EmptyState.tsx`
- Test: `tests/integration/cart.test.tsx`, `tests/integration/order-presentation.test.tsx`

**Interfaces:**

- Produces empty/filled cart states, stale-cart choice, explicit clear confirmation, atomic location change confirmation, closed CTA copy, and read-only full-screen presentation.

- [ ] Write failing tests for stale-cart choices, clear confirmation, quantity changes, last-item removal, closed CTA, location transfer, and modal close rules.
- [ ] Run tests and confirm expected failures.
- [ ] Implement cart, dialogs, location switching, and presentation mode.
- [ ] Run focused and full tests; expect success.

### Task 7: Map, SEO, metadata, and static assets

**Files:**

- Create: `src/components/map/MapSection.tsx`, `src/components/map/MapPlaceholder.tsx`, `src/components/map/RouteButton.tsx`
- Create: `src/services/mapProvider.ts`, `src/seo/structuredData.ts`
- Create: `src/app/robots.ts`, `src/app/sitemap.ts`
- Create: `public/manifest.webmanifest`, `public/icons/*`, `public/favicon/*`
- Test: `tests/integration/map.test.tsx`, `tests/unit/structuredData.test.ts`

**Interfaces:**

- Produces a provider-independent lazy map placeholder, route fallback, two-location Restaurant JSON-LD, canonical metadata, robots, sitemap, and brand icons without a service worker.

- [ ] Write failing tests for lazy map activation, map failure fallback, route availability, and structured data for two locations.
- [ ] Run tests and confirm expected failures.
- [ ] Implement map adapter, map section, metadata, JSON-LD, sitemap, robots, and static brand assets.
- [ ] Run focused and full tests; expect success.

### Task 8: Responsive styling and production verification

**Files:**

- Create/modify: component CSS Modules and `src/app/globals.css`
- Create: `tests/e2e/main-flow.spec.ts`, `tests/e2e/accessibility.spec.ts`, `tests/e2e/responsive.spec.ts`

**Interfaces:**

- Produces the approved visual system at 360, 390, and 430 px plus a stable desktop layout.

- [ ] Add failing E2E assertions for navigation, cart persistence, stale dialog, location change, order presentation, route fallback, keyboard focus, and reduced motion.
- [ ] Run E2E tests and confirm expected failures.
- [ ] Complete responsive CSS Modules using approved tokens, dimensions, motion, and safe areas.
- [ ] Run unit, integration, E2E, axe, lint, typecheck, and production build.
- [ ] Start the production-like dev server and inspect desktop/mobile screenshots for overlap, empty media, sticky panels, and focus visibility.
- [ ] Record all temporary owner-provided data that must be replaced before publication.
