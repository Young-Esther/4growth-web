import "./globals.css";

/**
 * v0.2 — <html lang> 이 로케일마다 달라야 하므로 문서 뼈대는 app/[locale]/layout.tsx 가 만든다.
 * 여기는 app 루트의 파일(sitemap · robots · not-found)을 위한 통과 레이아웃이다.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
