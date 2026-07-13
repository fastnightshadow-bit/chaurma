# Cart Comments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-item preparation requests and one persisted order-wide comment to the cart and seller presentation.

**Architecture:** Extend the cart domain with a required `orderComment`, reducer actions for both comment scopes, and backward-compatible storage migration from version 1 to version 2. Keep editing local to each cart line and reuse the existing state provider persistence flow.

**Tech Stack:** React 19, TypeScript, React Context/useReducer, Zod, CSS Modules, Node test runner, Playwright.

## Global Constraints

- Individual comment maximum: 120 characters.
- Order comment maximum: 200 characters.
- No modal or new route for editing.
- Version 1 saved carts must continue to restore.
- Comments must appear in seller presentation mode.

---

### Task 1: Cart domain and persistence

**Files:**

- Modify: `src/types/cart.ts`
- Modify: `src/state/actions.ts`
- Modify: `src/state/appReducer.ts`
- Modify: `src/state/initialState.ts`
- Modify: `src/services/cartStorage.ts`
- Test: `tests/unit/domain.test.ts`

- [ ] Add failing tests for scoped item updates, order comment updates, clear behaviour, version 2 persistence, and version 1 migration.
- [ ] Add length constants, `orderComment`, comment actions, reducer handling, and storage schemas.
- [ ] Run unit tests and require all tests to pass.

### Task 2: Cart editing interface

**Files:**

- Modify: `src/components/cart/CartItem.tsx`
- Create: `src/components/cart/OrderCommentField.tsx`
- Modify: `src/components/cart/CartSection.tsx`
- Modify: `src/components/site.module.css`
- Test: `tests/e2e/main-flow.spec.ts`

- [ ] Add a failing interaction test for add, save, edit, remove, order comment entry, and reload persistence.
- [ ] Add the inline item editor and order comment field with accessible labels, counters, and 44 px controls.
- [ ] Add only the approved short reveal animation and reduced-motion-compatible styles.

### Task 3: Seller presentation and verification

**Files:**

- Modify: `src/components/cart/OrderPresentationModal.tsx`
- Test: `tests/e2e/main-flow.spec.ts`

- [ ] Assert item and order comments are visible in presentation mode.
- [ ] Render each comment in its correct scope.
- [ ] Run formatting, ESLint, TypeScript, unit tests, production build, and mobile Playwright checks.
- [ ] Publish the focused change and verify the deployed page.
