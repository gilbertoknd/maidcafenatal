import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminFontes from "../components/AdminFontes/index.tsx";
import * as api from "../services/api";

// Mock da API
vi.mock("../services/api");

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("AdminFontes", () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
    (api.buscarConfiguracoes as any).mockResolvedValue({
      configuracoes: {
        fonte_titulo_site: "Sweet Apricot",
        fonte_navbar: "Inter",
        fonte_categorias: "Arial",
        fonte_titulos_itens: "Inter",
        fonte_descricoes: "Inter",
        fonte_botoes: "Inter",
        fonte_geral: "Inter",
      },
      fontes_customizadas: [
        { id: 1, nome: "MinhaFonte", arquivo_url: "/fonts/minhafonte.woff2" },
      ],
    });
  });

  it("deve renderizar o título e as seções de fontes e upload", async () => {
    renderWithClient(<AdminFontes />);

    // Aguarda carregar dados
    expect(
      await screen.findByText(/Configuração de Fontes/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Upload de Fonte Customizada/i),
    ).toBeInTheDocument();
  });

  it("deve listar as fontes customizadas retornadas pela API nos selects", async () => {
    renderWithClient(<AdminFontes />);

    // Aguarda o combobox aparecer e verifica se a fonte customizada está lá
    const selects = await screen.findAllByRole("combobox");
    expect(selects.length).toBe(7); // 7 categorias

    // O select de 'fonte_titulo_site' (Títulos do Site)
    const selectTituloSite = selects[0];
    await waitFor(() => {
      expect(selectTituloSite).toHaveTextContent("MinhaFonte");
    });
  });

  it("deve permitir alterar uma fonte e chamar a api de salvar", async () => {
    (api.atualizarConfiguracoes as any).mockResolvedValue({
      message: "Sucesso",
    });
    renderWithClient(<AdminFontes />);

    const selects = await screen.findAllByRole("combobox");
    const selectNavbar = selects[1]; // segundo select: Navbar

    fireEvent.change(selectNavbar, { target: { value: "Pacifico" } });
    expect(selectNavbar).toHaveValue("Pacifico");

    const btnSalvar = screen.getByText(/Salvar Configurações/i);
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(api.atualizarConfiguracoes).toHaveBeenCalledWith(
        expect.objectContaining({
          fonte_navbar: "Pacifico",
        }),
      );
    });
  });

  it("deve chamar a api de upload ao enviar um arquivo", async () => {
    (api.uploadFonteCustomizada as any).mockResolvedValue({
      id: 2,
      nome: "Nova Fonte",
      arquivo_url: "/fonts/nova.woff2",
    });

    renderWithClient(<AdminFontes />);

    // Encontrar os inputs da seção de upload usando testid
    const inputNome = await screen.findByTestId("upload-nome");
    const inputFile = screen.getByTestId("upload-file");

    // Simular upload
    fireEvent.change(inputNome, { target: { value: "Nova Fonte" } });

    const file = new File(["fake content"], "nova.woff2", {
      type: "font/woff2",
    });
    fireEvent.change(inputFile, { target: { files: [file] } });

    const btnUpload = screen.getByText(/Fazer Upload/i);
    fireEvent.click(btnUpload);

    await waitFor(() => {
      expect(api.uploadFonteCustomizada).toHaveBeenCalled();
    });
  });
});
