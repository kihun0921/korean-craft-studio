"use client";

import { useState, type FormEvent } from "react";
import { submitClassApplication } from "@/lib/mock-api";
import type { CraftClass, MockApiResult } from "@/types";
import PracticeNotice from "@/components/PracticeNotice";
import ClassResultCard from "./ClassResultCard";

interface ClassApplicationFormProps {
  craftClass: CraftClass;
  onClose: () => void;
}

interface FormValues {
  name: string;
  phone: string;
  desiredDate: string;
  headcount: string;
  requestNote: string;
}

type FieldName = "name" | "phone" | "desiredDate" | "headcount";
type FormErrors = Partial<Record<FieldName, string>>;

const PHONE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;
const FIELD_ORDER: FieldName[] = ["name", "phone", "desiredDate", "headcount"];

function getTodayString(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function validate(values: FormValues, capacity: number, today: string): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim() === "") {
    errors.name = "이름을 입력해 주세요.";
  }

  const phone = values.phone.trim();
  if (phone === "") {
    errors.phone = "연락처를 입력해 주세요.";
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "올바른 휴대전화 번호 형식으로 입력해 주세요. (예: 010-1234-5678)";
  }

  if (values.desiredDate === "") {
    errors.desiredDate = "희망 날짜를 선택해 주세요.";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.desiredDate)) {
    errors.desiredDate = "올바른 날짜를 선택해 주세요.";
  } else if (values.desiredDate < today) {
    errors.desiredDate = "과거 날짜는 선택할 수 없습니다. 오늘 이후 날짜를 선택해 주세요.";
  }

  const headcountText = values.headcount.trim();
  const headcount = Number(headcountText);
  if (headcountText === "") {
    errors.headcount = "인원을 입력해 주세요.";
  } else if (!/^\d+$/.test(headcountText) || headcount < 1 || headcount > capacity) {
    errors.headcount = `인원은 1명 이상 ${capacity}명 이하의 정수로 입력해 주세요. (이 클래스의 정원은 ${capacity}명입니다.)`;
  }

  return errors;
}

const inputBase =
  "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#211F1C] placeholder:text-[#8A8275] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B08968] disabled:bg-[#F8F5EF]";

