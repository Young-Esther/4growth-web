"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import ko from "@/messages/ko.json";

/**
 * SPEC §8 (v0.1) — CONTACT. v0.2 §3-6:
 * - 협업 방식 5번째로 `차담 구매·수입` 추가
 * - 문의 유형 option value 는 로케일과 무관하게 고정
 * - `?type=chadam` 처럼 쿼리가 있으면 해당 유형을 미리 선택
 * - Formspree hidden 필드 `locale`, `_subject` = `[4growth][KO|EN|VI] {유형 한국어명}`
 */

/** 고정 option value (SPEC §3-6) — 순서가 곧 select 표시 순서 */
export const INQUIRY_TYPES = [
  "smartfarm",
  "trial",
  "education",
  "regional",
  "chadam",
  "other",
] as const;
type InquiryType = (typeof INQUIRY_TYPES)[number];

const isInquiryType = (v: string | null): v is InquiryType =>
  v !== null && (INQUIRY_TYPES as readonly string[]).includes(v);

const EMAIL = "4orgrow@gmail.com";

const FIELD_CLASS =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-caption focus:border-blue";

type Status = "idle" | "submitting" | "success" | "error";
type Way = { title: string; desc: string };

export default function Contact({ no = "01" }: { no?: string }) {
  const t = useTranslations("contact");
  const home = useTranslations("home.cta");
  const label = useTranslations("labels");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [type, setType] = useState<InquiryType | "">("");

  const ways = t.raw("ways") as Way[];

  // ?type= 프리셀렉트. 정적 페이지라 서버에서는 쿼리를 모르므로 마운트 후에 읽는다.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("type");
    if (isInquiryType(requested)) setType(requested);
  }, []);

  // 수신자가 한국어 메일함에서 언어·유형을 바로 알 수 있게 제목은 항상 한국어 유형명.
  const subject = `[4growth][${locale.toUpperCase()}] ${type ? ko.contact.types[type] : ""}`.trim();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

    if (!endpoint) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setType("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const submitting = status === "submitting";
  const requiredMark = (
    <abbr title={t("required")} className="text-blue no-underline">
      *
    </abbr>
  );

  return (
    <section id="contact" className="section-4g scroll-mt-[72px]">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>{`${no} — ${label("contact")}`}</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
          {/* 좌: 협업 방식 */}
          <FadeIn>
            <ul className="space-y-7">
              {ways.map((w) => (
                <li key={w.title} className="border-t border-line pt-5">
                  <p className="text-[17px] font-bold md:text-lg">{w.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{w.desc}</p>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* 우: 문의폼 */}
          <FadeIn delay={120}>
            <form onSubmit={handleSubmit} className="relative rounded-2xl bg-surface p-6 md:p-8">
              {/* 스팸 방지 honeypot — Formspree 규약상 필드명은 _gotcha. 화면·보조기기 모두 숨김. */}
              <div
                className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
                aria-hidden
              >
                <input id="_gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
              </div>

              {/* SPEC §3-6 — 수신 메일 제목·언어 표시 */}
              <input type="hidden" name="_subject" value={subject} />
              <input type="hidden" name="locale" value={locale} />

              <div className="space-y-5">
                <div>
                  <label htmlFor="inquiry-type" className="mb-2 block text-sm font-bold">
                    {t("typeLabel")} {requiredMark}
                  </label>
                  <select
                    id="inquiry-type"
                    name="문의 유형"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value as InquiryType)}
                    className={FIELD_CLASS}
                  >
                    <option value="" disabled>
                      {t("placeholder")}
                    </option>
                    {INQUIRY_TYPES.map((value) => (
                      <option key={value} value={value}>
                        {t(`types.${value}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-bold">
                      {t("name")} {requiredMark}
                    </label>
                    <input
                      id="name"
                      name="이름"
                      type="text"
                      required
                      autoComplete="name"
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-bold">
                      {t("organization")}
                    </label>
                    <input
                      id="company"
                      name="소속/회사"
                      type="text"
                      autoComplete="organization"
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-bold">
                      {t("email")} {requiredMark}
                    </label>
                    <input
                      id="email"
                      name="이메일"
                      type="email"
                      required
                      autoComplete="email"
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-bold">
                      {t("phone")}
                    </label>
                    <input
                      id="phone"
                      name="연락처"
                      type="tel"
                      autoComplete="tel"
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-bold">
                    {t("message")} {requiredMark}
                  </label>
                  <textarea
                    id="message"
                    name="문의 내용"
                    required
                    rows={5}
                    className={FIELD_CLASS + " resize-y"}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="privacy"
                    name="개인정보 수집·이용 동의"
                    type="checkbox"
                    required
                    value="동의"
                    className="mt-1 h-4 w-4 shrink-0 accent-blue"
                  />
                  <label htmlFor="privacy" className="text-sm leading-relaxed text-ink/80">
                    {t("privacy")} {requiredMark}
                    <span className="mt-1 block text-caption">{t("privacyNote")}</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-blue px-7 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? t("sending") : t("submit")}
              </button>

              <div aria-live="polite" className="mt-4 empty:mt-0">
                {status === "success" && (
                  <div className="rounded-lg border border-blue/30 bg-blue/[0.06] p-4">
                    <p className="text-sm font-bold text-blue">{t("success")}</p>
                    {/* 성공 시 함께 노출하는 절차 표시 (SPEC §8) */}
                    <p className="mt-3 text-xs text-ink/70">{home("process")}</p>
                  </div>
                )}
                {status === "error" && (
                  <p className="rounded-lg border border-line bg-white p-4 text-sm text-ink/80">
                    {t("error")}
                  </p>
                )}
              </div>

              {/* 폼이 안 될 때의 대안 (SPEC §8) */}
              <p className="mt-5 text-sm text-caption">
                {t("emailDirect")}:{" "}
                <a
                  href={"mailto:" + EMAIL}
                  className="font-bold text-blue underline underline-offset-4"
                >
                  {EMAIL}
                </a>
              </p>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
