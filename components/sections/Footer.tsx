import { useTranslations } from "next-intl";
import Logo from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";

/** SPEC §9 (v0.1) — FOOTER. v0.2 §3-7: 라벨 번역 + 메뉴 링크 4개 한 줄. */

const NAV = [
  { key: "technology", href: "/technology" },
  { key: "business", href: "/business" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
] as const;

const EMAIL = "4orgrow@gmail.com";

type CompanyItem = { label: string; value: string };

export default function Footer() {
  const t = useTranslations("footer");
  const common = useTranslations("common");
  const label = useTranslations("labels");
  /** COMPANY INFORMATION (카탈로그 11p 항목 순서 그대로). */
  const company = t.raw("company") as CompanyItem[];

  return (
    <footer className="bg-ink text-white">
      <div className="container-4g py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <Logo className="h-6" variant="white" />
            <p className="mt-5 text-[15px] text-white/75">{t("tagline")}</p>
            <nav className="mt-8">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/75 transition-colors hover:text-white"
                    >
                      {common(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <p className="label-en mb-5 text-white/50">{label("companyInfo")}</p>
            <dl className="space-y-2.5 text-sm">
              {company.map((item) => (
                <div key={item.label} className="flex gap-4">
                  {/* en/vi 라벨(Founded, Thành lập 등)이 길어 폭을 조금 넓힌다 */}
                  <dt className="w-20 shrink-0 text-white/50">{item.label}</dt>
                  <dd className="text-white/85">
                    {item.value === EMAIL ? (
                      <a
                        href={`mailto:${EMAIL}`}
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
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
