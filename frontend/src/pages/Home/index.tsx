import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Banner } from "../../components/Banner";
import { HeroSection } from "../../components/HeroSection";
import { MaidCarousel } from "../../components/MaidCarousel";
import { EventsSection } from "../../components/EventsSection";
import { HowItWorksSection } from "../../components/HowItWorksSection";
import { AboutSection } from "../../components/AboutSection";
import { InstagramSection } from "../../components/InstagramSection";
import { ClubeMewSection } from "../../components/ClubeMewSection";

/**
 * Landing page do Mew Mew Café (redesign 2026 — vinho · bege · rosa).
 * Estrutura: Header (sticky) → Banner (vídeo/imagem da home) → Hero (boas-vindas) →
 * Como funciona → Carrossel de Maids → Eventos → Sobre nós →
 * Instagram → Clube Mew (cupom via WhatsApp) → Footer.
 */
export function Home() {
  return (
    <>
      <Header />
      <main>
        <Banner pagina="home" />
        <HeroSection />
        <HowItWorksSection />
        <MaidCarousel />
        <EventsSection />
        <AboutSection />
        <InstagramSection />
        <ClubeMewSection />
      </main>
      <Footer />
    </>
  );
}

