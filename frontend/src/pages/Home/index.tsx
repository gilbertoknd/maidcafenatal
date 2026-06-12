import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { HeroSection } from "../../components/HeroSection";
import { HighlightsSection } from "../../components/HighlightsSection";
import { MaidCarousel } from "../../components/MaidCarousel";
import { EventsSection } from "../../components/EventsSection";
import { HowItWorksSection } from "../../components/HowItWorksSection";
import { AboutSection } from "../../components/AboutSection";
import { InstagramSection } from "../../components/InstagramSection";
import { ClubeMewSection } from "../../components/ClubeMewSection";

/**
 * Landing page do Mew Mew Café (redesign 2026 — vinho · bege · rosa).
 * Estrutura: Header (sticky) → Hero (boas-vindas) → Destaques →
 * Carrossel de Maids → Eventos → Como funciona → Sobre nós →
 * Instagram → Clube Mew (cupom via WhatsApp) → Footer.
 */
export function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HighlightsSection />
        <MaidCarousel />
        <EventsSection />
        <HowItWorksSection />
        <AboutSection />
        <InstagramSection />
        <ClubeMewSection />
      </main>
      <Footer />
    </>
  );
}
