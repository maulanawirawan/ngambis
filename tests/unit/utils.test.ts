import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils/cn";

describe("cn utility", () => {
  it("should merge class names", () => {
    const result = cn("px-4", "py-2");
    expect(result).toBe("px-4 py-2");
  });

  it("should handle conditional classes", () => {
    const result = cn("px-4", false && "py-2", "bg-red-500");
    expect(result).toBe("px-4 bg-red-500");
  });

  it("should merge Tailwind classes correctly", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("should handle undefined and null", () => {
    const result = cn("px-4", undefined, null, "py-2");
    expect(result).toBe("px-4 py-2");
  });
});
