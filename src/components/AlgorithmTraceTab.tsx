import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2,
  Table,
  Eye,
  Columns
} from 'lucide-react';
import { AlgorithmBreakdown } from '../types';
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

export default function AlgorithmTraceTab() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [breakdown, setBreakdown] = useState<AlgorithmBreakdown | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'stepper' | 'source'>('stepper');

  const steps = [
    "Establishing link with execution emulator...",
    "Generating syntax graph structures...",
    "Injecting dataset triggers...",
    "Recording intermediate pointer changes...",
    "Compiling timeline debugger cycles..."
  ];

  React.useEffect(() => {
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

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setBreakdown(null);
    setActiveStepIdx(0);

    try {
      const res = await fetch('/api/generate/explain-algorithm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setBreakdown(data);
        setActiveSubTab('stepper');
      } else {
        alert(data.error || "Failed to generate algorithm trace.");
      }
    } catch (err) {
      console.error(err);
      alert("Error linking to solver tracer.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!breakdown) return;
    setActiveStepIdx(prev => (prev < breakdown.steps.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setActiveStepIdx(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleReset = () => {
    setActiveStepIdx(0);
  };

  const activeStep = breakdown?.steps[activeStepIdx];

  const handleClear = () => {
    setPrompt('');
    setBreakdown(null);
  };

  const loadPreset = (presetName: string) => {
    if (presetName === 'binary') {
      setPrompt('Binary Search tree partition trace targeting search_key=14 in sorted matrix array [2, 5, 8, 11, 14, 19, 25]');
    } else if (presetName === 'bubble') {
      setPrompt('Bubble sort outer and inner loop swaps trace on static initial index target array [9, 3, 7, 1]');
    } else if (presetName === 'dijkstra') {
      setPrompt('Dijkstra graph shortest path traverse selection algorithm from origin Node A to Node D');
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      
      {/* 🔮 Brand Banner Header styled identically to the welcome banner with Orange/Red theme */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 md:p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        {/* Glowing Ambient light background sources matching the Orange/Red theme */}
        <div className="absolute top-0 right-0 -m-16 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f97316] to-[#ef4444] flex items-center justify-center border border-white/10 shadow-md shrink-0 ring-4 ring-[#f97316]/15 transform hover:scale-105 hover:rotate-3 transition-transform duration-300">
            <span className="text-xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">🎛️</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 rounded-full bg-white/5 border border-white/[0.08] text-[10px] font-bold text-orange-400 uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
              Chalkboard Debugger
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">AI Algorithm Execution Tracer</h2>
            <p className="text-slate-400 text-xs mt-1.5 font-light leading-relaxed max-w-2xl">
              Simulate computational data structure states, pointer references, stack changes, and conditional branches step-by-step with interactive visualizations.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Two-Column Panel Deck */}
      <motion.div 
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        
        {/* Left column: "Tracer Configuration" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 space-y-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-2.5 pb-3.5 border-b border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ef4444] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
              <span className="text-xs">🎯</span>
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Trace Parameter</h3>
          </div>

          <form onSubmit={(e) => handleGenerate(e)} className="relative z-10 space-y-5">
            {/* Project description input prompt block */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Target Algorithm Description
              </label>
              <textarea
                className="w-full h-36 p-4 bg-slate-950/40 border border-white/[0.08] focus:border-[#f97316]/45 focus:ring-1 focus:ring-[#f97316]/30 rounded-xl text-xs text-slate-100 focus:outline-none transition-all placeholder-slate-600 resize-none leading-relaxed font-sans"
                placeholder="Describe which algorithm you would like to trace, with array inputs..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Buttons Row Actions */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ef4444] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all cursor-pointer border border-white/10"
              >
                {loading ? <Cpu className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                <span>{loading ? "Compiling Tracer..." : "Map Stack Trace"}</span>
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

          {/* Quick-Selectors presets template section */}
          <div className="relative z-10 pt-4 border-t border-white/[0.06] space-y-2">
            <span className="block text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">Target Trace Presets</span>
            <div className="space-y-2">
              <button
                onClick={() => loadPreset('binary')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/40 border border-white/[0.05] hover:border-[#f97316]/35 text-[11px] text-slate-300 hover:text-white transition truncate block font-medium cursor-pointer"
              >
                🔍 Binary Search matrix loops
              </button>
              <button
                onClick={() => loadPreset('bubble')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/40 border border-white/[0.05] hover:border-[#f97316]/35 text-[11px] text-slate-300 hover:text-white transition truncate block font-medium cursor-pointer"
              >
                🔄 Bubble Sort swaps pointer keys
              </button>
              <button
                onClick={() => loadPreset('dijkstra')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/40 border border-white/[0.05] hover:border-[#f97316]/35 text-[11px] text-slate-300 hover:text-white transition truncate block font-medium cursor-pointer"
              >
                📍 Dijkstra shortest path graph
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right column: "Tracer Output" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 min-h-[580px] flex flex-col justify-between shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ef4444] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
                <span className="text-xs">🎮</span>
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Trace Debugger Viewport</h3>
            </div>
            
            {breakdown && !loading && (
              <div className="flex items-center gap-1.5 bg-[#0A0A0C] p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  onClick={handlePrev}
                  disabled={activeStepIdx === 0}
                  className="p-1 px-2 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-20 rounded transition cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono font-bold text-slate-200 px-1.5 shrink-0 selection:bg-transparent">
                  {activeStepIdx + 1} / {breakdown.steps.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={activeStepIdx === breakdown.steps.length - 1}
                  className="p-1 px-2 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-20 rounded transition cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-3.5 bg-slate-800 self-center mx-1"></div>
                <button
                  onClick={handleReset}
                  className="p-1 px-2 text-slate-450 hover:text-white hover:bg-white/5 rounded transition cursor-pointer"
                  title="Reset trace step index"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center py-4">
            
            {/* Loading indicators */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-12 animate-pulse">
                <div className="w-14 h-14 bg-[#1e293b]/50 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg text-2xl">
                  ⚙️
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-wide text-white uppercase">Assembling virtual callstack...</p>
                  <p className="text-[10px] text-purple-400 font-mono italic max-w-sm">{steps[loadingStep]}</p>
                </div>
              </div>
            )}

            {/* Empty state standard display */}
            {!breakdown && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-12">
                <div className="w-16 h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-2xl filter drop-shadow-[0_0_15px_rgba(139,92,246,0.15)] text-purple-400">
                  🎛️
                </div>
                <p className="text-xs md:text-sm text-slate-400 max-w-xs font-light">
                  Input target algorithms on the left to initialize visual pointer loops
                </p>
              </div>
            )}

            {/* Results output with tabs */}
            {breakdown && !loading && (
              <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                
                {/* Segment Tabs indicators */}
                <div className="flex items-center justify-between bg-black/40 p-1.5 rounded-xl border border-white/5">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setActiveSubTab('stepper')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeSubTab === 'stepper'
                          ? 'bg-[#8b5cf6] text-white shadow-md shadow-purple-600/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📈 Variable registers & details
                    </button>
                    <button
                      onClick={() => setActiveSubTab('source')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeSubTab === 'source'
                          ? 'bg-[#8b5cf6] text-white shadow-md shadow-purple-600/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      💻 Reference source code
                    </button>
                  </div>

                  <span className="text-[9px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    ● SIMULATING
                  </span>
                </div>

                {/* Sub contents space */}
                <div className="flex-1 flex flex-col min-h-[360px] text-left">
                  
                  {activeSubTab === 'stepper' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      
                      {/* Register variables grid */}
                      <div className="bg-[#050507] rounded-xl p-4 border border-white/10 space-y-3">
                        <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest block">CPU Variable Register Dump</span>
                        {activeStep ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {breakdown.variables.map((variableName) => {
                              const varValue = activeStep.variables[variableName] !== undefined ? activeStep.variables[variableName] : 'N/A';
                              return (
                                <div key={variableName} className="bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                                  <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider">{variableName}</span>
                                  <span className="text-xs font-mono font-bold text-white block mt-0.5 truncate" title={String(varValue)}>
                                    {String(varValue)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500 italic">No registers dumped at current indices.</div>
                        )}
                      </div>

                      {/* Execution instruction highlight pointer */}
                      <div className="bg-[#050507] rounded-xl p-4.5 border border-white/10 space-y-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest">Stack Program Counter Highlight</span>
                        </div>
                        <div className="p-3 bg-black/45 border border-white/5 rounded-lg text-xs font-mono text-slate-200 select-text leading-relaxed">
                          {activeStep?.line || "// Program loop idle state."}
                        </div>
                      </div>

                      {/* Verbal description details */}
                      <div className="p-4 bg-[#0a0a0d] border border-white/5 rounded-xl space-y-1.5 select-text">
                        <span className="text-[9px] font-mono font-bold text-purple-405 block uppercase tracking-wider">{breakdown.title} Concept Scope</span>
                        <p className="text-xs text-slate-350 leading-relaxed font-sans font-light">
                          {activeStep?.explanation}
                        </p>
                      </div>

                    </div>
                  )}

                  {activeSubTab === 'source' && (
                    <div className="bg-[#050507] rounded-xl border border-white/10 overflow-hidden flex flex-col flex-1">
                      <div className="px-4 py-2 bg-[#0d0d11] border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Emulator Loop Source ({breakdown.concept})</span>
                        <span className="text-purple-400 font-bold uppercase text-[9px] font-mono">Reference</span>
                      </div>

                      <div className="p-4 overflow-y-auto max-h-[310px] font-mono text-slate-300 text-[11px] leading-relaxed flex-1 select-text bg-black/40">
                        <pre className="whitespace-pre">{breakdown.code}</pre>
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
