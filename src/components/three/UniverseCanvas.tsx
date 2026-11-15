"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { UniverseScene } from "./UniverseScene";
import { Orbit, Compass, Zap, ShieldCheck, AlertTriangle } from "lucide-react";

export function UniverseCanvas() {
  const [selectedPlanet, setSelectedPlanet] = useState<string>("facebook/react");
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Empirical WebGL 2.0 / WebGL Availability Check
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        setIsWebGLSupported(false);
      }
    } catch {
      setIsWebGLSupported(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[520px] rounded-3xl bg-space-950 border border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-400 font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-plasma-400 border-t-transparent animate-spin" />
        <span>Initializing WebGL 2.0 Celestial Engine...</span>
      </div>
    );
  }

  if (!isWebGLSupported) {
    return (
      <div className="w-full h-[520px] rounded-3xl bg-space-950 border border-amber-500/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">WebGL Acceleration Unavailable</h3>
        <p className="text-sm text-slate-300 max-w-md">
          Your browser or display hardware does not support WebGL 2.0 hardware acceleration. GitSpace 3D requires WebGL for procedural shader rendering.
        </p>
        <span className="text-xs font-mono text-slate-400">
          Fallback mode: 2D Cosmological Telemetry Active
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[480px] sm:h-[580px] rounded-3xl bg-space-950 border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* 3D Canvas Viewport */}
      <Canvas
        camera={{ position: [0, 24, 34], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={["#030712"]} />
        <UniverseScene onSelectPlanet={(name) => setSelectedPlanet(name)} />
      </Canvas>

      {/* Interactive HUD Overlay: Top Left Controls */}
      <div className="absolute top-4 left-4 z-10 glass-panel p-3.5 rounded-2xl border-slate-800 text-xs font-mono space-y-2 pointer-events-auto">
        <div className="flex items-center gap-2 text-plasma-400 font-bold">
          <Orbit className="w-4 h-4 animate-spin-slow" />
          <span>Interactive 3D Orbit Viewport</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Drag to Orbit • Scroll to Zoom • Shift + Drag to Pan
        </p>
      </div>

      {/* Interactive HUD Overlay: Top Right Telemetry */}
      <div className="absolute top-4 right-4 z-10 glass-panel px-3.5 py-2 rounded-2xl border-slate-800 text-xs font-mono flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-supernova-400 animate-pulse" />
        <span className="text-slate-300">GPU Shaders: Active</span>
        <span className="text-slate-600">|</span>
        <span className="text-plasma-400 font-semibold">60 FPS</span>
      </div>

      {/* Interactive HUD Overlay: Bottom Telemetry Drawer */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-4 rounded-2xl border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-space-900 border border-plasma-400/40 flex items-center justify-center text-plasma-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Target: {selectedPlanet}
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-nebula-500/20 text-nebula-300 border border-nebula-500/30">
                Procedural Mesh
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Click any celestial body to focus and inspect Keplerian dynamics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-space-900 border border-slate-800 text-slate-300">
            Rayleigh Atmosphere: Active
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-space-900 border border-slate-800 text-supernova-400">
            Zero Code Storage
          </div>
        </div>
      </div>
    </div>
  );
}
