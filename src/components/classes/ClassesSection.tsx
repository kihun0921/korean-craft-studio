import ClassGrid from "./ClassGrid";

export default function ClassesSection() {
  return (
    <div className="space-y-10">
      <div className="max-w-2xl space-y-4">
        <h2 className="text-2xl font-semibold text-[#211F1C] sm:text-3xl">공방 클래스</h2>
        <p className="leading-relaxed text-[#5B564C]">
          온결 공방의 클래스는 손끝으로 재료의 결을 느끼며 천천히 무언가를 완성해 가는 시간입니다.
          장인과 함께 흙을 빚고, 천을 잇고, 나무를 다듬으며 일상에 오래 곁에 둘 나만의 공예품을
          만들어 보세요.
        </p>
      </div>

      <aside
        aria-labelledby="class-guide-title"
        className="rounded-2xl border border-[#E4DCC9] bg-[#FBF8F2] p-6"
      >
        <h3 id="class-guide-title" className="text-base font-semibold text-[#211F1C]">
          준비물·취소 안내 <span className="text-sm font-normal text-[#5B564C]">(실습용 가상 안내)</span>
        </h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#5B564C]">
          <li>별도 준비물은 필요 없으며, 재료와 앞치마는 공방에서 제공합니다. 편한 복장으로 참여해 주세요.</li>
          <li>수업 1일 전까지 취소 시 전액 환불되며, 당일 취소는 환불이 어렵습니다.</li>
          <li>완성작 소성·건조가 필요한 클래스는 수령까지 2~3주가 소요될 수 있습니다.</li>
        </ul>
      </aside>

      <ClassGrid />
    </div>
  );
}
