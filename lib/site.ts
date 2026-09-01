/**
 * 사이트 절대 URL.
 *
 * TODO(SPEC §0): 도메인 미확보. 후보 4growth.co.kr / 4growth.kr.
 *   구매·연결 후 Vercel 환경변수 NEXT_PUBLIC_SITE_URL 에 등록한다.
 *   (카탈로그 QR이 `https://{도메인}/#contact` 를 가리켜야 하므로 인쇄 전 필수)
 *
 * 미설정 시에는 Vercel 배포 URL → localhost 순으로 대체한다.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
