import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * SPEC §1 — `/` 접속 시 NEXT_LOCALE 쿠키 → Accept-Language → ko 순으로 로케일을 정해 보낸다.
 * 리다이렉트 응답에는 해시가 실리지 않지만, 브라우저가 원래 URL의 해시(#contact)를
 * 이동한 주소에 그대로 붙인다. 이후 처리는 LegacyHashRedirect (SPEC §4).
 */
export default createMiddleware(routing);

export const config = {
  // API·Next 내부 경로·확장자가 있는 파일(sitemap.xml, robots.txt, 이미지 등)은 제외
  matcher: ["/((?!api|_next|_vercel|.*\..*).*)"],
};
