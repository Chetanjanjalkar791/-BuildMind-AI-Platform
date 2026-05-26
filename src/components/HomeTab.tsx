import React from 'react';
import { motion } from 'motion/react';

interface HomeTabProps {
  onSelectTab: (tab: any) => void;
}

export default function HomeTab({ onSelectTab }: HomeTabProps) {
  const tools = [
    {
      id: 'code-gen',
      title: 'AI Code Generator',
      desc: 'Generate production-ready code in multiple languages with intelligent suggestions and best practices.',
      emoji: '💻',
      gradient: 'from-[#a855f7] to-[#ec4899]',
      glowColor: 'rgba(168, 85, 247, 0.15)',
      borderFocus: 'hover:border-[#a855f7]/40',
      textColor: 'group-hover:text-[#ec4899]',
      cardBg: 'bg-[#a855f7]/[0.02] hover:bg-[#a855f7]/[0.07]',
      badge: 'Generation'
    },
    {
      id: 'roadmap',
      title: 'Learning Roadmaps',
      desc: 'Create personalized learning paths for any technology or domain with AI-powered recommendations.',
      emoji: '🗺️',
      gradient: 'from-[#06b6d4] to-[#3b82f6]',
      glowColor: 'rgba(6, 182, 212, 0.15)',
      borderFocus: 'hover:border-[#06b6d4]/40',
      textColor: 'group-hover:text-[#06b6d4]',
      cardBg: 'bg-[#06b6d4]/[0.02] hover:bg-[#06b6d4]/[0.07]',
      badge: 'Curriculum'
    },
    {
      id: 'complexity',
      title: 'Complexity Analyzer',
      desc: 'Analyze time and space complexity of your algorithms with detailed insights and optimization tips.',
      emoji: '📊',
      gradient: 'from-[#10b981] to-[#14b8a6]',
      glowColor: 'rgba(16, 185, 129, 0.15)',
      borderFocus: 'hover:border-[#10b981]/40',
      textColor: 'group-hover:text-[#10b981]',
      cardBg: 'bg-[#10b981]/[0.02] hover:bg-[#10b981]/[0.07]',
      badge: 'Performance'
    },
    {
      id: 'algorithm',
      title: 'Algorithm Explainer',
      desc: 'Trace variable states, logic logic, and debug code steps on a dynamic visual chalkboard.',
      emoji: '🧮',
      gradient: 'from-[#f97316] to-[#ef4444]',
      glowColor: 'rgba(249, 115, 22, 0.15)',
      borderFocus: 'hover:border-[#f97316]/40',
      textColor: 'group-hover:text-[#f97316]',
      cardBg: 'bg-[#f97316]/[0.02] hover:bg-[#f97316]/[0.07]',
      badge: 'Logic Trace'
    },
    {
      id: 'api-mock',
      title: 'API Generator',
      desc: 'Design, simulate, and generate robust REST API endpoint schemas and mock response structures.',
      emoji: '🔌',
      gradient: 'from-[#6366f1] to-[#a855f7]',
      glowColor: 'rgba(99, 102, 241, 0.15)',
      borderFocus: 'hover:border-[#6366f1]/40',
      textColor: 'group-hover:text-[#818cf8]',
      cardBg: 'bg-[#6366f1]/[0.02] hover:bg-[#6366f1]/[0.07]',
      badge: 'Development'
    },
    {
      id: 'frontend',
      title: 'Frontend Developer',
      desc: 'Draft mock UI layouts, live preview responsive elements, and extract exportable Tailwind snippets.',
      emoji: '🎨',
      gradient: 'from-[#ff007a] via-[#ff4d4d] to-[#ef4444]',
      glowColor: 'rgba(255, 0, 122, 0.15)',
      borderFocus: 'hover:border-[#ff007a]/40',
      textColor: 'group-hover:text-[#ff4d4d]',
      cardBg: 'bg-[#ff007a]/[0.02] hover:bg-[#ff007a]/[0.07]',
      badge: 'Visual Sandbox'
    },
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-white overflow-hidden py-16 px-4 md:px-8 font-sans">
      {/* Background decorations matching the mockups exactly */}
      <div className="absolute left-[5%] top-16 w-52 h-52 border border-white/5 rounded-[2.5rem] rotate-[32deg] pointer-events-none hidden lg:block"></div>
      <div className="absolute right-[5%] bottom-44 w-36 h-36 border border-white/5 rounded-full pointer-events-none hidden lg:block"></div>
      
      {/* Glowing custom star elements */}
      <div className="absolute left-[12%] top-[30%] w-1.5 h-1.5 bg-white/35 rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute right-[15%] top-[10%] w-1 h-1 bg-white/20 rounded-full pointer-events-none"></div>
      <div className="absolute left-[45%] top-[15%] w-1.5 h-1.5 bg-white/25 rounded-full pointer-events-none"></div>
      <div className="absolute right-[28%] bottom-[40%] w-1 h-1 bg-white/15 rounded-full pointer-events-none"></div>
      <div className="absolute left-[20%] bottom-[20%] w-1.5 h-1.5 bg-white/20 rounded-full pointer-events-none"></div>
      <div className="absolute right-[40%] bottom-[15%] w-1.5 h-1.5 bg-white/30 rounded-full pointer-events-none"></div>

      {/* Hero Badge Section */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#162235]/40 text-xs font-semibold tracking-wide text-slate-300 backdrop-blur-sm shadow-inner"
        >
          <span>🚀</span>
          <span>AI Development Tools suite</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-3xl"
        >
          AI-Powered <br /> Development Tools
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-xs md:text-sm max-w-xl leading-relaxed font-normal"
        >
          Transform your development workflow with our suite of intelligent AI tools. Generate code, analyze algorithms, create roadmaps, and build APIs faster than ever before.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-850 border border-white/10 text-xs font-semibold text-white shadow-xl hover:border-white/20 transition cursor-pointer active:scale-[0.98]"
          >
            <span>🚀</span>
            <span>Get Started</span>
          </button>
          
          <button
            onClick={() => {
              const el = document.getElementById('tools-grid-head');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#161F30]/30 border border-white/5 text-xs font-semibold text-slate-300 hover:bg-[#161F30]/60 hover:text-white transition cursor-pointer active:scale-[0.98]"
          >
            <span>🔍</span>
            <span>Explore Features</span>
          </button>
        </motion.div>

        {/* Counter Stats Deck inside the Hero Container */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-12"
        >
          {/* Card 1 */}
          <div className="bg-[#121A2E]/40 border border-white/5 rounded-2xl p-6 text-center backdrop-blur-md hover:border-white/10 transition-colors duration-300">
            <div className="text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">⚡</div>
            <div className="text-3xl font-extrabold text-white my-1">6+</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">AI Tools</div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#121A2E]/40 border border-white/5 rounded-2xl p-6 text-center backdrop-blur-md hover:border-white/10 transition-colors duration-300">
            <div className="text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">🌐</div>
            <div className="text-3xl font-extrabold text-white my-1">10+</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">Languages</div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#121A2E]/40 border border-white/5 rounded-2xl p-6 text-center backdrop-blur-md hover:border-white/10 transition-colors duration-300">
            <div className="text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(240,113,103,0.5)]">🕒</div>
            <div className="text-3xl font-extrabold text-white my-1">24/7</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">Availability</div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#121A2E]/40 border border-white/5 rounded-2xl p-6 text-center backdrop-blur-md hover:border-white/10 transition-colors duration-300">
            <div className="text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">🎉</div>
            <div className="text-3xl font-extrabold text-white my-1">100%</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">Free</div>
          </div>
        </motion.div>
      </div>

      {/* Powerful AI Tools Grid Section */}
      <div id="tools-grid" className="max-w-6xl mx-auto mt-32 space-y-12">
        <div id="tools-grid-head" className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Powerful AI Tools
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Everything you need to accelerate your development process with the power of artificial intelligence.
          </p>
        </div>

        {/* 6 Grid items rendered as individual transparent themed cards with hover effects matching dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((t, idx) => (
            <motion.div
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: `0 20px 40px -15px ${t.glowColor}, 0 0 15px -3px ${t.glowColor}`
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className={`relative ${t.cardBg} border border-white/[0.05] ${t.borderFocus} p-6 rounded-2xl flex flex-col justify-between min-h-[220px] transition-all duration-355 cursor-pointer group shadow-xl backdrop-blur-md overflow-hidden`}
            >
              {/* Card Corner Ambient Glow Accent */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-355 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${t.glowColor} 0%, transparent 70%)` }}
              ></div>

              <div>
                {/* Header Row with Badge & Emoji Icon container */}
                <div className="flex justify-between items-center mb-5">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.gradient} border border-white/10 flex items-center justify-center shrink-0 shadow-md relative z-10 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <span className="text-lg select-none leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">{t.emoji}</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-white/5 border border-white/[0.06] px-2.5 py-1 rounded-full group-hover:border-white/10 group-hover:text-white transition-all duration-300">
                    {t.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-base font-bold text-white ${t.textColor} transition-colors duration-300 tracking-tight`}>
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-3">
                    {t.desc}
                  </p>
                </div>
              </div>

              {/* Action Prompt matching the card theme color */}
              <div className="mt-5 pt-3 border-t border-white/[0.03] flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-all duration-300 inline-flex items-center gap-1.5 select-none">
                  Try it now
                </span>
                <span className="text-slate-400 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300 transform font-bold">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
