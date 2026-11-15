"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Orbit, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "../../lib/constants";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-nebula-500 rounded-lg p-1"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-space-900 border border-nebula-500/30 group-hover:border-nebula-400 transition-all duration-300 shadow-lg shadow-nebula-500/10">
              <Orbit className="w-5 h-5 text-plasma-400 group-hover:rotate-45 transition-transform duration-500" />
              <div className="absolute inset-0 rounded-xl bg-plasma-400/10 blur-sm group-hover:bg-plasma-400/20 transition-all" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-plasma-300 transition-colors">
                {SITE_NAME}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-medium">
                Cosmic Explorer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-plasma-400 rounded-md px-1 py-0.5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Button & Status Pill */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-space-900/80 border border-slate-700/60 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-supernova-400 animate-pulse" />
              <span>v0.1.0 Beta</span>
            </div>

            <a
              href="#explore"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-nebula-600 to-plasma-500 hover:from-nebula-500 hover:to-plasma-400 text-white text-xs font-semibold tracking-wide uppercase shadow-lg shadow-nebula-500/20 hover:shadow-plasma-500/30 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-plasma-400"
            >
              <span>Explore Cosmos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-space-900/80 border border-slate-800 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-plasma-400"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 pt-4 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-space-850 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-3">
              <span>Status</span>
              <span className="flex items-center gap-1.5 text-supernova-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-supernova-400 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <a
              href="#explore"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-nebula-600 to-plasma-500 text-white text-xs font-semibold uppercase tracking-wider shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Any Repository</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
