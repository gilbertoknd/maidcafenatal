import "../setupTests";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { ParceirosSection } from "../components/ParceirosSection";

/**
 * Copy proibida pelo pivô de Jun/2026: o Mew Mew Café não atende
 * presencialmente. Descrever o negócio DO PARCEIRO (ex.: "mercado coreano
 * em Natal/RN") é permitido; convidar o cliente a visitar não é.
 */
const COPY_PROIBIDA = /endereço|rua|visite|mesa|presencial|nossa loja física/i;

function renderSecao() {
  return render(
    <BrowserRouter>
      <ParceirosSection />
    </BrowserRouter>
  );
}

describe("Seção de Parceiros", () => {
  it("deve renderizar os dois parceiros com nome e sinopse", () => {
    renderSecao();

    expect(screen.getByText("ArtePsi")).toBeInTheDocument();
    expect(screen.getByText(/Psicoterapia para mulheres/i)).toBeInTheDocument();
    expect(screen.getByText(/artepsicoterapia/i)).toBeInTheDocument();

    expect(screen.getByText("Jjang")).toBeInTheDocument();
    expect(screen.getByText(/mercado coreano em Natal\/RN/i)).toBeInTheDocument();
    expect(screen.getByText(/ramen, soju, snacks e doces/i)).toBeInTheDocument();
  });

  it("deve abrir os links externos em nova aba com rel de segurança", () => {
    renderSecao();

    const externos = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");

    // ArtePsi: site + instagram · Jjang: instagram + whatsapp
    expect(externos).toHaveLength(4);
    externos.forEach((link) => {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("deve apontar para as URLs oficiais dos parceiros", () => {
    renderSecao();

    expect(
      screen.getByRole("link", { name: "Abrir o site da ArtePsi em nova aba" })
    ).toHaveAttribute("href", "https://artepsimonica.com");

    expect(
      screen.getByRole("link", {
        name: "Abrir o Instagram da ArtePsi em nova aba",
      })
    ).toHaveAttribute("href", "https://www.instagram.com/artepsinomundo/");

    expect(
      screen.getByRole("link", {
        name: "Abrir o Instagram da Jjang em nova aba",
      })
    ).toHaveAttribute("href", "https://www.instagram.com/jjangnatal/");

    expect(
      screen.getByRole("link", {
        name: "Falar com a Jjang no WhatsApp em nova aba",
      })
    ).toHaveAttribute("href", "https://api.whatsapp.com/send/?phone=5584992088194");
  });

  it("deve ter aria-label descritivo em todos os links", () => {
    renderSecao();

    screen.getAllByRole("link").forEach((link) => {
      expect(link).toHaveAttribute("aria-label");
      expect(link.getAttribute("aria-label")).not.toBe("");
    });
  });

  it("deve exibir o CTA 'Ver todos' apontando para /parceiros", () => {
    renderSecao();

    const cta = screen.getByRole("link", {
      name: /Ver todos os parceiros/i,
    });
    expect(cta).toHaveAttribute("href", "/parceiros");
  });

  it("deve exibir o monograma com as iniciais quando a logo falha ao carregar", () => {
    renderSecao();

    // jsdom nunca carrega imagens de verdade — o onError precisa ser disparado
    fireEvent.error(screen.getByAltText("Logo da ArtePsi"));

    expect(screen.getByText("AP")).toBeInTheDocument();
    expect(screen.queryByAltText("Logo da ArtePsi")).not.toBeInTheDocument();
    // O card da Jjang segue tentando exibir a logo
    expect(screen.getByAltText("Logo da Jjang")).toBeInTheDocument();
  });

  it("não deve conter copy de atendimento presencial", () => {
    const { container } = renderSecao();

    expect(container.textContent).not.toMatch(COPY_PROIBIDA);
  });
});
