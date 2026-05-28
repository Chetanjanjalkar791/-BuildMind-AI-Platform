import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  Cpu, 
  Trash2, 
  FileEdit,
  FolderOpen,
  FolderMinus,
  Globe,
  Settings,
  FolderPlus,
  Compass,
  FileCode,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { FrontendComponentResponse } from '../types';

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

interface FrontendTabProps {
  onSaveSnippet: (title: string, language: string, code: string, explanation: string) => void;
  initialPrompt?: string;
}

export default function FrontendTab({ onSaveSnippet, initialPrompt }: FrontendTabProps) {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [framework, setFramework] = useState('html-js');
  const [styling, setStyling] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [response, setResponse] = useState<FrontendComponentResponse | null>(null);
  const [activeTabType, setActiveTabType] = useState<'preview' | 'code'>('preview');
  const [selectedFile, setSelectedFile] = useState<'index.html' | 'styles.css' | 'script.js'>('index.html');
  const [modifyPrompt, setModifyPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const steps = [
    "Establishing link with Gemini-3.5-Flash engine...",
    "Drafting responsive flexbox wireframes & UX specs...",
    "Injecting specified framework configurations...",
    "Tailoring classes with requested styling paradigm...",
    "Embedding dynamic triggers and Javascript event listeners...",
    "Refining margin ratios and rendering viewport wrapper..."
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
      }, 1800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    // Build optimized instructions appending Framework & Styling selections
    const frameworkLabel = 
      framework === 'react' ? 'React (Functional components using Tailwind CSS classes)' :
      framework === 'angular' ? 'Angular (SPA structure using Tailwind utility classes)' :
      framework === 'vue' ? 'Vue.js (Single File Component style styled with Tailwind)' :
      'HTML5/CSS3/Vanilla ECMAScript JavaScript';

    const stylingLabel = 
      styling === 'tailwind' ? 'Fully styled with advanced utility-first Tailwind CSS design structures' :
      styling === 'dark' ? 'Ultra-sleek modern midnight dark mode theme with soft glowing gradients and subtle spacing' :
      'Sophisticated, high-contrast, clean & minimalist design utilizing premium font proportions and ample negative space';

    const compiledPrompt = `
Generate a beautiful frontend interface mockup.
[Target Framework Specification]: ${frameworkLabel}
[Primary Visual Styling Theme Style]: ${stylingLabel}

[Core Functional Requirements & Feature Prompt]:
${prompt}
`;

    try {
      const res = await fetch('/api/generate/frontend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data);
        setActiveTabType('preview');
      } else {
        alert(data.error || "Failed to generate frontend mock component.");
      }
    } catch (err) {
      console.error(err);
      alert("Error linking to server-side AI model.");
    } finally {
      setLoading(false);
    }
  };

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifyPrompt.trim() || !response) return;

    setLoading(true);
    const combinedPrompt = `You are refining an existing component. Here is the current markup:\n${response.html}\n\nExisting Custom CSS:\n${response.css}\n\nExisting JS Script:\n${response.js}\n\nApply this targeted adjustment/modification request:\n${modifyPrompt}`;

    try {
      const res = await fetch('/api/generate/frontend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data);
        setModifyPrompt('');
        setActiveTabType('preview');
      } else {
        alert(data.error || "Failed to refine component.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error updating component framework.");
    } finally {
      setLoading(false);
    }
  };

  // Combine components into HTML package utilizing standard Tailwind CDN block
  const getCombinedCode = () => {
    if (!response) return '';
    return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
    }
    ${response.css || ''}
  </style>
</head>
<body class="bg-[#0B0F19] text-slate-100 min-h-screen flex flex-col justify-between">
  ${response.html || ''}

  <script>
    try {
      ${response.js || ''}
    } catch (e) {
      console.error("User script runtime exception: ", e);
    }
  </script>
