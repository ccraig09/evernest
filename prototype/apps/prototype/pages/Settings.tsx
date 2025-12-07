import React from 'react';
import { useApp } from '../context/AppContext';
import { FaithPreference } from '../types';
import { Moon, Sun, Type } from 'lucide-react';

const Settings: React.FC = () => {
  const { profile, updateProfile } = useApp();

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <header className="mt-8">
        <h1 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
          Settings
        </h1>
      </header>

      <section className="space-y-6">
        <div className="bg-white dark:bg-stone-800 rounded-xl p-5 shadow-sm border border-stone-100 dark:border-stone-700">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-500 mb-1">Parent Names</label>
              <input 
                type="text" 
                value={profile.parentNames}
                onChange={(e) => updateProfile({ parentNames: e.target.value })}
                className="w-full p-2 bg-stone-50 dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-500 mb-1">Baby Nickname</label>
              <input 
                type="text" 
                value={profile.babyNickname}
                onChange={(e) => updateProfile({ babyNickname: e.target.value })}
                className="w-full p-2 bg-stone-50 dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-500 mb-1">Due Date</label>
              <input 
                type="date" 
                value={profile.dueDate}
                onChange={(e) => updateProfile({ dueDate: e.target.value })}
                className="w-full p-2 bg-stone-50 dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-500 mb-1">Tone / Preference</label>
              <select 
                value={profile.faithPreference}
                onChange={(e) => updateProfile({ faithPreference: e.target.value as FaithPreference })}
                className="w-full p-2 bg-stone-50 dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-700"
              >
                {Object.values(FaithPreference).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-xl p-5 shadow-sm border border-stone-100 dark:border-stone-700">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
              {profile.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span>Dark Mode</span>
            </div>
            <button 
              onClick={() => updateProfile({ darkMode: !profile.darkMode })}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${profile.darkMode ? 'bg-sage-600' : 'bg-stone-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${profile.darkMode ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
              <Type size={20} />
              <span>Large Text</span>
            </div>
            <button 
              onClick={() => updateProfile({ fontSize: profile.fontSize === 'normal' ? 'large' : 'normal' })}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${profile.fontSize === 'large' ? 'bg-sage-600' : 'bg-stone-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${profile.fontSize === 'large' ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="text-center p-4">
          <p className="text-xs text-stone-400 italic">
            Disclaimer: This app provides creative storytelling for bonding. It does not provide medical advice.
          </p>
          <p className="text-xs text-stone-300 mt-2">v1.0.0</p>
        </div>
      </section>
    </div>
  );
};

export default Settings;