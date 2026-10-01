# Consensus Plan (Draft v1): 온결 공방 — Korean Craft Studio Prototype

Source spec: `.omc/specs/deep-interview-onkyeol-gongbang.md` (ambiguity 20%, PASSED)
Mode: RALPLAN-DR short (non-interactive, `--direct`)
Status: DRAFT — pending Architect/Critic review

## RALPLAN-DR Summary

### Principles
1. **Mock-only, network-free**: every dynamic behavior (data, images, form results) must be resolvable with zero real network/database calls — this is a practice sandbox, not a real product.
2. **Symmetry over special-casing**: the two domains (products, classes) should share as much structure as possible (card component, form component, mock-api contract) to minimize duplicated logic and keep the codebase small.
3. **Explicit, deterministic test paths**: the failure path must be trivially and repeatably reproducible (`010-0000-0000`) so QA/demo can exercise both outcomes without randomness.
4. **Calm, restrained design**: visual choices default toward fewer colors/motifs rather than more; when in doubt, simplify rather than decorate.
5. **Route-first navigation**: `/products` and `/classes` are real Next.js routes (not client-only tab state), so the App Router's file-based routing and layouts do the navigation work.

### Decision Drivers (top 3)
1. **Shared mock-api contract** must cleanly support two distinct entities (product inquiry vs class application) without leaking domain-specific logic into the API layer itself.
2. **Data modeling for images**: local static assets only (per spec) — needs a defined folder convention and a small fixed set of placeholder images reused across 6 products + 6 classes.
3. **Form/result UI reuse**: both forms share the same 3-field shape and the same inline-result-card behavior — a shared form component avoids duplicating the 700ms-delay/success/failure rendering logic twice.

### Viable Options

**Option A — Single generic `InquiryForm` + single generic `mockSubmit()` (Recommended)**
- One generic form component parameterized by `subjectLabel` (product or class name) and `onSubmit` callback; one generic `mockSubmit(payload): Promise<MockResult>` in `mock-api.ts` used by both flows.
- Pros: least duplication, single place to tune the 700ms delay/failure rule, easy to test once.
- Cons: generic component needs a small amount of prop-driven flexibility (e.g., button label, subject reference) — slightly more abstraction than two hardcoded forms.

**Option B — Two separate forms/API functions (`submitOrderInquiry`, `submitClassApplication`)**
- Pros: each flow is fully independent, zero shared-abstraction risk, trivial to read in isolation.
- Cons: duplicates the identical 3-field validation, 700ms delay, and failure-trigger logic twice — directly conflicts with Principle 2 (symmetry over special-casing) and risks drift if one copy is tweaked and the other isn't.

**Decision: Option A.** Option B is invalidated because the spec explicitly describes both forms as structurally identical (name/phone/message, same failure trigger, same inline-result UX) — duplicating that logic would violate the minimal-code/no-premature-divergence principle for zero added flexibility.

## Goal (inherited from spec)
Build the "온결 공방" prototype: two-route (`/products`, `/classes`) Next.js App Router site with static TS mock data, a shared mock API layer, and inline-result inquiry/application forms — no auth, DB, payment, or real network calls.

## Implementation Steps

1. **Project scaffolding & shared types** (`src/lib/types.ts` or `src/types/`)
   - Define `CraftType` union (`"도자기" | "나전칠기" | "보자기" | "목공예"`), `Product`, `WorkshopClass`, `InquiryPayload`, `MockResult` types.

2. **Mock data** (`src/data/products.ts`, `src/data/classes.ts`)
   - 6 `Product` entries across the 4 craft categories (image path, name, craftType, description, price).
   - 6 `WorkshopClass` entries (name, description, price, duration, capacity).
   - Reference local images under `public/images/products/` and `public/images/classes/` (placeholder assets to be added/generated as part of this step — flat-color or simple SVG placeholders acceptable, no external fetches).

3. **Mock API layer** (`src/lib/mock-api.ts`)
   - `submitInquiry(payload: InquiryPayload): Promise<MockResult>` — single shared async function.
   - Behavior: `await delay(700)`; if `payload.phone === "010-0000-0000"` → resolve `{ success: false, message: "..." }`; else → resolve `{ success: true, receiptNumber: <generated>, message: "..." }`.
   - Receipt number format: e.g. `OG-${Date.now().toString().slice(-8)}` or similar fake-but-plausible id (no real sequencing/storage).
   - No `fetch`, no `localStorage` persistence — purely in-memory/computed.

4. **Global shell** (`src/app/layout.tsx`, new `src/components/NavTabs.tsx`, `src/components/PracticeBanner.tsx`)
   - Header with site name "온결 공방", `NavTabs` linking to `/products` and `/classes` using Next.js `<Link>` with active-route styling.
   - Global `PracticeBanner` (or per-form banner) stating this is a practice-only prototype and instructing users not to enter real name/phone.
   - Tailwind theme tokens (color palette, typography) reflecting a calm, modern-traditional Korean aesthetic — restrained palette (e.g., muted celadon/hanji-paper neutrals + one accent), no motif overuse.