</body>
</html>`;
  };

  const copyCode = () => {
    if (!response) return;
    let textToCopy = '';
    if (activeTabType === 'code') {
      if (selectedFile === 'index.html') textToCopy = response.html;
      else if (selectedFile === 'styles.css') textToCopy = response.css || '/* No custom CSS generated */';
      else if (selectedFile === 'script.js') textToCopy = response.js || '// No Javascript triggers needed';
    } else {
      textToCopy = getCombinedCode();
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPrompt('');
    setResponse(null);
  };

  const sampleFrontendProjects = [
    "E-commerce product catalog with search and filters",
    "Todo app with drag and drop functionality",
    "SaaS landing page with interactive pricing grid and responsive reviews"
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      
      {/* 🔮 Brand Banner Header styled identically to the welcome banner with pink theme */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 md:p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
      >
        {/* Glowing Ambient light background sources matching the Pink-Purple theme */}
        <div className="absolute top-0 right-0 -m-16 w-80 h-80 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#8b5cf6]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff007a] via-[#ff4d4d] to-[#ef4444] flex items-center justify-center border border-white/10 shadow-md shrink-0 ring-4 ring-[#ff007a]/15 transform hover:scale-105 hover:rotate-3 transition-transform duration-300">
            <span className="text-xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">🎨</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 rounded-full bg-white/5 border border-white/[0.08] text-[10px] font-bold text-pink-400 uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
              Interactive UI Canvas
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">AI Frontend Developer</h2>
            <p className="text-slate-400 text-xs mt-1.5 font-light leading-relaxed max-w-2xl">
              Draft mock UI frameworks, inspect live rendering previews of responsive elements, and extract tailored, production-ready styling blocks with zero friction.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Two-Column Panel Deck */}
      <motion.div 
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        
        {/* Left column: "Project Configuration" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 space-y-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow inside the Left Column card */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-pink-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-2.5 pb-3.5 border-b border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff007a] to-[#ef4444] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
              <span className="text-xs">🎯</span>
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Project Configuration</h3>
          </div>

          <form onSubmit={(e) => handleGenerate(e)} className="relative z-10 space-y-5">
            {/* Project Description input block */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Project Description
              </label>
              <textarea
                className="w-full h-36 p-4 bg-slate-950/40 border border-white/[0.08] focus:border-pink-500/45 focus:ring-1 focus:ring-pink-500/30 rounded-xl text-xs text-slate-100 focus:outline-none transition-all placeholder-slate-600 resize-none leading-relaxed font-sans"
                placeholder="Describe your frontend project in detail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Selector Grid: Framework & Styling exactly side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Framework selector dropdown */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Framework
                </label>
                <div className="relative">
                  <select
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-950/40 border border-white/[0.08] focus:border-pink-500/45 focus:ring-1 focus:ring-pink-500/30 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer appearance-none transition-all"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                  >
                    <option value="html-js" className="bg-[#0A0A0C]">🌐 HTML/CSS/JavaScript</option>
                    <option value="react" className="bg-[#0A0A0C]">⚛️ React</option>
                    <option value="angular" className="bg-[#0A0A0C]">🅰️ Angular</option>
                    <option value="vue" className="bg-[#0A0A0C]">💚 Vue.js</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                    <svg className="fill-current h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Styling selector dropdown */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Styling
                </label>
                <div className="relative">
                  <select
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-950/40 border border-white/[0.08] focus:border-pink-500/45 focus:ring-1 focus:ring-pink-500/30 rounded-xl text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer appearance-none transition-all"
                    value={styling}
                    onChange={(e) => setStyling(e.target.value)}
                  >
                    <option value="modern" className="bg-[#0A0A0C]">✨ Modern & Clean</option>
                    <option value="tailwind" className="bg-[#0A0A0C]">🎨 Tailwind CSS</option>
                    <option value="dark" className="bg-[#0A0A0C]">🖤 Sleek Dark Mode</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                    <svg className="fill-current h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Form buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff007a] via-[#ff4d4d] to-[#ef4444] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-pink-500/10 active:scale-[0.98] transition-all cursor-pointer border border-white/10"
              >
                {loading ? <Cpu className="w-3.5 h-3.5 animate-spin text-white" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                <span>{loading ? "Generating Elements..." : "Generate Sandbox UI"}</span>
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

          {/* Quick-Selectors samples widget section matching design */}
          <div className="relative z-10 pt-4 border-t border-white/[0.06] space-y-2.5">
            <div className="space-y-2">
              {sampleFrontendProjects.map((prob, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(prob)}
                  className="w-full text-left p-3 rounded-xl bg-[#0A0A0C] border border-white/5 hover:border-purple-500/30 hover:bg-[#121214] text-[11px] text-slate-300 hover:text-white transition-all duration-150 block truncate font-medium cursor-pointer"
                  title={prob}
                >
                  {prob}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right column: "Generated Code Structure" */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-slate-950/25 backdrop-blur-xl border border-white/[0.05] p-6 min-h-[580px] flex flex-col justify-between shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Ambient background accent glow inside the Right Column card */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff007a] to-[#ef4444] flex items-center justify-center border border-white/10 shadow-sm shrink-0">
                <span className="text-xs">💻</span>
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Generated Code Structure</h3>
            </div>
            
            {response && !loading && (
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
                    onSaveSnippet("AI Generated Frontend Template", framework, getCombinedCode(), response.explanation);
                    setTimeout(() => setSaving(false), 800);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 hover:text-white text-[10px] font-bold border border-pink-500/20 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Template"}</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center py-4">
            {/* Case A: Loading State with detailed diagnostics */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-12 animate-pulse">
                <div className="w-14 h-14 bg-slate-950/40 rounded-2xl flex items-center justify-center border border-white/[0.08] shadow-lg text-2xl">
                  ⚙️
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-wide text-white uppercase">Architecting viewport markup...</p>
                  <p className="text-[10px] text-pink-400 font-mono italic max-w-sm">{steps[loadingStep]}</p>
                </div>
              </div>
            )}

            {/* Case B: Blank Empty state matching Screenshot exactly */}
            {!response && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-12">
                <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-2xl filter drop-shadow-[0_0_15px_rgba(255,0,122,0.15)] text-pink-400">
                  🎨
                </div>
                <p className="text-xs md:text-sm text-slate-400 max-w-xs font-light">
                  Configure your project to generate intelligent frontend code
                </p>
              </div>
            )}

            {/* Case C: Output results dashboard display when ready */}
            {response && !loading && (
              <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                
                {/* Advanced Tab Controllers (Live Sandbox viewport OR Raw Code explorer) */}
                <div className="flex items-center justify-between bg-slate-950/40 p-1.5 rounded-xl border border-white/5">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setActiveTabType('preview')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTabType === 'preview'
                          ? 'bg-gradient-to-r from-[#ff007a] to-[#ef4444] text-white shadow-md shadow-pink-500/10 border border-white/10'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      👁️ Live Sandbox View
                    </button>
                    <button
                      onClick={() => setActiveTabType('code')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTabType === 'code'
                          ? 'bg-gradient-to-r from-[#ff007a] to-[#ef4444] text-white shadow-md shadow-pink-500/10 border border-white/10'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📂 File Directory Code
                    </button>
                  </div>

                  <span className="text-[9px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    ● COMPILED
                  </span>
                </div>

                {/* Sub UI Code Workspace based on chosen tab type */}
                <div className="flex-1 flex flex-col min-h-[360px]">
                  {activeTabType === 'preview' && (
                    <div className="relative bg-[#050507] rounded-xl overflow-hidden border border-white/10 flex-1 min-h-[360px] h-[380px]">
                      <iframe
                        id="sandbox-viewport"
                        name="sandbox-frame"
                        className="w-full h-full bg-[#050507]"
                        srcDoc={getCombinedCode()}
                        sandbox="allow-scripts allow-popups-to-escape-sandbox allow-same-origin"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {activeTabType === 'code' && (
                    <div className="bg-[#050507] rounded-xl border border-white/10 overflow-hidden flex flex-col flex-1 min-h-[360px]">
                      {/* Simulated IDE file tab structure */}
                      <div className="px-4 py-2 bg-[#0d0d11] border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedFile('index.html')}
                            className={`px-2.5 py-1 rounded transition-colors ${
                              selectedFile === 'index.html' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'hover:text-white'
                            }`}
                          >
                            📄 index.html
                          </button>
                          <button
                            onClick={() => setSelectedFile('styles.css')}
                            className={`px-2.5 py-1 rounded transition-colors ${
                              selectedFile === 'styles.css' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'hover:text-white'
                            }`}
                          >
                            🎨 styles.css
                          </button>
                          <button
                            onClick={() => setSelectedFile('script.js')}
                            className={`px-2.5 py-1 rounded transition-colors ${
                              selectedFile === 'script.js' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'hover:text-white'
                            }`}
                          >
                            ⚡ script.js
                          </button>
                        </div>
                        <span>UTF-8 Specs</span>
                      </div>

                      <div className="p-4 overflow-y-auto max-h-[320px] font-mono text-left text-slate-300 text-[11px] leading-relaxed flex-1 select-text">
                        {selectedFile === 'index.html' && (
                          <pre className="whitespace-pre">{response.html}</pre>
                        )}
                        {selectedFile === 'styles.css' && (
                          <pre className="whitespace-pre">{response.css || '/* Standard Tailwind utility classes handle layouts directly */'}</pre>
                        )}
                        {selectedFile === 'script.js' && (
                          <pre className="whitespace-pre">{response.js || '// Event controllers binding listeners dynamically'}</pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub modifier prompt trigger for targeted refines */}
                <div className="bg-slate-950/45 p-4 rounded-xl border border-white/10 space-y-3 shrink-0">
                  <div className="flex items-center gap-2 text-white">
                    <FileEdit className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 font-mono">
                      Request Layout Refinement
                    </span>
                  </div>
                  
                  <form onSubmit={handleModify} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3.5 py-2.5 bg-slate-950/40 rounded-xl border border-white/[0.08] focus:border-pink-500/45 focus:ring-1 focus:ring-pink-500/30 text-slate-200 focus:outline-none text-xs placeholder-slate-600 transition-all"
                      placeholder="e.g., Change the accent colors to vivid teal and animate the main display cards..."
                      value={modifyPrompt}
                      onChange={(e) => setModifyPrompt(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!modifyPrompt.trim()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff007a] to-[#ef4444] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all cursor-pointer border border-white/10"
                    >
                      Refine Setup
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>

        </motion.div>
      </motion.div>

    </motion.div>
  );
}
