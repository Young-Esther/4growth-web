import FadeIn from "@/components/ui/FadeIn";
import Video from "@/components/ui/Video";
import { CHADAM_VIDEO } from "@/lib/brands";

/**
 * SPEC §3-4 4번 — 홍보영상 (선택). public/assets/chadam/promo.mp4 가 있을 때만 렌더한다.
 * 자동재생하지 않는다. 무음으로 시작한다.
 */
export default function ChadamVideo() {
  return (
    <section className="section-4g">
      <div className="container-4g">
        <FadeIn>
          <Video src={CHADAM_VIDEO.src} poster={CHADAM_VIDEO.poster} muted />
        </FadeIn>
      </div>
    </section>
  );
}
