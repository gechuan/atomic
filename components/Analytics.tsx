import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { Habit } from '../types';

interface AnalyticsProps {
  habits: Habit[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ habits }) => {
  // Simulate data logic for "Habit Strength" (non-linear growth)
  const data = [
    { day: 'M', score: 10 },
    { day: 'T', score: 15 },
    { day: 'W', score: 25 },
    { day: 'T', score: 28 },
    { day: 'F', score: 40 }, // Plateau breakthrough
    { day: 'S', score: 65 },
    { day: 'S', score: 85 },
  ];

  const totalCompletions = habits.reduce((acc, h) => acc + h.totalCompletions, 0);
  const avgStreak = Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / (habits.length || 1));

  return (
    <div className="px-5 pt-8 pb-24 space-y-8 animate-in fade-in duration-500">

      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wide mb-1">总完成次数</p>
          <h2 className="text-3xl font-bold text-white">{totalCompletions}</h2>
        </div>
        <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wide mb-1">平均连续天数</p>
          <h2 className="text-3xl font-bold text-brand-orange">{avgStreak} <span className="text-sm text-zinc-500 font-normal">天</span></h2>
        </div>
      </div>

      {/* Main Chart: Latent Potential */}
      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">习惯强度</h3>
          <p className="text-xs text-zinc-500 mt-1">跨越潜能的平台期</p>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#27272a" strokeDasharray="3 3" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#10b981' }}
                cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streak Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">一致性热力图</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className={`
                aspect-square rounded-md flex items-center justify-center text-[10px] font-medium
                ${i % 8 === 0 ? 'bg-zinc-800 text-zinc-600' : 'bg-brand-orange text-black'}
                ${i > 20 ? 'opacity-30' : 'opacity-100'} 
              `}
            >
              {i % 8 === 0 ? 'X' : '✓'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};