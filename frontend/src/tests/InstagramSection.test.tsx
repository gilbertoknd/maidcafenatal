import "../setupTests";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { InstagramSection } from "../components/InstagramSection";
import * as api from "../services/api";
import type { InstagramPost } from "../types/Instagram";

vi.mock("../services/api", () => ({
  buscarInstagramPosts: vi.fn(),
}));

const mockPosts: InstagramPost[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  imagem_url: `/images/post${i + 1}.jpg`,
  link_url: `https://www.instagram.com/p/${i + 1}`,
  visivel: true,
  ordem: i + 1,
  criado_em: "2026-05-01T10:00:00.000Z",
}));

describe("InstagramSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.buscarInstagramPosts).mockResolvedValue(mockPosts);
  });

  it("should render correct handle and links", async () => {
    render(<InstagramSection />);

    const handles = await screen.findAllByText(/@mewmewnatal/i);
    expect(handles.length).toBeGreaterThan(0);
  });

  it("should show 5 dynamic posts and the 6th card as a redirect", async () => {
    render(<InstagramSection />);

    // espera os posts carregarem de fato (e não o estado de loading)
    await screen.findByTestId("instagram-primeiro-post");

    const links = screen.getAllByRole("link");
    const profileLinks = links.filter(
      (link) =>
        link.getAttribute("href") === "https://www.instagram.com/mewmewnatal/"
    );
    const postLinks = links.filter((link) =>
      link.getAttribute("href")?.includes("/p/")
    );

    expect(postLinks.length).toBe(5);
    expect(profileLinks.length).toBe(1);
  });

  it("deve renderizar o primeiro post no topo da ordem", async () => {
    render(<InstagramSection />);

    const primeiro = await screen.findByTestId("instagram-primeiro-post");
    // o primeiro é o primeiro post da ordem
    expect(primeiro).toHaveAttribute("href", "https://www.instagram.com/p/1");
  });

  it("não deve renderizar nada se não houver posts", async () => {
    vi.mocked(api.buscarInstagramPosts).mockResolvedValue([]);
    const { container } = render(<InstagramSection />);

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });
});
