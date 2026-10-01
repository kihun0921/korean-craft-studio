"use client";

import { useEffect, useRef, useState } from "react";
import PracticeNotice from "@/components/PracticeNotice";
import { submitOrderInquiry } from "@/lib/mock-api";
import type { Craft, MockApiResult } from "@/types";
import { formatWon } from "./formatPrice";
import OrderInquiryForm, {
  validateOrderForm,
  type OrderFormErrors,
  type OrderFormValues,
} from "./OrderInquiryForm";
import OrderResultCard from "./OrderResultCard";

interface OrderInquiryModalProps {
  craft: Craft;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const INITIAL_VALUES: OrderFormValues = {
  name: "",
  phone: "",
  quantity: "1",
  requestNote: "",
};

const FIELD_ORDER = ["name", "phone", "quantity"] as const;

export default function OrderInquiryModal({
  craft,
  onClose,
}: OrderInquiryModalProps) {
  const [values, setValues] = useState<OrderFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<MockApiResult | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const onCloseRef = useRef(onClose);
  const isMountedRef = useRef(true);

  const titleId = `order-dialog-${craft.id}-title`;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Initial focus, body scroll lock, and document-level Escape / focus trap.
  useEffect(() => {
    isMountedRef.current = true;
    nameInputRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const focusInside = active instanceof Node && dialog.contains(active);

      if (event.shiftKey) {
        if (!focusInside || active === first || active === dialog) {
          event.preventDefault();
          last.focus();
        }
      } else if (!focusInside || active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      isMountedRef.current = false;
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Move focus to the result heading when a result is shown.
  useEffect(() => {
    if (result) {
      resultHeadingRef.current?.focus();
    }
  }, [result]);

  function handleChange(field: keyof OrderFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof OrderFormErrors];
        return next;
      });
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    const nextErrors = validateOrderForm(values);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      const input = dialogRef.current?.querySelector<HTMLInputElement>(
        `[name="${firstInvalid}"]`,
      );
      input?.focus();
      return;
    }

    setIsSubmitting(true);
    // Keep focus inside the dialog while the form is disabled.
    dialogRef.current?.focus();

    const response = await submitOrderInquiry({
      name: values.name.trim(),
      phone: values.phone.trim(),
      craftId: craft.id,
      quantity: Number(values.quantity.trim()),
      requestNote: values.requestNote.trim(),
    });

    if (!isMountedRef.current) return;
    setIsSubmitting(false);
    setResult(response);
  }

  function handleRetry() {
    setResult(null);
    // Wait for the form to re-render before moving focus back into it.
    requestAnimationFrame(() => nameInputRef.current?.focus());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[#211F1C]/50"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-xl border border-[#E4DCC9] bg-[#F8F5EF] shadow-xl focus:outline-none sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E4DCC9] px-6 py-4">
          <div>
            <p className="text-xs font-medium text-[#5B564C]">주문 문의</p>
            <h2 id={titleId} className="mt-0.5 text-lg font-semibold text-[#211F1C]">
              {craft.name}
            </h2>
            <p className="mt-0.5 text-sm text-[#5B564C]">
              {craft.craftType} · {formatWon(craft.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="주문 문의 창 닫기"
            className="-mr-2 rounded-md px-2 py-1 text-2xl leading-none text-[#5B564C] hover:bg-[#FBF8F2] hover:text-[#211F1C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          <PracticeNotice />
          {result ? (
            <OrderResultCard
              result={result}
              headingRef={resultHeadingRef}
              onRetry={handleRetry}
              onClose={onClose}
            />
          ) : (
            <OrderInquiryForm
              craft={craft}
              values={values}
              errors={errors}
              isSubmitting={isSubmitting}
              nameInputRef={nameInputRef}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
