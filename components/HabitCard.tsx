import React, { useState, useRef, useEffect } from 'react';
import { Check, Flame, MoreVertical, Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onDelete }) => {
  const { name, cue, streak, completedToday, color } = habit;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`group relative overflow-visible rounded-2xl p-5 transition-all duration-300 ${completedToday ? 'bg-zinc-900/80 border border-zinc-800' : 'bg-zinc-900 border border-zinc-800'
        }`}
    >
      {/* Background Progress Effect - wrapped to clip correctly while keeping parent overflow visible */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div
          className={`absolute top-0 left-0 bottom-0 w-1 transition-all duration-500`}
          style={{ backgroundColor: color, opacity: completedToday ? 1 : 0.5 }}
        />
      </div>

      <div className="flex justify-between items-center relative z-10">
        <div className="flex-1 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-semibold transition-colors ${completedToday ? 'text-white' : 'text-zinc-200'}`}>
              {name}
            </h3>
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded-full">
                <Flame size={12} className="text-brand-orange" fill="#f97316" />
                <span className="text-xs font-mono text-brand-orange">{streak}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            <span className="opacity-70">关联:</span> {cue}
          </p>
        </div>

        <button
          onClick={() => onToggle(habit.id)}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 flex-shrink-0
            ${completedToday
              ? 'bg-brand-green text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-zinc-800 text-zinc-600 hover:bg-zinc-700'
            }
          `}
        >
          <Check size={24} strokeWidth={3} className={`transition-all ${completedToday ? 'scale-100' : 'scale-90 opacity-50'}`} />
        </button>
      </div>

      {/* Options Menu Button */}
      <div className="absolute top-2 right-2 z-20" ref={menuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1.5 text-zinc-600 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
        >
          <MoreVertical size={16} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden min-w-[120px] animate-in fade-in zoom-in-95 duration-100 origin-top-right z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onDelete(habit.id);
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 font-medium"
            >
              <Trash2 size={14} />
              删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};