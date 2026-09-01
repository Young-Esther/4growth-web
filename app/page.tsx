import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import TechStack from "@/components/sections/TechStack";
import TechDetail from "@/components/sections/TechDetail";
import Field from "@/components/sections/Field";
import RnD from "@/components/sections/RnD";
import Applications from "@/components/sections/Applications";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

/** SPEC §1 — 단일 페이지 `/` + 앵커 이동. 서브페이지 없음. */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TechStack />
        <TechDetail />
        <Field />
        <RnD />
        <Applications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
