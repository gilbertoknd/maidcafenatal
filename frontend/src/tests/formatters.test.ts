import { describe, it, expect } from "vitest";
import { formatCurrency } from "../utils/formatters";

describe("formatters", () => {
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
});
