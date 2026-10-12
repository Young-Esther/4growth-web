import { existsSync } from "node:fs";
import { join } from "node:path";

const publicPath = (src: string) => join(process.cwd(), "public", src);

type Props = {
  /** public/ 기준 경로 */
  src: string;
  poster?: string;
  /** 차담 홍보영상은 무음 시작(SPEC §3-4), 기술 소개 영상은 소리 포함(SPEC §3-2) */
  muted?: boolean;
  /** 보조기기용 영상 설명 */
  label?: string;
  /** 영상 아래 캡션 (상태 태그 등) */
  caption?: React.ReactNode;
};

/**
 * 공용 영상 — 16:9, 카드와 같은 모서리. 자동재생하지 않는다.
 * 파일이 있을 때만 렌더한다. 빌드 시점에 존재를 확인한다 (정적 생성).
 */
export default function Video({ src, poster, muted = false, label, caption }: Props) {
  if (!existsSync(publicPath(src))) return null;
  const posterSrc = poster && existsSync(publicPath(poster)) ? poster : undefined;

  return (
    <figure>
      <video
        controls
        muted={muted}
        playsInline
        preload="metadata"
        poster={posterSrc}
        aria-label={label}
        className="aspect-video w-full rounded-2xl bg-ink"
      >
        <source src={src} type="video/mp4" />
      </video>
      {caption && <figcaption className="mt-4">{caption}</figcaption>}
    </figure>
  );
}
