# 구현 계획: 온결 공방 — 한국 전통 공예 프로토타입

원본 스펙: `.omc/specs/deep-interview-onkyeol-gongbang.md` (모호성 20%, 통과)
모드: Direct plan (의사결정 우선, 아직 구현 없음)
상태: **승인 대기(pending approval)** — 아직 코드는 작성되지 않았습니다

## 범위 확정 (이전 인터뷰 결정 중 하나를 대체함)

원래 deep-interview 스펙에서는 2개 탭을 **별도 라우트**(`/products`, `/classes`)로 결정했었습니다. 이번 계획 요청에서는 **하나의 페이지** 위에 2개 상단 탭을 두는 방식을 명시적으로 요청했고, 사용자는 후속 확인에서 **단일 페이지 + 클라이언트 탭 상태전환** 방식을 선택했습니다. 아래 내용은 모두 이 결정을 반영합니다 — 라우트는 정확히 1개(`/`)이며, "공예품 전시·주문" / "공방 클래스"는 URL 라우트가 아니라 클라이언트에서 렌더링되는 탭 패널입니다. 그 외 스펙의 다른 결정들(Mock 전용, 로그인/DB/결제 없음, 상품 6개 + 클래스 6개, 이름/연락처/문의내용 폼 필드, `010-0000-0000` 실패 트리거, 로컬 정적 이미지)은 변경 없이 그대로 유지됩니다.

---

## 1. 필요한 컴포넌트

**클라이언트/서버 경계에 대한 참고:** `app/page.tsx`가 `activeTab` 상태와 문의 모달의 열림/대상 상태를 소유해야 하므로 `"use client"`가 필요합니다. App Router에서는 클라이언트 컴포넌트가 (서버 부모로부터 `children`으로 전달받은 게 아니라) 직접 import해서 렌더링하는 모든 컴포넌트가 같은 클라이언트 트리에 포함됩니다. 즉 `page.tsx` 자체가 클라이언트 컴포넌트인 이상 의미 있는 서버/클라이언트 분리는 불가능하며, 이 프로토타입은 어차피 서버 측 데이터 페칭도 하지 않습니다. 따라서 아래 컴포넌트는 전부 **클라이언트 컴포넌트**입니다. 이전 버전에서 카드 컴포넌트를 "Server (static)"로 표기했던 것은 잘못된 표기였습니다(카드가 `onClick` 핸들러를 가져야 하는데, `page.tsx` 아래 직접 중첩된 상태로는 서버 컴포넌트가 될 수 없기 때문입니다). 아래 표는 이를 바로잡은 것입니다.

| 컴포넌트 | 종류 | 역할 |
|---|---|---|
| `PracticeBanner` | Client (정적, 상태 없음) | 실습용 안내 문구, 페이지 상단 근처에 한 번 렌더링 |
| `TabNav` | Client | 상단 2개 탭 렌더링, 활성 탭 상태 보유/전달, 패널 전환 |
| `ProductsPanel` | Client | "공예품 전시·주문" 탭의 상품 그리드 렌더링 |
| `ClassesPanel` | Client | "공방 클래스" 탭의 클래스 그리드 렌더링 |
| `ProductCard` | Client | 상품 1개 표시(이미지, 이름, 공예 종류, 설명, 가격) + "주문 문의하기" 버튼 (`onClick` → `onRequestInquiry`) |
| `ClassCard` | Client | 클래스 1개 표시(이름, 설명, 가격, 소요시간, 정원) + "클래스 신청" 버튼 (`onClick` → `onRequestInquiry`) |
| `InquiryModal` | Client | 두 플로우가 공유하는 접근성 모달(다이얼로그), props로 `subjectType`("product" | "class"), `subjectName`, `subjectId`를 받음 |
| `InquiryForm` | Client | 3개 필드(이름, 연락처, 문의내용) 폼 + 제출 처리, `InquiryModal` 내부에 위치 |
| `ResultCard` | Client | 성공(접수번호+메시지) 또는 실패(오류 메시지)를 폼 자리 대신 렌더링, 같은 모달 내부 |

**컴포넌트 트리(개념도):**
```
app/page.tsx
 └─ PracticeBanner
 └─ TabNav (active tab: "products" | "classes")
     ├─ ProductsPanel
     │    └─ ProductCard[] → onClick 시 InquiryModal(subjectType="product") 오픈
     └─ ClassesPanel
          └─ ClassCard[] → onClick 시 InquiryModal(subjectType="class") 오픈
 └─ InquiryModal (한 번만 마운트, 공유 open/subject 상태로 제어)
     └─ InquiryForm  ⇄  ResultCard (제출 상태에 따라 둘 중 하나만 렌더링)
```

## 2. 데이터 구조

