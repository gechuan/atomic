import React, { useState, useEffect } from 'react';
import { Plus, LogIn } from 'lucide-react';
import { Tab, Habit } from './types';
import { Navigation } from './components/Navigation';
import { HabitCard } from './components/HabitCard';
import { AICoach } from './components/AICoach';
import { Analytics } from './components/Analytics';
import { AddHabitModal } from './components/AddHabitModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from './services/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

function AuthenticatedApp() {
  const { user, signIn, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TODAY);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [todayProgress, setTodayProgress] = useState(0);
  const [loadingHabits, setLoadingHabits] = useState(true);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoadingHabits(false);
      return;
    }

    const q = query(collection(db, 'habits'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Habit[];
      setHabits(habitsData);
      setLoadingHabits(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoadingHabits(false);
      // Optional: Set an error state to display to the user
    });

    return () => unsubscribe();
  }, [user]);

  // Safety timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingHabits) {
        console.warn("Loading timed out, forcing render");
        setLoadingHabits(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loadingHabits]);

  useEffect(() => {
    const completed = habits.filter(h => h.completedToday).length;
    const total = habits.length;
    setTodayProgress(total === 0 ? 0 : Math.round((completed / total) * 100));
  }, [habits]);

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newStatus = !habit.completedToday;
    const newStreak = newStatus ? habit.streak + 1 : Math.max(0, habit.streak - 1);
    const newTotal = newStatus ? habit.totalCompletions + 1 : Math.max(0, habit.totalCompletions - 1);

    // Update history for today (assuming last element is today for simplicity, 
    // but in a real app we'd manage dates more robustly. 
    // For now, we just toggle the last boolean in the array or push a new one if we were tracking dates properly)
    // To keep it simple and consistent with the previous local state logic:
    const newHistory = [...habit.history];
    if (newHistory.length > 0) {
      newHistory[newHistory.length - 1] = newStatus;
    }

    await updateDoc(doc(db, 'habits', id), {
      completedToday: newStatus,
      streak: newStreak,
      totalCompletions: newTotal,
      history: newHistory
    });
  };

  const addHabit = async (habitData: Habit) => {
    if (!user) return;
    try {
      console.log("Adding habit for user:", user.uid, habitData);
      // Remove id from habitData as Firestore creates it, but keep other fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = habitData;
      const docRef = await addDoc(collection(db, 'habits'), {
        ...data,
        userId: user.uid,
        createdAt: Date.now()
      });
      console.log("Habit added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding habit:", error);
      alert("Failed to add habit. Check console for details.");
    }
  };

  const confirmDeleteHabit = (id: string) => {
    setHabitToDelete(id);
  };

  const executeDeleteHabit = async () => {
    if (habitToDelete) {
      await deleteDoc(doc(db, 'habits', habitToDelete));
      setHabitToDelete(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 mb-2">
              我的口袋
            </h1>
            <p className="text-zinc-400">日积跬步，养成好习惯。</p>
          </div>

          <button
            onClick={signIn}
            className="w-full bg-white text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform active:scale-95"
          >
            <LogIn size={20} />
            使用 Google 登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-purple selection:text-white flex justify-center">

      {/* Mobile-first Container */}
      <div className="w-full max-w-md bg-black min-h-screen relative shadow-2xl shadow-zinc-900 border-x border-zinc-900/50">

        {/* Header - Only show on Today view */}
        {activeTab === Tab.TODAY && (
          <header className="px-6 pt-12 pb-6 flex justify-between items-end sticky top-0 bg-black/95 backdrop-blur-md z-40 border-b border-zinc-900">
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-1 uppercase tracking-wider">
                {new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                开始积累。
              </h1>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#27272a" strokeWidth="4" fill="none" />
                <circle
                  cx="24" cy="24" r="20"
                  stroke="#10b981"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={126}
                  strokeDashoffset={126 - (126 * todayProgress) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-[10px] font-bold">{todayProgress}%</span>
            </div>
          </header>
        )}

        {/* Header for other tabs */}
        {(activeTab === Tab.COACH || activeTab === Tab.STATS || activeTab === Tab.PROFILE) && (
          <header className="px-6 pt-12 pb-6 sticky top-0 bg-black/95 backdrop-blur-md z-40 border-b border-zinc-900">
            <h1 className="text-2xl font-bold text-white capitalize">
              {activeTab === Tab.COACH ? 'AI 教练' : activeTab === Tab.STATS ? '进度' : '个人中心'}
            </h1>
          </header>
        )}

        {/* Content Area */}
        <main className="h-full">
          {activeTab === Tab.TODAY && (
            <div className="px-4 pb-24 space-y-4 mt-4 animate-in fade-in duration-500">
              {loadingHabits ? (
                <div className="text-center py-10 text-zinc-500">加载习惯中...</div>
              ) : (
                <>
                  {habits.map(habit => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onToggle={toggleHabit}
                      onDelete={confirmDeleteHabit}
                    />
                  ))}

                  {habits.length === 0 && (
                    <div className="text-center py-20 px-6">
                      <p className="text-zinc-500 mb-4">"你不会成为你设定的目标，而是会回归到你系统的水平。"</p>
                      <p className="text-zinc-700 text-sm">— 詹姆斯·克利尔</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === Tab.COACH && <AICoach />}

          {activeTab === Tab.STATS && <Analytics habits={habits} />}

          {activeTab === Tab.PROFILE && (
            <div className="px-6 py-8 text-center text-zinc-500">
              <div className="w-24 h-24 bg-zinc-900 rounded-full mx-auto mb-4 flex items-center justify-center border border-zinc-800">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "用户"} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <h2 className="text-white text-xl font-bold mb-2">{user.displayName || "用户"}</h2>
              <p className="mb-8">{user.email}</p>

              <div className="bg-zinc-900 rounded-2xl p-4 text-left border border-zinc-800 mb-4">
                <h3 className="text-white font-semibold mb-4">设置</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span>深色模式</span>
                    <span className="text-brand-green">开启</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>通知</span>
                    <span className="text-zinc-600">关闭</span>
                  </div>
                </div>
              </div>

              <button
                onClick={signOut}
                className="text-red-500 text-sm hover:text-red-400 transition-colors"
              >
                退出登录
              </button>
            </div>
          )}
        </main>

        {/* Floating Action Button (Only on Today Tab) */}
        {activeTab === Tab.TODAY && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="fixed bottom-24 right-6 w-14 h-14 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center z-40 transition-transform active:scale-90 hover:scale-110"
          >
            <Plus size={28} />
          </button>
        )}

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modals */}
        <AddHabitModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addHabit}
        />

        <ConfirmationModal
          isOpen={!!habitToDelete}
          title="删除习惯"
          message="你确定要删除这个习惯吗？此操作无法撤销，你的连续打卡记录将会丢失。"
          onConfirm={executeDeleteHabit}
          onCancel={() => setHabitToDelete(null)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}