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
  Globe,
  BarChart3,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Code2,
} from "lucide-react";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SYSTEM_METRICS,
} from "../../lib/constants";
import { PlanetaryVisualDNA, RepoTelemetry, RepoApiResponse } from "../../lib/types";

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
  { name: "facebook/react", label: "React", stars: "230k", desc: "Oceanic Planet" },
  { name: "torvalds/linux", label: "Linux", stars: "185k", desc: "Gas Giant" },
  { name: "tiangolo/fastapi", label: "FastAPI", stars: "75k", desc: "Oceanic Planet" },
  { name: "yash26761/yh-nexus", label: "YH Nexus", stars: "Active", desc: "Super-Earth" },
];

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [activePreset, setActivePreset] = useState("facebook/react");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "info" | "success" | "error";
    text: string;
  } | null>(null);

  // Dynamic planets collection synthesized from GitHub
  const [customPlanets, setCustomPlanets] = useState<PlanetaryVisualDNA[]>([]);
  const [activeTelemetry, setActiveTelemetry] = useState<RepoTelemetry | null>(null);
  const [selectedPlanetName, setSelectedPlanetName] = useState<string>("facebook/react");

  const synthesizeRepository = async (repoSlug: string) => {
    if (!repoSlug || !repoSlug.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter a valid GitHub repository in 'owner/repo' format.",
      });
      return;
    }

    setIsSynthesizing(true);
    setStatusMessage({
      type: "info",
      text: `Connecting to GitHub REST API for "${repoSlug.trim()}"... Zero code ingestion policy enforced.`,
    });

    try {
      const res = await fetch(`/api/repo?repo=${encodeURIComponent(repoSlug.trim())}`);
      const data: RepoApiResponse = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({
          type: "error",
          text: data.error || `Synthesis failed with status ${res.status}.`,
        });
        return;
      }

      if (data.visualDna && data.telemetry) {
        // Add or update synthesized planet
        setCustomPlanets((prev) => {
          const filtered = prev.filter((p) => p.fullName !== data.visualDna!.fullName);
          return [data.visualDna!, ...filtered];
        });

        setActiveTelemetry(data.telemetry);
        setSelectedPlanetName(data.visualDna.fullName);
        setStatusMessage({
          type: "success",
          text: `Synthesized "${data.visualDna.fullName}" into ${data.visualDna.planetClass} with orbital velocity ${(data.visualDna.orbitalSpeed * 100).toFixed(1)} AU/s. ${data.cached ? "(Cached)" : "(Live GitHub Telemetry)"}`,
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: `Network error while querying repository: ${err?.message || "Check connection"}`,
      });
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    synthesizeRepository(query);
  };

  const handleSelectPreset = (name: string) => {
    setQuery(name);
    setActivePreset(name);
    synthesizeRepository(name);
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
            <span>Live GitHub Ingestion & Visual DNA</span>
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
                    if (statusMessage?.type === "error") setStatusMessage(null);
                  }}
                  placeholder="e.g. facebook/react or torvalds/linux"
                  disabled={isSynthesizing}
                  className="w-full pl-12 pr-36 py-4 rounded-2xl bg-space-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-plasma-400 focus:ring-2 focus:ring-plasma-400/20 shadow-2xl transition-all disabled:opacity-60"
                  aria-label="GitHub Repository Search"
                />
                <button
                  type="submit"
                  disabled={isSynthesizing}
                  className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-gradient-to-r from-nebula-600 to-plasma-500 hover:from-nebula-500 hover:to-plasma-400 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-nebula-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-plasma-400"
                >
                  {isSynthesizing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing</span>
                    </>
                  ) : (
                    <>
                      <span>Synthesize</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-400">
              <span className="font-mono text-slate-500">Live Presets:</span>
              {PRESET_SYSTEMS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  disabled={isSynthesizing}
                  onClick={() => handleSelectPreset(preset.name)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
                    activePreset === preset.name
                      ? "bg-space-800 border-plasma-400/50 text-plasma-300"
                      : "bg-space-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Status & Feedback Drawer */}
            {statusMessage && (
              <div
                className={`mt-3 p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 text-left animate-in fade-in duration-200 ${
                  statusMessage.type === "error"
                    ? "bg-rose-950/40 border-rose-500/30 text-rose-300"
                    : statusMessage.type === "success"
                    ? "bg-supernova-950/40 border-supernova-500/30 text-supernova-300"
                    : "bg-space-850/80 border-nebula-500/30 text-plasma-300"
                }`}
              >
                {statusMessage.type === "error" ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                ) : statusMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-supernova-400" />
                ) : (
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin text-plasma-400" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Real Live 3D WebGL 2.0 Celestial Canvas Viewport */}
        <div id="visualization" className="mt-14 max-w-5xl mx-auto">
          <DynamicUniverseCanvas
            planets={customPlanets}
            selectedPlanetName={selectedPlanetName}
            onSelectPlanet={(name) => {
              setSelectedPlanetName(name);
              const found = customPlanets.find((p) => p.fullName === name || p.name === name);
              if (found) {
                setStatusMessage({
                  type: "info",
                  text: `Focused on ${found.fullName} (${found.planetClass}, Radius: ${found.radius}, Orbit: ${found.orbitalRadius} AU)`,
                });
              }
            }}
          />
        </div>

        {/* Real-time Telemetry & Visual DNA Inspector Strip (when active telemetry exists) */}
        {activeTelemetry && (
          <div className="mt-6 max-w-5xl mx-auto glass-panel p-5 rounded-2xl border-slate-800/80 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {activeTelemetry.fullName}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-plasma-500/20 text-plasma-300 border border-plasma-500/30">
                    {activeTelemetry.metrics.primaryLanguage}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl line-clamp-1">
                  {activeTelemetry.description}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Stars: <strong className="text-white">{activeTelemetry.metrics.stars.toLocaleString()}</strong></span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Forks: <strong className="text-white">{activeTelemetry.metrics.forks.toLocaleString()}</strong></span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Size: <strong className="text-white">{Math.round(activeTelemetry.metrics.sizeKB / 1024)} MB</strong></span>
              </div>
            </div>

            {/* Language Composition Breakdown */}
            <div className="pt-3">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2">
                Language Architecture Breakdown (Bytes)
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeTelemetry.metrics.languages).slice(0, 5).map(([lang, bytes]) => {
                  const pct = activeTelemetry.metrics.totalBytes > 0
                    ? ((bytes / activeTelemetry.metrics.totalBytes) * 100).toFixed(1)
                    : "0";
                  return (
                    <span
                      key={lang}
                      className="px-2.5 py-1 rounded-lg bg-space-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                    >
                      {lang}: <strong className="text-plasma-400">{pct}%</strong>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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
