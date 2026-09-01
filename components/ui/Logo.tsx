import Image from "next/image";
import { ASSETS, firstImage } from "@/lib/assets";

type Props = {
  className?: string;
  /** 어두운 배경에서 사용 (Footer) */
  variant?: "color" | "white";
};

/** SPEC §0 — 로고 표기는 `4GROWTH`. (SPEC §10, LOGO) */
export default function Logo({ className = "", variant = "color" }: Props) {
  const asset = firstImage(ASSETS.LOGO);
  const src = variant === "white" ? asset.srcWhite : asset.src;

  if (src) {
    return (
      <Image
        src={src}
        alt="4GROWTH"
        width={asset.width}
        height={asset.height}
        // SVG는 이미지 최적화 대상이 아니므로 원본을 그대로 서빙한다.
        unoptimized
        priority
        className={`w-auto ${className}`}
      />
    );
  }

  return (
    <span
      className={`text-lg font-bold tracking-label ${
        variant === "white" ? "text-white" : "text-ink"
      } ${className}`}
    >
      4GROWTH
    </span>
  );
}
