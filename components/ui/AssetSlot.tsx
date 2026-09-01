import Image from "next/image";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { ASSETS, type AssetId } from "@/lib/assets";

type Props = {
  id: AssetId;
  /** aspect-ratio 유틸 클래스 등 래퍼에 붙일 클래스 */
  className?: string;
  /** Hero 이미지만 true (SPEC §12) */
  priority?: boolean;
  sizes?: string;
  /** 회색 박스·둥근 모서리 없이 이미지만 렌더 (Hero — 카탈로그 표지와 동일) */
  bare?: boolean;
};

/** SPEC §10 — 슬롯 ID 로 이미지를 꺼내 렌더한다. 배열 슬롯은 캐러셀이 된다. */
export default function AssetSlot({
  id,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  bare = false,
}: Props) {
  const entry = ASSETS[id];

  if (Array.isArray(entry)) {
    return (
      <ImageCarousel
        images={entry}
        sizes={sizes}
        className={`overflow-hidden ${className}`}
      />
    );
  }

  const asset = entry;

  if (bare) {
    // 래퍼 없이 이미지만. max-w/max-h 를 함께 걸면 비율이 유지된다.
    return (
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        priority={priority}
        className={`mx-auto h-auto w-auto max-w-full object-contain ${className}`}
      />
    );
  }

  const contain = asset.fit === "contain";
  return (
    <div className={`overflow-hidden ${contain ? "bg-surface" : ""} ${className}`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        priority={priority}
        className={`h-full w-full ${contain ? "object-contain" : "object-cover"}`}
      />
    </div>
  );
}
