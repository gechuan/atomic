import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Habit } from '../types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Habit) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState('');
  const [anchor, setAnchor] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      cue: `After I ${anchor}`,
      identity: `I am ${identity}`,
      category: 'other',
      streak: 0,
      completedToday: false,
      color: '#8b5cf6', // Default purple
      history: [],
      totalCompletions: 0
    };
    onAdd(newHabit);
    reset();
  };

  const reset = () => {
    setName('');
    setIdentity('');
    setAnchor('');
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

      <div className="bg-zinc-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-zinc-800 shadow-2xl pointer-events-auto transform transition-transform duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">建立新习惯</h2>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white"><X size={20} /></button>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <label className="block">
              <span className="text-zinc-400 text-sm font-medium mb-2 block">你想养成什么习惯？</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例如：阅读5页书"
                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-purple focus:outline-none"
                autoFocus
              />
            </label>
            <div className="pt-4">
              <button
                onClick={() => name && setStep(2)}
                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200"
              >
                下一步 <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <label className="block">
              <span className="text-brand-purple text-xs font-bold uppercase mb-2 block">习惯叠加</span>
              <span className="text-zinc-400 text-sm font-medium mb-2 block">在...之后 (当前习惯)</span>
              <input
                type="text"
                value={anchor}
                onChange={e => setAnchor(e.target.value)}
                placeholder="例如：喝完早晨的咖啡"
                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-purple focus:outline-none"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="text-brand-green text-xs font-bold uppercase mb-2 block">身份认同</span>
              <span className="text-zinc-400 text-sm font-medium mb-2 block">你想成为什么样的人？</span>
              <input
                type="text"
                value={identity}
                onChange={e => setIdentity(e.target.value)}
                placeholder="例如：一个阅读者"
                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-green focus:outline-none"
              />
            </label>
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-brand-green text-black font-bold py-4 rounded-xl hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                创建习惯
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6 justify-center">
          <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-white' : 'bg-zinc-800'}`} />
          <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-white' : 'bg-zinc-800'}`} />
        </div>
      </div>
    </div>
  );
};