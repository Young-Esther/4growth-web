"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

/**
 * SPEC §4 — v0.1 원페이지 앵커 호환. 인쇄된 카탈로그 QR 이 `https://4growth.co.kr/#contact` 를 가리킨다.
 *
 * `/#contact` → (미들웨어) `/ko#contact` → 여기서 `/ko/contact` 로 교체.
 * 뒤로가기 기록을 남기지 않도록 replace 만 쓴다.
 *
 * 두 겹으로 처리한다.
 *  1) HTML 에 들어가는 인라인 스크립트 — 파싱 즉시 location.replace. 박람회장처럼 느린 회선에서
 *     하이드레이션을 기다리는 동안 홈 화면이 먼저 보였다가 튀는 것을 막는다.
 *  2) useEffect 의 router.replace — 인라인 스크립트가 실행되지 않은 경우(클라이언트 내비게이션 등)의 보루.
 */
const LEGACY_HASHES: Record<string, string> = {
  "#contact": "/contact",
  "#technology": "/technology",
  "#applications": "/business",
  // v0.1 기술 카드 앵커 — SPEC 목록 밖이지만 옛 링크가 있을 수 있어 함께 옮긴다.
  "#a-block": "/technology#a-block",
  "#dlight": "/technology#dlight",
  "#ai-farm-os": "/technology#farm-os",
};

/** `#field` 는 홈에 그대로 있으므로 해당 섹션으로 스크롤만 한다 (브라우저 기본 동작 + 보정). */
const STAY_HASHES = new Set(["#field"]);

export default function LegacyHashRedirect({ locale }: { locale: string }) {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const target = LEGACY_HASHES[hash];
    if (target) {
      router.replace(target);
    } else if (STAY_HASHES.has(hash)) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [router]);

  const map = Object.fromEntries(
    Object.entries(LEGACY_HASHES).map(([hash, path]) => [hash, `/${locale}${path}`]),
  );
  const script = `(function(){var m=${JSON.stringify(map)};var t=m[location.hash];if(t)location.replace(t);})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
