"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type CarouselImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type Props = {
  images: CarouselImage[];
  /** CSS aspect-ratio 값. 주지 않으면 className 의 높이 유틸을 따른다. */
  aspect?: string;
  /** 뷰포트 래퍼에 붙일 클래스 (높이·모서리 등) */
  className?: string;
  sizes?: string;
};

/** 사용자가 모션 최소화를 켜 두었으면 즉시 이동한다 (globals.css 와 동일한 정책). */
function scrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") return "smooth";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

/**
 * SPEC §5 — 현장 사진 캐러셀.
 * 라이브러리 없이 CSS scroll-snap 으로만 구성한다. 자동재생 없음.
 * 모바일은 스와이프, 데스크톱(md~)은 화살표 버튼을 함께 제공한다.
 */
export default function ImageCarousel({
  images,
  aspect,
  className = "",
  sizes = "100vw",
}: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [current, setCurrent] = useState(0);

  const single = images.length <= 1;

  // 스크롤 위치 → 현재 슬라이드. 스와이프·화살표·점 어느 쪽으로 움직여도 같은 경로로 갱신된다.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || single) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = slideRefs.current.indexOf(entry.target as HTMLLIElement);
          if (index !== -1) setCurrent(index);
        }
      },
      { root: track, threshold: 0.6 },
    );

    for (const slide of slideRefs.current) {
      if (slide) observer.observe(slide);
    }
    return () => observer.disconnect();
  }, [single, images.length]);

  function goTo(index: number) {
    const target = slideRefs.current[Math.max(0, Math.min(index, images.length - 1))];
    // block: "nearest" — html 의 scroll-padding-top 때문에 세로로 튀는 것을 막는다.
    target?.scrollIntoView({
      behavior: scrollBehavior(),
      block: "nearest",
      inline: "start",
    });
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (single) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(current - 1);
    }
  }

  if (single) {
    const only = images[0];
    return (
      <div className={`overflow-hidden ${className}`} style={{ aspectRatio: aspect }}>
        <Image
          src={only.src}
          alt={only.alt}
          width={only.width}
          height={only.height}
          sizes={sizes}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: aspect }}
      role="group"
      aria-roledescription="캐러셀"
      aria-label="포그로우스 현장 사진"
    >
      <ul
        ref={trackRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-blue [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <li
            key={image.src}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className="h-full w-full shrink-0 snap-start"
            aria-roledescription="슬라이드"
            aria-label={`${index + 1} / ${images.length}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={sizes}
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
          </li>
        ))}
      </ul>

      {/* 데스크톱 전용 화살표 — 모바일은 스와이프로 넘긴다. */}
      <button
        type="button"
        aria-label="이전 사진"
        disabled={current === 0}
        onClick={() => goTo(current - 1)}
        className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        <Chevron direction="left" />
      </button>
      <button
        type="button"
        aria-label="다음 사진"
        disabled={current === images.length - 1}
        onClick={() => goTo(current + 1)}
        className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        <Chevron direction="right" />
      </button>

      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`${index + 1}번째 사진 보기`}
            aria-current={index === current ? "true" : undefined}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === current ? "w-6 bg-white" : "w-2 bg-white/55 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-5 w-5 ${direction === "left" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
