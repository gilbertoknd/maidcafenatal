import "../setupTests";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("deve renderizar o Login Modal se não existir token", () => {
    // Sem setar localStorage
    render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    expect(screen.getByTestId("login-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-dashboard")).not.toBeInTheDocument();
  });

  it("deve renderizar o Dashboard se o token estiver presente", () => {
    // Setando o token para bypass
    window.localStorage.setItem("token", "fake-jwt-token");
    
    render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    expect(screen.getByTestId("admin-dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });
});
