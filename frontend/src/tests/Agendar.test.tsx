import "../setupTests";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AgendarPage } from "../pages/Agendar";
import { CarrinhoProvider } from "../hooks/useCarrinho";

// Mock do hook de visibilidade da nav (Header depende dele)
vi.mock("../hooks/useNavVisibilidade", () => ({
  useNavVisibilidade: () => ({ temLoja: true, temMangas: true, isLoading: false }),
}));

function renderAgendar() {
  return render(
    <BrowserRouter>
      <CarrinhoProvider>
        <AgendarPage />
      </CarrinhoProvider>
    </BrowserRouter>
  );
}

function preencherObrigatorios() {
  fireEvent.click(
    screen.getByRole("radio", { name: /Aniversário temático/i })
  );
  fireEvent.change(screen.getByLabelText(/Nome completo/i), {
    target: { value: "João Silva" },
  });
  fireEvent.change(screen.getByLabelText(/Telefone/i), {
    target: { value: "84999999999" },
  });
  fireEvent.change(screen.getByLabelText(/Data desejada/i), {
    target: { value: "2026-07-15" },
  });
}

describe("Página de Agendamento", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deve renderizar o hero da página", () => {
    renderAgendar();
    expect(
      screen.getByRole("heading", { name: /Agende seu evento ♡/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Preencha o formulário e a gente cuida da magia!")
    ).toBeInTheDocument();
  });

  it("deve renderizar os 5 cards de tipo de serviço como radios", () => {
    renderAgendar();
    const tipos = [
      /Aniversário temático/i,
      /Formatura \/ Confraternização/i,
      /Encomenda de doces\/comidas/i,
      /Evento personalizado/i,
      /Delivery/i,
    ];
    for (const tipo of tipos) {
      expect(screen.getByRole("radio", { name: tipo })).toBeInTheDocument();
    }
  });

  it("deve renderizar todos os campos do formulário", () => {
    renderAgendar();
    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data desejada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Horário preferido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Local do evento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Número de convidados/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Detalhes adicionais/i)).toBeInTheDocument();
  });

  it("deve abrir o WhatsApp com a mensagem formatada ao enviar", () => {
    const abrirJanela = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);
    renderAgendar();

    preencherObrigatorios();
    fireEvent.change(screen.getByLabelText(/Horário preferido/i), {
      target: { value: "15:00" },
    });
    fireEvent.change(screen.getByLabelText(/Local do evento/i), {
      target: { value: "Minha casa" },
    });
    fireEvent.change(screen.getByLabelText(/Número de convidados/i), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText(/Detalhes adicionais/i), {
      target: { value: "Tema Sailor Moon, 2 veganos" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Enviar pelo WhatsApp ♡/i })
    );

    expect(abrirJanela).toHaveBeenCalledTimes(1);
    const url = abrirJanela.mock.calls[0][0] as string;
    expect(url).toContain("https://wa.me/5584998350914?text=");

    const mensagem = decodeURIComponent(url.split("?text=")[1]);
    expect(mensagem).toContain("🎀 Novo pedido — Mew Mew Café 🎀");
    expect(mensagem).toContain("Tipo: Aniversário temático");
    expect(mensagem).toContain("Nome: João Silva");
    expect(mensagem).toContain("Telefone: (84) 99999-9999");
    expect(mensagem).toContain("Data: 15/07/2026");
    expect(mensagem).toContain("Horário: 15:00");
    expect(mensagem).toContain("Local: Minha casa");
    expect(mensagem).toContain("Convidados: 30");
    expect(mensagem).toContain("Detalhes: Tema Sailor Moon, 2 veganos");
    expect(mensagem).toContain("Enviado pelo site mewworld.space");
  });

  it("não deve enviar e deve mostrar erros se os obrigatórios faltarem", () => {
    const abrirJanela = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);
    renderAgendar();

    fireEvent.click(
      screen.getByRole("button", { name: /Enviar pelo WhatsApp ♡/i })
    );

    expect(abrirJanela).not.toHaveBeenCalled();
    expect(screen.getByText(/Escolha o tipo de serviço/i)).toBeInTheDocument();
    expect(screen.getByText(/Informe seu nome/i)).toBeInTheDocument();
  });

  it("não deve enviar com telefone incompleto", () => {
    const abrirJanela = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);
    renderAgendar();

    preencherObrigatorios();
    fireEvent.change(screen.getByLabelText(/Telefone/i), {
      target: { value: "8499" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Enviar pelo WhatsApp ♡/i })
    );

    expect(abrirJanela).not.toHaveBeenCalled();
    expect(screen.getByText(/Telefone inválido/i)).toBeInTheDocument();
  });
});
