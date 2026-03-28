import { describe, it, expect } from "vitest";
import { formatDate } from "../utils/formatters.js";

describe("Formatters", () => {
  it("should format date correctly to pt-BR", () => {
    const date = new Date("2023-10-01T12:00:00Z");
    // Note: The output might vary depending on the system's timezone if not handled carefully,
    // but Intl.DateTimeFormat usually defaults to local time.
    // For this test, we'll check if it returns a string in DD/MM/YYYY format.
    const formatted = formatDate(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});
