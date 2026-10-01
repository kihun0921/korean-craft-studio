import type { ClassApplication, MockApiResult, OrderInquiry } from "@/types";

const MOCK_DELAY_MS = 700;
const FAILURE_TRIGGER_PHONE = "010-0000-0000";
const PRACTICE_FAILURE_MESSAGE =
  "실습용 오류입니다. 입력하신 연락처(010-0000-0000)는 테스트 실패 트리거이므로, 실제 접수는 이루어지지 않았습니다. 다른 연락처로 다시 시도해 보세요.";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateReceiptNumber(prefix: string): string {
  const timestamp = Date.now().toString().slice(-8);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${timestamp}${randomSuffix}`;
}

export async function submitOrderInquiry(
  payload: OrderInquiry,
): Promise<MockApiResult> {
  await delay(MOCK_DELAY_MS);

  if (payload.phone === FAILURE_TRIGGER_PHONE) {
    return { success: false, message: PRACTICE_FAILURE_MESSAGE };
  }

  return {
    success: true,
    receiptNumber: generateReceiptNumber("OG-ORDER"),
    message:
      "주문 문의가 접수되었습니다. (실습용 Mock 응답이며 실제로 저장·전송되지 않습니다.)",
  };
}

export async function submitClassApplication(
  payload: ClassApplication,
): Promise<MockApiResult> {
  await delay(MOCK_DELAY_MS);

  if (payload.phone === FAILURE_TRIGGER_PHONE) {
    return { success: false, message: PRACTICE_FAILURE_MESSAGE };
  }

  return {
    success: true,
    receiptNumber: generateReceiptNumber("OG-CLASS"),
    message:
      "클래스 신청이 접수되었습니다. (실습용 Mock 응답이며 실제로 저장·전송되지 않습니다.)",
  };
}
