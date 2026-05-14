import "../setupTests";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminCupons } from "../components/AdminCupons";
import { BrowserRouter } from "react-router-dom";
import * as api from "../services/api";
import type { CampanhaCupom, CupomResgatado } from "../types/Cupom";

vi.mock("../services/api", () => ({
  buscarCampanhasAdmin: vi.fn(),
  criarCampanhaAdmin: vi.fn(),
  buscarCuponsAdmin: vi.fn(),
}));

const mockCampanhas: CampanhaCupom[] = [
  {
    id: 1,
    nome: "Bem-vindo Mew Mew",
    descricao: "Desconto de boas-vindas",
    tipo_desconto: "percentual",
    valor_desconto: "10.00",
    limite_total: 100,
    qtd_cupons: "5",
    prefixo: "MEW",
    ativa: true,
    validade: null,
    criado_em: "2026-05-01T10:00:00.000Z",
  },
];

const mockCupons: CupomResgatado[] = [
  {
    id: 1,
    campanha_id: 1,
    codigo: "MEW-ABC123",
    cliente_nome: "João",
    cliente_whatsapp: "(84) 99999-9999",
    fingerprint_token: "fp_abc123",
    usado: false,
    usado_em: null,
    criado_em: "2026-05-10T15:00:00.000Z",
  },
];

describe("AdminCupons Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.buscarCampanhasAdmin).mockResolvedValue(mockCampanhas);
    vi.mocked(api.buscarCuponsAdmin).mockResolvedValue(mockCupons);
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("deve renderizar o título e o formulário de criação de campanha", async () => {
    render(
      <BrowserRouter>
        <AdminCupons />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Nova Campanha")).toBeInTheDocument();
    });

    expect(
      screen.getByPlaceholderText(/Nome da campanha/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Descrição da campanha/i),
    ).toBeInTheDocument();
  });

  it("deve listar campanhas cadastradas", async () => {
    render(
      <BrowserRouter>
        <AdminCupons />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bem-vindo Mew Mew")).toBeInTheDocument();
    });

    expect(screen.getByText("10.00% OFF")).toBeInTheDocument();
  });

  it("deve criar nova campanha com sucesso", async () => {
    vi.mocked(api.criarCampanhaAdmin).mockResolvedValue(mockCampanhas[0]);

    render(
      <BrowserRouter>
        <AdminCupons />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bem-vindo Mew Mew")).toBeInTheDocument();
    });

    const nomeInput = screen.getByPlaceholderText(/Nome da campanha/i);
    const descInput = screen.getByPlaceholderText(/Descrição da campanha/i);
    const prefixoInput = screen.getByPlaceholderText(/MEW/i);
    const valorInput = screen.getByPlaceholderText(/Valor do desconto/i);

    fireEvent.change(nomeInput, { target: { value: "Teste Campanha" } });
    fireEvent.change(descInput, { target: { value: "Uma campanha teste" } });
    fireEvent.change(prefixoInput, { target: { value: "TST" } });
    fireEvent.change(valorInput, { target: { value: "15" } });

    const submitBtn = screen.getByRole("button", { name: /Criar Campanha/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.criarCampanhaAdmin).toHaveBeenCalled();
    });
  });

  it("deve listar cupons resgatados ao expandir campanha", async () => {
    render(
      <BrowserRouter>
        <AdminCupons />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Bem-vindo Mew Mew")).toBeInTheDocument();
    });

    // Clicar para ver cupons da campanha
    const verCuponsBtn = screen.getByText(/Ver Cupons/i);
    fireEvent.click(verCuponsBtn);

    await waitFor(() => {
      expect(api.buscarCuponsAdmin).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.getByText("MEW-ABC123")).toBeInTheDocument();
    });
  });
});
