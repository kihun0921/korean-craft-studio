"use client";

import { useRef, useState } from "react";
import { crafts } from "@/mocks/crafts";
import type { Craft } from "@/types";
import CraftGrid from "./CraftGrid";
import OrderInquiryModal from "./OrderInquiryModal";

export default function ProductsSection() {
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [openCount, setOpenCount] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function handleInquire(craft: Craft, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setSelectedCraft(craft);
    setOpenCount((count) => count + 1);
  }

  function handleClose() {
    setSelectedCraft(null);
    triggerRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-[#211F1C]">
          공예품 전시·주문
        </h2>
        <p className="max-w-3xl leading-relaxed text-[#5B564C]">
          온결 공방은 흙과 옻, 천과 나무가 지닌 본래의 결을 존중하며 일상에
          오래 머무는 물건을 만듭니다. 장인의 손끝에서 천천히 완성된 공예품을
          둘러보고, 마음에 드는 작품이 있다면 주문 문의를 남겨 주세요.
        </p>
        <section
          aria-labelledby="products-shipping-title"
          className="rounded-lg border border-[#E4DCC9] bg-[#FBF8F2] px-5 py-4"
        >
          <h3
            id="products-shipping-title"
            className="text-sm font-semibold text-[#211F1C]"
          >
            가상 제작·배송 안내
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#5B564C]">
            <li>모든 상품은 주문 확인 후 2~3주 이내에 수작업으로 제작됩니다.</li>
            <li>제작이 끝난 상품은 안전 포장 후 전국 무료 배송됩니다.</li>
            <li>
              수공예 특성상 색감과 무늬가 사진과 조금씩 다를 수 있습니다.
            </li>
            <li>위 내용은 실습용 가상 안내이며 실제 판매·배송은 이루어지지 않습니다.</li>
          </ul>
        </section>
      </div>

      <CraftGrid crafts={crafts} onInquire={handleInquire} />

      {selectedCraft ? (
        <OrderInquiryModal
          key={openCount}
          craft={selectedCraft}
          onClose={handleClose}
        />
      ) : null}
    </div>
  );
}
