import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, GeneratedStory, FaithPreference, StoryTheme, StoryLength } from '../types';

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  stories: GeneratedStory[];
  saveStory: (story: GeneratedStory) => void;
  toggleFavorite: (id: string) => void;
  deleteStory: (id: string) => void;
}

const defaultProfile: UserProfile = {
  parentNames: '',
  babyNickname: '',
  dueDate: '',
  faithPreference: FaithPreference.NON_RELIGIOUS,
  darkMode: false,
  fontSize: 'normal',
  hasCompletedOnboarding: false,
  lastSelectedTheme: StoryTheme.LOVE_BONDING,
  lastSelectedLength: StoryLength.STANDARD,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('prenatal_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [stories, setStories] = useState<GeneratedStory[]>(() => {
    const saved = localStorage.getItem('prenatal_stories');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('prenatal_profile', JSON.stringify(profile));
    // Apply dark mode to HTML tag
    if (profile.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('prenatal_stories', JSON.stringify(stories));
  }, [stories]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const saveStory = (story: GeneratedStory) => {
    setStories(prev => [story, ...prev]);
  };

  const toggleFavorite = (id: string) => {
    setStories(prev => prev.map(s => 
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    ));
  };

  const deleteStory = (id: string) => {
    setStories(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider value={{ profile, updateProfile, stories, saveStory, toggleFavorite, deleteStory }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};