5. **Shared UI primitives** (`src/components/`)
   - `ProductCard` / `ClassCard` (or one generic `CraftCard` if fields overlap enough) rendering image, name, type/category or duration/capacity, description, price, and the CTA button ("주문 문의하기" / "클래스 신청").
   - `InquiryForm` (generic): name/phone/message fields, subject label prop, calls `submitInquiry`, renders 700ms pending state, then swaps to an inline `ResultCard` (success or failure) with a dismiss/retry action.

6. **`/products` route** (`src/app/products/page.tsx`)
   - Renders grid of 6 `ProductCard`s from `src/data/products.ts`; each card's inquiry button opens `InquiryForm` scoped to that product (inline expand or same-page state, not a separate route/modal).

7. **`/classes` route** (`src/app/classes/page.tsx`)
   - Renders grid of 6 `WorkshopClass` cards from `src/data/classes.ts`; each card's apply button opens `InquiryForm` scoped to that class.

8. **Root redirect / home page** (`src/app/page.tsx`)
   - Redirect `/` to `/products` (or render a minimal landing that links into both tabs) — spec implies the two tabs are primary; no separate home content was specified, so redirecting to `/products` is the simplest default consistent with "no login, two tabs" framing.

9. **Responsive & accessibility pass**
   - Verify grid layouts collapse to single/two-column on mobile widths; verify forms and buttons are touch-usable; run `npm run lint` and fix issues.

## Acceptance Criteria (inherited + refined, testable)
- [ ] `npm run dev` boots without errors; `/products` and `/classes` both render.
- [ ] Header shows "온결 공방"; nav has exactly 2 links, each navigating to a distinct route.
- [ ] `/products` renders exactly 6 product cards with image, name, craft type, description, price.
- [ ] `/classes` renders exactly 6 class cards with name, description, price, duration, capacity.
- [ ] Clicking a product's "주문 문의하기" reveals a form with name/phone/message fields and the product's name visibly referenced.
- [ ] Clicking a class's "클래스 신청" reveals a form with name/phone/message fields and the class's name visibly referenced.
- [ ] A visible practice-only disclaimer (not entering real name/phone) is present at/near every form.
- [ ] Submitting either form with phone `010-0000-0000` shows an inline failure result card after ~700ms.
- [ ] Submitting either form with any other phone value shows an inline success result card with a fake receipt/application number after ~700ms.
- [ ] No `fetch`/`XMLHttpRequest`/network calls occur during form submission (verifiable via browser devtools network tab showing no new requests).
- [ ] All product/class images are served from local `public/` assets, not remote URLs.
- [ ] Layout is usable at a mobile viewport (e.g., 375px) and a desktop viewport (e.g., 1280px) without horizontal scroll or overlapping elements.
- [ ] `npm run lint` passes with no errors.

## Risks and Mitigations
| Risk | Mitigation |
|------|------------|
| Generic `InquiryForm`/`mockSubmit` abstraction becomes awkward if products/classes forms diverge later | Spec explicitly confirms identical 3-field shape for both — low risk; if requirements change, split at that point (YAGNI) |
| Placeholder images look unpolished and undercut the "고급스러운" design goal | Use a small set of simple, consistent-style local placeholders (solid color blocks or minimal line-art SVGs in a shared palette) rather than mismatched stock-like images |
| Receipt number format perceived as too fake/unconvincing | Use a plausible-looking alphanumeric pattern (e.g., `OG-YYYYMMDD-XXXX`) generated client-side from `Date.now()` + random suffix |
| Root `/` page ambiguity (spec didn't specify home page content) | Redirect to `/products` as the simplest, most defensible default; flagged as an assumption, not a hard requirement |

## Verification Steps
1. `npm run build` (or `npm run dev`) — confirm no TypeScript/build errors.
2. `npm run lint` — confirm no lint errors.
3. Manual browser walkthrough (desktop + mobile viewport via devtools) of both routes and both forms, including the `010-0000-0000` failure path and a success path.
4. Devtools Network tab check during a form submission — confirm zero outgoing requests.
5. Visual check against Non-Goals list — confirm no login/auth UI, no payment UI, no cart UI leaked in.

## ADR

**Decision:** Build 온결 공방 as a single Next.js App Router project with two real routes (`/products`, `/classes`), one shared generic inquiry/application form and one shared mock API function, static local TS mock data (6 products + 6 classes), and local static placeholder images.

**Drivers:** network-free mock-only constraint; symmetry between the two form flows; deterministic reproducible failure path; calm/restrained Korean-modern design intent; route-based navigation per confirmed interview decision.

**Alternatives considered:** Two independent form/API implementations (Option B) — rejected as duplicative given the confirmed identical 3-field shape and shared failure/delay contract; a client-side SPA-tab-state navigation model — rejected in the interview in favor of real routes.

**Why chosen:** Option A (shared generic form + shared mock API) directly satisfies the interview-confirmed symmetry between the two domains while minimizing code, and matches the "shortest correct diff" principle without sacrificing any confirmed acceptance criterion.

**Consequences:** Slightly more prop-driven flexibility in `InquiryForm`/`mockSubmit` than two fully separate hardcoded implementations, but net less code and a single point of maintenance for the delay/failure-trigger rule. If a future (out-of-scope) requirement diverges the two flows, the shared components can be split at that time.

**Follow-ups:** None required for this scope; explicitly out of scope: real backend, real auth, real payments, cart/multi-item flows (per spec Non-Goals).
