import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Cpu, Compass } from "lucide-react";
import { STEPS } from "../../lib/constants";

const STEP_ICONS = [ShieldCheck, Cpu, Compass];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-space-900 border border-slate-800 text-xs font-mono text-nebula-400">
            <span>Cosmic Synthesis Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            From Code to Cosmos in Three Steps
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            A frictionless, privacy-preserving workflow that manifests your GitHub universe in real time.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, index) => {
            const Icon = STEP_ICONS[index] || CheckCircle2;
            return (
              <div
                key={item.step}
                className="relative glass-panel p-8 rounded-3xl border-slate-800/80 hover:border-plasma-400/40 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl"
              >
                {/* Step Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-extrabold font-mono bg-gradient-to-r from-plasma-400 to-nebula-400 bg-clip-text text-transparent">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-space-850 border border-slate-700/80 flex items-center justify-center text-plasma-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-space-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                    {item.detail}
                  </div>
                </div>

                {/* Step Footer */}
                <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-supernova-400" />
                  <span>Phase {index + 1} Pipeline Ready</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-16 glass-panel-glow p-8 sm:p-12 rounded-3xl border-nebula-500/30 text-center max-w-4xl mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to Explore Your Codebase Cosmos?
          </h3>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            No software installation or account creation required for public repository exploration.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-nebula-600 via-plasma-500 to-plasma-400 hover:from-nebula-500 hover:to-plasma-300 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-plasma-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Universe Explorer</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
