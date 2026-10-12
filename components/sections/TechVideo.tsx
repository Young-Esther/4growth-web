import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import StatusPill from "@/components/ui/StatusPill";
import Video from "@/components/ui/Video";

/**
 * SPEC §3-2 — 기술 페이지 맨 위 소개 영상. 섹션 번호는 매기지 않는다 (TechStack 이 01).
 * 자동재생·무음 없음. 영상 안 자막은 한국어라 EN/VI 는 아래 캡션으로 보완한다.
 */
export default function TechVideo() {
  const t = useTranslations("technology.video");
  return (
    <section className="section-4g pb-0 md:pb-0">
      <div className="container-4g">
        <FadeIn>
          <Video
            src="/assets/video/promo.mp4"
            poster="/assets/video/promo-poster.jpg"
            label={t("label")}
            caption={
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <StatusPill>{t("tag")}</StatusPill>
                <p className="text-sm leading-relaxed text-ink/80">{t("caption")}</p>
              </div>
            }
          />
        </FadeIn>
      </div>
    </section>
  );
}
