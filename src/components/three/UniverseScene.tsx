"use client";

import React, { useState } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import { CentralStar } from "./CentralStar";
import { PlanetMesh, PlanetProps } from "./PlanetMesh";
import { KeplerianOrbitRing } from "./KeplerianOrbitRing";

const DEMO_PLANETS: PlanetProps[] = [
  {
    name: "facebook/react",
    radius: 1.3,
    orbitalRadius: 8.5,
    orbitalSpeed: 0.5,
    initialAngle: 0.2,
    colorBase: "#0c4a6e",
    colorSurface: "#06b6d4",
    colorAtmosphere: "#38bdf8",
    hasRing: true,
    ringColor: "#0284c7",
  },
  {
    name: "torvalds/linux",
    radius: 1.7,
    orbitalRadius: 14.0,
    orbitalSpeed: 0.35,
    initialAngle: 2.1,
    colorBase: "#78350f",
    colorSurface: "#f59e0b",
    colorAtmosphere: "#fbbf24",
    hasRing: false,
  },
  {
    name: "tiangolo/fastapi",
    radius: 1.1,
    orbitalRadius: 19.5,
    orbitalSpeed: 0.25,
    initialAngle: 4.2,
    colorBase: "#064e3b",
    colorSurface: "#10b981",
    colorAtmosphere: "#34d399",
    hasRing: false,
  },
  {
    name: "yash26761/yh-nexus",
    radius: 1.4,
    orbitalRadius: 25.5,
    orbitalSpeed: 0.18,
    initialAngle: 5.4,
    colorBase: "#312e81",
    colorSurface: "#6366f1",
    colorAtmosphere: "#818cf8",
    hasRing: true,
    ringColor: "#4f46e5",
  },
];

export function UniverseScene({
  onSelectPlanet,
}: {
  onSelectPlanet?: (name: string) => void;
}) {
  return (
    <>
      {/* Dynamic Smooth Camera Orbit Controls */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={8}
        maxDistance={70}
        maxPolarAngle={Math.PI / 2 + 0.1}
      />

      {/* Deep Space Background Starfield */}
      <Stars
        radius={120}
        depth={60}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Central Solar Host Star */}
      <CentralStar radius={2.2} />

      {/* Orbit Rings & Procedural Planetary Systems */}
      {DEMO_PLANETS.map((planet) => (
        <React.Fragment key={planet.name}>
          <KeplerianOrbitRing
            radius={planet.orbitalRadius}
            color="#334155"
            opacity={0.3}
          />
          <PlanetMesh
            {...planet}
            onSelect={(name) => onSelectPlanet?.(name)}
          />
        </React.Fragment>
      ))}
    </>
  );
}
