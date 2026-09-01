import type { Config } from "tailwindcss";

// SPEC §1 디자인 토큰
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 배경 / 본문 텍스트
        bg: "#FFFFFF",
        ink: "#231F20",
        // 포인트 블루 (카탈로그 뒷표지 · CTA 바)
        blue: "#4366B9",
        // 보조 회색
        surface: "#F4F5F7", // 카드 배경
        caption: "#8A8F99", // 캡션
        // 파생 토큰: SPEC에 명시되지 않은 경계선 색. surface/caption 사이 값.
        line: "#E5E6EA",
        // TODO(SPEC §1, §0): 로고 그린 `[확인 필요]` — AI 원본에서 추출 후 등록.
        //   로고 외에는 사용하지 않는다.
        // logoGreen: "#______",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      maxWidth: {
        container: "1200px",
      },
      letterSpacing: {
        // 영문 라벨 전용
        label: "0.08em",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
