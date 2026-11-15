"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
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

// Client-only dynamic loading of the 3D WebGL Canvas to prevent SSR hydration discrepancies
const DynamicUniverseCanvas = dynamic(
  () => import("../three/UniverseCanvas").then((mod) => mod.UniverseCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[480px] sm:h-[580px] rounded-3xl bg-space-950 border border-slate-800/80 flex flex-col items-center justify-center gap-4 text-slate-400 font-mono text-xs shadow-2xl">
        <div className="w-8 h-8 rounded-full border-2 border-plasma-400 border-t-transparent animate-spin" />
        <span>Initializing WebGL 2.0 Procedural Cosmos...</span>
      </div>
    ),
  }
);

const PRESET_SYSTEMS = [
  { name: "torvalds/linux", color: "#f59e0b", orbits: "140k+", stars: "185k" },
  { name: "facebook/react", color: "#06b6d4", orbits: "90k+", stars: "230k" },
  { name: "tiangolo/fastapi", color: "#10b981", orbits: "30k+", stars: "75k" },
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
    setStatusMessage(`Focusing cosmic sensors on "${query.trim()}". (Milestone 4 GitHub API ingestion will query live commit history)`);
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

        {/* Real Live 3D WebGL 2.0 Celestial Canvas Viewport (Milestone 3 Implementation) */}
        <div id="visualization" className="mt-14 max-w-5xl mx-auto">
          <DynamicUniverseCanvas />
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
