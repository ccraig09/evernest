export enum FaithPreference {
  FAITH_BASED = 'Faith-based',
  SPIRITUAL = 'Neutral Spiritual',
  NON_RELIGIOUS = 'Non-religious',
}

export enum StoryLength {
  SHORT = 'Short (200-300 words)',
  STANDARD = 'Standard (350-500 words)',
}

export enum StoryTheme {
  COLORS_SHAPES = 'Colors & Shapes',
  LOVE_BONDING = 'Love & Bonding',
  NATURE_CALM = 'Nature & Calm',
  SPIRITUAL_LIGHT = 'Spiritual & Light',
  RHYTHM_SOUND = 'Rhythm & Sound',
  FAMILY_LEGACY = 'Family Legacy',
  SURPRISE = 'Surprise Me',
}

export interface UserProfile {
  parentNames: string;
  babyNickname: string;
  dueDate: string;
  faithPreference: FaithPreference;
  darkMode: boolean;
  fontSize: 'normal' | 'large';
  hasCompletedOnboarding: boolean;
  lastSelectedTheme?: StoryTheme;
  lastSelectedLength?: StoryLength;
}

export interface GeneratedStory {
  id: string;
  title: string;
  content: string;
  theme: StoryTheme;
  length: StoryLength;
  dateGenerated: string;
  isFavorite: boolean;
}

export interface StoryPromptParams {
  theme: StoryTheme;
  length: StoryLength;
  parentNames: string;
  babyNickname: string;
  dueDate: string;
  faithPreference: FaithPreference;
}

export interface StoryResponse {
  title: string;
  content: string;
}