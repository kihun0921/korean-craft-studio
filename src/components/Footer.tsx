const PRACTICE_INFO: ReadonlyArray<{ term: string; detail: string }> = [
  { term: "주소", detail: "서울특별시 종로구 온결길 12, 온결 공방 (가상 주소)" },
  { term: "운영시간", detail: "평일 10:00–18:00 (가상 운영시간)" },
  { term: "문의", detail: "0000-0000 (가상 연락처, 실제로 연결되지 않습니다)" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#E4DCC9] bg-[#FBF8F2] text-[#211F1C]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-lg font-semibold tracking-[0.2em]">온결 공방</p>
        <section aria-labelledby="footer-practice-info" className="mt-6">
          <h2 id="footer-practice-info" className="text-sm font-semibold">
            실습용 가상 정보
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5B564C]">
            이 사이트는 실습용 프로토타입이며, 아래의 주소·운영시간·연락처는 모두
            실제와 무관한 가상의 정보입니다. 실제로 운영되는 공방이 아닙니다.
          </p>
          <dl className="mt-4 grid gap-2 text-sm text-[#5B564C] sm:grid-cols-[auto_1fr] sm:gap-x-6">
            {PRACTICE_INFO.map((item) => (
              <div key={item.term} className="contents">
                <dt className="font-medium text-[#211F1C]">{item.term}</dt>
                <dd className="mb-2 sm:mb-0">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </section>
        <p className="mt-8 border-t border-[#E4DCC9] pt-6 text-xs text-[#5B564C]">
          © 온결 공방 실습 프로토타입. 상업적 목적이 없는 학습용 페이지입니다.
        </p>
      </div>
    </footer>
  );
}
