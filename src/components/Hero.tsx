export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="bg-gradient-to-b from-[#F8F5EF] via-[#F3ECDF] to-[#EDE3D1]"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <p className="text-sm font-medium tracking-[0.3em] text-[#5B564C]">
          ONGYEOL CRAFT STUDIO
        </p>
        <h1
          id="hero-title"
          className="mt-5 text-3xl font-semibold leading-tight text-[#211F1C] sm:text-5xl lg:text-6xl"
        >
          손끝의 결을 잇는,
          <br />
          오늘의 전통 공예
        </h1>
        <span aria-hidden="true" className="mt-8 block h-px w-16 bg-[#B08968]" />
        <p className="mt-8 max-w-xl text-base leading-relaxed text-[#5B564C] sm:text-lg">
          온결 공방은 한지, 나전, 도자, 매듭처럼 오래 이어져 온 한국의 전통 공예를
          지금의 생활에 어울리는 모습으로 다시 빚어냅니다. 천천히 만든 물건과
          조용한 배움의 시간을 소개합니다.
        </p>
      </div>
    </section>
  );
}
