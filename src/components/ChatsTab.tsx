import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Terminal, 
  Sparkles,
  RefreshCw,
  Clock,
  HelpCircle
} from 'lucide-react';
import { ChatMessage } from '../types';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'motion/react';

const entranceVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

interface ChatsTabProps {
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  chatLoading: boolean;
  onClearChat: () => void;
}

export default function ChatsTab({ 
  chatMessages, 
  onSendMessage, 
  chatLoading,
  onClearChat
}: ChatsTabProps) {
  const { user } = useUser();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const starterPrompts = [
    "Review memory leaks traps inside React useEffect hooks",
    "Explain when to choose CJS vs ESM targets in compilation configurations",
    "Compare database indices: B-Tree vs Hash indexing scopes",
    "Pragmatic security rules pattern for Firestore DB queries"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || chatLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleStarterClick = (prompt: string) => {
    if (chatLoading) return;
    onSendMessage(prompt);
  };

  return (
    <motion.div 
      variants={entranceVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-[calc(100vh-160px)] relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
    >
      {/* Glowing Ambient light background sources matching the Slate premium style */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Chats header controls */}
      <div className="relative z-10 px-5 py-4 bg-slate-950/45 border-b border-white/[0.06] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-white/10 shadow-sm shrink-0">
            <Bot className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Gemini Code Companion</h3>
            <span className="text-[10px] text-emerald-450 font-mono flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live fullstack connection
            </span>
          </div>
        </div>
        <button
          onClick={onClearChat}
          className="text-[10px] text-slate-400 hover:text-white font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
        >
          Clear History
        </button>
      </div>

      {/* Clerk Sync Status Banner */}
      <div className="relative z-10 px-5 py-3 bg-slate-950/20 border-b border-white/[0.04] flex items-center justify-between text-[11px] shrink-0">
        {user ? (
          <div className="flex items-center gap-2 text-[#a78bfa]">
            <span className="text-sm select-none">☁️</span>
            <span>Signed in as <strong className="text-white font-mono">{user.primaryEmailAddress?.emailAddress}</strong>. Chats are secured inside Cloud DB Sync.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-450">
            <span className="text-sm select-none">🔒</span>
            <span>Guest session active. Sign In from the top header to backup and sync your messages permanently.</span>
          </div>
        )}
      </div>

      {/* Message canvas */}
      <div className="relative z-10 flex-1 p-5 overflow-y-auto space-y-4 bg-transparent scrollbar-thin">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ask the Technical Expert</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Receive instant expert programming recommendations, clean implementation reviews, and architecture details backed by Gemini models.
              </p>
            </div>

            {/* Quick prebuilts cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-4">
              {starterPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleStarterClick(p)}
                  className="p-3.5 text-left bg-slate-950/40 hover:bg-slate-950/75 rounded-xl border border-white/[0.05] hover:border-blue-500/30 text-[10px] text-slate-300 hover:text-white leading-normal transition-all active:scale-[0.98] cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 max-w-[85%] ${
                    isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center border ${
                    isAssistant 
                      ? 'bg-white/5 border-white/10 text-blue-400' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/10 text-white shadow-md'
                  }`}>
                    {isAssistant ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                  </div>

                  <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                    isAssistant
                      ? 'bg-slate-950/40 border-white/[0.05] text-slate-200'
                      : 'bg-blue-600/10 border-blue-500/20 text-blue-105'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <span className="text-[9px] text-slate-500 font-mono mt-2 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Loader bubble */}
            {chatLoading && (
              <div className="flex gap-3.5 max-w-[80%] mr-auto">
                <div className="p-2.5 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center bg-white/5 border border-white/10 text-blue-400 font-medium">
                  <Bot className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/[0.05] flex items-center gap-2 text-xs text-blue-400 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  <span>Gemini is compiling solution...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input row footer */}
      <div className="relative z-10 p-4.5 bg-slate-950/45 border-t border-white/[0.06] shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 bg-slate-950/40 border border-white/[0.08] focus:border-blue-500/40 text-slate-100 focus:outline-none text-xs rounded-xl placeholder-slate-600 transition-all focus:ring-1 focus:ring-blue-500/25"
            placeholder={chatLoading ? "Gemini is replying..." : "Ask Gemini: review, solve, outline or troubleshoot..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={chatLoading}
          />
          <button
            type="submit"
            disabled={chatLoading || !inputText.trim()}
            className="p-3 bg-gradient-to-r from-blue-550 to-indigo-650 bg-blue-600 hover:opacity-90 disabled:opacity-40 rounded-xl text-white transition-all duration-150 shrink-0 active:scale-95 cursor-pointer border border-white/10"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
