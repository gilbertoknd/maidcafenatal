import "../setupTests";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EventosPage } from "../pages/Eventos";
import { BrowserRouter } from "react-router-dom";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  buscarEventos: vi.fn(),
}));

describe("PaginaEventos", () => {
  it("deve renderizar a página principal de eventos e seus componentes", async () => {
    vi.mocked(api.buscarEventos).mockResolvedValue([
      { id: 1, titulo: "Mew Party", descricao: "Festa Gato", data: "2026-10-10T10:00:00Z", local: "Central", visivel: true, criado_em: "2026-05-01T10:00:00.000Z" }
    ]);
    
    render(
      <BrowserRouter>
        <EventosPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText("Carregando eventos...")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("Mew Party")).toBeInTheDocument();
    });
  });
});
