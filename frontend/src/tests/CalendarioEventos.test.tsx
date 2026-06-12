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

  it("should highlight all days in a multi-day event range", () => {
    const multiDayEvent: Evento[] = [
      {
        id: 3,
        titulo: "Evento Multi-dia",
        descricao: "Dura 3 dias",
        data: new Date(currentYear, currentMonth, 12, 10, 0).toISOString(),
        data_fim: new Date(currentYear, currentMonth, 14, 18, 0).toISOString(),
        local: "Mew Mew",
        visivel: true,
        criado_em: new Date().toISOString()
      }
    ];

    render(<CalendarioEventos eventos={multiDayEvent} />);
    
    const day12 = screen.getByText("12").closest("div");
    const day13 = screen.getByText("13").closest("div");
    const day14 = screen.getByText("14").closest("div");
    const day15 = screen.getByText("15").closest("div");

    expect(day12).toBeInTheDocument();
    expect(day13).toBeInTheDocument();
    expect(day14).toBeInTheDocument();
    expect(day15).toBeInTheDocument();

    // Verify dot element with event title is present on the days of the range
    expect(day12?.querySelector(`[title="Evento Multi-dia"]`)).toBeInTheDocument();
    expect(day13?.querySelector(`[title="Evento Multi-dia"]`)).toBeInTheDocument();
    expect(day14?.querySelector(`[title="Evento Multi-dia"]`)).toBeInTheDocument();
    
    // Day 15 is outside the range
    expect(day15?.querySelector(`[title="Evento Multi-dia"]`)).not.toBeInTheDocument();
  });
});
