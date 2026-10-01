# Deep Interview Spec: 온결 공방 (Onkyeol Gongbang) — Korean Craft Studio Prototype

## Metadata
- Interview ID: onkyeol-gongbang-001
- Rounds: 8
- Final Ambiguity Score: 20%
- Type: greenfield (fresh Next.js scaffold, no existing product code)
- Generated: 2026-09-30
- Threshold: 0.2
- Threshold Source: default
- Initial Context Summarized: no
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.80 | 40% | 0.32 |
| Constraint Clarity | 0.80 | 30% | 0.24 |
| Success Criteria | 0.80 | 30% | 0.24 |
| **Total Clarity** | | | **0.80** |
| **Ambiguity** | | | **0.20** |

## Topology
| Component | Status | Description | Coverage Note |
|-----------|--------|-------------|----------------|
| 공예품 전시·주문 탭 | active | 상품 목록(도자기/나전칠기/보자기/목공예) + 주문 문의 폼 | Fields, quantity model, route confirmed |
| 공방 클래스 탭 | active | 클래스 목록(체험 강습) + 신청 폼 | Fields, route confirmed |
| Mock API 레이어 | active | src/lib/mock-api.ts 공유 지연/성공/실패 로직 | Result-display UX, failure trigger confirmed |
| 전역 셸 & 디자인 시스템 | active | 상단 2탭 내비게이션, 반응형 레이아웃, 실습 안내 배너, 톤앤매너 | Routing, image sourcing confirmed; exact palette left to execution |

No components were deferred.

## Goal
Build "온결 공방" — a login-free, database-free Next.js (App Router) + TypeScript + Tailwind CSS frontend **prototype** promoting Korean traditional crafts. The site has exactly two top-level routes/tabs:

1. **`/products` — 공예품 전시·주문**: browse Korean craft products (pottery, mother-of-pearl lacquerware, bojagi wrapping cloth, woodcraft, etc.) and submit a per-product order inquiry via a mock-only form.
2. **`/classes` — 공방 클래스**: browse hands-on workshop classes (pottery-making, bojagi-making, etc.) and submit a class application via a mock-only form.

All data is static TypeScript mock data; all form submissions resolve through a shared, fake async API in `src/lib/mock-api.ts` — no real network calls, no persistence, no auth, no payment.

## Constraints
- No user accounts, login, database, real payment, or external API/network calls of any kind (including no remote image URLs — images are locally bundled static placeholders).
- `src/lib/mock-api.ts` functions are async, resolve after ~700ms, and return a fake success or fake failure — never touching the network or disk.
- Success responses include a fake receipt/application number and a completion message.
- Failure is deterministically reproducible: submitting the exact phone number `010-0000-0000` triggers a mock error response (for repeatable failure-path testing). Any other phone value succeeds.
- Order inquiry is scoped to **one product per inquiry** (no cart/multi-item bundling); class application is similarly scoped to one class per submission.
- Order inquiry form fields: 이름 (name), 연락처 (phone), 문의 내용 (message) — three fields only, no quantity/date fields.
- Class application form fields: 이름 (name), 연락처 (phone), 문의 내용 (message) — same three-field shape as the order form, no separate date/headcount fields (schedule/capacity are informational display fields on the class card only, not form inputs).
- A visible practice-only disclaimer must appear near/above every form (and/or globally near the top of the site), instructing users not to enter their real name or real phone number.
- Mock data volume: **6 products total** (distributed across the 4 craft categories: pottery, mother-of-pearl lacquerware, bojagi, woodcraft) and **6 classes total**.
- Two top-level tabs are implemented as separate Next.js App Router routes (`/products`, `/classes`), not client-side state-only tab switching.
- Design: calm, refined, modern reinterpretation of Korean traditional craft aesthetics — not flashy, not overloaded with traditional patterns/motifs.
- Fully responsive: usable on both desktop and mobile.

## Non-Goals
- No sign-up/login/authentication of any kind.
- No database or persistent storage (client or server).
- No real payment/checkout flow.
- No external API integrations (including no remote-hosted images).
- No cart or multi-item order/application bundling.
- No collection or validation of genuinely real personal data — the practice disclaimer explicitly discourages entering real name/phone.

