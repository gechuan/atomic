import React from 'react';
import { Home, BarChart2, MessageSquare, User } from 'lucide-react';
import { Tab } from '../types';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const getIconColor = (tab: Tab) => activeTab === tab ? 'text-white' : 'text-zinc-500';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-zinc-900 pb-safe pt-2 px-6 h-20 flex justify-between items-start z-50 max-w-md mx-auto w-full">
      <button onClick={() => onTabChange(Tab.TODAY)} className="flex flex-col items-center gap-1 p-2">
        <Home size={24} className={getIconColor(Tab.TODAY)} strokeWidth={activeTab === Tab.TODAY ? 2.5 : 2} />
        <span className={`text-[10px] ${activeTab === Tab.TODAY ? 'text-white font-medium' : 'text-zinc-600'}`}>今日</span>
      </button>

      <button onClick={() => onTabChange(Tab.STATS)} className="flex flex-col items-center gap-1 p-2">
        <BarChart2 size={24} className={getIconColor(Tab.STATS)} strokeWidth={activeTab === Tab.STATS ? 2.5 : 2} />
        <span className={`text-[10px] ${activeTab === Tab.STATS ? 'text-white font-medium' : 'text-zinc-600'}`}>统计</span>
      </button>

      <button onClick={() => onTabChange(Tab.COACH)} className="flex flex-col items-center gap-1 p-2 relative">
        <div className={`absolute top-2 right-1 w-2 h-2 rounded-full bg-brand-purple ${activeTab === Tab.COACH ? 'animate-pulse' : ''}`} />
        <MessageSquare size={24} className={getIconColor(Tab.COACH)} strokeWidth={activeTab === Tab.COACH ? 2.5 : 2} />
        <span className={`text-[10px] ${activeTab === Tab.COACH ? 'text-white font-medium' : 'text-zinc-600'}`}>教练</span>
      </button>

      <button onClick={() => onTabChange(Tab.PROFILE)} className="flex flex-col items-center gap-1 p-2">
        <User size={24} className={getIconColor(Tab.PROFILE)} strokeWidth={activeTab === Tab.PROFILE ? 2.5 : 2} />
        <span className={`text-[10px] ${activeTab === Tab.PROFILE ? 'text-white font-medium' : 'text-zinc-600'}`}>我的</span>
      </button>
    </nav>
  );
};