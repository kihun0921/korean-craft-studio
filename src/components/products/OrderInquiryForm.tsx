import type { ChangeEvent, FormEvent, RefObject } from "react";
import type { Craft } from "@/types";

export interface OrderFormValues {
  name: string;
  phone: string;
  quantity: string;
  requestNote: string;
}

export type OrderFormErrors = Partial<
  Record<"name" | "phone" | "quantity", string>
>;

export const PHONE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 10;

export function validateOrderForm(values: OrderFormValues): OrderFormErrors {
  const errors: OrderFormErrors = {};

  if (values.name.trim() === "") {
    errors.name = "이름을 입력해 주세요.";
  }

  const phone = values.phone.trim();
  if (phone === "") {
    errors.phone = "연락처를 입력해 주세요.";
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone =
      "연락처 형식이 올바르지 않습니다. 010-1234-5678 형식의 휴대전화 번호를 입력해 주세요.";
  }

  const quantity = values.quantity.trim();
  if (quantity === "") {
    errors.quantity = "수량을 입력해 주세요.";
  } else if (!/^\d+$/.test(quantity)) {
    errors.quantity = `수량은 ${MIN_QUANTITY}에서 ${MAX_QUANTITY} 사이의 정수로 입력해 주세요.`;
  } else {
    const parsed = Number(quantity);
    if (parsed < MIN_QUANTITY || parsed > MAX_QUANTITY) {
      errors.quantity = `수량은 최소 ${MIN_QUANTITY}개, 최대 ${MAX_QUANTITY}개까지 문의할 수 있습니다.`;
    }
  }

  return errors;
}

interface OrderInquiryFormProps {
  craft: Craft;
  values: OrderFormValues;
  errors: OrderFormErrors;
  isSubmitting: boolean;
  nameInputRef: RefObject<HTMLInputElement | null>;
  onChange: (field: keyof OrderFormValues, value: string) => void;
  onSubmit: () => void;
}

const inputBaseClass =
  "w-full rounded-md border bg-white px-3 py-2 text-[#211F1C] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#B08968] disabled:bg-[#F8F5EF]";

function fieldBorder(hasError: boolean): string {
  return hasError ? "border-[#A23B2A]" : "border-[#E4DCC9]";
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-[#A23B2A]">
      <span aria-hidden="true">⚠ </span>
      {message}
    </p>
  );
}

export default function OrderInquiryForm({
  craft,
  values,
  errors,
  isSubmitting,
  nameInputRef,
  onChange,
  onSubmit,
}: OrderInquiryFormProps) {
  const idPrefix = `order-${craft.id}`;
  const ids = {
    name: `${idPrefix}-name`,
    phone: `${idPrefix}-phone`,
    product: `${idPrefix}-product`,
    quantity: `${idPrefix}-quantity`,
    requestNote: `${idPrefix}-request-note`,
  };
  const errorIds = {
    name: `${ids.name}-error`,
    phone: `${ids.phone}-error`,
    quantity: `${ids.quantity}-error`,
  };
  const hintIds = {
    phone: `${ids.phone}-hint`,
    quantity: `${ids.quantity}-hint`,
  };

  function describedBy(...candidates: (string | false | undefined)[]) {
    const value = candidates.filter(Boolean).join(" ");
    return value === "" ? undefined : value;
  }

  function handleInput(field: keyof OrderFormValues) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(field, event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
        <legend className="sr-only">{craft.name} 주문 문의 정보 입력</legend>
        <p className="text-xs text-[#5B564C]">
          <span aria-hidden="true">*</span> 표시는 필수 입력 항목입니다.
        </p>

        <div>
          <label
            htmlFor={ids.name}
            className="mb-1.5 block text-sm font-medium text-[#211F1C]"
          >
            이름 <span aria-hidden="true">*</span>
          </label>
          <input
            ref={nameInputRef}
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleInput("name")}
            aria-required="true"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy(errors.name && errorIds.name)}
            className={`${inputBaseClass} ${fieldBorder(Boolean(errors.name))}`}
          />
          <FieldError id={errorIds.name} message={errors.name} />
        </div>

        <div>
          <label
            htmlFor={ids.phone}
            className="mb-1.5 block text-sm font-medium text-[#211F1C]"
          >
            연락처 <span aria-hidden="true">*</span>
          </label>
          <input
            id={ids.phone}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="010-1234-5678"
            value={values.phone}
            onChange={handleInput("phone")}
            aria-required="true"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy(
              hintIds.phone,
              errors.phone && errorIds.phone,
            )}
            className={`${inputBaseClass} ${fieldBorder(Boolean(errors.phone))}`}
          />
          <p id={hintIds.phone} className="mt-1 text-xs text-[#5B564C]">
            휴대전화 번호를 010-1234-5678 형식으로 입력해 주세요.
          </p>
          <FieldError id={errorIds.phone} message={errors.phone} />
        </div>

        <div>
          <label
            htmlFor={ids.product}
            className="mb-1.5 block text-sm font-medium text-[#211F1C]"
          >
            상품
          </label>
          <input
            id={ids.product}
            name="product"
            type="text"
            value={craft.name}
            readOnly
            aria-readonly="true"
            className={`${inputBaseClass} border-[#E4DCC9] bg-[#F8F5EF] text-[#5B564C]`}
          />
        </div>

        <div>
          <label
            htmlFor={ids.quantity}
            className="mb-1.5 block text-sm font-medium text-[#211F1C]"
          >
            수량 <span aria-hidden="true">*</span>
          </label>
          <input
            id={ids.quantity}
            name="quantity"
            type="number"
            inputMode="numeric"
            min={MIN_QUANTITY}
            max={MAX_QUANTITY}
            step={1}
            value={values.quantity}
            onChange={handleInput("quantity")}
            aria-required="true"
            aria-invalid={errors.quantity ? true : undefined}
            aria-describedby={describedBy(
              hintIds.quantity,
              errors.quantity && errorIds.quantity,
            )}
            className={`${inputBaseClass} ${fieldBorder(Boolean(errors.quantity))} max-w-32`}
          />
          <p id={hintIds.quantity} className="mt-1 text-xs text-[#5B564C]">
            {MIN_QUANTITY}~{MAX_QUANTITY}개 사이로 입력해 주세요.
          </p>
          <FieldError id={errorIds.quantity} message={errors.quantity} />
        </div>

        <div>
          <label
            htmlFor={ids.requestNote}
            className="mb-1.5 block text-sm font-medium text-[#211F1C]"
          >
            요청사항 <span className="text-xs text-[#5B564C]">(선택)</span>
          </label>
          <textarea
            id={ids.requestNote}
            name="requestNote"
            rows={3}
            value={values.requestNote}
            onChange={handleInput("requestNote")}
            className={`${inputBaseClass} border-[#E4DCC9] resize-y`}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-md bg-[#B08968] px-4 py-2.5 text-sm font-semibold text-[#211F1C] transition-colors hover:bg-[#6E4F32] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C] disabled:cursor-wait disabled:opacity-80"
        >
          {isSubmitting ? "접수 중..." : "주문 문의 보내기"}
        </button>
        {isSubmitting ? (
          <p role="status" className="text-center text-sm text-[#5B564C]">
            주문 문의를 접수하고 있습니다. 잠시만 기다려 주세요.
          </p>
        ) : null}
      </fieldset>
    </form>
  );
}
