import "../setupTests";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HomeBanner } from "../components/HomeBanner";

/**
 * Testes do componente HomeBanner — banner de vídeo fullscreen
 * que aparece apenas na Home, abaixo do rolling banner,
 * e desaparece ao scrollar.
 */

// Mock do hook useBanners para fornecer dados de banner da home
vi.mock("../hooks/useBanners", () => ({
  useBanners: () => ({
    data: [
      {
        pagina: "home",
        tipo: "video",
        url: "/videos/home-banner.mp4",
        titulo: "Bem-vindo ao Mew Mew Café",
        subtitulo: "A magia começa aqui",
        texto_botao: "Explorar",
        link_botao: "#inicio",
      },
    ],
    isLoading: false,
  }),
}));

function renderHomeBanner() {
  return render(
    <BrowserRouter>
      <HomeBanner />
    </BrowserRouter>
  );
}

describe("Componente HomeBanner", () => {
  beforeEach(() => {
    // Resetar o scroll antes de cada teste
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("deve renderizar o container do banner com data-testid", () => {
    renderHomeBanner();
    expect(screen.getByTestId("home-video-banner")).toBeInTheDocument();
  });

  it("deve renderizar um elemento de vídeo quando o tipo é 'video'", () => {
    renderHomeBanner();
    const container = screen.getByTestId("home-video-banner");
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video?.getAttribute("src")).toBe("/videos/home-banner.mp4");
  });

  it("deve ter o vídeo com autoPlay, loop, muted e playsInline", () => {
    renderHomeBanner();
    const container = screen.getByTestId("home-video-banner");
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video?.autoplay).toBe(true);
    expect(video?.loop).toBe(true);
    expect(video?.muted).toBe(true);
    expect(video?.playsInline).toBe(true);
  });

  it("deve mostrar o overlay com título e subtítulo", () => {
    renderHomeBanner();
    expect(screen.getByText("Bem-vindo ao Mew Mew Café")).toBeInTheDocument();
    expect(screen.getByText("A magia começa aqui")).toBeInTheDocument();
  });

  it("deve mostrar o botão CTA quando texto_botao está presente", () => {
    renderHomeBanner();
    expect(screen.getByText("Explorar")).toBeInTheDocument();
  });

  it("deve ficar visível quando o scroll está no topo (scrollY = 0)", () => {
    renderHomeBanner();
    const banner = screen.getByTestId("home-video-banner");
    expect(banner.getAttribute("data-visible")).toBe("true");
  });

  it("deve ficar oculto quando o scroll ultrapassa o limite", () => {
    renderHomeBanner();

    // Simular scroll para baixo
    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    fireEvent.scroll(window);

    const banner = screen.getByTestId("home-video-banner");
    expect(banner.getAttribute("data-visible")).toBe("false");
  });
});
