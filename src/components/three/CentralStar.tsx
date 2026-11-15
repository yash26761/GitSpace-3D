"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SolarCoreShader } from "./PlanetaryShaders";

export function CentralStar({
  radius = 2.2,
  colorCore = "#fbbf24",
  colorFlare = "#f59e0b",
}: {
  radius?: number;
  colorCore?: string;
  colorFlare?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SolarCoreShader.vertexShader,
      fragmentShader: SolarCoreShader.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColorCore: { value: new THREE.Color(colorCore) },
        uColorFlare: { value: new THREE.Color(colorFlare) },
        uColorOuter: { value: new THREE.Color("#ef4444") },
      },
    });
  }, [colorCore, colorFlare]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    starMaterial.uniforms.uTime.value = elapsed;

    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.15;
    }

    if (lightRef.current) {
      // Subtle solar luminosity fluctuation
      lightRef.current.intensity = 3.5 + Math.sin(elapsed * 2.0) * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Star Core */}
      <mesh ref={meshRef} material={starMaterial}>
        <sphereGeometry args={[radius, 48, 48]} />
      </mesh>

      {/* Primary Omnidirectional Solar Emitter */}
      <pointLight
        ref={lightRef}
        color="#fbbf24"
        intensity={3.5}
        distance={150}
        decay={1.2}
      />

      {/* Ambient Celestial Baseline Light */}
      <ambientLight color="#1e1b4b" intensity={0.4} />
    </group>
  );
}
