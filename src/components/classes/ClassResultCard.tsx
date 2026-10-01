"use client";

import { useEffect, useRef } from "react";
import type { MockApiResult } from "@/types";

interface ClassResultCardProps {
  result: MockApiResult;
  classTitle: string;
  onRetry: () => void;
  onClose: () => void;
}

export default function ClassResultCard({
  result,
  classTitle,
  onRetry,
  onClose,
}: ClassResultCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, [result]);

  const buttonBase =
    "rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C]";

  if (result.success) {
    return (
      <div
        ref={containerRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-[#E4DCC9] bg-[#F8F5EF] p-6 outline-none"
      >
        <h3 className="text-lg font-semibold text-[#211F1C]">신청이 접수되었습니다</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#5B564C]">{result.message}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <dt className="text-[#5B564C]">신청 클래스</dt>
            <dd className="font-semibold text-[#211F1C]">{classTitle}</dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="text-[#5B564C]">접수 번호</dt>
            <dd className="font-mono font-semibold text-[#211F1C]">{result.receiptNumber}</dd>
          </div>
        </dl>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`${buttonBase} bg-[#B08968] text-[#211F1C] hover:bg-[#6E4F32] hover:text-white`}
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="alert"
      className="rounded-2xl border border-[#B08968] bg-[#F8F5EF] p-6 outline-none"
    >
      <h3 className="text-lg font-semibold text-[#211F1C]">신청을 완료하지 못했습니다</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#5B564C]">{result.message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className={`${buttonBase} border border-[#E4DCC9] bg-[#FBF8F2] text-[#211F1C] hover:border-[#B08968]`}
        >
          닫기
        </button>
        <button
          type="button"
          onClick={onRetry}
          className={`${buttonBase} bg-[#B08968] text-[#211F1C] hover:bg-[#6E4F32] hover:text-white`}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
