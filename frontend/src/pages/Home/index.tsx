import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { HeroSection } from "../../components/HeroSection";
import { HighlightsSection } from "../../components/HighlightsSection";
import { MaidCarousel } from "../../components/MaidCarousel";
import { HowItWorksSection } from "../../components/HowItWorksSection";
import { AboutSection } from "../../components/AboutSection";

/**
 * Landing page do Mew Mew Café (redesign 2026 — vinho · bege · rosa).
 * Estrutura: Header (sticky) → Hero (boas-vindas) → Destaques →
 * Carrossel de Maids → Como funciona → Sobre nós → Footer detalhado.
 */
export function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HighlightsSection />
        <MaidCarousel />
        <HowItWorksSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
