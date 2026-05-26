import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  FolderPlus, 
  Cpu, 
  ArrowRight,
  BookOpen,
  Code2,
  Trash2,
  Lightbulb
} from 'lucide-react';
import { motion } from 'motion/react';
import { GeneratedCodeResponse } from '../types';

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
      staggerChildren: 0.08,
      delayChildren: 0.1
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

interface CodeGenTabProps {
  onSaveSnippet: (title: string, language: string, code: string, explanation: string) => void;
}

export default function CodeGenTab({ onSaveSnippet }: CodeGenTabProps) {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<GeneratedCodeResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: '.js' },
    { value: 'typescript', label: 'TypeScript', ext: '.ts' },
    { value: 'python', label: 'Python', ext: '.py' },
    { value: 'go', label: 'Go Language', ext: '.go' },
    { value: 'rust', label: 'Rust System', ext: '.rs' },
    { value: 'cpp', label: 'C++', ext: '.cpp' }
  ];

  const sampleProblems = [
    "Implement a binary search algorithm",
    "Design an LRU cache with O(1) operations",
    "Write a robust debounce function for search inputs",
    "Create a dynamic programming solution for the knapsack problem"
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/generate/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || "Failed to generate optimized code snippet.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to fullstack Express service.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPrompt('');
    setResult(null);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      
      {/* 🔮 Brand Banner Header styled identically to the welcome banner with Purple/Pink theme */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 md:p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        {/* Glowing Ambient light background sources matching the Purple/Pink theme */}
        <div className="absolute top-0 right-0 -m-16 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center border border-white/10 shadow-md shrink-0 ring-4 ring-[#a855f7]/15 transform hover:scale-105 hover:rotate-3 transition-transform duration-300">
            <span className="text-xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">💻</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 rounded-full bg-white/5 border border-white/[0.08] text-[10px] font-bold text-purple-400 uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              Synthesizer Engine
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">AI Code Generator</h2>
            <p className="text-slate-400 text-xs mt-1.5 font-light leading-relaxed max-w-2xl">
              Generate production-ready code in multiple programming languages with intelligent pattern suggestions, standard algorithms, and robust optimization.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Two-Column Panel Deck */}
      <motion.div 
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        
        {/* Left Hand: "Generate Code" Form Grid Column */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 space-y-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-2.5 pb-3.5 border-b border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
              <span className="text-xs">🎯</span>
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Generate Code</h3>
          </div>

          <form onSubmit={handleGenerate} className="relative z-10 space-y-5">
            {/* Problem Statement */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Problem Statement
              </label>
              <textarea
                className="w-full h-44 p-4 bg-slate-950/40 border border-white/[0.08] focus:border-purple-500/45 focus:ring-1 focus:ring-purple-500/30 rounded-xl text-xs text-slate-100 focus:outline-none transition-all placeholder-slate-600 resize-none leading-relaxed font-sans"
                placeholder="Describe the problem or functionality you want to implement..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Programming Language Picker */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Programming Language
              </label>
              
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-amber-500 text-xs">⚡</span>
                <select
                  className="w-full pl-8 pr-8 py-2.5 bg-slate-950/40 border border-white/[0.08] focus:border-purple-500/45 focus:ring-1 focus:ring-purple-500/30 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer appearance-none transition-all"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((l) => (
                    <option key={l.value} value={l.value} className="bg-[#0A0A0C] text-slate-200 font-sans">
                      {l.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Bar Trigger Buttons matching layout EXACTLY */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-purple-500/10 active:scale-[0.98] transition-all cursor-pointer border border-white/10"
              >
                {loading ? <Cpu className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                <span>{loading ? "Generating..." : "Generate Code"}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="px-4.5 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer active:scale-[0.98]"
              >
                Clear
              </button>
            </div>
          </form>

          {/* Sample Problems widget section */}
          <div className="relative z-10 pt-4 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 text-slate-350">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Sample Problems</span>
            </div>
            <div className="space-y-2">
              {sampleProblems.map((prob, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(prob)}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/40 border border-white/[0.05] hover:border-purple-500/30 hover:bg-slate-950/70 text-[11px] text-slate-300 hover:text-white transition-all duration-150 block truncate font-medium cursor-pointer"
                  title={prob}
                >
                  • {prob}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Hand: "Generated Code" Output Frame Column */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 min-h-[580px] flex flex-col shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none"></div>

          {/* Header Bar matching left one */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
                <span className="text-xs">💻</span>
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Generated Code</h3>
            </div>
            
            {result && !loading && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-300 hover:text-white transition-all border border-white/10 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={() => {
                    setSaving(true);
                    onSaveSnippet(result.title, result.language, result.code, result.explanation);
                    setTimeout(() => setSaving(false), 800);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-450 hover:text-white text-[10px] font-bold border border-purple-500/20 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Blueprint"}</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center py-4">
            {/* Case A: LOADING state */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12 animate-pulse">
                <div className="w-14 h-14 bg-slate-950/40 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg text-2xl">
                  ⚙️
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-wide text-white uppercase">AI is drafting pristine logic...</p>
                  <p className="text-[10px] text-purple-400 font-mono italic">Compiling modular specs onto chalkboards</p>
                </div>
              </div>
            )}

            {/* Case B: EMPTY state placeholder matching Image 3 exactly */}
            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-12">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.15)] text-purple-400">
                  💻
                </div>
                <p className="text-xs md:text-sm text-slate-400 max-w-sm font-light">
                  Describe your problem to generate intelligent code.
                </p>
              </div>
            )}

            {/* Case C: PRESENT results output */}
            {result && !loading && (
              <div className="space-y-5 animate-fade-in flex-1 flex flex-col justify-between">
                
                {/* Responsive code block frame */}
                <div className="bg-[#050507] rounded-xl border border-white/10 overflow-hidden flex flex-col flex-1 min-h-[320px]">
                  <div className="px-4 py-2 bg-[#0d0d11] border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{result.language || language} script module</span>
                    <span>UTF-8</span>
                  </div>
                  
                  <div className="p-4 overflow-x-auto font-mono text-left text-slate-300 text-[11px] leading-relaxed flex-1 select-text">
                    <pre className="whitespace-pre">{result.code}</pre>
                  </div>
                </div>

                {/* Algorithmic description & Architectural Breakdown note card */}
                <div className="bg-[#1a1a20]/45 p-4 rounded-xl border border-white/15 space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-350 font-mono">
                      Implementation Concept
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-light select-text">
                    {result.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
