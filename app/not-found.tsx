import NextError from "next/error";

/** 로케일 밖에서 404 가 나면 (미들웨어를 거치지 않은 경로) Next 기본 404 화면을 쓴다. */
export default function NotFound() {
  return (
    <html lang="ko">
      <body>
        <NextError statusCode={404} />
      </body>
    </html>
  );
}
