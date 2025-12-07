import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createStory, getUserStories } from '@/server/story-service';
import { z } from 'zod';
import { FaithPreference, StoryLength, StoryTheme } from '@/lib/types';

// Schema for story generation request
const generateStorySchema = z.object({
  config: z.object({
    theme: z.nativeEnum(StoryTheme),
    length: z.nativeEnum(StoryLength),
    faithPreference: z.nativeEnum(FaithPreference),
    parentOneName: z.string().min(1),
    parentTwoName: z.string().optional(),
    babyNickname: z.string().optional(),
    dueDate: z.string().optional(),
  }),
});

/**
 * POST /api/stories - Generate a new story
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = generateStorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await createStory({
      userId: session.user.id,
      config: parsed.data.config,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stories - List user's stories
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const favoritesOnly = searchParams.get('favorites') === 'true';

    const result = await getUserStories(session.user.id, {
      page,
      pageSize,
      favoritesOnly,
    });

    return NextResponse.json({
      stories: result.stories,
      total: result.total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

