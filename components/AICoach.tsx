import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { startCoachChat, sendMessageToCoach } from '../services/geminiService';

export const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'model',
      text: "你好！我是你的原子习惯教练。今天你想成为什么样的人？",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = startCoachChat();
    if (session) {
      chatSession.current = session;
    } else {
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'model',
        text: "我现在离线了。请检查你的 Gemini API Key 配置。",
        timestamp: Date.now()
      }]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatSession.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToCoach(chatSession.current, userMsg.text);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white pb-24">
      <div className="flex-1 overflow-y-auto px-4 pt-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'user'
                ? 'bg-zinc-800 text-white rounded-br-sm'
                : 'bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-800 text-zinc-200 rounded-bl-sm shadow-sm'
                }`}
            >
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-brand-purple text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={12} /> 原子 AI
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 rounded-2xl p-4 flex gap-2 items-center">
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="问问你的教练..."
            className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-full py-3.5 pl-5 pr-12 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 w-9 h-9 bg-brand-purple rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:bg-zinc-700 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};