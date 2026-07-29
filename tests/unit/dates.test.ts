import { describe, it, expect } from "vitest";

describe("Date utilities", () => {
  it("should format date correctly", () => {
    const date = new Date("2024-01-15T10:30:00");
    const formatted = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    expect(formatted).toContain("15");
  });

  it("should get daypart correctly", () => {
    const getDaypart = (hour: number): string => {
      if (hour >= 5 && hour < 11) return "pagi";
      if (hour >= 11 && hour < 15) return "siang";
      if (hour >= 15 && hour < 19) return "sore";
      return "malam";
    };

    expect(getDaypart(7)).toBe("pagi");
    expect(getDaypart(12)).toBe("siang");
    expect(getDaypart(16)).toBe("sore");
    expect(getDaypart(20)).toBe("malam");
    expect(getDaypart(2)).toBe("malam");
  });

  it("should calculate elapsed time correctly", () => {
    const start = new Date("2024-01-15T10:00:00").getTime();
    const end = new Date("2024-01-15T10:25:00").getTime();
    const elapsed = Math.floor((end - start) / 1000);

    expect(elapsed).toBe(1500); // 25 minutes in seconds
  });
});