`src/lib/types.ts`:
```ts
export type CraftType = "도자기" | "나전칠기" | "보자기" | "목공예";

export interface Product {
  id: string;
  name: string;
  craftType: CraftType;
  description: string;
  price: number;
  imageSrc: string; // public 하위 로컬 경로
}

export interface WorkshopClass {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  capacity: number;
  imageSrc: string;
}

export type InquirySubjectType = "product" | "class";

export interface InquiryPayload {
  subjectType: InquirySubjectType;
  subjectId: string;
  subjectName: string;
  name: string;
  phone: string;
  message: string;
}

export type MockResult =
  | { success: true; receiptNumber: string; message: string }
  | { success: false; message: string };
```

목업 데이터: `src/data/products.ts`는 `products: Product[]`를 export (4개 `CraftType`에 걸쳐 총 6개 항목). `src/data/classes.ts`는 `classes: WorkshopClass[]`를 export (총 6개 항목).

## 3. 파일 구조

```
src/
  app/
    layout.tsx              # 루트 레이아웃, globals.css import, 메타데이터(사이트명) 설정
    page.tsx                # 단일 페이지: PracticeBanner + TabNav + 패널들 + InquiryModal 렌더링
    globals.css              # Tailwind 베이스 + 디자인 토큰(팔레트용 CSS 커스텀 프로퍼티)
  components/
    layout/
      PracticeBanner.tsx
      TabNav.tsx
    products/
      ProductsPanel.tsx
      ProductCard.tsx
    classes/
      ClassesPanel.tsx
      ClassCard.tsx
    inquiry/
      InquiryModal.tsx
      InquiryForm.tsx
      ResultCard.tsx
  data/
    products.ts
    classes.ts
  lib/
    types.ts
    mock-api.ts             # submitInquiry(payload): Promise<MockResult>
    format.ts                # 가격(₩) 포맷, 소요시간 포맷 등 작은 헬퍼
public/
  images/
    products/*.svg (또는 .png) # 로컬 플레이스홀더 이미지 6장
    classes/*.svg
```

## 4. 각 컴포넌트의 책임

- **`page.tsx`**: `"use client"` (상태 보유, §1 경계 설명 참고); 최상위 `activeTab` 상태와 `InquiryModal`의 open/subject 상태를 소유; 나머지 컴포넌트들을 조합만 함, props/콜백 연결 외의 비즈니스 로직은 없음.
- **`TabNav`**: 순수 표시 + `onTabChange` 콜백; ARIA 탭 역할(§8 참고) 담당; 데이터 페칭 없음.
- **`ProductsPanel` / `ClassesPanel`**: 목업 데이터 배열을 `ProductCard`/`ClassCard`에 매핑; `page.tsx`로부터 `onRequestInquiry(subject)` 콜백을 전달받음(자체 모달 상태 없음).
- **`ProductCard` / `ClassCard`**: 순수 표시 + `onRequestInquiry`를 호출하는 버튼 1개; 상태 없음.
- **`InquiryModal`**: 포커스 트랩/다이얼로그 시맨틱(§8 참고) 담당, 로컬 `status: "idle" | "submitting" | "success" | "error"` 상태머신에 따라 `InquiryForm` 또는 `ResultCard`를 렌더링; "닫기"/"다시 시도" 동작 담당.
- **`InquiryForm`**: 필드 상태(`name`, `phone`, `message`)와 클라이언트 측 필수값 검증 담당; 제출 시 `mock-api.ts`의 `submitInquiry()`를 호출하고 결과를 콜백으로 상위에 전달(모달 내부 구조는 알 필요 없음).
- **`ResultCard`**: `MockResult`를 순수하게 표시, "닫기"/"다시 시도" 버튼 포함.
- **`mock-api.ts`**: `submitInquiry(payload: InquiryPayload): Promise<MockResult>` 하나만 export — 700ms 지연과 `010-0000-0000` 실패 규칙을 아는 유일한 곳. 어떤 컴포넌트도 이 로직을 다시 구현하지 않음.
- **`data/products.ts`, `data/classes.ts`**: 순수 데이터, 로직 없음.

## 5. 구현 순서

