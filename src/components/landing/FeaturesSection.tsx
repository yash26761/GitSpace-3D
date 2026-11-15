import React from "react";
import {
  Globe,
  Orbit,
  BarChart3,
  Zap,
  Shield,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { FEATURES, FeatureItem } from "../../lib/constants";

const ICON_MAP: Record<FeatureItem["iconName"], LucideIcon> = {
  Globe,
  Orbit,
  BarChart3,
  Zap,
  Shield,
  Sparkles,
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 relative">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-nebula-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-space-900 border border-slate-800 text-xs font-mono text-plasma-400">
            <span>Cosmological Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Celestial Codebase Exploration
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Every repository maps to a procedurally generated planet with dynamic visual DNA derived from real development momentum.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature) => {
            const Icon = ICON_MAP[feature.iconName] || Globe;
            return (
              <div
                key={feature.id}
                className="group glass-panel p-6 sm:p-8 rounded-3xl border-slate-800/80 hover:border-nebula-500/40 hover:bg-space-900/60 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-nebula-500/10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-space-850 border border-slate-700/80 group-hover:border-plasma-400/60 flex items-center justify-center text-plasma-400 group-hover:text-plasma-300 transition-colors shadow-inner">
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2.5 py-0.5 rounded-full bg-space-900 border border-slate-800">
                      {feature.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-plasma-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Subsystem Verified</span>
                  <span className="text-supernova-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-supernova-400" />
                    Operational
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
