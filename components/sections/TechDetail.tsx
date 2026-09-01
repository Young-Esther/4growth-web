import type { ReactNode } from "react";
import AssetSlot from "@/components/ui/AssetSlot";
import FadeIn from "@/components/ui/FadeIn";
import StatusPill from "@/components/ui/StatusPill";
import DLightGraph from "@/components/diagrams/DLightGraph";

/** SPEC §4 — SECTION 03. 3카드 세로 배치, 카드마다 좌우 반전. 모바일은 텍스트 → 이미지. */

type CardProps = {
  id: string;
  label: string;
  headline: string;
  body: string;
  pills?: ReactNode;
  extra?: ReactNode;
  visual: ReactNode;
  /** true 면 이미지가 왼쪽 (데스크톱만) */
  reversed?: boolean;
};

function TechCard({
  id,
  label,
  headline,
  body,
  pills,
  extra,
  visual,
  reversed = false,
}: CardProps) {
  return (
    <article id={id} className="scroll-mt-[88px] border-t border-line py-14 md:py-20">
      <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-14">
        <FadeIn className={reversed ? "md:order-2" : undefined}>
          <p className="label-en mb-4 text-blue">{label}</p>
          <h3 className="text-[22px] font-bold leading-snug md:text-[32px]">{headline}</h3>
          <p className="mt-5 text-[15px] leading-[1.75] text-ink/80">{body}</p>
          {pills && <div className="mt-6 flex flex-wrap gap-2">{pills}</div>}
          {extra}
        </FadeIn>

        <FadeIn delay={120} className={reversed ? "md:order-1" : undefined}>
          {visual}
        </FadeIn>
      </div>
    </article>
  );
}

const A_POINTS = [
  { no: "01", title: "모듈형 구조", desc: "현장 조립·해체, 이설 가능" },
  { no: "02", title: "단계적 확장", desc: "모듈 단위로 규모 조정" },
  { no: "03", title: "통합 제어", desc: "센서·제어부 내장" },
  { no: "04", title: "반개방형 설계", desc: "자연광 활용, 밀폐형 대비 에너지 절감" },
];

/** SPEC §4 (03-B) — 좌측 플로우를 캡션 5줄로 축약 */
const DLIGHT_FLOW = [
  "자연광 유입",
  "센서 측정",
  "누적 DLI 산출",
  "목표와 비교",
  "부족분만 LED 출력",
];

const FARM_OS_FEATURES = [
  "환경 모니터링 (온습도 · CO₂ · 광량)",
  "DLI 누적 및 광량 관리",
  "장치 제어",
  "재배 이력 및 생육 데이터 관리",
  "재배 리포트 자동 생성",
];

const DATA_FLOW = ["FARM", "SENSOR", "DATA", "AI", "CONTROL"];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className="mt-[3px] h-4 w-4 shrink-0 fill-none stroke-blue"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="10" r="8.5" className="stroke-blue/40" />
      <path d="M6 10.2 L8.8 13 L14 7.6" />
    </svg>
  );
}

export default function TechDetail() {
  return (
    <section className="container-4g pb-4">
      {/* 03-A. A-Block */}
      <TechCard
        id="a-block"
        label="A-Block — Modular Growing Space"
        headline="필요한 만큼 짓고, 필요한 곳으로 옮깁니다."
        body="A-Block은 알루미늄 프로파일 프레임과 폴리카보네이트 패널로 구성된 반개방형 모듈 재배 유닛입니다. 현장에서 조립·해체할 수 있고, 규모에 따라 모듈 단위로 확장됩니다. 센서와 제어부가 모듈 안에 통합되어 있어 별도의 설비 공사 없이 재배 환경을 관리할 수 있습니다."
        pills={<StatusPill>개발 중 · 시제품 제작 단계</StatusPill>}
        extra={
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {A_POINTS.map((p) => (
              <li key={p.no}>
                <p className="label-en text-caption">{p.no}</p>
                <p className="mt-1.5 text-[15px] font-bold">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-caption">{p.desc}</p>
              </li>
            ))}
          </ul>
        }
        visual={
          <div className="space-y-4">
            <AssetSlot id="I-03" className="aspect-[4/3] w-full rounded-2xl" />
            <AssetSlot id="I-04" className="aspect-[16/6] w-full rounded-2xl" />
            <p className="label-en text-center text-caption">
              1 Module → 2 Modules → 3 Modules
            </p>
          </div>
        }
      />

      {/* 03-B. DLight */}
      <TechCard
        id="dlight"
        reversed
        label="DLight — DLI-based Light Control"
        headline="식물은 빛이 계속 필요한 것이 아니라, 필요한 만큼의 빛이 필요합니다."
        body="작물마다 하루에 필요한 누적 광량(DLI)이 다릅니다. 고정 타이머 방식은 자연광이 충분한 날에도 같은 시간만큼 LED를 켭니다. DLight는 유입되는 자연광을 실시간으로 측정하고, 목표 광량에서 부족한 만큼만 LED로 보충합니다."
        pills={
          <>
            <StatusPill>개발 중 · 현장 검증 진행 중</StatusPill>
            <StatusPill tone="blue">특허 출원</StatusPill>
          </>
        }
        extra={
          <ol className="mt-8 space-y-2.5">
            {DLIGHT_FLOW.map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-sm text-ink/80">
                <span className="label-en mt-[3px] w-6 shrink-0 text-caption">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        }
        visual={
          <div className="rounded-2xl border border-line bg-surface p-4 md:p-6">
            <DLightGraph />
          </div>
        }
      />

      {/* 03-C. AI Farm OS */}
      <TechCard
        id="ai-farm-os"
        label="AI Farm OS — Data & Control"
        headline="하나의 농장을 하나의 시스템에서"
        body="센서가 수집한 환경 데이터와 재배 기록은 AI Farm OS에 모입니다. 환경 모니터링, 광량 관리, 장치 제어, 재배 이력을 한 화면에서 관리하고, 축적된 데이터를 기반으로 재배 리포트를 자동 생성합니다."
        extra={
          <ul className="mt-8 space-y-3">
            {FARM_OS_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[15px] text-ink/80">
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>
        }
        visual={
          <div className="space-y-6">
            {/* 노트북/브라우저 프레임 없이 그림자만 (SPEC §4 03-C) */}
            <AssetSlot
              id="S-01"
              className="aspect-[16/10] w-full rounded-xl shadow-[0_24px_60px_-24px_rgba(35,31,32,0.35)]"
            />
            <ol className="flex items-center justify-between gap-1 rounded-full bg-surface px-4 py-3">
              {DATA_FLOW.map((step, i) => (
                <li key={step} className="flex items-center gap-1 md:gap-2">
                  <span className="label-en text-[10px] text-ink md:text-xs">{step}</span>
                  {i < DATA_FLOW.length - 1 && (
                    <span aria-hidden className="text-caption">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        }
      />
    </section>
  );
}