1. `src/lib/types.ts` — 공유 타입 (아직 의존하는 곳 없음, 가장 먼저 안전하게 진행 가능).
2. `src/data/products.ts`, `src/data/classes.ts` — 목업 데이터 (타입에 의존).
3. `public/images/**`의 플레이스홀더 이미지 (2단계와 병렬 진행 가능).
4. `src/lib/mock-api.ts` — 목업 제출 로직 (타입에만 의존).
5. `src/lib/format.ts` — 포맷 헬퍼 (타입 외 의존성 없음).
6. `src/components/products/ProductCard.tsx`, `src/components/classes/ClassCard.tsx` — 타입 + 포맷 헬퍼에 의존.
7. `src/components/products/ProductsPanel.tsx`, `src/components/classes/ClassesPanel.tsx` — 카드 + 데이터에 의존.
8. `src/components/inquiry/InquiryForm.tsx`, `ResultCard.tsx`, `InquiryModal.tsx` — 타입 + mock-api에 의존.
9. `src/components/layout/TabNav.tsx`, `PracticeBanner.tsx` — 타입/스타일 외 의존성 없음.
10. `src/app/page.tsx` — 전체를 연결(가장 마지막, 위 전부에 의존).
11. `src/app/layout.tsx`, `globals.css` — 사이트 메타데이터 + 디자인 토큰/팔레트 (일찍 병렬로 시작 가능, `page.tsx`와 함께 마지막에 마무리).
12. 반응형 점검 + `npm run lint` + `npm run build` (최종 게이트, §10 참고).

## 6. 검증 방법

- **타입/빌드 확인**: `npm run build`가 TypeScript 오류 0건으로 완료되어야 함.
- **린트 확인**: `npm run lint`가 오류 0건으로 완료되어야 함.
- **수동 브라우저 점검**(dev 서버): 두 탭 패널이 각각 6개 항목을 렌더링하는지, 상품 문의와 클래스 신청이 각각 성공/실패(`010-0000-0000`) 전체 경로를 완료하는지 확인.
- **네트워크 검증**: 탭 전환, 이미지 로드, 폼 제출 중 브라우저 devtools의 Network 탭에 외부 요청이 전혀 없어야 함(모두 로컬).
- **반응형 확인**: 약 375px(모바일)와 약 1280px(데스크톱)에서 리사이즈/에뮬레이션 — 가로 스크롤이나 요소 겹침 없이 버튼이 탭 가능해야 함.
- **접근성 점검**: 키보드만 사용한 점검 — Tab으로 탭 버튼 도달, 화살표 키(또는 Tab)로 두 탭 사이 이동, Enter/Space로 카드의 문의 버튼 활성화, 포커스가 모달 내부로 이동, Escape로 닫힘, 닫힌 후 포커스가 원래 버튼으로 복귀.

## 7. Agent별 파일 소유권과 공용 파일 통합 방법

여러 에이전트가 병렬로 실행할 경우(예: `/team`), 병합 충돌을 피하기 위해 디렉터리 단위로 엄격히 나눕니다.

| Agent | 소유(단독 쓰기) | 읽기 전용 |
|---|---|---|
| **Agent A — 데이터 & API** | `src/lib/types.ts`, `src/lib/mock-api.ts`, `src/lib/format.ts`, `src/data/products.ts`, `src/data/classes.ts`, `public/images/**` | — |
| **Agent B — 상품/클래스 UI** | `src/components/products/**`, `src/components/classes/**` | `src/lib/types.ts`, `src/data/*.ts` (Agent A가 완성할 때까지 읽기 전용) |
| **Agent C — 문의 플로우** | `src/components/inquiry/**` | `src/lib/types.ts`, `src/lib/mock-api.ts` |
| **Agent D — 셸 & 페이지 조립** | `src/components/layout/**`, `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css` | 위 전부 (통합 지점) |

**통합 규칙**: `src/lib/types.ts`는 모든 에이전트가 읽는 유일한 파일이므로, B/C가 시작하기 전에 **가장 먼저** 작성/확정되어야 합니다(에이전트 간 타입 형태가 흔들리는 것을 방지). `src/app/page.tsx`는 유일한 통합 지점이며 Agent D가 단독 소유하고, B/C의 컴포넌트를 완성된 의존성으로 가져다 쓸 뿐 공동 편집하지 않습니다. 두 에이전트가 같은 파일을 쓰는 일은 없습니다. 여러 에이전트가 공유해야 하는 상수(예: Tailwind 색상 토큰)가 있다면 Agent D가 소유한 `globals.css`/Tailwind 설정에 두고, 다른 에이전트는 클래스명만 참조할 뿐 그 파일을 직접 수정하지 않습니다.

## 8. Tab·Form·Modal 접근성 조건

**탭(`TabNav`):**
- 컨테이너는 `role="tablist"`; 각 탭 버튼은 `role="tab"`, `aria-selected`, 고유 `id`를 가짐; 각 패널은 `role="tabpanel"`과 해당 탭을 가리키는 `aria-labelledby`를 가짐.
- 활성 탭 버튼만 기본 Tab 순서에 포함(`tabIndex=0`); 비활성 탭은 `tabIndex=-1`로 두고 좌우 화살표 키로 이동(roving tabindex 패턴).
- 활성 탭 스타일은 색상만으로 구분하지 않음(밑줄/굵기 변화 등 병행) — 대비/색약 접근성 고려.

