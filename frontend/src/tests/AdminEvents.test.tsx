import "../setupTests";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminEvents } from "../components/AdminEvents";
import * as api from "../services/api";
import type { Event } from "../types/Event";

vi.mock("../services/api", () => ({
  getAdminEvents: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
  toggleEventVisibility: vi.fn(),
}));

const mockEvents: Event[] = [
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

describe("AdminEvents Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.getAdminEvents as any).mockResolvedValue(mockEvents);
    // Mock the window.alert
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("should render events list on mount", async () => {
    render(<AdminEvents />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Festa do Chá Admin")).toBeInTheDocument();
    });
  });

  it("should create a new event successfully", async () => {
    (api.createEvent as any).mockResolvedValue(mockEvents[0]);

    render(<AdminEvents />);
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
      expect(api.createEvent).toHaveBeenCalled();
    });
  });

  it("should populate form on edit and call update API", async () => {
    (api.updateEvent as any).mockResolvedValue(mockEvents[0]);

    render(<AdminEvents />);
    await waitFor(() => screen.getByText("Festa do Chá Admin"));

    const editBtn = screen.getByTitle("Editar");
    fireEvent.click(editBtn);

    const titleInput = screen.getByDisplayValue("Festa do Chá Admin");
    expect(titleInput).toBeInTheDocument();

    const saveBtn = screen.getByRole("button", { name: "Salvar Alterações" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(api.updateEvent).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });

  it("should delete event", async () => {
    render(<AdminEvents />);
    await waitFor(() => screen.getByText("Festa do Chá Admin"));

    const deleteBtn = screen.getByTitle("Excluir");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(api.deleteEvent).toHaveBeenCalledWith(1);
    });
  });

  it("should toggle visibility", async () => {
    render(<AdminEvents />);
    await waitFor(() => screen.getByText("Festa do Chá Admin"));

    const hideBtn = screen.getByTitle("Ocultar");
    fireEvent.click(hideBtn);

    await waitFor(() => {
      expect(api.toggleEventVisibility).toHaveBeenCalledWith(1);
    });
  });
});
