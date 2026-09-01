import Image from "next/image";
import { ASSETS } from "@/lib/assets";

type Props = {
  className?: string;
  /** 푸터 등 어두운 배경에서 사용 */
  variant?: "color" | "white";
};

/**
 * SPEC §0 — 로고 표기는 `4GROWTH`.
 * TODO(SPEC §10, LOGO): 로고 SVG(컬러/화이트)를 public/assets/ 에 넣고
 *   lib/assets.ts 의 LOGO.src 를 채우면 워드마크가 이미지로 교체된다.
 */
export default function Logo({ className = "", variant = "color" }: Props) {
  const asset = ASSETS.LOGO;

  if (asset.src) {
    return (
      <span className={`relative block ${className}`}>
        <Image src={asset.src} alt="4GROWTH" fill className="object-contain object-left" />
      </span>
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
