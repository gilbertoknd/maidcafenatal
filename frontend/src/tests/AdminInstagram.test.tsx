import "../setupTests";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminInstagram } from "../components/AdminInstagram";
import styles from "../components/AdminInstagram/styles.module.css";
import { BrowserRouter } from "react-router-dom";
import * as api from "../services/api";
import type { InstagramPost } from "../types/Instagram";

vi.mock("../services/api", () => ({
  buscarInstagramPostsAdmin: vi.fn(),
  criarInstagramPost: vi.fn(),
  atualizarInstagramPost: vi.fn(),
  deletarInstagramPost: vi.fn(),
}));

const mockPosts: InstagramPost[] = [
  {
    id: 1,
    imagem_url: "/images/post1.jpg",
    link_url: "https://www.instagram.com/p/123",
    visivel: true,
    ordem: 1,
    criado_em: "2026-05-01T10:00:00.000Z",
  },
];

describe("AdminInstagram Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.buscarInstagramPostsAdmin).mockResolvedValue(mockPosts);
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("should render posts list on mount", async () => {
    render(
      <BrowserRouter>
        <AdminInstagram />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("https://www.instagram.com/p/123")).toBeInTheDocument();
    });
  });

  it("should open and close the modal when clicking outside (overlay)", async () => {
    render(
      <BrowserRouter>
        <AdminInstagram />
      </BrowserRouter>
    );

    await screen.findByText("https://www.instagram.com/p/123");

    // Open modal for new post
    const addButton = (await screen.findAllByText(/Novo Post/i)).find(el => el.tagName === 'BUTTON' || el.closest('button'));
    if (addButton) fireEvent.click(addButton);

    expect(await screen.findByRole("heading", { name: /Novo Post/i })).toBeInTheDocument();

    // Click outside (on the overlay)
    const overlay = screen.getByTestId("modal-overlay");
    fireEvent.click(overlay);

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /Novo Post/i })).not.toBeInTheDocument();
    });
  });

  it("should NOT close the modal when clicking inside the modal content", async () => {
    render(
      <BrowserRouter>
        <AdminInstagram />
      </BrowserRouter>
    );

    await screen.findByText("https://www.instagram.com/p/123");

    // Open modal
    const addButton = (await screen.findAllByText(/Novo Post/i)).find(el => el.tagName === 'BUTTON' || el.closest('button'));
    if (addButton) fireEvent.click(addButton);

    const modal = (await screen.findByRole("heading", { name: /Novo Post/i })).closest(`.${styles.modal}`);
    if (modal) {
      // Clicking the modal content should NOT close it
      fireEvent.click(modal);
    }

    // Modal should still be there
    expect(await screen.findByRole("heading", { name: /Novo Post/i })).toBeInTheDocument();
  });
});
