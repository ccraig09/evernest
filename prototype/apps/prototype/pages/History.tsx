import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Trash2, Calendar, BookOpen } from 'lucide-react';

const History: React.FC = () => {
  const { stories, toggleFavorite, deleteStory } = useApp();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredStories = stories.filter(s => filter === 'all' || s.isFavorite);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex items-center justify-between mt-8">
        <h1 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
          Library
        </h1>
        <div className="flex bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-white shadow-sm' : 'text-stone-500'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === 'favorites' ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-white shadow-sm' : 'text-stone-500'}`}
          >
            Favorites
          </button>
        </div>
      </header>

      {filteredStories.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <BookOpen className="mx-auto mb-4" size={48} />
          <p>No stories found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredStories.map((story) => (
            <div key={story.id} className="bg-white dark:bg-stone-800 p-5 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700 group transition-transform hover:scale-[1.01]">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <span className="text-[10px] uppercase font-bold text-sage-600 dark:text-sage-400 tracking-wider">
                     {story.theme}
                   </span>
                   <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-200 mt-1">
                     {story.title}
                   </h3>
                </div>
                <button
                  onClick={() => toggleFavorite(story.id)}
                  className={`p-2 rounded-full transition-colors ${story.isFavorite ? 'text-red-500' : 'text-stone-300 hover:text-stone-500'}`}
                >
                  <Heart size={18} className={story.isFavorite ? 'fill-current' : ''} />
                </button>
              </div>
              
              <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-2 mb-4">
                {story.content}
              </p>

              <div className="flex justify-between items-center text-xs text-stone-400">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(story.dateGenerated).toLocaleDateString()}
                </div>
                <button 
                  onClick={() => deleteStory(story.id)}
                  className="text-stone-300 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;