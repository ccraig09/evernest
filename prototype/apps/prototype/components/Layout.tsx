import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Settings as SettingsIcon, Heart } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const isReadingMode = location.pathname.includes('/read'); 

  // Hide nav during deep reading if desired, but keeping it persistent for now per reqs
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 w-full max-w-md mx-auto p-4 pb-24 md:max-w-2xl md:p-8">
        <Outlet />
      </main>

      {/* Mobile-First Sticky Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 z-50">
        <div className="max-w-md mx-auto md:max-w-2xl flex justify-around items-center p-3">
          <NavLink 
            to="/today" 
            className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-sage-600 dark:text-sage-400' : 'text-stone-400 dark:text-stone-500 hover:text-stone-600'}`}
          >
            <BookOpen size={24} strokeWidth={2} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Today</span>
          </NavLink>

          <NavLink 
            to="/history" 
            className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-sage-600 dark:text-sage-400' : 'text-stone-400 dark:text-stone-500 hover:text-stone-600'}`}
          >
            <Heart size={24} strokeWidth={2} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Saved</span>
          </NavLink>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-sage-600 dark:text-sage-400' : 'text-stone-400 dark:text-stone-500 hover:text-stone-600'}`}
          >
            <SettingsIcon size={24} strokeWidth={2} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Settings</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
