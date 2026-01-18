'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, Trash2, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';
import {
  StoryTheme,
  STORY_THEME_LABELS,
  type StoryListItem,
} from '@/lib/types';

export default function LibraryPage() {
  const [stories, setStories] = useState<StoryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [selectedStory, setSelectedStory] = useState<StoryListItem | null>(null);

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
        // Also update selected story if it's the one being toggled
        if (selectedStory?.id === storyId) {
            setSelectedStory(result.story);
        }
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
        if (selectedStory?.id === storyId) {
            setSelectedStory(null);
        }
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
              className="group cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md"
              onClick={() => setSelectedStory(story)}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(story.id);
                    }}
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

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {story.content}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(story.id);
                    }}
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

      {/* Story Reading Modal */}
      <Modal isOpen={!!selectedStory} onClose={() => setSelectedStory(null)}>
        {selectedStory && (
            <div className="space-y-6">
                <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between pr-10">
                        <span className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800 dark:bg-sage-900/50 dark:text-sage-300">
                             {STORY_THEME_LABELS[selectedStory.theme as StoryTheme]}
                        </span>
                        <div className="flex items-center gap-2">
                           <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleFavorite(selectedStory.id)}
                              className={cn(
                                'h-8 w-8 rounded-full',
                                selectedStory.isFavorite ? 'text-red-500' : 'text-muted-foreground'
                              )}
                           >
                             <Heart className={cn("h-4 w-4", selectedStory.isFavorite && "fill-current")} />
                           </Button>
                        </div>
                    </div>
                     <h2 className="font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl">
                        {selectedStory.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                         Generated on {new Date(selectedStory.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    <div className="prose-story whitespace-pre-line text-lg leading-relaxed text-foreground/90">
                        {selectedStory.content}
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
}

