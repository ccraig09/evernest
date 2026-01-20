/**
 * Test Mocks for EverNest
 * Provides mocked dependencies for unit and integration tests
 */

import {
  FaithPreference,
  StoryLength,
  StoryTheme,
  ChildStatus,
} from "@/lib/types";

// ============================================================================
// Prisma Mock
// ============================================================================

export const mockPrismaStory = {
  findFirst: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

export const mockPrismaUser = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

export const mockPrismaUserProfile = {
  findFirst: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

export const mockDb = {
  story: mockPrismaStory,
  user: mockPrismaUser,
  userProfile: mockPrismaUserProfile,
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

// Mock the db module
jest.mock("@/lib/db", () => ({
  db: mockDb,
}));

// ============================================================================
// NextAuth Session Mock
// ============================================================================

export const mockSession = {
  user: {
    id: "test-user-id-cuid123456789",
    email: "test@example.com",
    name: "Test User",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const mockAuth = jest.fn().mockResolvedValue(mockSession);

jest.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

// ============================================================================
// Gemini AI Mock
// ============================================================================

export const mockGenerateStoryResult = {
  title: "A Gentle Lullaby",
  content: "Once upon a time, in a peaceful garden...",
};

export const mockGenerateStory = jest
  .fn()
  .mockResolvedValue(mockGenerateStoryResult);

jest.mock("@/lib/ai-service", () => ({
  ...jest.requireActual("@/lib/ai-service"),
  generateStory: mockGenerateStory,
}));

// ============================================================================
// Test Fixtures
// ============================================================================

export const validStoryConfig = {
  theme: StoryTheme.NATURE_CALM,
  length: StoryLength.SHORT,
  faithPreference: FaithPreference.NON_RELIGIOUS,
  parentOneName: "Mom",
  parentTwoName: "Dad",
  babyNickname: "Bean",
  dueDate: "May 2026",
  childStatus: ChildStatus.PRENATAL,
};

export const validBornStoryConfig = {
  ...validStoryConfig,
  childStatus: ChildStatus.BORN,
  birthDate: "2025-01-01",
  dueDate: undefined,
};

export const mockStoryRecord = {
  id: "story-id-123",
  userId: "test-user-id-cuid123456789",
  profileId: null,
  title: "A Gentle Lullaby",
  content: "Once upon a time, in a peaceful garden...",
  theme: StoryTheme.NATURE_CALM,
  length: StoryLength.SHORT,
  faithPreference: FaithPreference.NON_RELIGIOUS,
  parentOneName: "Mom",
  parentTwoName: "Dad",
  babyNickname: "Bean",
  dueDate: "May 2026",
  childStatus: "prenatal",
  configHash: "abc123hash",
  wordCount: 150,
  isFavorite: false,
  createdAt: new Date("2025-01-15T10:00:00Z"),
};

// ============================================================================
// Helper Functions
// ============================================================================

export function resetAllMocks() {
  jest.clearAllMocks();
  mockAuth.mockResolvedValue(mockSession);
  mockGenerateStory.mockResolvedValue(mockGenerateStoryResult);
}

export function mockUnauthenticated() {
  mockAuth.mockResolvedValue(null);
}

export function mockAuthenticatedAs(
  userId: string,
  email = "test@example.com",
) {
  mockAuth.mockResolvedValue({
    user: { id: userId, email, name: "Test User" },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
}
