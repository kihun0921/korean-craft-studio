const wonFormatter = new Intl.NumberFormat("ko-KR");

export function formatWon(price: number): string {
  return `₩${wonFormatter.format(price)}`;
}
