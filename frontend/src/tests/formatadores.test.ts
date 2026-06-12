import { describe, it, expect } from "vitest";
import { formatCurrency, formatEventDate } from "../utils/formatadores";

describe("formatadores", () => {
  describe("formatCurrency", () => {
    it("should format number to BRL currency", () => {
      expect(formatCurrency(10)).toContain("R$");
      expect(formatCurrency(10)).toContain("10,00");
    });

    it("should format string number to BRL currency", () => {
      expect(formatCurrency("25.50")).toContain("R$");
      expect(formatCurrency("25.50")).toContain("25,50");
    });
  });

  describe("formatEventDate", () => {
    it("should format single-day event correctly", () => {
      const dataInicio = "2026-06-12T13:00:00.000Z";
      const formatted = formatEventDate(dataInicio);
      expect(formatted).toContain("12");
      expect(formatted).toContain("junho");
    });

    it("should format same-day event with end time correctly", () => {
      const dataInicio = "2026-06-12T13:00:00.000Z";
      const dataFim = "2026-06-12T21:00:00.000Z";
      const formatted = formatEventDate(dataInicio, dataFim);
      expect(formatted).toContain("12");
      expect(formatted).toContain("junho");
      expect(formatted).toContain("das");
      expect(formatted).toContain("às");
    });

    it("should format multi-day event correctly", () => {
      const dataInicio = "2026-06-12T13:00:00.000Z";
      const dataFim = "2026-06-14T21:00:00.000Z";
      const formatted = formatEventDate(dataInicio, dataFim);
      expect(formatted).toContain("De");
      expect(formatted).toContain("12");
      expect(formatted).toContain("junho");
      expect(formatted).toContain("até");
      expect(formatted).toContain("14");
    });
  });
});
