import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import AssetSlot from "@/components/ui/AssetSlot";
import FadeIn from "@/components/ui/FadeIn";
import StatusPill from "@/components/ui/StatusPill";
import DLightGraph from "@/components/diagrams/DLightGraph";

/**
 * SPEC §4 (v0.1) — 세 기술 상세. 3카드 세로 배치, 카드마다 좌우 반전. 모바일은 텍스트 → 이미지.
 * v0.2: 기술 페이지로 이동. 카드 앵커 id `a-block` `dlight` `farm-os` (SPEC §3-2).
 */

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

type Point = { no: string; title: string; desc: string };

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
  const t = useTranslations("technology");
  const label = useTranslations("labels");

  const aPoints = t.raw("aBlock.points") as Point[];
  /**
   * 카탈로그 5p 구조도 부품 라벨. 도면(I-03)이 라벨 없는 버전이라 HTML로 병기한다.
   * COPY §기술 > 구조도 캡션 한 줄을 ` · ` 로 나눠 목록으로 쓴다.
   */
  const structureLabels = t("aBlock.structure").split(" · ");
  /** SPEC §4 (03-B) — 좌측 플로우 캡션 5줄 */
  const dlightFlow = t.raw("dlight.flow") as string[];
  const farmOsFeatures = t.raw("farmOs.features") as string[];
  /** 데이터 흐름 번역 (en 은 빈 값 — 영문 스트립만 표시, COPY §AI Farm OS) */
  const farmOsFlow = t("farmOs.flow");

  return (
    <section className="container-4g pb-4">
      {/* A-Block */}
      <TechCard
        id="a-block"
        label={label("aBlock")}
        headline={t("aBlock.headline")}
        body={t("aBlock.body")}
        pills={<StatusPill>{t("aBlock.status")}</StatusPill>}
        extra={
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {aPoints.map((p) => (
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
            {/* 도면 + 부품 라벨. 데스크톱은 우측, 모바일은 아래. */}
            <div className="grid gap-5 sm:grid-cols-[1.1fr_1fr] sm:items-center sm:gap-6">
              <AssetSlot
                id="I-03"
                sizes="(max-width: 640px) 100vw, 30vw"
                className="aspect-[1331/1710] w-full rounded-2xl"
              />
              <ul className="divide-y divide-dashed divide-line border-y border-dashed border-line">
                {structureLabels.map((l) => (
                  <li key={l} className="py-2.5 text-[13px] leading-snug text-caption">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            {/* I-04 이미지 안에 1 MODULE → 2 MODULES → 3 MODULES 라벨이 포함되어 있다. */}
            <AssetSlot id="I-04" className="aspect-[16/6] w-full rounded-2xl" />
          </div>
        }
      />

      {/* DLight */}
      <TechCard
        id="dlight"
        reversed
        label={label("dlight")}
        headline={t("dlight.headline")}
        body={t("dlight.body")}
        pills={
          <>
            <StatusPill>{t("dlight.status")}</StatusPill>
            <StatusPill tone="blue">{t("dlight.patent")}</StatusPill>
          </>
        }
        extra={
          <ol className="mt-8 space-y-2.5">
            {dlightFlow.map((step, i) => (
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
            <DLightGraph
              summary={t("dlight.summary")}
              labels={{
                time: t("dlight.graph.time"),
                light: t("dlight.graph.light"),
                natural: t("dlight.graph.natural"),
                led: t("dlight.graph.led"),
                target: t("dlight.graph.target"),
              }}
            />
          </div>
        }
      />

      {/* AI Farm OS */}
      <TechCard
        id="farm-os"
        label={label("farmOs")}
        headline={t("farmOs.headline")}
        body={t("farmOs.body")}
        extra={
          <ul className="mt-8 space-y-3">
            {farmOsFeatures.map((f) => (
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
            {farmOsFlow && (
              <p className="-mt-3 text-center text-xs text-caption">{farmOsFlow}</p>
            )}
          </div>
        }
      />
    </section>
  );
}
