import Image from "next/image";
import { ASSETS, type AssetId } from "@/lib/assets";

type Props = {
  id: AssetId;
  /** aspect-ratio 유틸 클래스 등 래퍼에 붙일 클래스 */
  className?: string;
  /** Hero 이미지만 true (SPEC §12) */
  priority?: boolean;
  sizes?: string;
};

/**
 * public/assets/ 에 파일이 준비된 슬롯은 next/image 로,
 * 아직 없는 슬롯은 SPEC의 ID를 표시한 회색 플레이스홀더로 렌더한다.
 */
export default function AssetSlot({
  id,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  const asset = ASSETS[id];

  if (asset.src && asset.width && asset.height) {
    const contain = asset.fit === "contain";
    return (
      <div className={`overflow-hidden ${contain ? "bg-surface" : ""} ${className}`}>
        <Image
          src={asset.src}
          alt={asset.label}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          priority={priority}
          className={`h-full w-full ${contain ? "object-contain" : "object-cover"}`}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${id} — ${asset.label} (이미지 준비 중)`}
      className={`flex flex-col items-center justify-center gap-1 border border-dashed border-line bg-surface ${className}`}
    >
      <span className="label-en text-caption">{id}</span>
      <span className="px-4 text-center text-xs text-caption">
        {asset.label}
      </span>
    </div>
  );
}
