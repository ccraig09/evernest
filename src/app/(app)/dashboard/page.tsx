"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StoryTheme,
  StoryLength,
  FaithPreference,
  AIProvider,
  ChildStatus,
  AgeGroup,
  AGE_GROUP_LABELS,
  STORY_THEME_LABELS,
  STORY_LENGTH_LABELS,
  CHILD_STATUS_LABELS,
  type StoryListItem,
  type StoryGenerationConfig,
} from "@/lib/types";

export default function GeneratePage() {
  const [config, setConfig] = useState<StoryGenerationConfig>({
    theme: StoryTheme.LOVE_BONDING,
    length: StoryLength.STANDARD,
    faithPreference: FaithPreference.NON_RELIGIOUS,
    parentOneName: "",
    parentTwoName: "",
    babyNickname: "",
    dueDate: "",
    childStatus: ChildStatus.PRENATAL,
    aiProvider: AIProvider.GEMINI,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState<StoryListItem | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleGenerate = async () => {
    if (!config.parentOneName.trim()) {
      setError("Please enter at least one parent name");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentStory(null);
    setIsDuplicate(false);

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const result = await response.json();
      setCurrentStory(result.story);
      setIsDuplicate(result.isDuplicate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentStory) return;

    try {
      const response = await fetch(`/api/stories/${currentStory.id}`, {
        method: "PATCH",
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentStory(result.story);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // Story display view
  if (currentStory) {
    return (
      <div className="animate-fadeIn mx-auto max-w-2xl">
        <Card className="relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-bl-full bg-sage-100 opacity-50 dark:bg-sage-900/30" />

          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
                {STORY_THEME_LABELS[currentStory.theme as StoryTheme]}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(currentStory.createdAt).toLocaleDateString()}
              </span>
            </div>
            <CardTitle className="mt-4 font-serif text-3xl md:text-4xl">
              {currentStory.title}
            </CardTitle>
            {isDuplicate && (
              <CardDescription className="text-amber-600 dark:text-amber-400">
                You&apos;ve generated a similar story before. Here it is!
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="prose-story whitespace-pre-line text-lg leading-relaxed">
              {currentStory.content}
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleFavorite}
                  className={cn(
                    "rounded-full",
                    currentStory.isFavorite
                      ? "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                      : "",
                  )}
                >
                  <Heart
                    className={currentStory.isFavorite ? "fill-current" : ""}
                  />
                </Button>
              </div>

              <Button variant="secondary" onClick={() => setCurrentStory(null)}>
                New Story
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generation form view
  return (
    <div className="animate-fadeIn space-y-8">
      <header className="mt-8 space-y-2 text-center">
        <h1 className="font-serif text-3xl text-foreground">
          Tonight&apos;s Story
        </h1>
        <p className="text-muted-foreground">
          Create a moment of connection with your little one.
        </p>
      </header>

      {error && (
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-6 pt-6">
          {/* Child Status Toggle */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Who is this story for?
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ChildStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => setConfig({ ...config, childStatus: status })}
                  className={cn(
                    "rounded-lg border p-3 text-center text-sm transition-all",
                    config.childStatus === status
                      ? "border-sage-500 bg-sage-50 text-sage-800 dark:bg-sage-900/50 dark:text-sage-100"
                      : "border-border bg-transparent text-foreground hover:border-sage-300",
                  )}
                >
                  {CHILD_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Selector (Only visible for Born status) */}
          {config.childStatus === ChildStatus.BORN && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="age-group"
                  className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Developmental Stage
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help opacity-70 hover:opacity-100" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64 text-xs">
                        We use developmental stages instead of exact age to
                        tailor the story&apos;s complexity and sensory focus.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={config.ageGroup}
                onValueChange={(value) =>
                  setConfig({ ...config, ageGroup: value as AgeGroup })
                }
              >
                <SelectTrigger id="age-group" className="w-full">
                  <SelectValue placeholder="Select stage..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AgeGroup).map((age) => (
                    <SelectItem key={age} value={age}>
                      {AGE_GROUP_LABELS[age]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Parent Names */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="parentOne">Parent 1 Name *</Label>
              <Input
                id="parentOne"
                placeholder="e.g., Sarah"
                value={config.parentOneName}
                onChange={(e) =>
                  setConfig({ ...config, parentOneName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentTwo">Parent 2 Name</Label>
              <Input
                id="parentTwo"
                placeholder="e.g., Mike"
                value={config.parentTwoName}
                onChange={(e) =>
                  setConfig({ ...config, parentTwoName: e.target.value })
                }
              />
            </div>
          </div>

          {/* Baby Nickname */}
          <div className="space-y-2">
            <Label htmlFor="babyNickname">Baby&apos;s Nickname</Label>
            <Input
              id="babyNickname"
              placeholder="e.g., Peanut, Bean, or a name"
              value={config.babyNickname}
              onChange={(e) =>
                setConfig({ ...config, babyNickname: e.target.value })
              }
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Choose a Theme
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(StoryTheme).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setConfig({ ...config, theme })}
                  className={cn(
                    "rounded-lg border p-3 text-left text-sm transition-all",
                    config.theme === theme
                      ? "border-sage-500 bg-sage-50 text-sage-800 dark:bg-sage-900/50 dark:text-sage-100"
                      : "border-border bg-transparent text-foreground hover:border-sage-300",
                  )}
                >
                  {STORY_THEME_LABELS[theme]}
                </button>
              ))}
            </div>
          </div>

          {/* Length Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Story Length
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.values(StoryLength).map((length) => (
                <button
                  key={length}
                  onClick={() => setConfig({ ...config, length })}
                  className={cn(
                    "rounded-lg border p-3 text-center text-sm transition-all",
                    config.length === length
                      ? "border-sage-500 bg-sage-50 text-sage-800 dark:bg-sage-900/50 dark:text-sage-100"
                      : "border-border bg-transparent text-foreground hover:border-sage-300",
                  )}
                >
                  {STORY_LENGTH_LABELS[length].split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !config.parentOneName.trim()}
              className="w-full text-lg shadow-xl shadow-sage-200/50 dark:shadow-none"
              size="lg"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" />
                  Weaving Story...
                </>
              ) : (
                <>
                  <Sparkles />
                  Generate Story
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
