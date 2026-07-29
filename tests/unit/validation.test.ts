import { describe, it, expect } from "vitest";
import { signUpSchema, signInSchema } from "@/lib/validation/auth";

describe("Auth Validation", () => {
  describe("signUpSchema", () => {
    it("should validate correct input", () => {
      const validInput = {
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        display_name: "Test User",
      };

      const result = signUpSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidInput = {
        email: "not-an-email",
        password: "password123",
        username: "testuser",
        display_name: "Test User",
      };

      const result = signUpSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const invalidInput = {
        email: "test@example.com",
        password: "short",
        username: "testuser",
        display_name: "Test User",
      };

      const result = signUpSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject invalid username characters", () => {
      const invalidInput = {
        email: "test@example.com",
        password: "password123",
        username: "Test User!",
        display_name: "Test User",
      };

      const result = signUpSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject short username", () => {
      const invalidInput = {
        email: "test@example.com",
        password: "password123",
        username: "ab",
        display_name: "Test User",
      };

      const result = signUpSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe("signInSchema", () => {
    it("should validate correct input", () => {
      const validInput = {
        email: "test@example.com",
        password: "password123",
      };

      const result = signInSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject empty password", () => {
      const invalidInput = {
        email: "test@example.com",
        password: "",
      };

      const result = signInSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
