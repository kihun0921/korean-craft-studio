import type { RefObject } from "react";
import type { MockApiResult } from "@/types";

interface OrderResultCardProps {
  result: MockApiResult;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onClose: () => void;
}

const primaryButtonClass =
  "rounded-md bg-[#B08968] px-4 py-2.5 text-sm font-semibold text-[#211F1C] transition-colors hover:bg-[#6E4F32] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C]";
const secondaryButtonClass =
  "rounded-md border border-[#E4DCC9] bg-white px-4 py-2.5 text-sm font-semibold text-[#211F1C] transition-colors hover:bg-[#F8F5EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C]";

export default function OrderResultCard({
  result,
  headingRef,
  onRetry,
  onClose,
}: OrderResultCardProps) {
  if (result.success) {
    return (
      <div
        role="status"
        className="flex flex-col gap-4 rounded-lg border border-[#B08968] bg-[#FBF8F2] p-5"
      >
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-semibold text-[#211F1C] focus:outline-none"
        >
          주문 문의 접수 완료
        </h3>
        <p className="text-sm leading-relaxed text-[#5B564C]">
          {result.message}
        </p>
        <dl className="rounded-md border border-[#E4DCC9] bg-white px-4 py-3">
          <dt className="text-xs text-[#5B564C]">접수번호</dt>
          <dd className="mt-1 font-mono text-base font-semibold text-[#211F1C]">
            {result.receiptNumber}
          </dd>
        </dl>
        <button type="button" onClick={onClose} className={primaryButtonClass}>
          닫기
        </button>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex flex-col gap-4 rounded-lg border border-[#A23B2A] bg-[#FBF8F2] p-5"
    >
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="text-lg font-semibold text-[#A23B2A] focus:outline-none"
      >
        <span aria-hidden="true">⚠ </span>
        주문 문의 접수 실패
      </h3>
      <p className="text-sm leading-relaxed text-[#211F1C]">{result.message}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onRetry} className={primaryButtonClass}>
          다시 시도
        </button>
        <button
          type="button"
          onClick={onClose}
          className={secondaryButtonClass}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
