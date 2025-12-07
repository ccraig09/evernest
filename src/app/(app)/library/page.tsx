'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, Trash2, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  StoryTheme,
  STORY_THEME_LABELS,
  type StoryListItem,
} from '@/lib/types';

export default function LibraryPage() {
  const [stories, setStories] = useState<StoryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === 'favorites') {
        params.set('favorites', 'true');
      }
      const response = await fetch(`/api/stories?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
      }
    } catch (err) {
      console.error('Failed to fetch stories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleToggleFavorite = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        const result = await response.json();
        setStories((prev) =>
          prev.map((s) => (s.id === storyId ? result.story : s))
        );
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStories((prev) => prev.filter((s) => s.id !== storyId));
      }
    } catch (err) {
      console.error('Failed to delete story:', err);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <header className="mt-8 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-foreground">Library</h1>
        <div className="flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm transition-colors',
              filter === 'all'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm transition-colors',
              filter === 'favorites'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            )}
          >
            Favorites
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : stories.length === 0 ? (
        <div className="py-20 text-center opacity-50">
          <BookOpen className="mx-auto mb-4 h-12 w-12" />
          <p>No stories found.</p>
          {filter === 'favorites' && (
            <p className="mt-2 text-sm">
              Try viewing all stories or generate a new one.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="group transition-transform hover:scale-[1.01]"
            >
              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
                      {STORY_THEME_LABELS[story.theme as StoryTheme]}
                    </span>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">
                      {story.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(story.id)}
                    className={cn(
                      'rounded-full p-2 transition-colors',
                      story.isFavorite
                        ? 'text-red-500'
                        : 'text-muted-foreground/30 hover:text-muted-foreground'
                    )}
                  >
                    <Heart
                      size={18}
                      className={story.isFavorite ? 'fill-current' : ''}
                    />
                  </button>
                </div>

                <p
                  className={cn(
                    'mb-4 text-sm text-muted-foreground',
                    expandedStoryId === story.id ? '' : 'line-clamp-2'
                  )}
                >
                  {story.content}
                </p>

                {expandedStoryId !== story.id && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-sage-600 dark:text-sage-400"
                    onClick={() => setExpandedStoryId(story.id)}
                  >
                    Read more
                  </Button>
                )}

                {expandedStoryId === story.id && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-sage-600 dark:text-sage-400"
                    onClick={() => setExpandedStoryId(null)}
                  >
                    Show less
                  </Button>
                )}

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="rounded p-1 text-muted-foreground/30 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

