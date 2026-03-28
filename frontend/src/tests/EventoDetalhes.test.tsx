import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EventoDetalhes } from "../pages/EventoDetalhes/index";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock da API
vi.mock("../services/api", () => ({
  buscarEventoPorId: vi.fn().mockResolvedValue({
    id: 1,
    titulo: "Evento de Teste",
    descricao: "Uma descrição detalhada do evento kawaii.",
    data: "2026-04-10T20:00:00.000Z",
    local: "Café Mew Mew",
    imagem_url: "/images/test.jpg",
  }),
}));

describe("Página EventoDetalhes", () => {
  it("deve buscar e exibir os detalhes do evento", async () => {
    render(
      <MemoryRouter initialEntries={["/eventos/1"]}>
        <Routes>
          <Route path="/eventos/:id" element={<EventoDetalhes />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Carregando/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("Evento de Teste")).toBeDefined();
      expect(
        screen.getByText("Uma descrição detalhada do evento kawaii."),
      ).toBeDefined();
      expect(screen.getByText(/Café Mew Mew/i)).toBeDefined();
    });
  });
});
