import Link from "next/link";
import Logo from "@/components/ui/Logo";

/**
 * 로케일 밖 404 (미들웨어를 거치지 않은 경로, draft 글 등).
 * COPY 에 404 문구가 없어 숫자와 로고(→ 홈)만 둔다.
 */
export default function NotFound() {
  return (
    <html lang="ko">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-8">
          <p className="text-[52px] font-bold text-blue">404</p>
          <Link href="/">
            <Logo className="h-6" />
          </Link>
        </main>
      </body>
    </html>
  );
}
