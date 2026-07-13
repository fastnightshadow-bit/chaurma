# Open Graph Brand Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the temporary social preview with a production-ready 1200 x 630 px brand image and publish it with correct Open Graph and Twitter metadata.

**Architecture:** Generate one deterministic raster asset from the existing Hero photograph, brand icon, approved colors, and Manrope typography. Keep metadata in `src/app/layout.tsx`, remove obsolete assets, and enforce the contract with a focused unit test.

**Tech Stack:** Next.js Metadata API, TypeScript, Vitest, Playwright screenshot rendering, PNG.

## Global Constraints

- Use the existing Hero photograph and brand icon without redrawing them.
- Output exactly 1200 x 630 px.
- Use only the brand name `Шаурма №1 Халяль`; no tagline or temporary text.
- Remove both old placeholder assets and every metadata reference to them.
- Use an absolute public URL in Open Graph and Twitter metadata.

---

### Task 1: Add the social-preview regression test

**Files:**

- Create: `tests/unit/seo-assets.test.ts`

**Interfaces:**

- Consumes: `public/images/brand` and `src/app/layout.tsx`.
- Produces: a test contract for the PNG dimensions, metadata filename, and removed placeholders.

- [ ] **Step 1: Write a failing Vitest test**

The test reads the PNG header, expects 1200 x 630, checks `layout.tsx` for `og-shawarma-no1.png`, and rejects `og-placeholder` references or files.

- [ ] **Step 2: Verify the test fails**

Run: `pnpm vitest run tests/unit/seo-assets.test.ts`

Expected: FAIL because `og-shawarma-no1.png` does not exist and metadata still references `og-placeholder.png`.

### Task 2: Create and connect the production OG asset

**Files:**

- Create: `public/images/brand/og-shawarma-no1.png`
- Modify: `src/app/layout.tsx`
- Delete: `public/images/brand/og-placeholder.png`
- Delete: `public/images/brand/og-placeholder.svg`

**Interfaces:**

- Consumes: `public/images/hero/hero-shawarma.webp`, `public/icons/brand-icon-1024.png`, and the local Manrope font.
- Produces: `https://fastnightshadow-bit.github.io/chaurma/images/brand/og-shawarma-no1.png`.

- [ ] **Step 1: Render the approved 1200 x 630 composition**

Use the Hero photo on the right, graphite gradient on the left, brand icon, saffron accent, and exact brand name inside safe margins.

- [ ] **Step 2: Update Metadata API values**

Use the new absolute URL for Open Graph and Twitter. Add width, height, and Russian alt text to Open Graph.

- [ ] **Step 3: Delete obsolete assets**

Remove both `og-placeholder` files and verify `rg -n "og-placeholder|Временное фирменное изображение" src public` returns no matches.

- [ ] **Step 4: Verify the regression test passes**

Run: `pnpm vitest run tests/unit/seo-assets.test.ts`

Expected: PASS.

### Task 3: Verify and publish

**Files:**

- Modify only if validation exposes an issue.

**Interfaces:**

- Consumes: the finished static export.
- Produces: a deployed public OG image with HTTP 200.

- [ ] **Step 1: Run project checks**

Run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`; all commands must exit with code 0.

- [ ] **Step 2: Inspect generated metadata**

Confirm `out/index.html` contains the new `og:image` and `twitter:image` absolute URL and no placeholder reference.

- [ ] **Step 3: Publish the changed files to `main`**

Create one focused commit containing the new asset, metadata update, deleted placeholders, test, specification, and plan.

- [ ] **Step 4: Verify the public image**

Request `https://fastnightshadow-bit.github.io/chaurma/images/brand/og-shawarma-no1.png` and require HTTP 200 with `Content-Type: image/png`.
