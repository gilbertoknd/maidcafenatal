import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EventCard } from "../components/EventCard";
import type { Event } from "../types/Event";

const mockEvent: Event = {
  id: 1,
  titulo: "Festival de Outono",
  descricao: "Venha celebrar o outono conosco!",
  data: "2026-05-15T15:00:00.000Z",
  local: "Mew Mew Café",
  visivel: true,
  criado_em: "2026-03-20T10:00:00Z"
};

describe("EventCard Component", () => {
  it("should render event details", () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText("Festival de Outono")).toBeInTheDocument();
    expect(screen.getByText("Venha celebrar o outono conosco!")).toBeInTheDocument();
    expect(screen.getByText("Mew Mew Café")).toBeInTheDocument();
    
    // Day 15 should be visible somewhere
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("should display admin controls when isAdmin is true", () => {
    render(<EventCard event={mockEvent} isAdmin={true} />);

    expect(screen.getByText("Visível")).toBeInTheDocument();
    expect(screen.getByTitle("Ocultar")).toBeInTheDocument();
    expect(screen.getByTitle("Editar")).toBeInTheDocument();
    expect(screen.getByTitle("Excluir")).toBeInTheDocument();
  });
});
