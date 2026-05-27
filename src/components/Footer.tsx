import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
  Globe,
  Heart,
  ExternalLink
} from 'lucide-react';
import logo from '../assets/logo.png';

interface FooterProps {
  onSelectTab?: (tab: any) => void;
}

export default function Footer({ onSelectTab }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const navLinks = [
    { label: 'AI Code Gen', tab: 'code-gen' },
    { label: 'Learning Roadmaps', tab: 'roadmap' },
    { label: 'Complexity Analyzer', tab: 'complexity' },
    { label: 'Algorithm Explainer', tab: 'algorithm' },
    { label: 'API Generator', tab: 'api-mock' },
    { label: 'Frontend Sandbox', tab: 'frontend' },
  ];

  return (
    <footer className="relative mt-32 border-t border-white/[0.05] bg-[#070709]/80 backdrop-blur-xl z-20 overflow-hidden -mx-6 -mb-6">
      {/* Top Gradient Border Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-blue-500/50" />

      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-12 right-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand and Description (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center border border-white/10 shadow-lg shadow-purple-950/20 overflow-hidden">
                <img src={logo} alt="BuildMind Logo" className="w-full h-full object-contain p-1.5" />
              </div>
              <div className="flex flex-col text-left">
                <h2 className="text-xl font-extrabold text-white tracking-tight leading-none bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  BuildMind AI
                </h2>
                <span className="text-xs text-slate-500 font-medium tracking-wide mt-1 block">
                  Intelligent Developer Ecosystem
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-light">
              Transforming code generation, system architecture, learning curricula, and algorithm exploration with highly optimized generative AI models.
            </p>

            {/* Social Links List */}
            <div className="flex items-center gap-3.5 pt-2">
              {[
                { icon: Github, href: 'https://github.com/Chetanjanjalkar791/-BuildMind-AI-Platform', label: 'GitHub' },
                { icon: Twitter, href: 'https://x.com/chetanjanjalkar', label: 'Twitter' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/chetan-janjalkar-2a92a432b/', label: 'LinkedIn' },
                { icon: Globe, href: '#', label: 'Website' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 shadow-md"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Core Suite
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.tab}>
                  {onSelectTab ? (
                    <button
                      onClick={() => onSelectTab(link.tab)}
                      className="text-slate-400 hover:text-white transition-colors duration-250 text-sm cursor-pointer text-left block py-0.5 hover:underline decoration-purple-500/50 underline-offset-4"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <span className="text-slate-400 text-sm">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Community (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Documentation', href: '#' },
                { label: 'Developer API', href: '#' },
                { label: 'System Status', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Privacy Policy', href: '#' },
              ].map((res) => (
                <li key={res.label}>
                  <a
                    href={res.href}
                    className="text-slate-400 hover:text-white transition-colors duration-250 text-sm flex items-center gap-1 group"
                  >
                    <span>{res.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter subscription (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Stay Ahead
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed font-light">
              Receive updates on AI developer tools, prompting tips, and new feature rollouts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-purple-500/40 text-white rounded-xl py-2 px-3 text-xs placeholder-slate-500 outline-none transition-all duration-300 backdrop-blur-md shadow-inner focus:ring-1 focus:ring-purple-500/20"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="absolute right-1 p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all duration-300 disabled:from-emerald-600 disabled:to-emerald-600 cursor-pointer shadow-md disabled:cursor-default"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400 text-[11px] font-medium font-sans flex items-center gap-1"
                >
                  <span>✓</span> Joined waitlist successfully!
                </motion.p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright & socials */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <p className="text-slate-500 text-xs font-mono font-medium">
              &copy; {new Date().getFullYear()} BuildMind AI. All rights reserved.
            </p>
            <span className="hidden md:inline text-white/10 select-none">|</span>
            <p className="text-slate-500 text-xs font-sans flex items-center justify-center gap-1 select-none">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/50 animate-pulse" />
              <span>for builders.</span>
            </p>
          </div>

          {/* Legal / Policy Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-350 transition-colors text-xs font-mono">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-350 transition-colors text-xs font-mono">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-slate-350 transition-colors text-xs font-mono">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
