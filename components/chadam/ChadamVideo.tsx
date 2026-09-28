import { existsSync } from "node:fs";
import { join } from "node:path";
import FadeIn from "@/components/ui/FadeIn";
import { CHADAM_VIDEO } from "@/lib/brands";

const publicPath = (src: string) => join(process.cwd(), "public", src);

/**
 * SPEC §3-4 4번 — 홍보영상 (선택). public/assets/chadam/promo.mp4 가 있을 때만 렌더한다.
 * 자동재생하지 않는다. 빌드 시점에 파일 존재를 확인한다 (정적 생성).
 */
export default function ChadamVideo() {
  if (!existsSync(publicPath(CHADAM_VIDEO.src))) return null;
  const poster = existsSync(publicPath(CHADAM_VIDEO.poster)) ? CHADAM_VIDEO.poster : undefined;

  return (
    <section className="section-4g">
      <div className="container-4g">
        <FadeIn>
          <video
            controls
            muted
            playsInline
            preload="metadata"
            poster={poster}
            className="aspect-video w-full rounded-2xl bg-ink"
          >
            <source src={CHADAM_VIDEO.src} type="video/mp4" />
          </video>
        </FadeIn>
      </div>
    </section>
  );
}
