import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Copy, 
  Check, 
  Flame, 
  LineChart, 
  CheckCircle2, 
  Gauge,
  TrendingUp,
  ZapOff,
  FolderPlus,
  Play
} from 'lucide-react';
import { ComplexityAnalysis } from '../types';
import { motion } from 'motion/react';

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

interface ComplexityTabProps {
  onSaveSnippet: (title: string, language: string, code: string, explanation: string) => void;
  passedCode?: string;
}

export default function ComplexityTab({ onSaveSnippet, passedCode }: ComplexityTabProps) {
  const [code, setCode] = useState(passedCode || '');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysis, setAnalysis] = useState<ComplexityAnalysis | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'refactored'>('metrics');
  const [copiedOpt, setCopiedOpt] = useState(false);
  const [saving, setSaving] = useState(false);

  const steps = [
    "Establishing link with Big-O Analyzer engine...",
    "Tokenizing AST tree and loop nesting depths...",
    "Calculating asymptotical coefficients & operations limits...",
    "Plotting N scale growth projection arrays...",
    "Generating refactored non-blocking codebase blueprint..."
  ];

  useEffect(() => {
    if (passedCode) {
      setCode(passedCode);
    }
  }, [passedCode]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch('/api/generate/complexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data);
        setActiveSubTab('metrics');
      } else {
        alert(data.error || "Failed to analyze complexity specs.");
      }
    } catch (err) {
      console.error(err);
      alert("Error linking to solver-engine.");
    } finally {
      setLoading(false);
    }
  };

  const copyOptimized = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.optimizedCode);
    setCopiedOpt(true);
    setTimeout(() => setCopiedOpt(false), 2000);
  };

  const handleClear = () => {
    setCode('');
    setAnalysis(null);
  };

  const loadSample = (sampleType: string) => {
    if (sampleType === 'bubble') {
      setCode(`function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
  return arr;
}`);
    } else if (sampleType === 'fib') {
      setCode(`function recursiveFibonacci(n) {
  if (n <= 1) return n;
  return recursiveFibonacci(n - 1) + recursiveFibonacci(n - 2);
}`);
    } else if (sampleType === 'search') {
      setCode(`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`);
    }
  };

  // SVG growth graphics curves plotter
  const renderGrowthSvg = (data: any[]) => {
    if (!data || data.length === 0) return null;

    const width = 450;
    const height = 180;
    const padding = 25;

    // Find max value to scale relative
    const maxVal = Math.max(
      ...data.map(d => Math.max(d.linear, d.quadratic, d.custom))
    );

    const getX = (n: number) => padding + ((n - 1) / 99) * (width - padding * 2);
    const getY = (val: number) => height - padding - (val / maxVal) * (height - padding * 2);

    const buildPath = (key: string) => {
      return data.map((d, i) => {
        const x = getX(d.n);
        const y = getY(d[key]);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');
    };

    const linearPath = buildPath('linear');
    const quadraticPath = buildPath('quadratic');
    const customPath = buildPath('custom');

    return (
      <svg className="w-full h-auto bg-slate-950/70 border border-slate-900 rounded-xl" viewBox={`0 0 ${width} ${height}`}>
        {/* Horizontal & vertical grid lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1e293b" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#1e293b" strokeWidth="1" />

        {/* Math paths */}
        <path d={linearPath} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d={quadraticPath} fill="none" stroke="#be123c" strokeWidth="1.2" strokeDasharray="2 2" />
        <path d={customPath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />

        <text x={padding + 8} y={height - 8} fill="#475569" className="text-[8px] font-mono select-none">N Size Scale ➔</text>
        <text x={width - 120} y={height - 8} fill="#475569" className="text-[8px] font-mono select-none">Relative Cycles ➔</text>
      </svg>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      
      {/* 🔮 Brand Banner Header styled identically to the welcome banner with Emerald/Teal theme */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 md:p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        {/* Glowing Ambient light background sources matching the Emerald/Teal theme */}
        <div className="absolute top-0 right-0 -m-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#14b8a6] flex items-center justify-center border border-white/10 shadow-md shrink-0 ring-4 ring-[#10b981]/15 transform hover:scale-105 hover:rotate-3 transition-transform duration-300">
            <span className="text-xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">⏱️</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 rounded-full bg-white/5 border border-white/[0.08] text-[10px] font-bold text-emerald-400 uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              Big-O Runtime Auditor
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">AI Complexity Auditor</h2>
            <p className="text-slate-400 text-xs mt-1.5 font-light leading-relaxed max-w-2xl">
              Audit codeblocks dynamically to calculate runtime mathematical complexities and synthesize clean, non-blocking asynchronous alternatives.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Two-Column Panel Deck */}
      <motion.div 
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        
        {/* Left column: "Source Code Entry" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 space-y-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-2.5 pb-3.5 border-b border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10b981] to-[#14b8a6] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
              <span className="text-xs">💻</span>
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Algorithm Code Block</h3>
          </div>

          <form onSubmit={(e) => handleAnalyze(e)} className="relative z-10 space-y-5">
            {/* Project Description input block */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Source Code Block
              </label>
              <textarea
                className="w-full h-80 p-4 bg-slate-950/40 border border-white/[0.08] focus:border-[#10b981]/45 focus:ring-1 focus:ring-[#10b981]/30 rounded-xl text-[11px] font-mono text-slate-200 focus:outline-none transition-all placeholder-slate-700 resize-none leading-relaxed"
                placeholder="// Paste or write your Javascript/Python/TypeScript algorithm utilities here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {/* Actions Form buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all cursor-pointer border border-white/10"
              >
                {loading ? <Cpu className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                <span>{loading ? "Sweeping Complexities..." : "Analyze Big O Specs"}</span>
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

          {/* Quick-Selectors samples widget section */}
          <div className="relative z-10 pt-4 border-t border-white/[0.06] space-y-2">
            <span className="block text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">Load Diagnostic Templates</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => loadSample('bubble')}
                className="p-2 py-2.5 bg-slate-950/40 border border-white/[0.05] hover:border-[#10b981]/30 text-[10px] text-slate-300 hover:text-white rounded-lg transition font-mono cursor-pointer truncate"
              >
                Bubble Sort O(N²)
              </button>
              <button
                onClick={() => loadSample('fib')}
                className="p-2 py-2.5 bg-slate-950/40 border border-white/[0.05] hover:border-[#10b981]/30 text-[10px] text-slate-300 hover:text-white rounded-lg transition font-mono cursor-pointer truncate"
              >
                Recursive Fib O(2^N)
              </button>
              <button
                onClick={() => loadSample('search')}
                className="p-2 py-2.5 bg-slate-950/40 border border-white/[0.05] hover:border-[#10b981]/30 text-[10px] text-slate-300 hover:text-white rounded-lg transition font-mono cursor-pointer truncate"
              >
                Binary Search O(log N)
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right column: "Performance Analysis Viewport" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 min-h-[580px] flex flex-col justify-between shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10b981] to-[#14b8a6] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
                <span className="text-xs">📈</span>
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Audit Results Viewport</h3>
            </div>
            
            {analysis && !loading && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyOptimized}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-slate-300 hover:text-white transition-all border border-white/10 cursor-pointer"
                >
                  {copiedOpt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedOpt ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={() => {
                    setSaving(true);
                    onSaveSnippet("Refactored Code Optimizer", "Javascript", analysis.optimizedCode, analysis.explanation);
                    setTimeout(() => setSaving(false), 800);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-white text-[10px] font-bold border border-emerald-500/20 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Optimized Code"}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center py-4">
            
            {/* Loading diagnostics */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-12 animate-pulse">
                <div className="w-14 h-14 bg-[#1e293b]/50 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg text-2xl">
                  ⚙️
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-wide text-white uppercase">Inspecting computational scale...</p>
                  <p className="text-[10px] text-purple-400 font-mono italic max-w-sm">{steps[loadingStep]}</p>
                </div>
              </div>
            )}

            {/* Empty state standard display */}
            {!analysis && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-12">
                <div className="w-16 h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-2xl filter drop-shadow-[0_0_15px_rgba(139,92,246,0.15)] text-purple-400">
                  ⚡
                </div>
                <p className="text-xs md:text-sm text-slate-400 max-w-xs font-light">
                  Input source codebase blocks on the left to analyze runtime complexity scales
                </p>
              </div>
            )}

            {/* Analysis output panels */}
            {analysis && !loading && (
              <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                
                {/* Segment Tabs indicators */}
                <div className="flex items-center justify-between bg-black/40 p-1.5 rounded-xl border border-white/5">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setActiveSubTab('metrics')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeSubTab === 'metrics'
                          ? 'bg-[#8b5cf6] text-white shadow-md shadow-purple-600/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📈 Complexity Projections
                    </button>
                    <button
                      onClick={() => setActiveSubTab('refactored')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeSubTab === 'refactored'
                          ? 'bg-[#8b5cf6] text-white shadow-md shadow-purple-600/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      💡 Refactored Optimal Blueprint
                    </button>
                  </div>

                  <span className="text-[9px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    ● COMPILED
                  </span>
                </div>

                {/* Sub components space */}
                <div className="flex-1 flex flex-col min-h-[360px] text-left">
                  
                  {activeSubTab === 'metrics' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      {/* Grid metrics blocks */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#050507] p-4.5 rounded-xl border border-white/10 flex items-center gap-4.5">
                          <div className="p-3 bg-rose-500/10 text-rose-450 rounded-xl shrink-0 border border-rose-500/20">
                            <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold font-mono tracking-wider text-slate-500 uppercase">Worst Case Time</span>
                            <span className="text-lg font-bold font-mono text-white block mt-1">{analysis.time}</span>
                          </div>
                        </div>

                        <div className="bg-[#050507] p-4.5 rounded-xl border border-white/10 flex items-center gap-4.5">
                          <div className="p-3 bg-blue-500/10 text-blue-450 rounded-xl shrink-0 border border-blue-500/20">
                            <Gauge className="w-5 h-5 text-blue-405" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold font-mono tracking-wider text-slate-500 uppercase">Aux Space Growth</span>
                            <span className="text-lg font-bold font-mono text-white block mt-1">{analysis.space}</span>
                          </div>
                        </div>
                      </div>

                      {/* SVG scale graphs */}
                      <div className="bg-[#050507] rounded-xl p-4.5 border border-white/10 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <LineChart className="w-4 h-4 text-purple-400" />
                            <span className="text-[10px] font-bold font-mono text-white uppercase tracking-wider">Asymptotic Scale Comparison ({analysis.time})</span>
                          </div>
                          <div className="flex gap-3 text-[8px] font-mono text-slate-500">
                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span> O(N)</div>
                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> O(N²)</div>
                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Your Algorithm</div>
                          </div>
                        </div>
                        {renderGrowthSvg(analysis.growthData)}
                      </div>

                      {/* Bottleneck block list */}
                      <div className="bg-[#0a0a0d] p-4 rounded-xl border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-rose-455 font-mono text-[9px] font-bold uppercase tracking-widest pb-1 border-b border-white/5">
                          <ZapOff className="w-3.5 h-3.5" /> Performance Bottlenecks Identified
                        </div>
                        <div className="space-y-1.5 max-h-[90px] overflow-y-auto">
                          {analysis.bottlenecks.map((item, idx) => (
                            <div key={idx} className="text-[11px] text-slate-300 leading-relaxed font-sans flex items-start gap-2">
                              <span className="text-rose-500 font-bold">•</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {activeSubTab === 'refactored' && (
                    <div className="bg-[#050507] rounded-xl border border-white/10 overflow-hidden flex flex-col flex-1">
                      <div className="px-4 py-2 bg-[#0d0d11] border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Refactored Optimal Source</span>
                        <span className="text-emerald-400 font-bold uppercase">● OPTIMIZED</span>
                      </div>

                      <div className="p-4 overflow-y-auto max-h-[240px] font-mono text-slate-300 text-[11px] leading-relaxed flex-1 select-text bg-black/40">
                        <pre className="whitespace-pre">{analysis.optimizedCode}</pre>
                      </div>

                      <div className="p-4 bg-[#0d0d11]/85 border-t border-white/5 text-[11px] text-slate-400 leading-relaxed italic pr-4 select-text">
                        <strong className="text-purple-400 font-semibold font-mono not-italic uppercase text-[9px]">Aesthetic Review:</strong> {analysis.explanation}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}
          </div>

        </motion.div>
      </motion.div>

    </motion.div>
  );
}
