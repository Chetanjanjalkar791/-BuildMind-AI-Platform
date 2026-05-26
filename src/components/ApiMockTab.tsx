import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  ArrowRight,
  Database,
  Globe,
  Share2,
  FolderPlus,
  Cpu
} from 'lucide-react';
import { ApiMockResponse, ApiMockEndpoint } from '../types';
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

interface ApiMockTabProps {
  onSaveSnippet: (title: string, language: string, code: string, explanation: string) => void;
}

export default function ApiMockTab({ onSaveSnippet }: ApiMockTabProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [apiMock, setApiMock] = useState<ApiMockResponse | null>(null);
  const [selectedEndpointPath, setSelectedEndpointPath] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [liveConsoleResult, setLiveConsoleResult] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'endpoints' | 'sandbox'>('endpoints');

  const steps = [
    "Establishing link with REST Architect engine...",
    "Drafting HTTP specs and route match patterns...",
    "Synthesizing randomized mock payload schemas...",
    "Bundling client-side asynchronous fetch classes...",
    "Assembling operational sandbox console metrics..."
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
    setApiMock(null);
    setSelectedEndpointPath(null);
    setLiveConsoleResult(null);

    try {
      const res = await fetch('/api/generate/api-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setApiMock(data);
        if (data.endpoints && data.endpoints.length > 0) {
          setSelectedEndpointPath(data.endpoints[0].path);
        }
        setActiveSubTab('endpoints');
      } else {
        alert(data.error || "Failed to generate mock route blueprints.");
      }
    } catch (err) {
      console.error(err);
      alert("Error linking to REST service generator.");
    } finally {
      setLoading(false);
    }
  };

  const activeEndpoint = apiMock?.endpoints.find(e => e.path === selectedEndpointPath);

  const copyFetchCode = (endpoint: ApiMockEndpoint) => {
    navigator.clipboard.writeText(endpoint.fetchSelector);
    setCopiedPath(endpoint.path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const simulateRequest = () => {
    if (!activeEndpoint) return;
    setSimulating(true);
    setLiveConsoleResult(null);

    setTimeout(() => {
      setSimulating(false);
      setLiveConsoleResult(activeEndpoint.responseBody);
    }, 1200);
  };

  const handleClear = () => {
    setPrompt('');
    setApiMock(null);
    setSelectedEndpointPath(null);
    setLiveConsoleResult(null);
  };

  const loadSample = (sampleType: string) => {
    if (sampleType === 'store') {
      setPrompt('REST routing of list parameters of GET /api/v1/store/catalog returning inventory product items arrays, and post parameters of POST /api/v1/store/checkout completing orders');
    } else if (sampleType === 'auth') {
      setPrompt('E-commerce authentication routes like POST /api/v1/auth/login creating dynamic sessions tokens, and GET /api/v1/auth/profile retrieving user details lists');
    } else if (sampleType === 'dashboard') {
      setPrompt('SaaS user overview controls containing GET /api/v1/dashboard/metrics yielding usage graphs statistics, and PUT /api/v1/dashboard/settings saving profiles');
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      
      {/* 🔮 Brand Banner Header styled identically to the welcome banner with Indigo/Purple theme */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 md:p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        {/* Glowing Ambient light background sources matching the Indigo/Purple theme */}
        <div className="absolute top-0 right-0 -m-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center border border-white/10 shadow-md shrink-0 ring-4 ring-[#6366f1]/15 transform hover:scale-105 hover:rotate-3 transition-transform duration-300">
            <span className="text-xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">🌐</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 rounded-full bg-white/5 border border-white/[0.08] text-[10px] font-bold text-indigo-400 uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
              REST API Architect
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">API Mock Generator</h2>
            <p className="text-slate-400 text-xs mt-1.5 font-light leading-relaxed max-w-2xl">
              Describe endpoints to instantly synthesize live mock backend routing files, test payloads, schema specifications, and executable client asynchronous fetch commands.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Two-Column Panel Deck */}
      <motion.div 
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        
        {/* Left column: "Route Parameters" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 space-y-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-2.5 pb-3.5 border-b border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
              <span className="text-xs">🎯</span>
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Route Parameters</h3>
          </div>

          <form onSubmit={(e) => handleGenerate(e)} className="relative z-10 space-y-5">
            {/* Range schemas input prompt */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                API Endpoint Specifications
              </label>
              <textarea
                className="w-full h-36 p-4 bg-slate-950/40 border border-white/[0.08] focus:border-[#6366f1]/45 focus:ring-1 focus:ring-[#6366f1]/30 rounded-xl text-xs text-slate-100 focus:outline-none transition-all placeholder-slate-600 resize-none leading-relaxed font-sans"
                placeholder="E.g., GET /api/v1/orders, POST /api/v1/auth/callback creating sessions, billing info endpoints..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Buttons Row Actions */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all cursor-pointer border border-white/10"
              >
                {loading ? <Cpu className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                <span>{loading ? "Designing Blueprints..." : "Build Api Blueprint"}</span>
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
            <span className="block text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">Target Endpoint Presets</span>
            <div className="space-y-2">
              <button
                onClick={() => loadSample('store')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/40 border border-white/[0.05] hover:border-[#6366f1]/35 text-[11px] text-slate-300 hover:text-white transition truncate block font-medium cursor-pointer"
              >
                🛒 GET/POST E-Commerce Catalog
              </button>
              <button
                onClick={() => loadSample('auth')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/40 border border-white/[0.05] hover:border-[#6366f1]/35 text-[11px] text-slate-300 hover:text-white transition truncate block font-medium cursor-pointer"
              >
                🔐 SSO Profile User Authentications
              </button>
              <button
                onClick={() => loadSample('dashboard')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/40 border border-white/[0.05] hover:border-[#6366f1]/35 text-[11px] text-slate-300 hover:text-white transition truncate block font-medium cursor-pointer"
              >
                📊 Dashboard Analytics Metrics
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right column: "Sandbox Viewports" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 min-h-[580px] flex flex-col justify-between shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
                <span className="text-xs">🌐</span>
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">REST Sandbox Viewport</h3>
            </div>
            
            {apiMock && !loading && (
              <button
                onClick={() => {
                  setSaving(true);
                  onSaveSnippet(
                    `${apiMock.title} Blueprint`,
                    "Schema",
                    JSON.stringify(apiMock, null, 2),
                    `Microservice endpoint mockup for ${apiMock.endpoints.length} routes.`
                  );
                  setTimeout(() => setSaving(false), 800);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-white text-[10px] font-bold border border-indigo-500/20 cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save API Specifications"}</span>
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
                  <p className="text-xs font-bold tracking-wide text-white uppercase">Architecting REST endpoints...</p>
                  <p className="text-[10px] text-purple-400 font-mono italic max-w-sm">{steps[loadingStep]}</p>
                </div>
              </div>
            )}

            {/* Empty state standard display */}
            {!apiMock && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-12">
                <div className="w-16 h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-2xl filter drop-shadow-[0_0_15px_rgba(139,92,246,0.15)] text-purple-400">
                  🌐
                </div>
                <p className="text-xs md:text-sm text-slate-400 max-w-xs font-light">
                  Input target API definitions on the left to generate mocked server specs
                </p>
              </div>
            )}

            {/* API Mock sandbox visualization with dual tabs */}
            {apiMock && !loading && (
              <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                
                {/* Segment Tabs indicators */}
                <div className="flex items-center justify-between bg-black/40 p-1.5 rounded-xl border border-white/5">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setActiveSubTab('endpoints')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeSubTab === 'endpoints'
                          ? 'bg-[#8b5cf6] text-white shadow-md shadow-purple-600/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📁 API routes list
                    </button>
                    <button
                      onClick={() => setActiveSubTab('sandbox')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeSubTab === 'sandbox'
                          ? 'bg-[#8b5cf6] text-white shadow-md shadow-purple-600/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🚀 Simulated console sandbox
                    </button>
                  </div>

                  <span className="text-[9px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    ● REST SERVER ACTIVE
                  </span>
                </div>

                {/* Sub contents space */}
                <div className="flex-1 flex flex-col min-h-[360px] text-left justify-between">
                  
                  {activeSubTab === 'endpoints' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      
                      {/* Short summary info */}
                      <div className="bg-[#050507] p-3 rounded-lg border border-white/10 select-text">
                        <span className="text-[9px] font-mono font-bold text-purple-400 uppercase block">{apiMock.title}</span>
                        <p className="text-[11px] text-slate-400 mt-1 font-light leading-relaxed">{apiMock.description}</p>
                      </div>

                      {/* Routes listing */}
                      <div className="flex-1 bg-[#050507] rounded-xl border border-white/10 p-3.5 space-y-3.5 max-h-[290px] overflow-y-auto">
                        <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest block border-b border-white/5 pb-1.5">Configured Endpoint Routers</span>
                        <div className="space-y-2.5">
                          {apiMock.endpoints.map((ep) => {
                            const isSelected = selectedEndpointPath === ep.path;
                            return (
                              <div
                                key={ep.path}
                                onClick={() => {
                                  setSelectedEndpointPath(ep.path);
                                  setLiveConsoleResult(null);
                                  setActiveSubTab('sandbox');
                                }}
                                className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-left transition select-none cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#15151b] border-purple-500/30'
                                    : 'bg-black/35 border-white/5 hover:border-white/10 hover:bg-[#0a0a0f]'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2 text-xs mb-1 font-mono">
                                    <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${
                                      ep.method === 'GET' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10' :
                                      ep.method === 'POST' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/10' :
                                      'bg-amber-500/15 text-amber-400 border border-amber-500/10'
                                    }`}>
                                      {ep.method}
                                    </span>
                                    <span className="text-slate-200 font-bold">{ep.path}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-450 leading-relaxed max-w-sm truncate">
                                    {ep.description}
                                  </p>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyFetchCode(ep);
                                  }}
                                  className="px-2.5 py-1 rounded bg-[#121217] border border-white/5 hover:bg-white/5 text-[9px] font-bold text-slate-350 hover:text-white transition flex items-center gap-1.5 cursor-pointer shrink-0"
                                >
                                  {copiedPath === ep.path ? <Check className="w-3 h-3 text-emerald-450" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedPath === ep.path ? "Copied" : "Fetch SDK"}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {activeSubTab === 'sandbox' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      {activeEndpoint ? (
                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          
                          {/* Top endpoint selected indicator header */}
                          <div className="bg-[#050507] p-3 rounded-lg border border-white/10 flex items-center justify-between text-xs select-text">
                            <div className="font-mono">
                              <span className="text-purple-400 text-[9px] font-bold block uppercase">Active Routes</span>
                              <span className="font-bold text-white mt-1 block">
                                {activeEndpoint.method} {activeEndpoint.path}
                              </span>
                            </div>
                            <button
                              onClick={simulateRequest}
                              disabled={simulating}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[10px] font-bold flex items-center gap-1.5 shadow active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <Play className="w-2.5 h-2.5 text-purple-200 fill-purple-200" />
                              <span>{simulating ? "Requesting..." : "Send Request"}</span>
                            </button>
                          </div>

                          {/* Code sections container */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                            
                            {/* Copy Fetch codes */}
                            <div className="bg-[#050507] rounded-xl border border-white/10 p-3 flex flex-col justify-between overflow-hidden">
                              <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest block pb-1 border-b border-white/5">Client Fetch Method</span>
                              <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono text-slate-350 leading-relaxed overflow-x-auto select-text flex-1 h-[140px] mt-2">
                                <pre className="whitespace-pre">{activeEndpoint.fetchSelector}</pre>
                              </div>
                            </div>

                            {/* Simulation JSON responses */}
                            <div className="bg-[#050507] rounded-xl border border-white/10 p-3 flex flex-col justify-between overflow-hidden">
                              <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest block pb-1 border-b border-white/5">Live Server Response</span>
                              
                              <div className="flex-1 mt-2 flex flex-col">
                                {simulating ? (
                                  <div className="h-[140px] bg-[#121214] rounded-lg border border-white/5 flex flex-col items-center justify-center space-y-2 animate-pulse text-[10px] text-slate-500">
                                    <Terminal className="w-4 h-4 text-purple-400 animate-spin" />
                                    <span>Initiating TCP handshakes...</span>
                                  </div>
                                ) : liveConsoleResult ? (
                                  <div className="p-2.5 bg-[#0A0A0C] border border-purple-500/10 rounded-lg text-[9px] font-mono text-slate-300 leading-relaxed h-[140px] overflow-y-auto select-text">
                                    <pre className="whitespace-pre">{liveConsoleResult}</pre>
                                  </div>
                                ) : (
                                  <div className="h-[140px] bg-black/40 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-[10px] text-slate-500 italic text-center p-3">
                                    Click Send Request to run mocked REST backend response.
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>

                        </div>
                      ) : (
                        <div className="p-5 text-center text-slate-500 text-[11px] font-light italic border border-dashed border-white/10 rounded-xl bg-black/20 flex-1 flex items-center justify-center">
                          Select an endpoint to inspect sandbox methods.
                        </div>
                      )}
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
