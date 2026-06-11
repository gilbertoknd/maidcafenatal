import "../setupTests";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AddressMapModal } from "../components/AddressMapModal";

const { flyTo } = vi.hoisted(() => ({ flyTo: vi.fn() }));

// Leaflet não roda em jsdom — mockamos os blocos do react-leaflet
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => null,
  useMapEvents: () => ({ getCenter: () => ({ lat: -5.805, lng: -35.209 }) }),
  useMap: () => ({ flyTo }),
}));

// Local público usado apenas como fixture de teste (não é endereço do negócio)
const sugestaoNominatim = [
  {
    display_name:
      "Midway Mall, Avenida Bernardo Vieira, Tirol, Natal, Rio Grande do Norte, Brasil",
    lat: "-5.8050",
    lon: "-35.2122",
  },
];

function mockFetch() {
  return vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
    const endereco = String(url);
    if (endereco.includes("/search")) {
      return Promise.resolve({
        json: () => Promise.resolve(sugestaoNominatim),
      } as Response);
    }
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          address: { road: "Avenida Bernardo Vieira", suburb: "Tirol" },
        }),
    } as Response);
  });
}

function renderModal(onConfirm = vi.fn()) {
  return render(
    <AddressMapModal isOpen={true} onClose={vi.fn()} onConfirm={onConfirm} />
  );
}

describe("AddressMapModal — busca de endereço", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    flyTo.mockClear();
  });

  it("deve renderizar o campo de busca de endereço", () => {
    mockFetch();
    renderModal();
    expect(
      screen.getByPlaceholderText(/Digite seu endereço/i)
    ).toBeInTheDocument();
  });

  it("deve buscar sugestões ao digitar o endereço", async () => {
    const fetchSpy = mockFetch();
    renderModal();

    fireEvent.change(screen.getByPlaceholderText(/Digite seu endereço/i), {
      target: { value: "Midway Mall" },
    });

    const sugestao = await screen.findByRole("button", {
      name: /Tirol, Natal/i,
    });
    expect(sugestao).toBeInTheDocument();
    expect(
      fetchSpy.mock.calls.some(([url]) =>
        String(url).includes("nominatim.openstreetmap.org/search")
      )
    ).toBe(true);
  });

  it("ao escolher uma sugestão, deve voar o mapa até o local", async () => {
    mockFetch();
    renderModal();

    fireEvent.change(screen.getByPlaceholderText(/Digite seu endereço/i), {
      target: { value: "Midway Mall" },
    });
    fireEvent.click(
      await screen.findByRole("button", { name: /Tirol, Natal/i })
    );

    await waitFor(() => {
      expect(flyTo).toHaveBeenCalledWith([-5.805, -35.2122], 17);
    });
    // a lista de sugestões some após a escolha
    expect(
      screen.queryByRole("button", { name: /Tirol, Natal/i })
    ).not.toBeInTheDocument();
  });

  it("deve confirmar com as coordenadas da sugestão escolhida", async () => {
    mockFetch();
    const onConfirm = vi.fn();
    renderModal(onConfirm);

    fireEvent.change(screen.getByPlaceholderText(/Digite seu endereço/i), {
      target: { value: "Midway Mall" },
    });
    fireEvent.click(
      await screen.findByRole("button", { name: /Tirol, Natal/i })
    );

    const confirmar = screen.getByRole("button", {
      name: /Confirmar este local/i,
    });
    await waitFor(() => expect(confirmar).not.toBeDisabled());
    fireEvent.click(confirmar);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    const dados = onConfirm.mock.calls[0][0];
    expect(dados.lat).toBeCloseTo(-5.805);
    expect(dados.lng).toBeCloseTo(-35.2122);
    expect(dados.address).toMatch(/Midway Mall/i);
  });
});
