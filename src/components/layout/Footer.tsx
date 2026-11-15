"use client";

import React from "react";
import Link from "next/link";
import { Orbit, ShieldCheck } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "../../lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-space-950 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-space-900 border border-slate-800 text-plasma-400">
              <Orbit className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">{SITE_NAME}</span>
              <p className="text-xs text-slate-400">{SITE_TAGLINE}</p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-space-900/60 px-4 py-2 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-supernova-400 shrink-0" />
            <span>Privacy Guaranteed: Zero raw source code downloaded or stored.</span>
          </div>

          {/* Copyright & Engine */}
          <div className="text-xs text-slate-400 font-mono text-center md:text-right">
            <p>© 2026 {SITE_NAME}. All rights reserved.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Engineered with Three.js & React Three Fiber
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
