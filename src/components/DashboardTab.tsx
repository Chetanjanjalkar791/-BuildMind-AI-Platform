import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  Code2, 
  Zap, 
  Award, 
  ArrowRight, 
  FileCode, 
  HelpCircle, 
  Sparkles,
  ClipboardCheck,
  CheckCircle2
} from 'lucide-react';
import { SavedSnippet } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.05,
      delayChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18
    }
  }
};

interface DashboardTabProps {
  savedSnippets: SavedSnippet[];
  onSelectTab: (tab: any) => void;
  onOptimizeCode: (code: string) => void;
  onAskGemini: (question: string) => void;
}

export default function DashboardTab({ 
  savedSnippets, 
  onSelectTab, 
  onOptimizeCode,
  onAskGemini
}: DashboardTabProps) {
  const [quickCode, setQuickCode] = useState('');
  const [quickQuestion, setQuickQuestion] = useState('');

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Welcome banner in glassmorphic transparent container */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-8 md:p-10 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col md:flex-row md:items-center justify-between gap-8"
      >
        {/* Glowing Ambient light background sources matching the primary themes */}
        <div className="absolute top-0 right-0 -m-16 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#8b5cf6]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 max-w-xl flex-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-5 rounded-full bg-white/5 border border-white/[0.08] text-xs font-medium text-blue-400 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            Empowered by Gemini 3.5 Flash
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-white mb-3">
            Your Full-Stack AI Development Companion
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6 font-light">
            Build modern responsive frontends, generate optimized code structures, estimate Big O complexity, map career pathways, and generate mock services in seconds.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTab('frontend')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98] border border-blue-400/10 cursor-pointer"
            >
              Start Coding
            </button>
            <button
              onClick={() => onSelectTab('complexity')}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-white/10 active:scale-[0.98] cursor-pointer"
            >
              Complexity Check
            </button>
          </div>
        </div>

        {/* 3D Thumbs-up Character Illustration container identical to requested PNG position */}
        <div className="relative z-10 shrink-0 self-center md:self-end flex justify-center items-center">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 16 }}
            className="relative"
          >
            {/* Soft Ambient glowing background disc */}
            <div className="absolute inset-4 bg-gradient-to-br from-blue-550 to-[#8b5cf6] rounded-full blur-[35px] opacity-25 animate-pulse"></div>
            
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/boy-doing-thumbs-up-sign-5182173-4333649.png"
              alt="3D developer character avatar thumbs up"
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.55)] transition-all duration-300 hover:scale-[1.07] hover:rotate-3 cursor-pointer select-none"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* AI Development Tools Grid Section integrated beautifully inside Dashboard */}
      <motion.div 
        variants={sectionVariants}
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">🛠️</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">AI Development Tools Suite</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-light">
            Directly select, launch, and control any of the advanced AI specialized developer capabilities built into the platform:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
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
            }
          ].map((tool) => (
            <motion.div
              key={tool.id}
              onClick={() => onSelectTab(tool.id)}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: `0 20px 40px -15px ${tool.glowColor}, 0 0 15px -3px ${tool.glowColor}`
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className={`relative ${tool.cardBg} border border-white/[0.05] ${tool.borderFocus} p-6 rounded-2xl flex flex-col justify-between min-h-[220px] transition-all duration-355 cursor-pointer group shadow-xl backdrop-blur-md overflow-hidden`}
            >
              {/* Card Corner Ambient Glow Accent */}
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-355 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${tool.glowColor} 0%, transparent 70%)` }}
              ></div>

              <div>
                {/* Header Row with Badge & Emoji Icon container */}
                <div className="flex justify-between items-center mb-5">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} border border-white/10 flex items-center justify-center shrink-0 shadow-md relative z-10 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <span className="text-lg select-none leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">{tool.emoji}</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-white/5 border border-white/[0.06] px-2.5 py-1 rounded-full group-hover:border-white/10 group-hover:text-white transition-all duration-300">
                    {tool.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-base font-bold text-white ${tool.textColor} transition-colors duration-300 tracking-tight`}>
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-3">
                    {tool.desc}
                  </p>
                </div>
              </div>

              {/* Action Prompt matching the card theme color */}
              <div className="mt-5 pt-3 border-t border-white/[0.03] flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-all duration-300 inline-flex items-center gap-1.5 select-none font-sans">
                  Try it now
                </span>
                <span className="text-slate-400 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300 transform font-bold">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Getting Started Steps Section inside a beautiful transparent card backing panel */}
      <motion.div 
        variants={sectionVariants}
        className="relative p-6 md:p-8 rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden space-y-6"
      >
        {/* Ambient background accent glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div variants={itemVariants} className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl select-none">🏁</span>
            <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Getting Started: How to Use the Studio Suite</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-light">
            Follow these simple high-impact steps to boost your engineering productivity and streamline development flows using this suite.
          </p>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Select a DevTool',
              desc: 'Browse our specialized modules on the sidebar or click any card above—such as the Frontend Canvas or REST API Designer.',
              emoji: '🎯',
              glowColor: 'rgba(59, 130, 246, 0.15)',
              borderColor: 'border-blue-500/10 hover:border-blue-500/40',
              numColor: 'text-blue-400',
              cardBg: 'bg-blue-500/[0.01] hover:bg-blue-500/[0.05]'
            },
            {
              step: '02',
              title: 'Describe Objective',
              desc: 'Input customized prompts, explain your logic targets, paste slow algorithm loops, or declare your database structures.',
              emoji: '💬',
              glowColor: 'rgba(168, 85, 247, 0.15)',
              borderColor: 'border-purple-500/10 hover:border-purple-500/40',
              numColor: 'text-purple-400',
              cardBg: 'bg-purple-500/[0.01] hover:bg-purple-500/[0.05]'
            },
            {
              step: '03',
              title: 'Synthesize & Simulate',
              desc: 'Trigger our models to engineer functional micro-frontends, construct precise flowcharts, or inspect execution traces on-the-fly.',
              emoji: '⚙️',
              glowColor: 'rgba(236, 72, 153, 0.15)',
              borderColor: 'border-pink-500/10 hover:border-pink-500/40',
              numColor: 'text-pink-400',
              cardBg: 'bg-pink-500/[0.01] hover:bg-pink-500/[0.05]'
            },
            {
              step: '04',
              title: 'Deploy & Export',
              desc: 'Copy optimized TypeScript classes directly to your local codebase, utilize simulated APIs, or review completed learning routes.',
              emoji: '🚀',
              glowColor: 'rgba(16, 185, 129, 0.15)',
              borderColor: 'border-emerald-500/10 hover:border-emerald-500/40',
              numColor: 'text-emerald-400',
              cardBg: 'bg-emerald-500/[0.01] hover:bg-emerald-500/[0.05]'
            }
          ].map((item) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              whileHover={{ 
                y: -6, 
                scale: 1.02,
                boxShadow: `0 20px 30px -10px ${item.glowColor}`
              }}
              transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              className={`relative ${item.cardBg} border ${item.borderColor} p-6 rounded-2xl flex flex-col justify-between min-h-[190px] transition-all duration-300 group backdrop-blur-md overflow-hidden`}
            >
              {/* Individual Soft Ambient glow in the corner on hover */}
              <div 
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${item.glowColor} 0%, transparent 70%)` }}
              ></div>

              <div className="flex justify-between items-center relative z-10 mb-4">
                <span className={`text-2xl font-mono font-extrabold tracking-tight ${item.numColor} select-none opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                  {item.step}
                </span>
                <span className="text-xl select-none filter drop-shadow-md group-hover:scale-120 group-hover:rotate-6 transition-transform duration-300">
                  {item.emoji}
                </span>
              </div>
              <div className="space-y-1.5 relative z-10">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-white transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
