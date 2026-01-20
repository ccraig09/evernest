/**
 * Integration Tests for Story Service
 * Tests story CRUD operations with mocked dependencies
 */

// Jest hoists jest.mock to top - all mocks must be fully inline

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn(),
  Type: { OBJECT: "object", STRING: "string" },
}));

jest.mock("@/lib/db", () => ({
  db: {
    story: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock("@/lib/ai-service", () => ({
  ...jest.requireActual("@/lib/ai-service"),
  generateStory: jest.fn().mockResolvedValue({
    title: "A Gentle Lullaby",
    content:
      "Once upon a time, in a peaceful garden where flowers swayed gently...",
  }),
}));

import {
  createStory,
  getUserStories,
  getStoryById,
  toggleFavorite,
  deleteStory,
  checkForDuplicate,
} from "@/server/story-service";
import {
  FaithPreference,
  StoryLength,
  StoryTheme,
  ChildStatus,
} from "@/lib/types";
import { db } from "@/lib/db";

// Access the mocked functions
const mockedDb = jest.mocked(db);

// Test fixtures
const mockStoryRecord = {
  id: "story-id-123",
  userId: "cltest123456789012345678",
  profileId: null,
  title: "A Gentle Lullaby",
  content:
    "Once upon a time, in a peaceful garden where flowers swayed gently...",
  theme: "nature_calm",
  length: "short",
  faithPreference: "non_religious",
  parentOneName: "Mom",
  parentTwoName: "Dad",
  babyNickname: "Bean",
  dueDate: "May 2026",
  childStatus: "prenatal",
  configHash: "abc123hashdef456",
  wordCount: 150,
  isFavorite: false,
  createdAt: new Date("2025-01-15T10:00:00Z"),
};

describe("Story Service", () => {
  const validConfig = {
    theme: StoryTheme.NATURE_CALM,
    length: StoryLength.SHORT,
    faithPreference: FaithPreference.NON_RELIGIOUS,
    parentOneName: "Mom",
    parentTwoName: "Dad",
    babyNickname: "Bean",
    dueDate: "May 2026",
    childStatus: ChildStatus.PRENATAL,
  };

  const validUserId = "cltest123456789012345678";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkForDuplicate", () => {
    it("should return isDuplicate: false when no existing story", async () => {
      mockedDb.story.findFirst.mockResolvedValue(null);

      const result = await checkForDuplicate(validUserId, "somehash");

      expect(result.isDuplicate).toBe(false);
      expect(result.existingStoryId).toBeUndefined();
    });

    it("should return isDuplicate: true with existingStoryId when story exists", async () => {
      mockedDb.story.findFirst.mockResolvedValue({
        id: "existing-story-id",
      } as never);

      const result = await checkForDuplicate(validUserId, "somehash");

      expect(result.isDuplicate).toBe(true);
      expect(result.existingStoryId).toBe("existing-story-id");
    });

    it("should query with correct userId and configHash", async () => {
      mockedDb.story.findFirst.mockResolvedValue(null);

      await checkForDuplicate(validUserId, "specifichash");

      expect(mockedDb.story.findFirst).toHaveBeenCalledWith({
        where: { userId: validUserId, configHash: "specifichash" },
        select: { id: true },
      });
    });
  });

  describe("createStory", () => {
    it("should create a new story successfully", async () => {
      mockedDb.story.findFirst.mockResolvedValue(null);
      mockedDb.story.create.mockResolvedValue(mockStoryRecord as never);

      const result = await createStory({
        userId: validUserId,
        config: validConfig,
      });

      expect(result.isDuplicate).toBe(false);
      expect(result.story.title).toBe("A Gentle Lullaby");
      expect(result.story.id).toBe("story-id-123");
    });

    it("should return existing story when duplicate detected", async () => {
      mockedDb.story.findFirst.mockResolvedValue({
        id: "existing-id",
      } as never);
      mockedDb.story.findUnique.mockResolvedValue(mockStoryRecord as never);

      const result = await createStory({
        userId: validUserId,
        config: validConfig,
      });

      expect(result.isDuplicate).toBe(true);
      expect(result.existingStoryId).toBe("story-id-123");
    });

    it("should throw error for invalid input", async () => {
      await expect(
        createStory({
          userId: "invalid-user-id",
          config: validConfig,
        }),
      ).rejects.toThrow("Invalid input");
    });

    it("should throw error for missing required config fields", async () => {
      await expect(
        createStory({
          userId: validUserId,
          config: { ...validConfig, parentOneName: "" },
        }),
      ).rejects.toThrow("Invalid input");
    });
  });

  describe("getUserStories", () => {
    const mockStories = [
      mockStoryRecord,
      { ...mockStoryRecord, id: "story-2" },
    ];

    beforeEach(() => {
      mockedDb.story.findMany.mockResolvedValue(mockStories as never);
      mockedDb.story.count.mockResolvedValue(2 as never);
    });

    it("should return user stories with default pagination", async () => {
      const result = await getUserStories(validUserId);

      expect(result.stories).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockedDb.story.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: validUserId },
          skip: 0,
          take: 20,
        }),
      );
    });

    it("should handle custom pagination", async () => {
      await getUserStories(validUserId, { page: 2, pageSize: 10 });

      expect(mockedDb.story.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it("should filter favorites when requested", async () => {
      await getUserStories(validUserId, { favoritesOnly: true });

      expect(mockedDb.story.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: validUserId, isFavorite: true },
        }),
      );
    });
  });

  describe("getStoryById", () => {
    it("should return story when found", async () => {
      mockedDb.story.findFirst.mockResolvedValue(mockStoryRecord as never);

      const result = await getStoryById(validUserId, "story-id-123");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("story-id-123");
    });

    it("should return null when story not found", async () => {
      mockedDb.story.findFirst.mockResolvedValue(null);

      const result = await getStoryById(validUserId, "non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("toggleFavorite", () => {
    it("should toggle favorite status", async () => {
      mockedDb.story.findFirst.mockResolvedValue(mockStoryRecord as never);
      mockedDb.story.update.mockResolvedValue({
        ...mockStoryRecord,
        isFavorite: true,
      } as never);

      const result = await toggleFavorite(validUserId, "story-id-123");

      expect(result?.isFavorite).toBe(true);
    });

    it("should return null if story not found", async () => {
      mockedDb.story.findFirst.mockResolvedValue(null);

      const result = await toggleFavorite(validUserId, "non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("deleteStory", () => {
    it("should delete story and return true", async () => {
      mockedDb.story.findFirst.mockResolvedValue(mockStoryRecord as never);
      mockedDb.story.delete.mockResolvedValue(mockStoryRecord as never);

      const result = await deleteStory(validUserId, "story-id-123");

      expect(result).toBe(true);
    });

    it("should return false if story not found", async () => {
      mockedDb.story.findFirst.mockResolvedValue(null);

      const result = await deleteStory(validUserId, "non-existent-id");

      expect(result).toBe(false);
    });
  });
});
