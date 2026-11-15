"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export function KeplerianOrbitRing({
  radius,
  color = "#334155",
  opacity = 0.35,
}: {
  radius: number;
  color?: string;
  opacity?: number;
}) {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <primitive
      object={
        new THREE.Line(
          lineGeometry,
          new THREE.LineBasicMaterial({
            color: new THREE.Color(color),
            transparent: true,
            opacity: opacity,
          })
        )
      }
    />
  );
}
