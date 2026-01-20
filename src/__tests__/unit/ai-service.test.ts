/**
 * Unit Tests for AI Service
 * Tests prompt construction logic in src/lib/ai-service.ts
 */

// Mock @google/genai before imports to avoid ESM transform issues
jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn(),
  Type: {
    OBJECT: "object",
    STRING: "string",
  },
}));

import {
  constructPrompt,
  getAvailableProviders,
  getDefaultProvider,
} from "@/lib/ai-service";
import {
  FaithPreference,
  StoryLength,
  StoryTheme,
  AIProvider,
  ChildStatus,
  type StoryGenerationConfig,
} from "@/lib/types";

describe("constructPrompt", () => {
  const baseConfig: StoryGenerationConfig = {
    theme: StoryTheme.NATURE_CALM,
    length: StoryLength.SHORT,
    faithPreference: FaithPreference.NON_RELIGIOUS,
    parentOneName: "Mom",
  };

  describe("Persona Selection", () => {
    it("should use prenatal persona by default", () => {
      const prompt = constructPrompt(baseConfig);
      expect(prompt).toContain("prenatal storytelling companion");
      expect(prompt).toContain("unborn baby");
    });

    it("should use prenatal persona when childStatus is PRENATAL", () => {
      const config = { ...baseConfig, childStatus: ChildStatus.PRENATAL };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("prenatal storytelling companion");
      expect(prompt).toContain("unborn baby");
    });

    it("should use born persona when childStatus is BORN", () => {
      const config = { ...baseConfig, childStatus: ChildStatus.BORN };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("storyteller for a young baby");
      expect(prompt).not.toContain("unborn");
    });
  });

  describe("Faith Preference", () => {
    it("should include faith-based instructions", () => {
      const config = {
        ...baseConfig,
        faithPreference: FaithPreference.FAITH_BASED,
      };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("God's love");
      expect(prompt).toContain("blessings");
    });

    it("should include spiritual instructions", () => {
      const config = {
        ...baseConfig,
        faithPreference: FaithPreference.SPIRITUAL,
      };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("universal connection");
      expect(prompt).toContain("light");
      expect(prompt).toContain("energy");
    });

    it("should include non-religious instructions", () => {
      const config = {
        ...baseConfig,
        faithPreference: FaithPreference.NON_RELIGIOUS,
      };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("love, biology, nature");
      expect(prompt).toContain("without spiritual references");
    });
  });

  describe("Theme Selection", () => {
    it("should include specific theme context for non-surprise themes", () => {
      const config = { ...baseConfig, theme: StoryTheme.LOVE_BONDING };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("Love & Bonding");
    });

    it("should use random theme instruction for SURPRISE theme (prenatal)", () => {
      const config = {
        ...baseConfig,
        theme: StoryTheme.SURPRISE,
        childStatus: ChildStatus.PRENATAL,
      };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("random theme suitable for a baby in the womb");
    });

    it("should use random theme instruction for SURPRISE theme (born)", () => {
      const config = {
        ...baseConfig,
        theme: StoryTheme.SURPRISE,
        childStatus: ChildStatus.BORN,
      };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("random theme suitable for a young baby");
    });

    it("should handle all theme types", () => {
      const themes = [
        { theme: StoryTheme.COLORS_SHAPES, expected: "Colors & Shapes" },
        { theme: StoryTheme.NATURE_CALM, expected: "Nature & Calm" },
        { theme: StoryTheme.SPIRITUAL_LIGHT, expected: "Spiritual & Light" },
        { theme: StoryTheme.RHYTHM_SOUND, expected: "Rhythm & Sound" },
        { theme: StoryTheme.FAMILY_LEGACY, expected: "Family Legacy" },
        {
          theme: StoryTheme.DISCIPLINE_VALUES,
          expected: "Discipline & Values",
        },
      ];

      themes.forEach(({ theme, expected }) => {
        const config = { ...baseConfig, theme };
        const prompt = constructPrompt(config);
        expect(prompt).toContain(expected);
      });
    });
  });

  describe("Story Length", () => {
    it("should include word count range for SHORT stories", () => {
      const config = { ...baseConfig, length: StoryLength.SHORT };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("200");
      expect(prompt).toContain("300");
    });

    it("should include word count range for QUICK stories", () => {
      const config = { ...baseConfig, length: StoryLength.QUICK };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("150");
      expect(prompt).toContain("200");
    });

    it("should include word count range for STANDARD stories", () => {
      const config = { ...baseConfig, length: StoryLength.STANDARD };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("350");
      expect(prompt).toContain("450");
    });

    it("should include word count range for LONG stories", () => {
      const config = { ...baseConfig, length: StoryLength.LONG };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("500");
      expect(prompt).toContain("600");
    });
  });

  describe("Name Context", () => {
    it("should include baby nickname when provided", () => {
      const config = { ...baseConfig, babyNickname: "Bean" };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("Bean");
      expect(prompt).toContain("affectionately called");
    });

    it("should use generic baby reference when no nickname", () => {
      const prompt = constructPrompt(baseConfig);
      expect(prompt).toContain("little one");
    });

    it("should include single parent name", () => {
      const config = { ...baseConfig, parentOneName: "Sarah" };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("Sarah");
      expect(prompt).toContain("parent reading this");
    });

    it("should include both parent names when provided", () => {
      const config = {
        ...baseConfig,
        parentOneName: "Sarah",
        parentTwoName: "Mike",
      };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("Sarah");
      expect(prompt).toContain("Mike");
      expect(prompt).toContain("parents reading this");
    });
  });

  describe("Date Context", () => {
    it("should include due date for prenatal stories", () => {
      const config = {
        ...baseConfig,
        dueDate: "May 2026",
        childStatus: ChildStatus.PRENATAL,
      };
      const prompt = constructPrompt(config);
      expect(prompt).toContain("May 2026");
      expect(prompt).toContain("expected around");
    });

    it("should NOT include due date for born stories", () => {
      const config = {
        ...baseConfig,
        dueDate: "May 2026",
        childStatus: ChildStatus.BORN,
      };
      const prompt = constructPrompt(config);
      expect(prompt).not.toContain("expected around");
    });
  });

  describe("Output Format", () => {
    it("should request JSON output format", () => {
      const prompt = constructPrompt(baseConfig);
      expect(prompt).toContain("JSON object");
      expect(prompt).toContain("title");
      expect(prompt).toContain("content");
    });

    it("should include calming/safety instructions", () => {
      const prompt = constructPrompt(baseConfig);
      expect(prompt).toContain("calming");
      expect(prompt).toContain("safety");
      expect(prompt).toContain("love");
    });

    it("should include formatting instructions", () => {
      const prompt = constructPrompt(baseConfig);
      expect(prompt).toContain("paragraph breaks");
      expect(prompt).toContain("punctuation");
    });
  });
});

describe("getAvailableProviders", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should return Gemini when GEMINI_API_KEY is set", () => {
    process.env.GEMINI_API_KEY = "test-key";
    const providers = getAvailableProviders();
    expect(providers).toContain(AIProvider.GEMINI);
  });

  it("should return empty array when no API key is set", () => {
    delete process.env.GEMINI_API_KEY;
    const providers = getAvailableProviders();
    expect(providers).toEqual([]);
  });
});

describe("getDefaultProvider", () => {
  it("should return Gemini as default provider", () => {
    const provider = getDefaultProvider();
    expect(provider).toBe(AIProvider.GEMINI);
  });
});
