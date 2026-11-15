"use client";

import React, { useState } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  Orbit,
  Star,
  GitBranch,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SYSTEM_METRICS,
} from "../../lib/constants";

const PRESET_SYSTEMS = [
  { name: "torvalds/linux", color: "#f59e0b", orbits: "140k+", stars: "185k" },
  { name: "facebook/react", color: "#06b6d4", orbits: "90k+", stars: "230k" },
  { name: "yash26761/yh-nexus", color: "#6366f1", orbits: "450+", stars: "Active" },
];

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [activePreset, setActivePreset] = useState("facebook/react");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setStatusMessage("Enter a GitHub username or owner/repo to initiate orbit synthesis.");
      return;
    }
    setStatusMessage(`Synthesizing star system telemetry for "${query.trim()}"... (Milestone 3 3D Canvas integration ready)`);
  };

  return (
    <section id="overview" className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background Cosmic Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] sm:h-[600px] bg-gradient-to-tr from-nebula-600/15 via-plasma-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-aurora-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Animated Cosmic Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border-plasma-400/20 text-xs font-mono text-slate-300 shadow-lg shadow-plasma-500/10 animate-in fade-in zoom-in-95 duration-500">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-plasma-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-plasma-500" />
            </span>
            <span className="text-plasma-300 font-semibold uppercase tracking-wider">
              {SITE_NAME}
            </span>
            <span className="text-slate-600">/</span>
            <span>Next-Gen Repository Cosmology</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Transform Codebases into a{" "}
            <span className="bg-gradient-to-r from-plasma-400 via-nebula-400 to-aurora-400 bg-clip-text text-transparent">
              3D Celestial Universe
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {SITE_DESCRIPTION}
          </p>

          {/* Interactive Search Console */}
          <div id="explore" className="pt-4 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="relative w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setStatusMessage(null);
                  }}
                  placeholder="e.g. facebook/react or torvalds/linux"
                  className="w-full pl-12 pr-36 py-4 rounded-2xl bg-space-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-plasma-400 focus:ring-2 focus:ring-plasma-400/20 shadow-2xl transition-all"
                  aria-label="GitHub Repository Search"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-gradient-to-r from-nebula-600 to-plasma-500 hover:from-nebula-500 hover:to-plasma-400 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-nebula-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-plasma-400"
                >
                  <span>Synthesize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-400">
              <span className="font-mono text-slate-500">Preset Systems:</span>
              {PRESET_SYSTEMS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setQuery(preset.name);
                    setActivePreset(preset.name);
                    setStatusMessage(`Selected preset: ${preset.name} (${preset.stars} stars, ${preset.orbits} orbits)`);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
                    activePreset === preset.name
                      ? "bg-space-800 border-plasma-400/50 text-plasma-300"
                      : "bg-space-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {statusMessage && (
              <div className="mt-3 p-3 rounded-xl bg-space-850/80 border border-nebula-500/30 text-xs font-mono text-plasma-300 animate-in fade-in duration-200">
                {statusMessage}
              </div>
            )}
          </div>
        </div>

        {/* 3D Visual Preview Container */}
        <div id="visualization" className="mt-14 max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-700/50 via-slate-800/20 to-transparent shadow-2xl">
            <div className="relative rounded-[22px] bg-space-950 border border-slate-800/80 overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-6 sm:p-10">
              {/* Top HUD Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-solar-500/80" />
                    <span className="w-3 h-3 rounded-full bg-supernova-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    Cosmic Scene Graph Telemetry
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-supernova-400">
                    <span className="w-2 h-2 rounded-full bg-supernova-400 animate-ping" />
                    60 FPS Ready
                  </span>
                  <span className="hidden sm:inline">WebGL 2.0</span>
                </div>
              </div>

              {/* Orbital Graphic Representation */}
              <div className="relative my-8 py-6 flex items-center justify-center">
                {/* Orbit Rings (Keplerian Visual Mock) */}
                <div className="absolute w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] rounded-full border border-dashed border-slate-800 pointer-events-none" />
                <div className="absolute w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] rounded-full border border-slate-800/60 pointer-events-none" />

                {/* Central Star (User/Org Core) */}
                <div className="relative z-10 flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-solar-400 via-solar-500 to-amber-600 shadow-2xl shadow-solar-500/40 border-2 border-white/20 animate-pulse">
                  <Star className="w-8 h-8 text-white drop-shadow" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-1">
                    Solar Core
                  </span>
                </div>

                {/* Orbiting Planetary Nodes */}
                <div className="absolute top-4 left-6 sm:left-24 glass-panel-glow p-3 rounded-2xl flex items-center gap-3 transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="w-8 h-8 rounded-xl bg-plasma-500/20 border border-plasma-400 flex items-center justify-center text-plasma-300">
                    <Orbit className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">facebook/react</p>
                    <p className="text-[10px] text-slate-400 font-mono">Planet Class: Gas Giant</p>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 sm:right-24 glass-panel-glow p-3 rounded-2xl flex items-center gap-3 transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="w-8 h-8 rounded-xl bg-nebula-500/20 border border-nebula-400 flex items-center justify-center text-nebula-300">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">torvalds/linux</p>
                    <p className="text-[10px] text-slate-400 font-mono">140k Keplerian Orbits</p>
                  </div>
                </div>
              </div>

              {/* Bottom HUD Bar */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-supernova-400" />
                  <span>Zero Code Ingestion Guarantee: Telemetry computed from public metadata only.</span>
                </div>
                <div className="font-mono text-plasma-400 font-semibold">
                  Orbit Velocity: Real-Time
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics Strip */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SYSTEM_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="glass-panel p-4 rounded-2xl border-slate-800/80 text-center space-y-1 hover:border-slate-700 transition-colors"
            >
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                {metric.label}
              </p>
              <p className="text-sm sm:text-base font-bold text-white tracking-tight">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
