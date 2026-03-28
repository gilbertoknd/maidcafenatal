import "../setupTests";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminEventos } from "../components/AdminEventos";
import * as api from "../services/api";
import type { Evento } from "../types/Evento";

vi.mock("../services/api", () => ({
  buscarEventosAdmin: vi.fn(),
  criarEvento: vi.fn(),
  atualizarEvento: vi.fn(),
  deletarEvento: vi.fn(),
  alterarVisibilidadeEvento: vi.fn(),
}));

const mockEventos: Evento[] = [
  {
    id: 1,
    titulo: "Festa do Chá Admin",
    descricao: "Teste admin",
    data: "2026-05-10T15:00:00.000Z",
    local: "Mew Mew Café",
    visivel: true,
    criado_em: "2026-05-01T10:00:00.000Z",
  },
];

describe("AdminEventos Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.buscarEventosAdmin as any).mockResolvedValue(mockEventos);
    // Mock the window.alert
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("should render events list on mount", async () => {
    render(<AdminEventos />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Festa do Chá Admin")).toBeInTheDocument();
    });
  });

  it("should create a new event successfully", async () => {
    (api.criarEvento as any).mockResolvedValue(mockEventos[0]);

    render(<AdminEventos />);
    await waitFor(() => screen.getByText("Festa do Chá Admin"));

    const titleInput = screen.getByPlaceholderText("Ex: Festa do Chá");
    const localInput = screen.getByPlaceholderText("Ex: Mew Mew Café Centro");

    fireEvent.change(titleInput, { target: { value: "Novo Evento" } });
    fireEvent.change(localInput, { target: { value: "Praca" } });

    // Encontrar os inputs pelo parentNode pra ter certeza (Data)
    // datetime-local input isn't considered textbox by role.
    const dateInput = document.querySelector('input[type="datetime-local"]');
    if (dateInput) {
      fireEvent.change(dateInput, { target: { value: "2027-01-01T12:00" } });
    }

    const createBtn = screen.getByRole("button", { name: "Criar Evento" });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(api.criarEvento).toHaveBeenCalled();
    });
  });

  it("should populate form on edit and call update API", async () => {
    (api.atualizarEvento as any).mockResolvedValue(mockEventos[0]);

    render(<AdminEventos />);
    await waitFor(() => screen.getByText("Festa do Chá Admin"));

    const editBtn = screen.getByTitle("Editar");
    fireEvent.click(editBtn);

    const titleInput = screen.getByDisplayValue("Festa do Chá Admin");
    expect(titleInput).toBeInTheDocument();

    const saveBtn = screen.getByRole("button", { name: "Salvar Alterações" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(api.atualizarEvento).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });

  it("should delete event", async () => {
    render(<AdminEventos />);
    await waitFor(() => screen.getByText("Festa do Chá Admin"));

    const deleteBtn = screen.getByTitle("Excluir");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(api.deletarEvento).toHaveBeenCalledWith(1);
    });
  });

  it("should toggle visibility", async () => {
    render(<AdminEventos />);
    await waitFor(() => screen.getByText("Festa do Chá Admin"));

    const hideBtn = screen.getByTitle("Ocultar");
    fireEvent.click(hideBtn);

    await waitFor(() => {
      expect(api.alterarVisibilidadeEvento).toHaveBeenCalledWith(1);
    });
  });
});
