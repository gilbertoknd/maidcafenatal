import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "../components/Footer";

describe("Footer Component", () => {
  it("should render the copyright text", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText((content) =>
        content.includes(`© ${currentYear} Mew Mew Maid Café`)
      )
    ).toBeInTheDocument();
  });

  it("should render social links", () => {
    render(<Footer />);

    const instagramLink = screen.getByLabelText("Siga nosso Instagram");
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/maidcafenatal/"
    );

    const whatsappLink = screen.getByLabelText("Fale conosco no WhatsApp");
    expect(whatsappLink).toBeInTheDocument();
    expect(whatsappLink).toHaveAttribute("href", "https://wa.me/558486643897");
  });
});
