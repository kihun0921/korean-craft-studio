"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import type { CraftClass } from "@/types";
import ClassApplicationForm from "./ClassApplicationForm";
import { formatWon } from "./ClassCard";

interface ClassApplicationModalProps {
  craftClass: CraftClass;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.getClientRects().length > 0,
  );
}

export default function ClassApplicationModal({ craftClass, onClose }: ClassApplicationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `class-apply-title-${craftClass.id}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      const [first] = getFocusable(dialog);
      (first ?? dialog).focus();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = getFocusable(dialogRef.current);
    if (focusable.length === 0) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const isInside = active instanceof Node && dialogRef.current.contains(active);

    if (event.shiftKey && (active === first || !isInside || active === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !isInside)) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#211F1C]/50"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-[#E4DCC9] bg-[#FBF8F2] p-6 shadow-xl outline-none sm:rounded-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#5B564C]">클래스 신청</p>
            <h2 id={titleId} className="mt-1 text-xl font-semibold text-[#211F1C]">
              {craftClass.name}
            </h2>
            <p className="mt-1 text-sm text-[#5B564C]">
              {formatWon(craftClass.price)} · 약 {craftClass.durationMinutes}분 · 정원{" "}
              {craftClass.capacity}명
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="신청 창 닫기"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E4DCC9] text-lg text-[#211F1C] transition-colors hover:border-[#B08968] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ClassApplicationForm craftClass={craftClass} onClose={onClose} />
      </div>
    </div>,
    document.body,
  );
}