**폼(`InquiryForm`):**
- 모든 입력에 `<label>`을 연결(placeholder만 사용하지 않음).
- 필수 필드에는 `aria-required="true"`; 검증 오류는 `aria-describedby`로 인라인 오류 텍스트와 연결(색상만으로 표시하지 않음).
- 700ms 목업 지연 동안 제출 버튼이 비활성/`aria-busy="true"` 상태를 표시하여 스크린리더가 "처리 중"임을 안내.

**모달(`InquiryModal`):**
- 루트에 `role="dialog"` + `aria-modal="true"` + `aria-labelledby`(모달 제목, 예: 상품/클래스명).
- 열릴 때 첫 포커스 가능 요소로 포커스 이동, 열려 있는 동안 포커스가 모달 내부에 갇힘(Tab/Shift+Tab 순환).
- `Escape`로 닫힘; 닫힌 후 포커스는 모달을 연 버튼으로 복귀.
- 열려 있는 동안 배경 콘텐츠는 보조기술에 대해 비활성 처리(`aria-hidden` 또는 다이얼로그 프리미티브의 동등 기능).

## 9. Mock API 성공·실패 테스트 방법

- **성공 경로**: 두 폼 중 하나에 `010-0000-0000`이 아닌 연락처(예: 실습 안내를 따른 `010-1234-5678` 같은 명백한 가짜 값)를 입력해 제출. 약 700ms 후 `submitInquiry`가 `{ success: true, receiptNumber, message }`로 resolve; `ResultCard`가 접수번호와 완료 메시지를 표시.
- **실패 경로**: 두 폼 중 하나에 정확히 `010-0000-0000`을 입력해 제출. 약 700ms 후 `submitInquiry`가 `{ success: false, message }`로 resolve; `ResultCard`가 오류 메시지와 "다시 시도" 버튼을 표시하며, 이전 입력값을 유지한 채 `InquiryForm`으로 돌아감.
- **수동 테스트 매트릭스**(§6 검증 단계에서 실행): 상품-성공, 상품-실패, 클래스-성공, 클래스-실패 — 4가지 조합 각각에서 지연(~700ms, 로딩 상태로 확인 가능)과 결과 표시가 올바른지 확인.
- **현재 저장소에는 자동화 테스트 프레임워크가 없음**(스펙의 기술 컨텍스트 기준) — `submitInquiry`의 분기 로직에 대한 경량 단위 테스트가 필요하다면 별도로 테스트 러너(예: Vitest) 도입을 결정해야 하며, 요청이 없는 한 이번 계획 범위 밖입니다.

## 10. npm run lint / npm run build 통과 조건

- `npm run build`는 TypeScript 타입 오류와 Next.js 빌드 오류 없이 0으로 종료되어야 함(모든 데이터/이미지가 로컬에서 정적으로 import되므로 미해결 import도 없어야 함).
- `npm run lint`는 저장소의 기존 `eslint.config.mjs`(`eslint-config-next`) 기준 오류 없이 0으로 종료되어야 함. 설정상 허용되는 경고가 있다면 검토는 하되, 설정이 오류로 취급하지 않는 한 기본적으로 차단하지 않음.
- 근거 없는 `any` 타입 도입 금지(저장소는 이미 `tsconfig.json`을 통해 strict TS 사용 중); 새 파일 모두 기존 `strict` 설정 하에서 타입 체크를 통과해야 함.
- 사용하지 않는 import/변수 없음(`eslint-config-next` 기본 규칙으로 커버) — §1의 컴포넌트들은 실제로 사용하는 것만 import.

---

## 이번 계획에서 사용자를 대신해 내린 결정 사항 (표시만 하고 아직 재확인은 안 된 부분)

- 문의/신청 폼은 (페이지 내 인라인 확장이 아니라) **모달 다이얼로그**로 열립니다 — 요청의 8번 항목이 모달 접근성 조건을 명시적으로 물었기 때문에 모달을 전제로 판단했습니다.
- 플레이스홀더 이미지는 이번 프로젝트를 위해 생성하는 단순한 로컬 정적 자산(SVG 또는 PNG)입니다 — "차분하고 고급스러운 현대적 재해석" 외에 구체적인 화풍 지정은 없었습니다.
- 별도 테스트 프레임워크는 추가하지 않으며, `npm run lint` + `npm run build` + 수동 검증을 최종 게이트로 삼습니다 — 요청의 10번 항목과 일치합니다.

아직 구현은 시작되지 않았습니다. 이 계획은 **승인 대기** 상태입니다 — 다음에 무엇을 진행할지 알려주세요 (예: 바로 구현 시작, §7의 소유권 분담에 따라 `/team`으로 실행, 위 항목 중 일부 수정 요청 등).
