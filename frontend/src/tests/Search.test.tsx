import "../setupTests";
import "../setupTests";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Search } from "../components/Search";

describe("Search Component", () => {
  it("should render input field", () => {
    render(<Search value="" onChange={() => {}} />);
    expect(
      screen.getByPlaceholderText("Buscar delícias...")
    ).toBeInTheDocument();
  });

  it("should call onChange when typing", () => {
    const handleChange = vi.fn();
    render(<Search value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Buscar delícias...");
    fireEvent.change(input, { target: { value: "Bolo" } });

    expect(handleChange).toHaveBeenCalledWith("Bolo");
  });

  it("should display the correct value", () => {
    const handleChange = vi.fn();
    render(<Search value="Café" onChange={handleChange} />);
    const input = screen.getByPlaceholderText(
      "Buscar delícias..."
    ) as HTMLInputElement;

    expect(input.value).toBe("Café");
  });
});
