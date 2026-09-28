import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * v0.2 서브페이지 머리 (사업영역 · 소식). 고정 헤더 높이만큼 위를 띄우고
 * 섹션 라벨 + 제목 + 본문을 섹션과 같은 타이포로 둔다.
 */
export default function PageIntro({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body?: string;
}) {
  return (
    <section className="pt-[72px]">
      <div className="container-4g pt-16 md:pt-24">
        <FadeIn>
          <SectionLabel>{label}</SectionLabel>
          <h1 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">{title}</h1>
          {body && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/80">{body}</p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
