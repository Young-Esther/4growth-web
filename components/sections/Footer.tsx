import Logo from "@/components/ui/Logo";

/** SPEC §9 — FOOTER */

/** COMPANY INFORMATION (카탈로그 11p 항목 순서 그대로). */
const COMPANY: { label: string; value: string; href?: string }[] = [
  { label: "회사명", value: "포그로우스(4growth)" },
  { label: "대표자", value: "김에스더" },
  { label: "설립", value: "2024" },
  { label: "소재지", value: "충남 당진시 합덕읍 성동로 121-31" },
  {
    label: "이메일",
    value: "4orgrow@gmail.com",
    href: "mailto:4orgrow@gmail.com",
  },
  { label: "팩스", value: "0504-427-9339" },
];

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
                  <dd className="text-white/85">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="underline underline-offset-4 transition-colors hover:text-white"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
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
