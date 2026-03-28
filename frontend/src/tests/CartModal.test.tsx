import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartModal } from "../components/CartModal";
import { CarrinhoProvider, useCarrinho } from "../hooks/useCarrinho";
import { useEffect } from "react";

// Mocking the api so we don't do real calls
vi.mock("../services/api", () => ({
  enviarPedido: vi.fn().mockResolvedValue({ pedido_id: 1, total: "10.00" }),
}));
// Ignore Mapbox inside tests 
vi.mock("../components/AddressMapModal", () => ({
  AddressMapModal: () => <div data-testid="address-map-modal"></div>
}));

function ModalOpener() {
  const { setEstaAberto } = useCarrinho();
  useEffect(() => {
    setEstaAberto(true);
  }, []);
  return null;
}

describe("Componente CartModal", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve renderizar o carrinho vazio corretamente", () => {
    render(
      <CarrinhoProvider>
        <ModalOpener />
        <CartModal />
      </CarrinhoProvider>
    );
    expect(screen.getByText("Seu carrinho está vazio.")).toBeDefined();
  });
});