export default function ClassApplicationForm({ craftClass, onClose }: ClassApplicationFormProps) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    phone: "",
    desiredDate: "",
    headcount: "1",
    requestNote: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<MockApiResult | null>(null);

  const today = getTodayString();
  const idPrefix = `class-apply-${craftClass.id}`;
  const fieldId = (field: keyof FormValues | "class") => `${idPrefix}-${field}`;
  const errorId = (field: FieldName) => `${idPrefix}-${field}-error`;

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field !== "requestNote" && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate(values, craftClass.capacity, getTodayString());
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitClassApplication({
        name: values.name.trim(),
        phone: values.phone.trim(),
        classId: craftClass.id,
        desiredDate: values.desiredDate,
        headcount: Number(values.headcount.trim()),
        requestNote: values.requestNote.trim(),
      });
      setResult(response);
    } catch {
      setResult({
        success: false,
        message: "일시적인 오류로 신청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    requestAnimationFrame(() => {
      document.getElementById(fieldId("name"))?.focus();
    });
  };

  if (result) {
    return (
      <ClassResultCard
        result={result}
        classTitle={craftClass.name}
        onRetry={handleRetry}
        onClose={onClose}
      />
    );
  }

  const describedBy = (field: FieldName, hintId?: string) => {
    const ids = [hintId, errors[field] ? errorId(field) : undefined].filter(Boolean);
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  const borderFor = (field: FieldName) =>
    errors[field] ? "border-[#9B2C2C]" : "border-[#E4DCC9]";

  const renderError = (field: FieldName) =>
    errors[field] ? (
      <p id={errorId(field)} className="mt-2 text-sm font-medium text-[#9B2C2C]">
        <span aria-hidden="true">! </span>
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="space-y-6">
      <PracticeNotice />
      <form
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className="space-y-5"
      >
        <p className="text-xs text-[#5B564C]">
          <span aria-hidden="true">*</span> 표시는 필수 입력 항목입니다.
        </p>

        <div>
          <label htmlFor={fieldId("name")} className="text-sm font-semibold text-[#211F1C]">
            이름 <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            value={values.name}
            onChange={(e) => updateValue("name", e.target.value)}
            disabled={isSubmitting}
            className={`${inputBase} ${borderFor("name")}`}
          />
          {renderError("name")}
        </div>

        <div>
          <label htmlFor={fieldId("phone")} className="text-sm font-semibold text-[#211F1C]">
            연락처 <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="010-1234-5678"
            required
            aria-required="true"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("phone", `${fieldId("phone")}-hint`)}
            value={values.phone}
            onChange={(e) => updateValue("phone", e.target.value)}
            disabled={isSubmitting}
            className={`${inputBase} ${borderFor("phone")}`}
          />
          <p id={`${fieldId("phone")}-hint`} className="mt-2 text-xs text-[#5B564C]">
            휴대전화 번호를 입력해 주세요. 하이픈(-)은 생략할 수 있습니다.
          </p>
          {renderError("phone")}
        </div>

        <div>
          <label htmlFor={fieldId("class")} className="text-sm font-semibold text-[#211F1C]">
            클래스
          </label>
          <input
            id={fieldId("class")}
            name="className"
            type="text"
            readOnly
            value={craftClass.name}
            className={`${inputBase} border-[#E4DCC9] bg-[#F8F5EF]`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor={fieldId("desiredDate")}
              className="text-sm font-semibold text-[#211F1C]"
            >
              희망 날짜 <span aria-hidden="true">*</span>
            </label>
            <input
              id={fieldId("desiredDate")}
              name="desiredDate"
              type="date"
              min={today}
              required
              aria-required="true"
              aria-invalid={errors.desiredDate ? true : undefined}
              aria-describedby={describedBy("desiredDate")}
              value={values.desiredDate}
              onChange={(e) => updateValue("desiredDate", e.target.value)}
              disabled={isSubmitting}
              className={`${inputBase} ${borderFor("desiredDate")}`}
            />
            {renderError("desiredDate")}
          </div>

          <div>
            <label
              htmlFor={fieldId("headcount")}
              className="text-sm font-semibold text-[#211F1C]"
            >
              인원 <span aria-hidden="true">*</span>
            </label>
            <input
              id={fieldId("headcount")}
              name="headcount"
              type="number"
              inputMode="numeric"
              min={1}
              max={craftClass.capacity}
              step={1}
              required
              aria-required="true"
              aria-invalid={errors.headcount ? true : undefined}
              aria-describedby={describedBy("headcount", `${fieldId("headcount")}-hint`)}
              value={values.headcount}
              onChange={(e) => updateValue("headcount", e.target.value)}
              disabled={isSubmitting}
              className={`${inputBase} ${borderFor("headcount")}`}
            />
            <p id={`${fieldId("headcount")}-hint`} className="mt-2 text-xs text-[#5B564C]">
              최대 {craftClass.capacity}명까지 신청할 수 있습니다.
            </p>
            {renderError("headcount")}
          </div>
        </div>

        <div>
          <label
            htmlFor={fieldId("requestNote")}
            className="text-sm font-semibold text-[#211F1C]"
          >
            요청사항 <span className="font-normal text-[#5B564C]">(선택)</span>
          </label>
          <textarea
            id={fieldId("requestNote")}
            name="requestNote"
            rows={3}
            value={values.requestNote}
            onChange={(e) => updateValue("requestNote", e.target.value)}
            disabled={isSubmitting}
            className={`${inputBase} resize-y border-[#E4DCC9]`}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E4DCC9] bg-[#FBF8F2] px-5 py-3 text-sm font-semibold text-[#211F1C] transition-colors hover:border-[#B08968] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C]"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            className="rounded-full bg-[#B08968] px-6 py-3 text-sm font-semibold text-[#211F1C] transition-colors hover:bg-[#6E4F32] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C] disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? "신청 접수 중입니다…" : "신청하기"}
          </button>
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          {isSubmitting ? "신청을 접수하고 있습니다. 잠시만 기다려 주세요." : ""}
        </p>
      </form>
    </div>
  );
}
