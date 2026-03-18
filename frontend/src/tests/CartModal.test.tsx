import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartModal } from "../components/CartModal";
import { CartProvider, useCart } from "../hooks/useCart";
import { useEffect } from "react";

// Mocking the api so we don't do real calls
vi.mock("../services/api", () => ({
  sendOrderToBackend: vi.fn().mockResolvedValue({ orderId: 1, total: "10.00" }),
}));
// Ignore Mapbox inside tests 
vi.mock("../components/AddressMapModal", () => ({
  AddressMapModal: () => <div data-testid="address-map-modal"></div>
}));

function ModalOpener() {
  const { setIsCartOpen } = useCart();
  useEffect(() => {
    setIsCartOpen(true);
  }, []);
  return null;
}

describe("CartModal Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should render empty cart correctly", () => {
    render(
      <CartProvider>
        <ModalOpener />
        <CartModal />
      </CartProvider>
    );
    expect(screen.getByText("Seu carrinho está vazio.")).toBeDefined();
  });
});
