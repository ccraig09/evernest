'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Type, Bot, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AIProvider, AI_PROVIDER_LABELS } from '@/lib/types';

// Key for localStorage
const AI_PROVIDER_KEY = 'evernest-ai-provider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [aiProvider, setAiProvider] = useState<AIProvider>(AIProvider.GEMINI);
  const [saved, setSaved] = useState(false);

  // Load saved AI provider preference
  useEffect(() => {
    const savedProvider = localStorage.getItem(AI_PROVIDER_KEY);
    if (savedProvider && Object.values(AIProvider).includes(savedProvider as AIProvider)) {
      setAiProvider(savedProvider as AIProvider);
    }
  }, []);

  // Save AI provider preference
  const handleProviderChange = (provider: AIProvider) => {
    setAiProvider(provider);
    localStorage.setItem(AI_PROVIDER_KEY, provider);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fadeIn space-y-8 pb-20">
      <header className="mt-8">
        <h1 className="font-serif text-2xl text-foreground">Settings</h1>
      </header>

      {/* AI Storyteller Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Bot size={16} />
            AI Storyteller
          </CardTitle>
          <CardDescription>
            Choose which AI model generates your stories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {Object.values(AIProvider).map((provider) => (
              <button
                key={provider}
                onClick={() => handleProviderChange(provider)}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4 text-left transition-all',
                  aiProvider === provider
                    ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/50'
                    : 'border-border hover:border-sage-300'
                )}
              >
                <div>
                  <p className="font-medium text-foreground">
                    {AI_PROVIDER_LABELS[provider]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {provider === AIProvider.GEMINI
                      ? 'Recommended – Google\'s latest AI model'
                      : 'OpenAI\'s GPT-4o model (requires paid API key)'}
                  </p>
                </div>
                {aiProvider === provider && (
                  <Check className="h-5 w-5 text-sage-600 dark:text-sage-400" />
                )}
              </button>
            ))}
          </div>
          {saved && (
            <p className="text-sm text-sage-600 dark:text-sage-400">
              ✓ AI provider saved
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how EverNest looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-foreground">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              <Label htmlFor="darkMode">Dark Mode</Label>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                'h-6 w-12 rounded-full p-1 transition-colors duration-300',
                theme === 'dark' ? 'bg-sage-600' : 'bg-muted'
              )}
            >
              <div
                className={cn(
                  'h-4 w-4 transform rounded-full bg-white transition-transform duration-300',
                  theme === 'dark' ? 'translate-x-6' : ''
                )}
              />
            </button>
          </div>

          {/* Font Size Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-foreground">
              <Type size={20} />
              <Label>Text Size</Label>
            </div>
            <span className="text-sm text-muted-foreground">
              Use browser zoom for larger text
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            EverNest is a prenatal storytelling companion that helps expectant
            parents bond with their unborn baby through personalized, calming
            bedtime stories.
          </p>
          <p className="text-xs italic text-muted-foreground">
            Disclaimer: This app provides creative storytelling for bonding
            purposes only. It does not provide medical advice.
          </p>
          <p className="text-xs text-muted-foreground/60">v1.0.0</p>
        </CardContent>
      </Card>
    </div>
  );
}

