import { db } from "@/lib/db";
import { generateStory as generateStoryWithAI } from "@/lib/ai-service";
import { countWords } from "@/lib/utils";
import { createStorySchema } from "@/lib/schemas";
import { computeConfigHash } from "./utils";
import type { StoryGenerationConfig, StoryListItem } from "@/lib/types";

export interface CreateStoryInput {
  userId: string;
  profileId?: string;
  config: StoryGenerationConfig;
}

export interface CreateStoryResult {
  story: StoryListItem;
  isDuplicate: boolean;
  existingStoryId?: string;
}

/**
 * Check if a story with the same config already exists for this user
 */
export async function checkForDuplicate(
  userId: string,
  configHash: string,
): Promise<{ isDuplicate: boolean; existingStoryId?: string }> {
  const existing = await db.story.findFirst({
    where: {
      userId,
      configHash,
    },
    select: { id: true },
  });

  return {
    isDuplicate: !!existing,
    existingStoryId: existing?.id,
  };
}

/**
 * Create a new story for a user
 */
export async function createStory(
  input: CreateStoryInput,
): Promise<CreateStoryResult> {
  // Validate input
  const validation = createStorySchema.safeParse(input);
  if (!validation.success) {
    throw new Error(`Invalid input: ${validation.error.message}`);
  }

  const { userId, profileId, config } = input;
  const configHash = computeConfigHash(config);

  // Check for duplicates
  const duplicateCheck = await checkForDuplicate(userId, configHash);

  if (duplicateCheck.isDuplicate && duplicateCheck.existingStoryId) {
    // Return the existing story
    const existingStory = await db.story.findUnique({
      where: { id: duplicateCheck.existingStoryId },
    });

    if (existingStory) {
      return {
        story: {
          id: existingStory.id,
          title: existingStory.title,
          content: existingStory.content,
          theme: existingStory.theme as StoryListItem["theme"],
          length: existingStory.length as StoryListItem["length"],
          wordCount: existingStory.wordCount,
          isFavorite: existingStory.isFavorite,
          createdAt: existingStory.createdAt.toISOString(),
        },
        isDuplicate: true,
        existingStoryId: existingStory.id,
      };
    }
  }

  // Generate new story with AI
  const aiResult = await generateStoryWithAI(config);
  const wordCount = countWords(aiResult.content);

  // Save to database
  const story = await db.story.create({
    data: {
      userId,
      profileId,
      title: aiResult.title,
      content: aiResult.content,
      theme: config.theme,
      length: config.length,
      faithPreference: config.faithPreference,
      parentOneName: config.parentOneName,
      parentTwoName: config.parentTwoName,
      babyNickname: config.babyNickname,
      dueDate: config.dueDate,
      childStatus: config.childStatus || "prenatal",
      configHash,
      wordCount,
    },
  });

  return {
    story: {
      id: story.id,
      title: story.title,
      content: story.content,
      theme: story.theme as StoryListItem["theme"],
      length: story.length as StoryListItem["length"],
      wordCount: story.wordCount,
      isFavorite: story.isFavorite,
      createdAt: story.createdAt.toISOString(),
    },
    isDuplicate: false,
  };
}

/**
 * Get all stories for a user
 */
export async function getUserStories(
  userId: string,
  options: {
    page?: number;
    pageSize?: number;
    favoritesOnly?: boolean;
  } = {},
): Promise<{ stories: StoryListItem[]; total: number }> {
  const { page = 1, pageSize = 20, favoritesOnly = false } = options;
  const skip = (page - 1) * pageSize;

  const where = {
    userId,
    ...(favoritesOnly ? { isFavorite: true } : {}),
  };

  const [stories, total] = await Promise.all([
    db.story.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.story.count({ where }),
  ]);

  return {
    stories: stories.map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      theme: s.theme as StoryListItem["theme"],
      length: s.length as StoryListItem["length"],
      wordCount: s.wordCount,
      isFavorite: s.isFavorite,
      createdAt: s.createdAt.toISOString(),
    })),
    total,
  };
}

/**
 * Get a single story by ID
 */
export async function getStoryById(
  userId: string,
  storyId: string,
): Promise<StoryListItem | null> {
  const story = await db.story.findFirst({
    where: {
      id: storyId,
      userId,
    },
  });

  if (!story) return null;

  return {
    id: story.id,
    title: story.title,
    content: story.content,
    theme: story.theme as StoryListItem["theme"],
    length: story.length as StoryListItem["length"],
    wordCount: story.wordCount,
    isFavorite: story.isFavorite,
    createdAt: story.createdAt.toISOString(),
  };
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  userId: string,
  storyId: string,
): Promise<StoryListItem | null> {
  const existing = await db.story.findFirst({
    where: { id: storyId, userId },
  });

  if (!existing) return null;

  const updated = await db.story.update({
    where: { id: storyId },
    data: { isFavorite: !existing.isFavorite },
  });

  return {
    id: updated.id,
    title: updated.title,
    content: updated.content,
    theme: updated.theme as StoryListItem["theme"],
    length: updated.length as StoryListItem["length"],
    wordCount: updated.wordCount,
    isFavorite: updated.isFavorite,
    createdAt: updated.createdAt.toISOString(),
  };
}

/**
 * Delete a story
 */
export async function deleteStory(
  userId: string,
  storyId: string,
): Promise<boolean> {
  const existing = await db.story.findFirst({
    where: { id: storyId, userId },
  });

  if (!existing) return false;

  await db.story.delete({ where: { id: storyId } });
  return true;
}
