"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PlanetSurfaceShader, AtmosphereGlowShader } from "./PlanetaryShaders";

export interface PlanetProps {
  name: string;
  fullName?: string;
  planetClass?: string;
  radius?: number;
  orbitalRadius: number;
  orbitalSpeed: number;
  initialAngle?: number;
  rotationSpeed?: number;
  colorBase?: string;
  colorSurface?: string;
  colorAtmosphere?: string;
  noiseScale?: number;
  roughness?: number;
  atmospherePower?: number;
  axialTilt?: number;
  hasRing?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColor?: string;
  activityScore?: number;
  onSelect?: (name: string) => void;
}

export function PlanetMesh({
  name,
  fullName,
  radius = 1.0,
  orbitalRadius,
  orbitalSpeed,
  initialAngle = 0,
  rotationSpeed = 0.6,
  colorBase = "#0f172a",
  colorSurface = "#06b6d4",
  colorAtmosphere = "#22d3ee",
  noiseScale = 3.5,
  roughness = 0.4,
  atmospherePower = 2.8,
  axialTilt = 0.2,
  hasRing = false,
  ringInnerRadius = 1.3,
  ringOuterRadius = 2.0,
  ringColor = "#38bdf8",
  onSelect,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const surfaceMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // Surface Shader Material memoization
  const surfaceMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: PlanetSurfaceShader.vertexShader,
      fragmentShader: PlanetSurfaceShader.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColorBase: { value: new THREE.Color(colorBase) },
        uColorSurface: { value: new THREE.Color(colorSurface) },
        uColorAtmosphere: { value: new THREE.Color(colorAtmosphere) },
        uLightPosition: { value: new THREE.Vector3(0, 0, 0) },
        uNoiseScale: { value: noiseScale },
        uAtmospherePower: { value: atmospherePower },
        uRoughness: { value: roughness },
      },
    });
  }, [colorBase, colorSurface, colorAtmosphere, noiseScale, roughness, atmospherePower]);

  // Atmosphere Glow Shader Material memoization
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: AtmosphereGlowShader.vertexShader,
      fragmentShader: AtmosphereGlowShader.fragmentShader,
      uniforms: {
        uGlowColor: { value: new THREE.Color(colorAtmosphere) },
        uFresnelBias: { value: 0.05 },
        uFresnelScale: { value: 1.2 },
        uFresnelPower: { value: 2.5 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
  }, [colorAtmosphere]);

  // Orbital motion and axial rotation
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // 1. Keplerian Orbit Around Central Star
    const angle = initialAngle + elapsed * orbitalSpeed * 0.3;
    const x = Math.cos(angle) * orbitalRadius;
    const z = Math.sin(angle) * orbitalRadius;

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }

    // 2. Axial Spin
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y = elapsed * rotationSpeed;
    }

    // 3. Update Shader Uniforms
    if (surfaceMaterialRef.current) {
      surfaceMaterialRef.current.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Planetary Group with Axial Tilt */}
      <group rotation={[axialTilt, 0, 0]}>
        {/* Core Planet Sphere */}
        <mesh
          ref={planetMeshRef}
          material={surfaceMaterial}
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(fullName || name);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[radius, 48, 48]} />
        </mesh>

        {/* Atmospheric Halo Shell */}
        <mesh material={atmosphereMaterial}>
          <sphereGeometry args={[radius * 1.14, 32, 32]} />
        </mesh>

        {/* Optional Planetary Ring */}
        {hasRing && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[radius * ringInnerRadius, radius * ringOuterRadius, 64]}
            />
            <meshStandardMaterial
              color={ringColor}
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
              roughness={0.6}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}
