import { z } from "zod";
import {
  FaithPreference,
  StoryLength,
  StoryTheme,
  AIProvider,
  ChildStatus,
  AgeGroup,
} from "./types";

// ============================================================================
// Story Validation Schemas
// ============================================================================

export const storyGenerationConfigSchema = z.object({
  theme: z.nativeEnum(StoryTheme),
  length: z.nativeEnum(StoryLength),
  faithPreference: z.nativeEnum(FaithPreference),
  parentOneName: z
    .string()
    .min(1, "Parent name is required")
    .max(50, "Parent name usually isn't that long")
    .regex(/^[a-zA-Z0-9\s\-']+$/, "Name contains invalid characters"),
  parentTwoName: z
    .string()
    .max(50, "Parent name usually isn't that long")
    .regex(/^[a-zA-Z0-9\s\-']+$/, "Name contains invalid characters")
    .optional(),
  babyNickname: z
    .string()
    .max(50, "Baby nickname usually isn't that long")
    .regex(/^[a-zA-Z0-9\s\-']+$/, "Name contains invalid characters")
    .optional(),
  dueDate: z.string().max(20).optional(), // Simple string check, could be a date validation if format is strict
  childStatus: z.nativeEnum(ChildStatus).optional(),
  ageGroup: z.nativeEnum(AgeGroup).optional(),
  aiProvider: z.nativeEnum(AIProvider).optional(),
});

export const createStorySchema = z.object({
  userId: z.string().cuid(),
  profileId: z.string().cuid().optional(),
  config: storyGenerationConfigSchema,
});

// ============================================================================
// Profile Validation Schemas
// ============================================================================

export const userProfileSchema = z.object({
  parentOneName: z
    .string()
    .min(1, "Parent name is required")
    .max(50, "Parent name usually isn't that long"),
  parentTwoName: z
    .string()
    .max(50, "Parent name usually isn't that long")
    .nullable()
    .optional(),
  babyNickname: z
    .string()
    .max(50, "Baby nickname usually isn't that long")
    .nullable()
    .optional(),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return !isNaN(Date.parse(val));
      },
      { message: "Invalid date format" },
    ),
  faithPreference: z.nativeEnum(FaithPreference),
  defaultTheme: z.nativeEnum(StoryTheme).nullable().optional(),
  defaultLength: z.nativeEnum(StoryLength).nullable().optional(),
  childStatus: z.nativeEnum(ChildStatus),
  birthDate: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return !isNaN(Date.parse(val));
      },
      { message: "Invalid date format" },
    ),
  darkMode: z.boolean(),
  fontSize: z.enum(["normal", "large"]),
});

export const updateProfileSchema = userProfileSchema.partial();

// ============================================================================
// Auth Validation Schemas
// ============================================================================

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
