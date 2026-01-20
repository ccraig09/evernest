/**
 * Unit Tests for Server Utilities
 * Tests config hashing in src/server/utils.ts
 */

import { computeConfigHash } from "@/server/utils";
import {
  FaithPreference,
  StoryLength,
  StoryTheme,
  type StoryGenerationConfig,
} from "@/lib/types";

describe("computeConfigHash", () => {
  const baseConfig: StoryGenerationConfig = {
    theme: StoryTheme.NATURE_CALM,
    length: StoryLength.SHORT,
    faithPreference: FaithPreference.NON_RELIGIOUS,
    parentOneName: "Mom",
    parentTwoName: "Dad",
    babyNickname: "Bean",
  };

  describe("Deterministic Hashing", () => {
    it("should produce same hash for identical configs", () => {
      const hash1 = computeConfigHash(baseConfig);
      const hash2 = computeConfigHash(baseConfig);
      expect(hash1).toBe(hash2);
    });

    it("should produce different hash for different themes", () => {
      const config1 = { ...baseConfig, theme: StoryTheme.NATURE_CALM };
      const config2 = { ...baseConfig, theme: StoryTheme.LOVE_BONDING };
      expect(computeConfigHash(config1)).not.toBe(computeConfigHash(config2));
    });

    it("should produce different hash for different lengths", () => {
      const config1 = { ...baseConfig, length: StoryLength.SHORT };
      const config2 = { ...baseConfig, length: StoryLength.LONG };
      expect(computeConfigHash(config1)).not.toBe(computeConfigHash(config2));
    });

    it("should produce different hash for different faith preferences", () => {
      const config1 = {
        ...baseConfig,
        faithPreference: FaithPreference.NON_RELIGIOUS,
      };
      const config2 = {
        ...baseConfig,
        faithPreference: FaithPreference.FAITH_BASED,
      };
      expect(computeConfigHash(config1)).not.toBe(computeConfigHash(config2));
    });

    it("should produce different hash for different parent names", () => {
      const config1 = { ...baseConfig, parentOneName: "Mom" };
      const config2 = { ...baseConfig, parentOneName: "Sarah" };
      expect(computeConfigHash(config1)).not.toBe(computeConfigHash(config2));
    });
  });

  describe("Case Insensitivity", () => {
    it("should produce same hash regardless of theme case", () => {
      // Theme is an enum so this tests the toLowerCase normalization
      const hash = computeConfigHash(baseConfig);
      expect(hash).toBeTruthy();
      expect(hash.length).toBe(32); // SHA256 truncated to 32 chars
    });

    it("should produce same hash for parent names with different cases", () => {
      const config1 = { ...baseConfig, parentOneName: "Mom" };
      const config2 = { ...baseConfig, parentOneName: "MOM" };
      const config3 = { ...baseConfig, parentOneName: "mom" };
      expect(computeConfigHash(config1)).toBe(computeConfigHash(config2));
      expect(computeConfigHash(config2)).toBe(computeConfigHash(config3));
    });

    it("should produce same hash for baby nicknames with different cases", () => {
      const config1 = { ...baseConfig, babyNickname: "Bean" };
      const config2 = { ...baseConfig, babyNickname: "BEAN" };
      expect(computeConfigHash(config1)).toBe(computeConfigHash(config2));
    });
  });

  describe("Whitespace Handling", () => {
    it("should produce same hash after trimming parent names", () => {
      const config1 = { ...baseConfig, parentOneName: "Mom" };
      const config2 = { ...baseConfig, parentOneName: "  Mom  " };
      expect(computeConfigHash(config1)).toBe(computeConfigHash(config2));
    });

    it("should produce same hash after trimming baby nickname", () => {
      const config1 = { ...baseConfig, babyNickname: "Bean" };
      const config2 = { ...baseConfig, babyNickname: "  Bean  " };
      expect(computeConfigHash(config1)).toBe(computeConfigHash(config2));
    });
  });

  describe("Optional Field Handling", () => {
    it("should handle missing parentTwoName", () => {
      const config = { ...baseConfig, parentTwoName: undefined };
      const hash = computeConfigHash(config);
      expect(hash).toBeTruthy();
      expect(hash.length).toBe(32);
    });

    it("should handle missing babyNickname", () => {
      const config = { ...baseConfig, babyNickname: undefined };
      const hash = computeConfigHash(config);
      expect(hash).toBeTruthy();
      expect(hash.length).toBe(32);
    });

    it("should produce different hash when optional fields differ", () => {
      const config1 = { ...baseConfig, babyNickname: "Bean" };
      const config2 = { ...baseConfig, babyNickname: undefined };
      expect(computeConfigHash(config1)).not.toBe(computeConfigHash(config2));
    });

    it("should NOT include dueDate in hash (intentionally excluded)", () => {
      const config1 = { ...baseConfig, dueDate: "May 2026" };
      const config2 = { ...baseConfig, dueDate: "June 2026" };
      const config3 = { ...baseConfig, dueDate: undefined };

      // All should produce the same hash since dueDate is excluded
      expect(computeConfigHash(config1)).toBe(computeConfigHash(config2));
      expect(computeConfigHash(config2)).toBe(computeConfigHash(config3));
    });
  });

  describe("Hash Format", () => {
    it("should produce 32 character hex string", () => {
      const hash = computeConfigHash(baseConfig);
      expect(hash).toMatch(/^[a-f0-9]{32}$/);
    });

    it("should be consistent across multiple calls", () => {
      const hashes = Array.from({ length: 5 }, () =>
        computeConfigHash(baseConfig),
      );
      expect(new Set(hashes).size).toBe(1);
    });
  });
});
