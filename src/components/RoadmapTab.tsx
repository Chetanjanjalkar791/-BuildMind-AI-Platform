import React, { useState, useEffect } from 'react';
import { 
  Milestone, 
  Sparkles, 
  MapPin, 
  Clock, 
  BookOpen, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  BookmarkPlus,
  Compass,
  ArrowRight
} from 'lucide-react';
import { RoadmapResponse } from '../types';
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

interface RoadmapTabProps {
  onSaveSnippet: (title: string, language: string, code: string, explanation: string) => void;
  initialPrompt?: string;
}

export default function RoadmapTab({ onSaveSnippet, initialPrompt }: RoadmapTabProps) {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [frequency, setFrequency] = useState('balanced');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Record<string, boolean>>({});
  const [bookmarking, setBookmarking] = useState(false);

  const steps = [
    "Establishing link with Gemini-3.5-Flash engine...",
    "Drafting educational pathways & role prerequisites...",
    "Structuring progressive study segments...",
    "Curating online documentation references and core modules...",
    "Refining phase milestones & duration guidelines..."
  ];

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1600);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setRoadmap(null);
    setSelectedNodeId(null);

    const compiledPrompt = `
Generate a comprehensive learning roadmap or development path.
[Target Difficulty Profile]: ${difficulty} Level
[Milestone Schedule Intensity]: ${frequency} cadence

[Core Technology or Learning Target]:
${prompt}
`;

    try {
      const res = await fetch('/api/generate/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setRoadmap(data);
        if (data.nodes && data.nodes.length > 0) {
          setSelectedNodeId(data.nodes[0].id);
        }
      } else {
        alert(data.error || "Failed to generate learning roadmap.");
      }
    } catch (err) {
      console.error(err);
      alert("Error linking to roadmap service.");
    } finally {
      setLoading(false);
    }
  };

  const toggleNodeCompleted = (nodeId: string) => {
    setCompletedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const activeNode = roadmap?.nodes.find(n => n.id === selectedNodeId);

  const handleClear = () => {
    setPrompt('');
    setRoadmap(null);
    setSelectedNodeId(null);
  };

  const sampleRoadmaps = [
    "Production Kubernetes Architect & GitOps DevOps Specialist",
    "Full Stack NestJS Backend Expert with GraphQL",
    "High Performance Rust Cryptography and Systems Engineer"
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      
      {/* 🔮 Brand Banner Header styled identically to the welcome banner with Cyan/Blue theme */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 md:p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        {/* Glowing Ambient light background sources matching the Cyan/Blue theme */}
        <div className="absolute top-0 right-0 -m-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] flex items-center justify-center border border-white/10 shadow-md shrink-0 ring-4 ring-[#06b6d4]/15 transform hover:scale-105 hover:rotate-3 transition-transform duration-300">
            <span className="text-xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">🗺️</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 rounded-full bg-white/5 border border-white/[0.08] text-[10px] font-bold text-cyan-400 uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              Interactive Pathways
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Learning Roadmaps</h2>
            <p className="text-slate-400 text-xs mt-1.5 font-light leading-relaxed max-w-2xl">
              Create personalized learning paths for any technology or domain with AI-powered conceptual nodes, structured phases, and estimated timelines.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Two-Column Panel Deck */}
      <motion.div 
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        
        {/* Left column: "Path Configuration" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 space-y-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow inside the Left Column card */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-2.5 pb-3.5 border-b border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
              <span className="text-xs">🎯</span>
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Learning Parameters</h3>
          </div>

          <form onSubmit={(e) => handleGenerate(e)} className="relative z-10 space-y-5">
            {/* Core learning prompt input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Technology or Role Target
              </label>
              <textarea
                className="w-full h-36 p-4 bg-slate-950/40 border border-white/[0.08] focus:border-[#06b6d4]/45 focus:ring-1 focus:ring-[#06b6d4]/30 rounded-xl text-xs text-slate-100 focus:outline-none transition-all placeholder-slate-600 resize-none leading-relaxed font-sans"
                placeholder="E.g., Docker container orchestration, Systems level Golang developer, or Advanced iOS Engineer..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Selector Grid: Difficulty & Cadence side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Difficulty dropdown */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Complexity Profile
                </label>
                <div className="relative">
                  <select
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-950/40 border border-white/[0.08] focus:border-[#06b6d4]/45 focus:ring-1 focus:ring-[#06b6d4]/30 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer appearance-none transition-all"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Beginner" className="bg-[#0A0A0C]">🌱 Beginner Essentials</option>
                    <option value="Intermediate" className="bg-[#0A0A0C]">🛠️ Intermediate Mastery</option>
                    <option value="Advanced" className="bg-[#0A0A0C]">🚀 Advanced Architect</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                    <svg className="fill-current h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Intensity Cadence dropdown */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Timeline Speed
                </label>
                <div className="relative">
                  <select
                    className="w-full pl-3 pr-8 py-2.5 bg-slate-950/40 border border-white/[0.08] focus:border-[#06b6d4]/45 focus:ring-1 focus:ring-[#06b6d4]/30 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer appearance-none transition-all"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="accelerated" className="bg-[#0A0A0C]">⚡ Express (Sprints)</option>
                    <option value="balanced" className="bg-[#0A0A0C]">⚖️ Balanced Pace</option>
                    <option value="deep-dive" className="bg-[#0A0A0C]">📚 Comprehensive</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                    <svg className="fill-current h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-cyan-500/10 active:scale-[0.98] transition-all cursor-pointer border border-white/10"
              >
                {loading ? <Cpu className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                <span>{loading ? "Mapping Pathway..." : "Generate Roadmap"}</span>
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

          {/* Core samples switcher */}
          <div className="relative z-10 pt-4 border-t border-white/[0.06] space-y-2.5">
            <div className="space-y-2">
              {sampleRoadmaps.map((prob, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(prob)}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/40 border border-white/[0.05] hover:border-[#06b6d4]/30 hover:bg-slate-950/70 text-[11px] text-slate-300 hover:text-white transition-all duration-150 block truncate font-medium cursor-pointer"
                  title={prob}
                >
                  {prob}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right column: "Pathway Viewport" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 min-h-[580px] flex flex-col justify-between shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
                <span className="text-xs">🗺️</span>
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Pathway Viewport</h3>
            </div>
            
            {roadmap && !loading && (
              <button
                onClick={() => {
                  setBookmarking(true);
                  onSaveSnippet(
                    `${roadmap.title} Pathway`,
                    "Schema",
                    JSON.stringify(roadmap, null, 2),
                    `${roadmap.nodes.length} phase development roadmap path.`
                  );
                  setTimeout(() => setBookmarking(false), 800);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-white text-[10px] font-bold border border-cyan-500/20 cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{bookmarking ? "Saving..." : "Bookmark Blueprint"}</span>
              </button>
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
                  <p className="text-xs font-bold tracking-wide text-white uppercase">Architecting target pathway...</p>
                  <p className="text-[10px] text-purple-400 font-mono italic max-w-sm">{steps[loadingStep]}</p>
                </div>
              </div>
            )}

            {/* Empty state standard display */}
            {!roadmap && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-12">
                <div className="w-16 h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-2xl filter drop-shadow-[0_0_15px_rgba(139,92,246,0.15)] text-purple-450">
                  🧭
                </div>
                <p className="text-xs md:text-sm text-slate-400 max-w-xs font-light">
                  Configure learning path parameters to map a target syllabus milestones
                </p>
              </div>
            )}

            {/* Roadmap Output displays side-by-side */}
            {roadmap && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start animate-fade-in flex-1">
                
                {/* Milestone Stepper Navigation list - LHS */}
                <div className="md:col-span-7 bg-black/30 rounded-xl border border-white/5 p-4 space-y-4 max-h-[460px] overflow-y-auto">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 pb-2 border-b border-white/5">
                    <span className="font-mono text-[10px] font-bold text-purple-400 uppercase tracking-widest">{roadmap.title}</span>
                    <span className="font-mono text-[9px] bg-white/5 px-2 py-0.5 rounded text-amber-300">{roadmap.overallTimeline}</span>
                  </div>

                  <div className="relative pl-7 space-y-4 pt-1">
                    {/* Vertical timeline vector ribbon */}
                    <div className="absolute left-2.5 top-3 bottom-3 w-[1px] bg-slate-800"></div>

                    {roadmap.nodes.map((node, index) => {
                      const isSelected = selectedNodeId === node.id;
                      const isDone = completedNodes[node.id];

                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`relative cursor-pointer transition-all p-3 rounded-lg border text-left select-none ${
                            isSelected
                              ? 'bg-[#15151b] border-purple-500/30'
                              : 'bg-[#08080b]/60 border-white/5 hover:border-white/10 hover:bg-[#0a0a0f]'
                          }`}
                        >
                          {/* Chronological loop bubble connector */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNodeCompleted(node.id);
                            }}
                            className={`absolute -left-[23px] top-4 w-[13px] h-[13px] rounded-full border flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-400 text-white'
                                : isSelected
                                ? 'bg-purple-600 border-purple-400'
                                : 'bg-slate-900 border-slate-700'
                            }`}
                          >
                            {isDone && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                          </div>

                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-semibold text-slate-200 truncate pr-2">{node.title}</span>
                            <span className="text-[8px] font-mono shrink-0 bg-[#121216] px-1.5 py-0.5 rounded border border-white/5 text-slate-450 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-blue-400" /> {node.duration}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-450 leading-relaxed truncate">
                            {node.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Phase Inspector panel details - RHS */}
                <div className="md:col-span-5 space-y-4 text-left">
                  {activeNode ? (
                    <div className="bg-[#050507] rounded-xl border border-white/10 p-4 space-y-4">
                      
                      {/* Active Phase Details Card */}
                      <div className="border-b border-white/5 pb-2">
                        <span className="text-[9px] font-mono font-bold text-purple-400 tracking-wider block">SELECTED MILESTONE</span>
                        <h4 className="text-xs font-bold text-white mt-1">{activeNode.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                          {activeNode.description}
                        </p>
                      </div>

                      {/* Resources / Sub-topics lists */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-purple-400 tracking-wider block mb-1">DETAILED CURRICULUM</span>
                        {activeNode.resources.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start text-[10px] text-slate-350 bg-white/5 p-2 rounded border border-white/5 font-mono">
                            <span className="text-emerald-500 font-bold shrink-0">✔</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Check completing phase buttons */}
                      <button
                        onClick={() => toggleNodeCompleted(activeNode.id)}
                        className={`w-full py-2 rounded-xl text-[10px] uppercase tracking-wider font-bold transition-all text-center cursor-pointer ${
                          completedNodes[activeNode.id]
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-450'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md'
                        }`}
                      >
                        {completedNodes[activeNode.id] ? "Phase Completed" : "Mark Phase Completed"}
                      </button>

                    </div>
                  ) : (
                    <div className="p-5 text-center text-slate-500 text-[11px] font-light italic border border-dashed border-white/10 rounded-xl bg-black/20">
                      Select a milestone to view detailed curriculum specs.
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
