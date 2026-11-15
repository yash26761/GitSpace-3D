import * as THREE from "three";

/**
 * Procedural Planetary Surface Shader
 * Simulates continental topology, ocean specular highlights, and atmospheric Rayleigh scattering
 * without requiring external image textures.
 */
export const PlanetSurfaceShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorBase: { value: new THREE.Color("#0f172a") },
    uColorSurface: { value: new THREE.Color("#06b6d4") },
    uColorAtmosphere: { value: new THREE.Color("#22d3ee") },
    uLightPosition: { value: new THREE.Vector3(0, 0, 0) },
    uNoiseScale: { value: 3.5 },
    uAtmospherePower: { value: 3.0 },
    uRoughness: { value: 0.4 },
  },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorBase;
    uniform vec3 uColorSurface;
    uniform vec3 uColorAtmosphere;
    uniform vec3 uLightPosition;
    uniform float uNoiseScale;
    uniform float uAtmospherePower;
    uniform float uRoughness;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    // Fast 3D Simplex-like hash noise for procedural topology
    vec3 hash33(vec3 p) {
      p = fract(p * vec3(0.1031, 0.1030, 0.0973));
      p += dot(p, p.yxz + 33.33);
      return fract((p.xxy + p.yxx) * p.zyx);
    }

    float noise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float n000 = dot(hash33(i + vec3(0,0,0)) * 2.0 - 1.0, f - vec3(0,0,0));
      float n100 = dot(hash33(i + vec3(1,0,0)) * 2.0 - 1.0, f - vec3(1,0,0));
      float n010 = dot(hash33(i + vec3(0,1,0)) * 2.0 - 1.0, f - vec3(0,1,0));
      float n110 = dot(hash33(i + vec3(1,1,0)) * 2.0 - 1.0, f - vec3(1,1,0));
      float n001 = dot(hash33(i + vec3(0,0,1)) * 2.0 - 1.0, f - vec3(0,0,1));
      float n101 = dot(hash33(i + vec3(1,0,1)) * 2.0 - 1.0, f - vec3(1,0,1));
      float n011 = dot(hash33(i + vec3(0,1,1)) * 2.0 - 1.0, f - vec3(0,1,1));
      float n111 = dot(hash33(i + vec3(1,1,1)) * 2.0 - 1.0, f - vec3(1,1,1));

      float nx00 = mix(n000, n100, f.x);
      float nx10 = mix(n010, n110, f.x);
      float nx01 = mix(n001, n101, f.x);
      float nx11 = mix(n011, n111, f.x);

      float nxy0 = mix(nx00, nx10, f.y);
      float nxy1 = mix(nx01, nx11, f.y);

      return mix(nxy0, nxy1, f.z) * 0.5 + 0.5;
    }

    // Fractal Brownian Motion (fBM) for realistic planetary bands & continental margins
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise3D(p * frequency);
        frequency *= 2.02;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      // 1. Procedural Surface Elevation & Bands
      vec3 coord = vPosition * uNoiseScale + vec3(uTime * 0.02, uTime * 0.01, 0.0);
      float elevation = fbm(coord);
      float band = sin(vPosition.y * 6.0 + elevation * 3.0) * 0.5 + 0.5;
      float surfaceMask = smoothstep(0.42, 0.58, elevation * 0.7 + band * 0.3);

      vec3 albedo = mix(uColorBase, uColorSurface, surfaceMask);

      // 2. Light & Shadow Direction (Point Light at Center or World Coordinates)
      vec3 lightDir = normalize(uLightPosition - vWorldPosition);
      float NdotL = max(dot(vNormal, lightDir), 0.08); // Ambient term 0.08

      // 3. Fresnel Atmospheric Rim Scattering
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), uAtmospherePower);

      // 4. Combine Lighting, Albedo, and Atmosphere
      vec3 finalColor = albedo * NdotL + uColorAtmosphere * fresnel * 1.5;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

/**
 * Atmospheric Halo / Glow Shader
 * Rendered on an inverted or slightly enlarged sphere to simulate glowing planetary atmospheres.
 */
export const AtmosphereGlowShader = {
  uniforms: {
    uGlowColor: { value: new THREE.Color("#06b6d4") },
    uFresnelBias: { value: 0.1 },
    uFresnelScale: { value: 1.0 },
    uFresnelPower: { value: 2.5 },
  },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uGlowColor;
    uniform float uFresnelBias;
    uniform float uFresnelScale;
    uniform float uFresnelPower;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = uFresnelBias + uFresnelScale * pow(1.0 - max(dot(viewDir, vNormal), 0.0), uFresnelPower);
      gl_FragColor = vec4(uGlowColor, fresnel * 0.6);
    }
  `,
};

/**
 * Central Solar Core Shader
 * Simulates high-energy turbulent plasma, solar coronal pulsations, and core emission.
 */
export const SolarCoreShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color("#fbbf24") },
    uColorFlare: { value: new THREE.Color("#f59e0b") },
    uColorOuter: { value: new THREE.Color("#ef4444") },
  },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorFlare;
    uniform vec3 uColorOuter;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    // Simple pseudo-random turbulence
    float sinTurbulence(vec3 p) {
      return sin(p.x * 4.0 + uTime * 2.0) * sin(p.y * 4.0 - uTime * 1.5) * sin(p.z * 4.0 + uTime);
    }

    void main() {
      float turb = sinTurbulence(vPosition * 1.5) * 0.5 + 0.5;
      vec3 starColor = mix(uColorCore, uColorFlare, turb);

      // Edge flare
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
      starColor = mix(starColor, uColorOuter, pow(rim, 1.8));

      gl_FragColor = vec4(starColor, 1.0);
    }
  `,
};
