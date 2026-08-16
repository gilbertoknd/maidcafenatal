import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Admin } from "../pages/Admin";
import { BrowserRouter } from "react-router-dom";

// Mock o Dashboard para não renderizar as complexidades dele
vi.mock("../components/AdminDashboard", () => ({
  default: () => <div data-testid="admin-dashboard">DASHBOARD AUTENTICADO</div>,
}));

// Mock o Login Modal para pegar a interceptação
vi.mock("../components/LoginModal", () => ({
  default: () => <div data-testid="login-modal">LOGIN REQUIRED</div>,
}));

describe("Admin Route Protection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("deve renderizar o Login Modal se a sessão não for válida (verify 401)", async () => {
    // O cookie HttpOnly não é lido pelo JS: a auth é verificada no servidor.
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));

    render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    expect(await screen.findByTestId("login-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-dashboard")).not.toBeInTheDocument();
  });

  it("deve renderizar o Dashboard se a sessão for válida (verify 200)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200 }));

    render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    expect(await screen.findByTestId("admin-dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });
});
