import Image from "next/image";
import type { MouseEvent } from "react";
import type { Craft } from "@/types";
import { formatWon } from "./formatPrice";

interface CraftCardProps {
  craft: Craft;
  onInquire: (craft: Craft, trigger: HTMLButtonElement) => void;
}

export default function CraftCard({ craft, onInquire }: CraftCardProps) {
  const titleId = `craft-${craft.id}-title`;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onInquire(craft, event.currentTarget);
  }

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E4DCC9] bg-[#FBF8F2]"
    >
      <div className="relative aspect-[4/3] w-full bg-[#F8F5EF]">
        <Image
          src={craft.imageSrc}
          alt={craft.imageAlt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="self-start rounded-full border border-[#B08968] px-2.5 py-0.5 text-xs font-medium text-[#5B564C]">
          {craft.craftType}
        </span>
        <h3 id={titleId} className="text-lg font-semibold text-[#211F1C]">
          {craft.name}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-[#5B564C]">
          {craft.description}
        </p>
        <p className="text-base font-semibold text-[#211F1C]">
          <span className="sr-only">가격 </span>
          {formatWon(craft.price)}
        </p>
        <button
          type="button"
          onClick={handleClick}
          aria-haspopup="dialog"
          aria-label={`${craft.name} 주문 문의하기`}
          className="mt-1 rounded-md bg-[#B08968] px-4 py-2.5 text-sm font-semibold text-[#211F1C] transition-colors hover:bg-[#6E4F32] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1C]"
        >
          주문 문의하기
        </button>
      </div>
    </article>
  );
}
