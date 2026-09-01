import Logo from "@/components/ui/Logo";

/** SPEC §9 — FOOTER */

/**
 * COMPANY INFORMATION (카탈로그 11p 항목).
 * TODO(SPEC §0, §9): `회사명` `[확인 필요]` — 확정되면 아래 목록 맨 앞에 추가.
 * TODO(SPEC §0, §9): `소재지` `[확인 필요]` — 당진시 + 상세 주소 공개 범위 확정 후 추가.
 * TODO(SPEC §0, §9): `대표번호` `[확인 필요, 공개 여부]` — 공개하기로 하면 추가.
 * TODO(SPEC §9): SNS 링크 `[확인 필요]` — 있으면 추가, 없으면 생략.
 */
const COMPANY = [
  { label: "대표자", value: "김에스더" },
  { label: "설립", value: "2024" },
];

const EMAIL = "4orgrow@gmail.com";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-4g py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <Logo className="h-6" variant="white" />
            <p className="mt-5 text-[15px] text-white/75">
              농업의 지속가능성을 기술로 설계합니다.
            </p>
          </div>

          <div>
            <p className="label-en mb-5 text-white/50">Company Information</p>
            <dl className="space-y-2.5 text-sm">
              {COMPANY.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <dt className="w-16 shrink-0 text-white/50">{item.label}</dt>
                  <dd className="text-white/85">{item.value}</dd>
                </div>
              ))}
              <div className="flex gap-4">
                <dt className="w-16 shrink-0 text-white/50">이메일</dt>
                <dd>
                  <a
                    href={"mailto:" + EMAIL}
                    className="text-white/85 underline underline-offset-4 transition-colors hover:text-white"
                  >
                    {EMAIL}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="mt-12 border-t border-white/15 pt-6 text-xs text-white/50">
          © 2026 4growth. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
