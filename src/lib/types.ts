// ============================================================================
// EverNest Core Types
// ============================================================================

// Enums
export enum FaithPreference {
  FAITH_BASED = "faith_based",
  SPIRITUAL = "spiritual",
  NON_RELIGIOUS = "non_religious",
}

export enum StoryTheme {
  COLORS_SHAPES = "colors_shapes",
  LOVE_BONDING = "love_bonding",
  NATURE_CALM = "nature_calm",
  SPIRITUAL_LIGHT = "spiritual_light",
  RHYTHM_SOUND = "rhythm_sound",
  FAMILY_LEGACY = "family_legacy",
  DISCIPLINE_VALUES = "discipline_values",
  SURPRISE = "surprise",
}

export enum StoryLength {
  QUICK = "quick",
  SHORT = "short",
  STANDARD = "standard",
  LONG = "long",
}

export enum AIProvider {
  GEMINI = "gemini",
}

export const AI_PROVIDER_LABELS: Record<AIProvider, string> = {
  [AIProvider.GEMINI]: "Google Gemini",
};

// Human-readable labels for enums
export const FAITH_PREFERENCE_LABELS: Record<FaithPreference, string> = {
  [FaithPreference.FAITH_BASED]: "Faith-Based",
  [FaithPreference.SPIRITUAL]: "Spiritual",
  [FaithPreference.NON_RELIGIOUS]: "Non-Religious",
};

export const STORY_THEME_LABELS: Record<StoryTheme, string> = {
  [StoryTheme.COLORS_SHAPES]: "Colors & Shapes",
  [StoryTheme.LOVE_BONDING]: "Love & Bonding",
  [StoryTheme.NATURE_CALM]: "Nature & Calm",
  [StoryTheme.SPIRITUAL_LIGHT]: "Spiritual & Light",
  [StoryTheme.RHYTHM_SOUND]: "Rhythm & Sound",
  [StoryTheme.FAMILY_LEGACY]: "Family Legacy",
  [StoryTheme.DISCIPLINE_VALUES]: "Discipline & Values",
  [StoryTheme.SURPRISE]: "Surprise Me",
};

export const STORY_LENGTH_LABELS: Record<StoryLength, string> = {
  [StoryLength.QUICK]: "Quick (~1-2 min)",
  [StoryLength.SHORT]: "Short (~2-3 min)",
  [StoryLength.STANDARD]: "Standard (~4 min)",
  [StoryLength.LONG]: "Long (~5-6 min)",
};

export const STORY_LENGTH_WORD_COUNTS: Record<
  StoryLength,
  { min: number; max: number }
> = {
  [StoryLength.QUICK]: { min: 150, max: 200 },
  [StoryLength.SHORT]: { min: 200, max: 300 },
  [StoryLength.STANDARD]: { min: 350, max: 450 },
  [StoryLength.LONG]: { min: 500, max: 600 },
};

// ============================================================================
// API Types
// ============================================================================

export interface StoryGenerationConfig {
  theme: StoryTheme;
  length: StoryLength;
  faithPreference: FaithPreference;
  parentOneName: string;
  parentTwoName?: string;
  babyNickname?: string;
  dueDate?: string;
  aiProvider?: AIProvider;
}

export interface StoryGenerationResult {
  title: string;
  content: string;
}

export interface GenerateStoryRequest {
  config: StoryGenerationConfig;
}

export interface GenerateStoryResponse {
  story: {
    id: string;
    title: string;
    content: string;
    theme: StoryTheme;
    length: StoryLength;
    wordCount: number;
    createdAt: string;
    isFavorite: boolean;
  };
  isDuplicate: boolean;
  existingStoryId?: string;
}

// ============================================================================
// Profile Types
// ============================================================================

export interface UserProfileData {
  id: string;
  parentOneName: string;
  parentTwoName?: string;
  babyNickname?: string;
  dueDate?: string;
  faithPreference: FaithPreference;
  defaultTheme?: StoryTheme;
  defaultLength?: StoryLength;
  preferredAIProvider: AIProvider;
  darkMode: boolean;
  fontSize: "normal" | "large";
}

export interface UpdateProfileRequest {
  parentOneName?: string;
  parentTwoName?: string;
  babyNickname?: string;
  dueDate?: string;
  faithPreference?: FaithPreference;
  defaultTheme?: StoryTheme;
  defaultLength?: StoryLength;
  darkMode?: boolean;
  fontSize?: "normal" | "large";
}

// ============================================================================
// Story List Types
// ============================================================================

export interface StoryListItem {
  id: string;
  title: string;
  content: string;
  theme: StoryTheme;
  length: StoryLength;
  wordCount: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface StoriesListResponse {
  stories: StoryListItem[];
  total: number;
  page: number;
  pageSize: number;
}
