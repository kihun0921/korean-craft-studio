import Image from "next/image";
import type { CraftClass } from "@/types";

interface ClassCardProps {
  craftClass: CraftClass;
  onApply: (craftClass: CraftClass, trigger: HTMLButtonElement) => void;
}

export function formatWon(price: number): string {
  return `₩${price.toLocaleString("ko-KR")}`;
}

export default function ClassCard({ craftClass, onApply }: ClassCardProps) {
  const { id, name, description, price, durationMinutes, capacity, imageSrc, imageAlt } =
    craftClass;
  const titleId = `class-card-title-${id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4DCC9] bg-[#FBF8F2]"
    >
      <div className="relative aspect-[4/3] w-full bg-[#F8F5EF]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 id={titleId} className="text-lg font-semibold text-[#211F1C]">
          {name}
        </h3>
        <p className="text-sm leading-relaxed text-[#5B564C]">{description}</p>
        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-[#E4DCC9] pt-4 text-sm">
          <div>
            <dt className="text-xs text-[#5B564C]">수강료</dt>
            <dd className="font-semibold text-[#211F1C]">{formatWon(price)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#5B564C]">소요 시간</dt>
            <dd className="font-semibold text-[#211F1C]">약 {durationMinutes}분</dd>
          </div>
          <div>
            <dt className="text-xs text-[#5B564C]">정원</dt>
            <dd className="font-semibold text-[#211F1C]">정원 {capacity}명</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={(event) => onApply(craftClass, event.currentTarget)}
          aria-label={`${name} 신청하기`}
          className="rounded-full bg-[#B08968] px-5 py-3 text-sm font-semibold text-[#211F1C] transition-colors hover:bg-[#6E4F32] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C]"
        >
          신청하기
        </button>
      </div>
    </article>
  );
}
