import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Banner } from "../../components/Banner";
import { HeroSection } from "../../components/HeroSection";
import { MaidCarousel } from "../../components/MaidCarousel";
import { EventsSection } from "../../components/EventsSection";
import { HowItWorksSection } from "../../components/HowItWorksSection";
import { AboutSection } from "../../components/AboutSection";
import { InstagramSection } from "../../components/InstagramSection";
import { ParceirosSection } from "../../components/ParceirosSection";
import { ClubeMewSection } from "../../components/ClubeMewSection";
import { useSecoesHome } from "../../hooks/useSecoesHome";

/**
 * Landing page do Mew Mew Café (redesign 2026 — vinho · bege · rosa).
 * Estrutura: Header (sticky) → Banner (vídeo/imagem da home) → Hero (boas-vindas) →
 * Como funciona → Carrossel de Maids → Eventos → Sobre nós →
 * Instagram → Parceiros → Clube Mew (cupom via WhatsApp) → Footer.
 *
 * Seções podem ser ocultadas pelo admin via /admin → Seções da Home.
 */
export function Home() {
  const { secoes } = useSecoesHome();

  return (
    <>
      <Header />
      <main>
        {secoes.secao_home_banner && <Banner pagina="home" />}
        {secoes.secao_home_hero && <HeroSection />}
        {secoes.secao_home_como_funciona && <HowItWorksSection />}
        {secoes.secao_home_maids && <MaidCarousel />}
        {secoes.secao_home_eventos && <EventsSection />}
        {secoes.secao_home_sobre && <AboutSection />}
        {secoes.secao_home_instagram && <InstagramSection />}
        {secoes.secao_home_parceiros && <ParceirosSection />}
        {secoes.secao_home_clube_mew && <ClubeMewSection />}
      </main>
      <Footer />
    </>
  );
}
