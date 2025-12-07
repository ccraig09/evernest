import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoryTheme, StoryLength, GeneratedStory } from '../types';
import { generateStory as fetchAIStory } from '../services/geminiService';
import Button from '../components/Button';
import { Sparkles, RefreshCw, Heart, Volume2, Share2, AlertCircle } from 'lucide-react';

const Today: React.FC = () => {
  const { profile, updateProfile, saveStory, toggleFavorite } = useApp();
  
  // Use preferences from profile, fallback to defaults if not set
  const selectedTheme = profile.lastSelectedTheme || StoryTheme.LOVE_BONDING;
  const selectedLength = profile.lastSelectedLength || StoryLength.STANDARD;

  const setSelectedTheme = (theme: StoryTheme) => updateProfile({ lastSelectedTheme: theme });
  const setSelectedLength = (length: StoryLength) => updateProfile({ lastSelectedLength: length });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState<GeneratedStory | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentStory(null);

    try {
      const result = await fetchAIStory({
        theme: selectedTheme,
        length: selectedLength,
        parentNames: profile.parentNames,
        babyNickname: profile.babyNickname,
        dueDate: profile.dueDate,
        faithPreference: profile.faithPreference,
      });

      const newStory: GeneratedStory = {
        id: crypto.randomUUID(),
        title: result.title,
        content: result.content,
        theme: selectedTheme,
        length: selectedLength,
        dateGenerated: new Date().toISOString(),
        isFavorite: false,
      };

      setCurrentStory(newStory);
      saveStory(newStory); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioStub = () => {
    alert("Audio generation is coming soon!");
  };

  if (currentStory) {
    return (
      <div className="animate-fadeIn max-w-2xl mx-auto">
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 md:p-10 shadow-xl border border-stone-100 dark:border-stone-700 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-sage-100 dark:bg-sage-900/30 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
                {currentStory.theme}
              </span>
              <span className="text-stone-400 text-xs">{new Date().toLocaleDateString()}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif text-stone-800 dark:text-stone-100 mb-8 leading-tight">
              {currentStory.title}
            </h1>

            <div className={`prose dark:prose-invert prose-stone max-w-none font-serif leading-relaxed whitespace-pre-line ${profile.fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
              {currentStory.content}
            </div>

            <div className="mt-12 pt-6 border-t border-stone-100 dark:border-stone-700 flex justify-between items-center">
              <div className="flex gap-3">
                 <button 
                   onClick={() => {
                     toggleFavorite(currentStory.id);
                     setCurrentStory(prev => prev ? ({...prev, isFavorite: !prev.isFavorite}) : null);
                   }}
                   className={`p-3 rounded-full transition-colors ${currentStory.isFavorite ? 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400' : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-400'}`}
                 >
                   <Heart className={currentStory.isFavorite ? 'fill-current' : ''} size={20} />
                 </button>
                 <button 
                   onClick={handleAudioStub}
                   className="p-3 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-400 transition-colors"
                 >
                   <Volume2 size={20} />
                 </button>
              </div>

              <Button onClick={() => setCurrentStory(null)} variant="secondary">
                New Story
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="text-center space-y-2 mt-8">
        <h1 className="text-3xl font-serif text-stone-800 dark:text-stone-100">
          Tonight's Story
        </h1>
        <p className="text-stone-500 dark:text-stone-400">
          Create a moment of connection with {profile.babyNickname || 'your baby'}.
        </p>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-stone-700 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-stone-500 mb-3 uppercase tracking-wide">Choose a Theme</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(StoryTheme).map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`p-3 text-sm rounded-lg border text-left transition-all ${
                  selectedTheme === theme
                    ? 'border-sage-500 bg-sage-50 text-sage-800 dark:bg-sage-900/50 dark:text-sage-100'
                    : 'border-stone-200 bg-transparent text-stone-600 hover:border-sage-300 dark:border-stone-700 dark:text-stone-300'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-500 mb-3 uppercase tracking-wide">Story Length</label>
          <div className="flex gap-3">
            {Object.values(StoryLength).map((len) => (
              <button
                key={len}
                onClick={() => setSelectedLength(len)}
                className={`flex-1 p-3 text-sm rounded-lg border transition-all ${
                  selectedLength === len
                    ? 'border-sage-500 bg-sage-50 text-sage-800 dark:bg-sage-900/50 dark:text-sage-100'
                    : 'border-stone-200 bg-transparent text-stone-600 hover:border-sage-300 dark:border-stone-700 dark:text-stone-300'
                }`}
              >
                {len.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleGenerate} disabled={isLoading} fullWidth className="text-lg shadow-xl shadow-sage-200/50 dark:shadow-none">
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Weaving Story...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Story
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Today;