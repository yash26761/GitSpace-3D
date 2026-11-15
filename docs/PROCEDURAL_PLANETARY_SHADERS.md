# GitSpace 3D — Procedural Planetary Shaders & Celestial Physics Specification

**Author:** Atlas (`RESEARCH_ANALYST`)  
**Component Domain:** WebGL 2.0 / GLSL Shaders & Keplerian Orbital Mechanics  
**Implementation Source:** `src/components/three/PlanetaryShaders.ts` & `src/components/three/PlanetMesh.tsx`  

---

## 1. Architectural Philosophy: Zero-Texture Procedural Synthesis

GitSpace 3D avoids static image textures (e.g. 4K PNG planet maps) to achieve:
1. **Zero Bandwidth Overhead:** Complete scene graph loads instantaneously without megabyte texture downloads.
2. **Infinite Procedural Variety:** High-frequency Fractal Brownian Motion (fBM) noise synthesizes continuous organic landmasses, gas giant atmospheric bands, and oceanic shorelines dynamically on the GPU.
3. **Responsive Mathematical Control:** Codebase metrics (commits, stars, languages) translate directly into GLSL uniforms.

---

## 2. Shader Subsystems

### 2.1 Surface Shader (`PlanetSurfaceShader`)
- **Vertex Shader:** Transforms geometry normals to world and view spaces; computes world coordinates for light-direction calculations.
- **Fragment Shader:**
  - **3D Hash & Simplex Noise Function:** Fast GPU hash function generating pseudo-random gradients across 3D coordinates.
  - **Fractal Brownian Motion (fBM):**
    $$\text{fBM}(p) = \sum_{i=0}^{3} A_i \cdot \text{Noise}(p \cdot 2.02^i), \quad A_i = 0.5^{i+1}$$
  - **Planetary Bands:**
    $$B(y, p) = \sin(6.0 \cdot y + 3.0 \cdot \text{fBM}(p)) \cdot 0.5 + 0.5$$
  - **Albedo Blending:**
    $$\text{Albedo} = \text{mix}(C_{\text{base}}, C_{\text{surface}}, \text{smoothstep}(0.42, 0.58, 0.7 \cdot \text{elevation} + 0.3 \cdot B))$$
  - **Diffuse Point-Light Illumination:**
    $$I_{\text{diffuse}} = \max(\mathbf{N} \cdot \mathbf{L}, 0.08)$$
  - **Atmospheric Rim Glow (Fresnel):**
    $$F = (\text{AtmosphereColor}) \cdot (1.0 - \max(\mathbf{V} \cdot \mathbf{N}, 0.0))^{\text{uAtmospherePower}} \cdot 1.5$$

### 2.2 Atmospheric Halo Shell (`AtmosphereGlowShader`)
- Rendered on a concentric inverted shell ($r_{\text{halo}} = 1.14 \cdot r_{\text{planet}}$) with additive blending (`THREE.AdditiveBlending`) and back-face culling (`THREE.BackSide`).
- Creates a soft, luminous planetary glow around the silhouette edges without occluding planetary surface details.

### 2.3 Central Solar Core Shader (`SolarCoronaShader`)
- Simulates turbulent coronal convection and chromospheric pulsations around the origin `(0, 0, 0)`.
- Emits real point-light illumination ($I = 3.5$, distance $= 150$) that realistically illuminates all orbiting planetary bodies.

---

## 3. Keplerian Orbital Mechanics

Planets traverse elliptical/circular orbits around the central host star according to Keplerian velocity equations:
$$\theta(t) = \theta_0 + \omega \cdot t$$
$$x(t) = R \cdot \cos(\theta(t)), \quad z(t) = R \cdot \sin(\theta(t))$$
Where:
- $R$: Semi-major orbital radius (`orbitalRadius`).
- $\omega$: Mean orbital angular velocity (`orbitalSpeed`).
- $\theta_0$: Initial phase offset (`initialAngle`).
- Axial rotation of the planet occurs concurrently around its tilted local Y-axis (`rotation.y = elapsed * 0.6`).

---

## 4. Uniform Parameter Reference Table

| Uniform | Type | Typical Value Range | Visual Impact |
| :--- | :--- | :--- | :--- |
| `uTime` | `float` | `clock.getElapsedTime()` | Drives atmospheric turbulence and surface drift. |
| `uColorBase` | `vec3` | Hex RGB (e.g. `#0c4a6e`) | Ocean / deep mantle baseline color. |
| `uColorSurface` | `vec3` | Hex RGB (e.g. `#06b6d4`) | Continental crust or upper atmospheric bands. |
| `uColorAtmosphere` | `vec3` | Hex RGB (e.g. `#38bdf8`) | Rayleigh atmospheric scattering tint. |
| `uNoiseScale` | `float` | `2.5` – `5.0` | Spatial frequency of terrain features. |
| `uAtmospherePower` | `float` | `2.0` – `3.5` | Exponent controlling Fresnel rim sharpness. |
