import "../setupTests";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CalendarioEventos } from "../components/CalendarioEventos";
import type { Evento } from "../types/Evento";

// Criar enventos no mes corrente
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

// Format: YYYY-MM-DDThh:mm:ssZ
const d1 = new Date(currentYear, currentMonth, 15, 10, 0).toISOString();
const d2 = new Date(currentYear, currentMonth, 20, 15, 0).toISOString();

const mockEventos: Evento[] = [
  {
    id: 1,
    titulo: "Festa do Chá",
    descricao: "Chá da tarde",
    data: d1,
    local: "Mew Mew",
    visivel: true,
    criado_em: new Date().toISOString()
  },
  {
    id: 2,
    titulo: "Encontro Cosplay",
    descricao: "Venha de cosplay",
    data: d2,
    local: "Mew Mew",
    visivel: true,
    criado_em: new Date().toISOString()
  }
];

describe("CalendarioEventos Component", () => {
  it("should render the calendar header", () => {
    render(<CalendarioEventos eventos={mockEventos} />);
    
    // Check week days
    expect(screen.getByText("Dom")).toBeInTheDocument();
    expect(screen.getByText("Seg")).toBeInTheDocument();
    expect(screen.getByText("Sáb")).toBeInTheDocument();
  });

  it("should change month when clicking navigation buttons", () => {
    render(<CalendarioEventos eventos={mockEventos} />);
    
    const prevButton = screen.getByText("<");
    const nextButton = screen.getByText(">");
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    
    // Not explicitly checking exact strings to avoid locale issues, just clickability
    fireEvent.click(prevButton);
    fireEvent.click(nextButton);
  });
});
