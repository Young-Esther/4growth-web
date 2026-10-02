import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import TeaIcon from "@/components/chadam/TeaIcon";
import { CHADAM_COLORS, CHADAM_TEAS } from "@/lib/brands";

type Tea = { name: string; time: string; line: string; ingredients: string };

/**
 * SPEC §3-4 2번 — 4종 카드. 데스크톱 4열 / 모바일 2×2.
 * 상단 색띠 + 아이콘 · 차 이름(크게) · 작은 줄 · 1줄 문구 · 재료 목록.
 * 문구는 패키지 띠지 인쇄 문구에 맞춘다 (COPY §차담 > 4종).
 *   `name` — KO/VI 차 이름, EN 은 패키지 영문명 (Morning Tea …).
 *   `time` — KO/VI 시간대, EN 은 로마자 이름 (Haetsal …).
 * TODO(COPY · [확인 필요: 인쇄 문구 대조]): 한낮차 1줄 문구는 인쇄본과 대조 전. 문구는 그대로 노출한다.
 * 배합비·효능 문구는 쓰지 않는다. 처방 유래명도 쓰지 않는다 (SPEC 0-1).
 */
export default function ChadamTeas() {
  const t = useTranslations("chadam");
  const teas = t.raw("teas") as Tea[];

  return (
    <section className="section-4g pt-0 md:pt-0">
      <div className="container-4g">
        <FadeIn>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {CHADAM_TEAS.map(({ key, icon }, i) => {
              const tea = teas[i];
              const color = CHADAM_COLORS[key];
              return (
                <li key={key} className="flex flex-col overflow-hidden rounded-2xl bg-surface">
                  <span aria-hidden className="block h-2 w-full" style={{ backgroundColor: color }} />
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <span style={{ color }}>
                      <TeaIcon icon={icon} className="h-8 w-8" />
                    </span>
                    <p className="mt-4 text-[17px] font-bold md:text-lg">{tea.name}</p>
                    <p className="mt-1 text-sm font-medium text-caption">{tea.time}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink/80">{tea.line}</p>
                    <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-caption">
                      {tea.ingredients}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
