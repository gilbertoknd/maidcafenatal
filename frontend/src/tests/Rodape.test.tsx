import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "../components/Footer";

describe("Footer Component", () => {
  it("should render the copyright text", () => {
    render(<Footer />);
    const currentYear = 2025;
    expect(
      screen.getByText((content) =>
        content.includes(`© ${currentYear} Mew Mew Maid Café`)
      )
    ).toBeInTheDocument();
  });

  it("não deve exibir a coluna 'Visite' nem endereço físico", () => {
    render(<Footer />);
    expect(screen.queryByText("Visite")).not.toBeInTheDocument();
    expect(screen.queryByText(/Rua Camilo de Paula/i)).not.toBeInTheDocument();
  });

  it("deve exibir a descrição focada em eventos e delivery", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Eventos personalizados, delivery e doces temáticos/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/primeiro maid & mangá café/i)
    ).not.toBeInTheDocument();
  });

  it("should render social links", () => {
    render(<Footer />);

    const instagramLink = screen.getByLabelText("Siga nosso Instagram");
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/mewmewnatal/"
    );

    const whatsappLink = screen.getByLabelText("Fale conosco no WhatsApp");
    expect(whatsappLink).toBeInTheDocument();
    expect(whatsappLink).toHaveAttribute("href", "https://wa.me/5584998350914");
  });
});
