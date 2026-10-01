const NOTICE_TEXT =
  "이 사이트는 실습용 프로토타입입니다. 입력한 정보는 저장되거나 전송되지 않으므로 실제 개인정보를 입력하지 마세요.";

interface PracticeNoticeProps {
  className?: string;
}

export default function PracticeNotice({ className = "" }: PracticeNoticeProps) {
  return (
    <div
      role="note"
      aria-label="실습용 프로토타입 안내"
      className={`flex items-start gap-3 rounded-md border border-[#B08968] bg-[#FBF8F2] px-4 py-3 text-sm leading-relaxed text-[#211F1C] ${className}`}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B08968] text-xs font-bold text-[#211F1C]"
      >
        i
      </span>
      <p>{NOTICE_TEXT}</p>
    </div>
  );
}
