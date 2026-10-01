import type { CraftClass } from "@/types";

export const craftClasses: CraftClass[] = [
  {
    id: "pottery-wheel",
    name: "도자기 물레 체험",
    description:
      "물레 위에서 흙을 직접 빚어 나만의 찻잔이나 그릇을 만들어 봅니다. 완성작은 초벌·재벌 후 약 3주 뒤 받아 보실 수 있습니다.",
    price: 65000,
    durationMinutes: 120,
    capacity: 6,
    imageSrc: "/images/classes/pottery-wheel.svg",
    imageAlt: "물레 위에서 두 손으로 흙을 감싸 그릇 모양을 빚고 있는 장면",
  },
  {
    id: "bojagi-wrapping",
    name: "보자기 만들기",
    description:
      "고운 천 조각을 이어 붙이는 조각보 기법으로 작은 보자기 한 장을 완성합니다. 바느질이 처음이어도 차근차근 따라 할 수 있습니다.",
    price: 48000,
    durationMinutes: 90,
    capacity: 8,
    imageSrc: "/images/classes/bojagi-wrapping.svg",
    imageAlt: "색이 다른 천 조각을 이어 붙인 조각보와 바늘, 실이 놓인 작업대",
  },
  {
    id: "woodcraft-tray",
    name: "목공예 소품 만들기",
    description:
      "원목을 다듬고 사포질해 생활 속에서 쓰는 작은 차 받침과 쟁반을 만듭니다. 마지막에 천연 오일로 마감해 나뭇결을 살립니다.",
    price: 72000,
    durationMinutes: 150,
    capacity: 5,
    imageSrc: "/images/classes/woodcraft-tray.svg",
    imageAlt: "원목 쟁반 옆에 끌과 사포, 나무망치가 가지런히 놓인 목공 작업대",
  },
];
