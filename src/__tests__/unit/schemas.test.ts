/**
 * Unit Tests for Zod Schemas
 * Tests validation logic in src/lib/schemas.ts
 */

import {
  storyGenerationConfigSchema,
  userProfileSchema,
  updateProfileSchema,
  signInSchema,
  createStorySchema,
} from "@/lib/schemas";
import {
  FaithPreference,
  StoryLength,
  StoryTheme,
  AIProvider,
  ChildStatus,
} from "@/lib/types";

describe("storyGenerationConfigSchema", () => {
  const validConfig = {
    theme: StoryTheme.NATURE_CALM,
    length: StoryLength.SHORT,
    faithPreference: FaithPreference.NON_RELIGIOUS,
    parentOneName: "Mom",
  };

  it("should accept valid config with required fields only", () => {
    const result = storyGenerationConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it("should accept valid config with all optional fields", () => {
    const fullConfig = {
      ...validConfig,
      parentTwoName: "Dad",
      babyNickname: "Bean",
      dueDate: "May 2026",
      childStatus: ChildStatus.PRENATAL,
      aiProvider: AIProvider.GEMINI,
    };
    const result = storyGenerationConfigSchema.safeParse(fullConfig);
    expect(result.success).toBe(true);
  });

  it("should reject missing parentOneName", () => {
    const invalid = { ...validConfig, parentOneName: undefined };
    const result = storyGenerationConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject empty parentOneName", () => {
    const invalid = { ...validConfig, parentOneName: "" };
    const result = storyGenerationConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("required");
    }
  });

  it("should reject parentOneName exceeding 50 characters", () => {
    const invalid = { ...validConfig, parentOneName: "A".repeat(51) };
    const result = storyGenerationConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject invalid theme enum value", () => {
    const invalid = { ...validConfig, theme: "invalid_theme" };
    const result = storyGenerationConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject invalid length enum value", () => {
    const invalid = { ...validConfig, length: "extra_long" };
    const result = storyGenerationConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should reject invalid faithPreference enum value", () => {
    const invalid = { ...validConfig, faithPreference: "atheist" };
    const result = storyGenerationConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should accept all valid theme values", () => {
    Object.values(StoryTheme).forEach((theme) => {
      const config = { ...validConfig, theme };
      const result = storyGenerationConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  it("should accept all valid length values", () => {
    Object.values(StoryLength).forEach((length) => {
      const config = { ...validConfig, length };
      const result = storyGenerationConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  it("should accept all valid faithPreference values", () => {
    Object.values(FaithPreference).forEach((faithPreference) => {
      const config = { ...validConfig, faithPreference };
      const result = storyGenerationConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });
});

describe("createStorySchema", () => {
  const validInput = {
    userId: "clxxxxxxxxxxxxxxxxxxxxxxxxx", // CUID format
    config: {
      theme: StoryTheme.NATURE_CALM,
      length: StoryLength.SHORT,
      faithPreference: FaithPreference.NON_RELIGIOUS,
      parentOneName: "Mom",
    },
  };

  it("should accept valid input with CUID userId", () => {
    const result = createStorySchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject invalid userId format", () => {
    const invalid = { ...validInput, userId: "not-a-cuid" };
    const result = createStorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should accept optional profileId", () => {
    const withProfile = {
      ...validInput,
      profileId: "clyyyyyyyyyyyyyyyyyyyyyyyyy",
    };
    const result = createStorySchema.safeParse(withProfile);
    expect(result.success).toBe(true);
  });
});

describe("userProfileSchema", () => {
  const validProfile = {
    parentOneName: "Mom",
    faithPreference: FaithPreference.SPIRITUAL,
    childStatus: ChildStatus.PRENATAL,
    darkMode: false,
    fontSize: "normal" as const,
  };

  it("should accept valid profile with required fields", () => {
    const result = userProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it("should accept valid profile with all optional fields", () => {
    const fullProfile = {
      ...validProfile,
      parentTwoName: "Dad",
      babyNickname: "Bean",
      dueDate: "2026-05-15",
      defaultTheme: StoryTheme.LOVE_BONDING,
      defaultLength: StoryLength.STANDARD,
      birthDate: null,
    };
    const result = userProfileSchema.safeParse(fullProfile);
    expect(result.success).toBe(true);
  });

  it("should reject invalid dueDate format", () => {
    const invalid = { ...validProfile, dueDate: "not-a-date" };
    const result = userProfileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Invalid date");
    }
  });

  it("should accept valid date formats", () => {
    const withDate = { ...validProfile, dueDate: "2026-05-15" };
    const result = userProfileSchema.safeParse(withDate);
    expect(result.success).toBe(true);
  });

  it("should reject invalid fontSize value", () => {
    const invalid = { ...validProfile, fontSize: "xlarge" };
    const result = userProfileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should accept both fontSize values", () => {
    expect(
      userProfileSchema.safeParse({ ...validProfile, fontSize: "normal" })
        .success,
    ).toBe(true);
    expect(
      userProfileSchema.safeParse({ ...validProfile, fontSize: "large" })
        .success,
    ).toBe(true);
  });
});

describe("updateProfileSchema", () => {
  it("should accept partial updates", () => {
    const partial = { darkMode: true };
    const result = updateProfileSchema.safeParse(partial);
    expect(result.success).toBe(true);
  });

  it("should accept empty object (no updates)", () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should still validate field constraints on partial updates", () => {
    const invalid = { parentOneName: "" };
    const result = updateProfileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("should accept valid email and password", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "securepassword123",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email format", () => {
    const result = signInSchema.safeParse({
      email: "not-an-email",
      password: "password",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("email");
    }
  });

  it("should reject empty password", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("required");
    }
  });

  it("should reject missing email", () => {
    const result = signInSchema.safeParse({ password: "password" });
    expect(result.success).toBe(false);
  });

  it("should reject missing password", () => {
    const result = signInSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(false);
  });
});
