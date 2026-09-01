/**
 * 사이트 절대 URL. 도메인 확정 (2026-09-02).
 *
 * 배포 환경에서 다른 URL을 쓰려면 NEXT_PUBLIC_SITE_URL 로 덮어쓴다.
 * (카탈로그 QR은 `https://4growth.co.kr/#contact` 를 가리킨다)
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://4growth.co.kr";