## Acceptance Criteria
- [ ] Site name "온결 공방" appears in the header/branding.
- [ ] Top navigation shows exactly 2 tabs, linking to `/products` and `/classes` as real Next.js routes.
- [ ] `/products` lists mock craft products; each product card shows image, name, craft type/category, short description, and price.
- [ ] Clicking "주문 문의하기" on a product opens an order inquiry form scoped to that single product (product identity carried into the form, e.g., pre-filled/displayed product name).
- [ ] Order inquiry form collects exactly: name, phone, message — with visible practice-only guidance not to enter real name/phone.
- [ ] `/classes` lists mock workshop classes; each class card shows name, description, price, duration, and capacity.
- [ ] Clicking "클래스 신청" on a class opens an application form scoped to that single class, with the same three-field shape (name, phone, message).
- [ ] Both forms submit through shared async functions in `src/lib/mock-api.ts` that resolve after ~700ms with either a fake success (receipt/application number + completion message) or fake failure.
- [ ] Submitting phone `010-0000-0000` on either form deterministically returns the mock failure response; any other phone value returns mock success.
- [ ] On submission, the form area is replaced by an inline result card showing the outcome (success: receipt number + message; failure: error message), with a way to dismiss/retry.
- [ ] Product and class mock data live in TypeScript files (not JSON fetched over network, not a CMS).
- [ ] No network requests are made for form submission or product/class images (images are local static assets).
- [ ] Layout and all interactive elements are usable on both mobile viewport widths and desktop widths.
- [ ] Visual design reads as calm/refined Korean-craft-inspired, avoiding gaudy colors or overused traditional motifs.

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| Product/class images could use external stock photo URLs | Would that violate the "no external network requests" constraint for a prototype? | Resolved: use locally bundled static placeholder images only |
| Order inquiry might need a cart-like multi-item flow | Is per-product inquiry sufficient, or do users need to bundle multiple items? | Resolved: one product per inquiry, no cart |
| Two tabs might be pure client-side state (SPA-style) rather than routes | Does "정확히 2개의 주요 탭" imply URL routes or in-page state? | Resolved: separate Next.js routes `/products` and `/classes` |
| Result of mock submission could be a modal/dialog | Where should success/failure appear? | Resolved: inline result card replacing the form, not a modal |
| Mock data volume was unspecified | How many products/classes are enough for a believable prototype without over-building? | Resolved: 6 products total (across 4 categories) + 6 classes total |
| Class application might need date/headcount inputs | Should the form capture desired class date or number of attendees? | Resolved: same 3-field shape as order form (name, phone, message); schedule/capacity remain display-only info on the class card |

## Technical Context
- Framework: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4 — already scaffolded in the repo (`src/app/layout.tsx`, `src/app/page.tsx`, default boilerplate only, no product code yet).
- Repo has no git history at time of interview (not a git repository); no prior `.omc/specs` or `.omc/plans` artifacts existed before this interview.
- Package manager/tooling: npm (package-lock.json present), ESLint 9 configured, no test framework currently configured.

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|----------------|
| Product (공예품) | core domain | image, name, craftType, description, price | Product has one craftType category; Product is target of one OrderInquiry |
| CraftType (공예 종류) | supporting | name (도자기/나전칠기/보자기/목공예) | CraftType groups many Products |
| OrderInquiry (주문 문의) | core domain | name, phone, message, targetProductId | OrderInquiry references exactly one Product; submitted via MockApiSubmission |
| WorkshopClass (공방 클래스) | core domain | name, description, price, duration, capacity | WorkshopClass is target of one ClassApplication |
| ClassApplication (클래스 신청) | core domain | name, phone, message, targetClassId | ClassApplication references exactly one WorkshopClass; submitted via MockApiSubmission |
| MockApiSubmission | supporting/infra | delay(~700ms), outcome(success\|failure), receiptNumber?, errorMessage? | Shared by OrderInquiry and ClassApplication; failure triggered when phone === "010-0000-0000" |

## Ontology Convergence
| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|------------------|
| 1-3 | 6 | 6 | - | - | N/A (entities named implicitly via components, not yet extracted) |
| 4-8 | 6 | 0 | 0 | 6 | 100% |

The six core entities (Product, CraftType, OrderInquiry, WorkshopClass, ClassApplication, MockApiSubmission) were stable from the initial prompt onward — the interview refined their fields and constraints rather than introducing or renaming entities, indicating the domain model was fundamentally clear from the start and the ambiguity was concentrated in implementation-scope decisions (routing, image sourcing, form fields, data volume, result UX).

## Interview Transcript
<details>
<summary>Full Q&A (8 rounds + 1 clarification)</summary>

### Round 0 — Topology confirmation
**Q:** 4개 최상위 구성요소(공예품 탭 / 클래스 탭 / Mock API / 전역 셸·디자인)로 이해했는데 맞는지 확인.
**A:** 맞습니다, 이대로 진행.

### Round 1
**Q:** 상품/클래스 카드에 쓸 이미지는 어떻게 준비할까요?
**A:** 로컬 정적 플레이스홀더 이미지.
**Ambiguity:** 31%

### Round 2
**Q:** 주문 문의 폼에는 어떤 입력 항목이 필요할까요?
**A:** 이름 + 연락처 + 문의 내용.
**Ambiguity:** 31%

### Round 3
**Q:** 클래스 신청 폼에는 이름+연락처+문의내용 외에 추가로 무엇이 필요할까요?
**A:** 이름+연락처+문의내용만, 동일한 구조.
**Ambiguity:** ~30%

### Round 4
**Q:** 상단 2개 탭은 어떻게 동작해야 할까요? (별도 라우트 vs SPA 상태전환)
**A:** 별도 라우트 (/products, /classes).
**Ambiguity:** ~28%

### Round 5
**Q:** 폼 제출 결과(접수완료/실패)는 어디에 표시할까요?
**A:** 폼을 대체하는 인라인 결과 카드.
**Ambiguity:** ~23%

### Round 6
**Q:** 주문 문의는 상품 1개 개별인가요, 장바구니식인가요?
**A:** 상품 1개당 개별 문의.
**Ambiguity:** ~23%

### Round 7
**Q:** 목업 데이터 규모는 어느 정도로 할까요?
**A:** "6개로 해줘" (free text, scope unclear — required clarification)

**Clarification Q:** 정확히 어느 범위에 6개를 적용할까요?
**A:** 상품 총 6개 + 클래스 총 6개.
**Ambiguity:** ~20%

### Round 8 (scoring confirmation)
All active components scored ≥0.8 across goal/constraints/criteria. Ambiguity = 20% ≤ threshold (20%). Interview concluded.

</details>
