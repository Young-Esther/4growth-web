"use client";

import { useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/** SPEC §8 — SECTION 07 CONTACT */

const WAYS = [
  {
    title: "스마트팜 도입",
    desc: "작물과 현장 환경에 맞춘 모듈 구성 및 구축 상담",
  },
  {
    title: "기술 실증",
    desc: "센서·제어·광량 관리·데이터 기반 재배기술의 현장 실증",
  },
  {
    title: "교육",
    desc: "학교·교육기관 대상 스마트농업 및 AI·데이터 교육 과정 운영",
  },
  {
    title: "지역 프로젝트",
    desc: "지자체·공공기관과의 스마트농업 사업 공동 기획",
  },
];

const INQUIRY_TYPES = [
  "스마트팜 도입",
  "기술 실증",
  "교육",
  "지역 프로젝트",
  "기타",
];

/** 성공 시 함께 노출하는 절차 표시 (SPEC §8) */
const PROCESS = ["상담 신청", "담당자 확인", "미팅", "범위 검토"];

const EMAIL = "4orgrow@gmail.com";

const FIELD_CLASS =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-caption focus:border-blue";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    // TODO(SPEC §12): Formspree endpoint 를 .env 로 주입 (수신: 4orgrow@gmail.com)
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
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <section id="contact" className="section-4g scroll-mt-[72px]">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>05 — Contact</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            어떤 방식으로 함께할 수 있나요?
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
          {/* 좌: 협업 방식 4개 */}
          <FadeIn>
            <ul className="space-y-7">
              {WAYS.map((w) => (
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
              {/* 스팸 방지 honeypot — Formspree 규약상 필드명은 _gotcha */}
              <div
                className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
                aria-hidden
              >
                <label htmlFor="_gotcha">이 항목은 비워 두세요</label>
                <input id="_gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="inquiry-type" className="mb-2 block text-sm font-bold">
                    문의 유형 <span className="text-blue">*</span>
                  </label>
                  <select
                    id="inquiry-type"
                    name="문의 유형"
                    required
                    defaultValue=""
                    className={FIELD_CLASS}
                  >
                    <option value="" disabled>
                      선택해 주세요
                    </option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-bold">
                      이름 <span className="text-blue">*</span>
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
                      소속/회사
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
                      이메일 <span className="text-blue">*</span>
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
                      연락처
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
                    문의 내용 <span className="text-blue">*</span>
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
                    개인정보 수집·이용 동의 <span className="text-blue">*</span>
                    <span className="mt-1 block text-caption">
                      문의 응대 목적으로만 이용하며, 응대 완료 후 파기합니다.
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-blue px-7 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "전송 중…" : "상담 신청"}
              </button>

              <div aria-live="polite" className="mt-4 empty:mt-0">
                {status === "success" && (
                  <div className="rounded-lg border border-blue/30 bg-blue/[0.06] p-4">
                    <p className="text-sm font-bold text-blue">
                      접수되었습니다. 담당자 확인 후 연락드리겠습니다.
                    </p>
                    <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                      {PROCESS.map((step, i) => (
                        <li key={step} className="flex items-center gap-2 text-xs text-ink/70">
                          {step}
                          {i < PROCESS.length - 1 && (
                            <span aria-hidden className="text-caption">
                              →
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {status === "error" && (
                  // SPEC에 실패 문구 규정이 없어 대안 연락 경로를 안내한다.
                  <p className="rounded-lg border border-line bg-white p-4 text-sm text-ink/80">
                    전송에 실패했습니다. 잠시 후 다시 시도하시거나 {EMAIL} 으로 직접 보내 주세요.
                  </p>
                )}
              </div>

              {/* 폼이 안 될 때의 대안 (SPEC §8) */}
              <p className="mt-5 text-sm text-caption">
                이메일로 문의:{" "}
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
