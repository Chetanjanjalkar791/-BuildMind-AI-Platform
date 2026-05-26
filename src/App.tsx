import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  LayoutDashboard, 
  Monitor, 
  Terminal, 
  Milestone, 
  LineChart, 
  Eye, 
  Database, 
  MessageSquare,
  Menu,
  X,
  PlusCircle,
  HelpCircle,
  Home
} from 'lucide-react';

import HomeTab from './components/HomeTab';
import DashboardTab from './components/DashboardTab';
import FrontendTab from './components/FrontendTab';
import CodeGenTab from './components/CodeGenTab';
import RoadmapTab from './components/RoadmapTab';
import ComplexityTab from './components/ComplexityTab';
import AlgorithmTraceTab from './components/AlgorithmTraceTab';
import ApiMockTab from './components/ApiMockTab';
import ChatsTab from './components/ChatsTab';
import ParticleBackground from './components/ParticleBackground';

import { ToolTab, SavedSnippet, ChatMessage } from './types';
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';

const tabStyles: Record<ToolTab, { 
  active: string; 
  hover: string; 
  textActive: string; 
  iconColor: string; 
  gradient: string;
  glow: string;
  emoji: string;
}> = {
  home: {
    active: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    hover: 'hover:bg-emerald-500/5 hover:text-emerald-300 hover:border-emerald-500/10',
    textActive: 'text-emerald-400',
    iconColor: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    emoji: '🏡'
  },
  dashboard: {
    active: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    hover: 'hover:bg-amber-500/5 hover:text-amber-300 hover:border-amber-500/10',
    textActive: 'text-amber-400',
    iconColor: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    emoji: '⚡'
  },
  frontend: {
    active: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    hover: 'hover:bg-sky-500/5 hover:text-sky-300 hover:border-sky-500/10',
    textActive: 'text-sky-400',
    iconColor: 'text-sky-400',
    gradient: 'from-sky-500 to-cyan-550',
    glow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]',
    emoji: '🎨'
  },
  'code-gen': {
    active: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    hover: 'hover:bg-indigo-500/5 hover:text-indigo-300 hover:border-indigo-500/10',
    textActive: 'text-indigo-400',
    iconColor: 'text-indigo-400',
    gradient: 'from-indigo-500 to-purple-600',
    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]',
    emoji: '💻'
  },
  roadmap: {
    active: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    hover: 'hover:bg-purple-500/5 hover:text-purple-300 hover:border-purple-500/10',
    textActive: 'text-purple-400',
    iconColor: 'text-purple-400',
    gradient: 'from-purple-500 to-violet-605',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    emoji: '📍'
  },
  complexity: {
    active: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    hover: 'hover:bg-rose-500/5 hover:text-rose-300 hover:border-rose-500/10',
    textActive: 'text-rose-400',
    iconColor: 'text-rose-400',
    gradient: 'from-rose-500 to-red-550',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    emoji: '📊'
  },
  algorithm: {
    active: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    hover: 'hover:bg-orange-500/5 hover:text-orange-300 hover:border-orange-500/10',
    textActive: 'text-orange-400',
    iconColor: 'text-orange-400',
    gradient: 'from-orange-500 to-amber-550',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    emoji: '🧮'
  },
  'api-mock': {
    active: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    hover: 'hover:bg-teal-500/5 hover:text-teal-300 hover:border-teal-500/10',
    textActive: 'text-teal-400',
    iconColor: 'text-teal-400',
    gradient: 'from-teal-500 to-emerald-555',
    glow: 'shadow-[0_0_15px_rgba(20,184,166,0.15)]',
    emoji: '🌐'
  },
  chats: {
    active: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    hover: 'hover:bg-pink-500/5 hover:text-pink-300 hover:border-pink-500/10',
    textActive: 'text-pink-400',
    iconColor: 'text-pink-400',
    gradient: 'from-pink-500 to-rose-550',
    glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]',
    emoji: '💬'
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ToolTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  
  const { user } = useUser();
  const userName = user ? (user.firstName || user.fullName || user.username || user.primaryEmailAddress?.emailAddress.split('@')[0] || 'User') : '';
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : 'U';
  
  // State for user actions flowing between tabs
  const [complexityPassedCode, setComplexityPassedCode] = useState('');
  
  // Local persistent states
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Load from local Cache
  useEffect(() => {
    setIsInIframe(window.self !== window.top);
    try {
      const cachedSnippets = localStorage.getItem('ai_devtools_snippets');
      if (cachedSnippets) setSavedSnippets(JSON.parse(cachedSnippets));

      const cachedChats = localStorage.getItem('ai_devtools_chats');
      if (cachedChats) setChatMessages(JSON.parse(cachedChats));
    } catch (e) {
      console.error("Local Storage parsing error:", e);
    }
  }, []);

  const handleSaveSnippet = (title: string, language: string, code: string, explanation?: string) => {
    const newSnippet: SavedSnippet = {
      id: Math.random().toString(36).substring(7),
      title,
      language,
      code,
      explanation,
      createdAt: new Date().toISOString()
    };
    const updated = [newSnippet, ...savedSnippets];
    setSavedSnippets(updated);
    localStorage.setItem('ai_devtools_snippets', JSON.stringify(updated));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMsgs = [...chatMessages, userMsg];
    setChatMessages(newMsgs);
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      if (res.ok) {
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const finalMsgs = [...newMsgs, assistantMsg];
        setChatMessages(finalMsgs);
        localStorage.setItem('ai_devtools_chats', JSON.stringify(finalMsgs));
      } else {
        alert(data.error || "Failed to receive answer from Chat service.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending message to fullstack assistant.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChatMessageHistory = () => {
    if (confirm("Are you sure you want to delete your conversation history?")) {
      setChatMessages([]);
      localStorage.removeItem('ai_devtools_chats');
    }
  };

  const handleOptimizeCodeFromDashboard = (code: string) => {
    setComplexityPassedCode(code);
    setActiveTab('complexity');
  };

  const handleAskGeminiFromDashboard = async (question: string) => {
    setActiveTab('chats');
    await handleSendMessage(question);
  };

  const navigationItems = [
    { id: 'dashboard' as const, label: 'Dashboard', emoji: '🏠', gradient: 'from-[#22d3ee] to-[#8b5cf6]' },
    { id: 'frontend' as const, label: 'Frontend Developer', emoji: '🎨', gradient: 'from-[#ff007a] via-[#ff4d4d] to-[#ef4444]' },
    { id: 'code-gen' as const, label: 'Code Generator', emoji: '💻', gradient: 'from-[#a855f7] to-[#ec4899]' },
    { id: 'roadmap' as const, label: 'Roadmap Generator', emoji: '🗺️', gradient: 'from-[#06b6d4] to-[#3b82f6]' },
    { id: 'complexity' as const, label: 'Time Complexity', emoji: '📊', gradient: 'from-[#10b981] to-[#14b8a6]' },
    { id: 'algorithm' as const, label: 'Algorithm Explainer', emoji: '🧮', gradient: 'from-[#f97316] to-[#ef4444]' },
    { id: 'api-mock' as const, label: 'API Generator', emoji: '🔌', gradient: 'from-[#6366f1] to-[#a855f7]' },
    { id: 'chats' as const, label: 'Recent Chats', emoji: '💬', gradient: 'from-[#3b82f6] to-[#06b6d4]' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-sleek-bg font-sans text-slate-300 antialiased selection:bg-blue-500/20 selection:text-white relative overflow-hidden">
      <ParticleBackground />
      {/* Outer frame container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation Panel for Desktop (hidden on home page to match home screenshot) */}
        {activeTab !== 'home' && (
          <aside className="w-72 bg-[#050507] border-r border-white/[0.04] shrink-0 hidden md:flex flex-col h-screen sticky top-0">
            {/* Brand Banner matching the mock layout exactly */}
            <div className="px-6 py-6 border-b border-white/[0.05] flex items-center gap-4 bg-transparent z-10 shrink-0">
              <div className="w-[44px] h-[44px] rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center border border-white/10 shadow-lg shadow-purple-950/20">
                <span className="text-xl select-none leading-none transform -rotate-12">🚀</span>
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-[17px] font-extrabold text-white tracking-tight leading-none">BuildMind AI</h1>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide mt-1.5 block leading-none">Development Suite</span>
              </div>
            </div>

            {/* Sidebar Nav buttons with colorful gradient emoji blocks */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 p-2.5 px-3.5 rounded-2xl text-[14px] font-bold tracking-wide transition-all duration-200 border text-left group ${
                      isActive
                        ? 'bg-[#140828] border-[#4c1d95]/50 text-purple-300 shadow-[0_0_20px_rgba(109,40,217,0.12)]'
                        : 'text-slate-200 border-transparent bg-transparent hover:bg-white/[0.03] hover:text-white'
                    }`}
                  >
                    {/* Emoji block with gradients */}
                    <div className={`w-[42px] h-[42px] rounded-2xl bg-gradient-to-br ${item.gradient} border border-white/10 flex items-center justify-center shrink-0 shadow-inner relative z-10 transform transition-transform group-hover:scale-[1.03]`}>
                      <span className="text-lg select-none leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">{item.emoji}</span>
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User context footer matching the theme status line */}
            <div className="px-6 py-4 border-t border-white/[0.05] shrink-0 bg-[#050507]">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider font-sans">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>Platform Connection Live</span>
              </div>
            </div>
          </aside>
        )}

        {/* Main layout contents area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
          {/* Centered Animated Blue Background Glow Layer */}
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-blue-600/15 to-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none z-0" style={{ animationDelay: '-6s' }}></div>

          {/* Top Navbar */}
          <header className="h-16 border-b border-white/[0.05] bg-[#0c0c0e]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
            {/* Active module title indicator & quick-toggle horizontal navigation tabs */}
            <div className="flex items-center gap-6">
              {activeTab === 'home' ? (
                <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center border border-white/10 shadow-md">
                    <span className="text-base select-none">🤖</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-extrabold text-white leading-none tracking-tight">BuildMind AI</span>
                    <span className="text-[10px] text-slate-450 font-medium tracking-wide mt-1 block leading-none">AI Development Tools suite</span>
                  </div>
                </div>
              ) : (
                activeTab !== 'dashboard' && (
                  <span className="text-slate-500 text-xs uppercase tracking-widest font-mono font-bold hidden lg:inline-block border-r border-white/10 pr-6">
                    {activeTab === 'frontend' ? 'Frontend Canvas' :
                     activeTab === 'code-gen' ? 'Language Code Synthesizer' :
                     activeTab === 'roadmap' ? 'Curriculum Path' :
                     activeTab === 'complexity' ? 'Complexity Analytics' :
                     activeTab === 'algorithm' ? 'Algorithm Trace Chalkboard' :
                     activeTab === 'api-mock' ? 'REST API Schema Designer' :
                     activeTab === 'chats' ? 'AI Dev Assistant Chat' : 
                     activeTab === 'home' ? 'Home Portal' :
                     'Core Suite'}
                  </span>
                )
              )}

              {/* Horizontal Command Tabs matching the requested mockup layout exactly */}
              <div className="flex items-center gap-2 bg-white/[0.02] p-1 rounded-2xl border border-white/[0.04]">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer border ${
                    activeTab === 'home'
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-lg shadow-purple-500/20 border-purple-400/20 scale-[1.02]'
                      : 'text-slate-400 border-transparent bg-transparent hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="text-sm select-none">🏡</span>
                  <span>Home</span>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer border ${
                    activeTab === 'dashboard'
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-lg shadow-purple-500/20 border-purple-400/20 scale-[1.02]'
                      : 'text-slate-400 border-transparent bg-transparent hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="text-sm select-none">⚡</span>
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('code-gen')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer border ${
                    activeTab === 'code-gen'
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-lg shadow-purple-500/20 border-indigo-400/20 scale-[1.02]'
                      : 'text-slate-400 border-transparent bg-transparent hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="text-sm select-none">💻</span>
                  <span>Code Generator</span>
                </button>
              </div>
            </div>

            {/* Right side Actions: Sign In with Clerk Integration */}
            <div className="flex items-center gap-3">
              <SignedIn>
                <div className="flex items-center gap-3">
                  {/* Name stack */}
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-white tracking-tight leading-tight">
                      {userName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                      Welcome back!
                    </span>
                  </div>

                  {/* Circle Avatar with custom gradient from screenshot */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8c5cf6] to-[#0ea5e9] flex items-center justify-center text-white text-sm font-extrabold select-none shrink-0 shadow-[0_0_10px_rgba(140,92,246,0.15)]">
                    {firstLetter}
                  </div>

                  {/* Sign Out Trigger with exact red button styled from screenshot */}
                  <SignOutButton>
                    <button className="px-4 py-1.5 text-xs font-bold bg-[#c20d0d] hover:bg-[#a10a0a] rounded-lg text-white transition duration-150 cursor-pointer active:scale-[0.98] border-none outline-none">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </SignedIn>
              <SignedOut>
                {isInIframe ? (
                  <button 
                    onClick={() => {
                      alert("🔒 Clerk Authentication Security Header Notice:\n\nBecause you are currently viewing the application inside the AI Studio editor iframe, Clerk's security rules prevent loading its login window here (driving-narwhal-32.accounts.dev refused to connect).\n\nTo login, please click the yellow 'Open in New Tab ↗' banner at the top of the screen to open the app outside of the iframe!");
                    }}
                    className="px-5 py-2.5 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-200 transition cursor-pointer active:scale-[0.98] flex items-center gap-2"
                  >
                    <span>🔐</span>
                    <span>Sign In</span>
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] hover:from-[#7c3aed] hover:to-[#2563eb] rounded-xl text-white shadow-md shadow-purple-600/20 transition cursor-pointer active:scale-[0.98] flex items-center gap-2">
                      <span>🔐</span>
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                )}
              </SignedOut>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded md:hidden transition-colors"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </header>

          {/* Mobile menu navigation drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-white/[0.05] bg-[#050507] sticky top-12 z-20 p-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 p-2 rounded-xl text-xs font-bold border text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-[#140828] border-[#4c1d95]/50 text-purple-300'
                        : 'text-slate-300 border-transparent bg-transparent hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}>
                      <span className="text-sm select-none leading-none">{item.emoji}</span>
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Iframe detection notice for Clerk */}
          {isInIframe && (
            <div className="bg-amber-500/10 border-b border-amber-500/15 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-350 gap-3 shrink-0 z-20">
              <div className="flex items-center gap-2 leading-relaxed">
                <span className="text-base select-none leading-none">⚠️</span>
                <span>
                  <strong>Clerk Authentication Restriction:</strong> Clerk login domains prevent rendering inside the AI Studio code preview iframe (refused to connect). To login and sync your workspace, please load the application in a full browser tab.
                </span>
              </div>
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-550/30 border border-amber-500/40 text-amber-200 text-xs font-bold rounded-xl transition duration-150 whitespace-nowrap active:scale-[0.98] cursor-pointer"
              >
                Open in New Tab ↗
              </a>
            </div>
          )}

          {/* Dynamic active tab routing container */}
          <main className="flex-1 p-6 w-full mx-auto overflow-y-auto bg-transparent relative z-10">
            {activeTab === 'home' && (
              <HomeTab onSelectTab={setActiveTab} />
            )}

            {activeTab === 'dashboard' && (
              <DashboardTab 
                savedSnippets={savedSnippets}
                onSelectTab={setActiveTab}
                onOptimizeCode={handleOptimizeCodeFromDashboard}
                onAskGemini={handleAskGeminiFromDashboard}
              />
            )}

            {activeTab === 'frontend' && (
              <FrontendTab onSaveSnippet={handleSaveSnippet} />
            )}

            {activeTab === 'code-gen' && (
              <CodeGenTab onSaveSnippet={handleSaveSnippet} />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapTab onSaveSnippet={handleSaveSnippet} />
            )}

            {activeTab === 'complexity' && (
              <ComplexityTab 
                onSaveSnippet={handleSaveSnippet} 
                passedCode={complexityPassedCode} 
              />
            )}

            {activeTab === 'algorithm' && (
              <AlgorithmTraceTab />
            )}

            {activeTab === 'api-mock' && (
              <ApiMockTab onSaveSnippet={handleSaveSnippet} />
            )}

            {activeTab === 'chats' && (
              <ChatsTab 
                chatMessages={chatMessages}
                onSendMessage={handleSendMessage}
                chatLoading={chatLoading}
                onClearChat={handleClearChatMessageHistory}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
