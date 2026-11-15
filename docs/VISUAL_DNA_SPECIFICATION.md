# GitSpace 3D — Planetary Visual DNA Procedural Mapping Specification

**Author:** Atlas (`atlas-research-analyst` / `RESEARCH_ANALYST`)  
**Backend Collaboration:** Kore (`kore-backend-developer` / `BACKEND_DEVELOPER`)  
**Milestone:** Phase 4 — GitHub API Telemetry & Procedural Mapping Engine  
**Project:** GitSpace 3D (`D:\Project\GitSpace-3D`)  
**Authority:** Founder & CEO  

---

## 1. Architectural Overview & Objective

The **Planetary Visual DNA Procedural Mapping Engine** converts public GitHub repository telemetry into mathematically deterministic 3D celestial parameters. Every public code repository manifests as an individual celestial world featuring custom procedural surface shaders, Rayleigh-scattering atmospheric halos, and Keplerian orbital dynamics centered around a host star.

### Strict Zero-Code-Ingestion Standard
In strict compliance with company security governance:
- **No Source Code Access**: Zero source files, diffs, git blobs, or ASTs are cloned, downloaded, parsed, or stored.
- **Metadata Isolation**: The visual representation is synthesized strictly from public repository metrics: byte sizes, star counts, fork counts, language byte distributions, and commit timestamps.
- **Client Token Isolation**: Any optional GitHub Personal Access Token (`GITHUB_TOKEN`) resides exclusively server-side in Next.js Route Handlers to raise API rate limits from 60/hr to 5,000/hr. It is never exposed in client bundles or network responses.

---

## 2. Mathematical Mapping Formulations

### A. Physical Planetary Scale & Radius ($R$)
Planetary radius represents repository codebase volume, modeled via base-10 logarithmic scaling to prevent massive repositories from dominating the screen while ensuring micro-repositories remain visible:

$$R = \text{clamp}\left(1.0 + \log_{10}(\max(\text{sizeKB}, 10)) \times 0.38, 1.1, 3.4\right)$$

#### Classification Tiers:
| Repository Size ($S$) | Planetary Radius ($R$) | Celestial Classification | Exemplar Repo |
| :--- | :--- | :--- | :--- |
| $S < 500\text{ KB}$ | $1.10 - 1.35$ | **Terrestrial / Proto-Planet** | Micro-libraries, CLI utils |
| $500\text{ KB} \le S < 10\text{ MB}$ | $1.35 - 2.10$ | **Oceanic World / Super-Earth** | `fastapi`, `express` |
| $10\text{ MB} \le S < 150\text{ MB}$ | $2.10 - 2.80$ | **Super-Earth / Gas Giant** | `facebook/react`, `vuejs/core` |
| $S \ge 150\text{ MB}$ | $2.80 - 3.40$ | **Colossal Jovian Giant** | `torvalds/linux`, `chromium` |

---

### B. Keplerian Orbital Distance ($r_{\text{orbit}}$) & Orbital Velocity ($\omega$)

In gravitational mechanics, planetary bodies distribute themselves across discrete orbital paths governed by angular momentum. In GitSpace 3D, community adoption (star count) governs the repository's orbital distance from the central host star:

$$r_{\text{base}} = 8.0 + \log_{10}(\max(\text{stars}, 1)) \times 3.5$$
$$r_{\text{orbit}} = \text{clamp}\left(r_{\text{base}} + \Delta_{\text{hash}}, 7.5, 38.0\right)$$

Where $\Delta_{\text{hash}} \in [0, 2.5]$ is a deterministic jitter offset derived from the 32-bit FNV-1a hash of the repository's full name, guaranteeing no two planetary bodies overlap in the same orbital plane.

#### Keplerian Orbital Velocity:
Applying Kepler's Third Law ($T^2 \propto r^3 \implies \omega \propto r^{-3/4}$), inner planets complete rapid orbits while outer distant worlds travel languidly:

$$\omega = \text{clamp}\left(\frac{1.15}{(r_{\text{orbit}})^{0.75}}, 0.05, 0.35\right)\text{ rad/s}$$

---

### C. Language Surface Color & Atmospheric Spectrum

Each programming language is mapped to a scientifically calibrated chromatic signature based on GitHub Linguist conventions and cosmic shader contrast:

| Programming Language | Base Bedrock (`colorBase`) | Surface Terrain (`colorSurface`) | Atmospheric Glow (`colorAtmosphere`) |
| :--- | :--- | :--- | :--- |
| **TypeScript** | `#0f2b48` (Abyssal Navy) | `#3178c6` (Deep Azure) | `#60a5fa` (Azure Aurora) |
| **JavaScript** | `#423806` (Volcanic Umber) | `#f7df1e` (Solar Amber) | `#fef08a` (Corona Halo) |
| **Python** | `#1e3a5f` (Oceanic Indigo) | `#3572A5` (Cosmic Cyan) | `#38bdf8` (Atmospheric Cyan) |
| **Rust** | `#451a03` (Oxidized Iron) | `#dea584` (Mars Terra Cotta)| `#fdba74` (Warm Dust) |
| **Go** | `#083344` (Aquatic Trench) | `#00ADD8` (Hyperdrive Teal) | `#67e8f9` (Ionized Aurora) |
| **C / C++** | `#1f2937` / `#4c0519` | `#555555` / `#f34b7d` | `#9ca3af` / `#fb7185` |
| **Java / Kotlin** | `#451a03` / `#2e1065` | `#b07219` / `#A97BFF` | `#fcd34d` / `#c084fc` |

For unmapped or emergent languages, colors are synthesized deterministically through FNV-1a hash hue rotation across HSL color space.

---

### D. Shannon Polyglot Entropy ($H$) & Procedural Surface Roughness

To reflect code architectural diversity, the engine calculates the Shannon information entropy of the repository's language byte distribution:

$$H = -\sum_{i=1}^{N} p_i \log_2(p_i), \quad p_i = \frac{\text{bytes}_i}{\sum \text{bytes}}$$

- **Single-Language Monoliths** ($H \approx 0$): Smooth, oceanic, stratified surface topology with gentle latitude bands.
- **Polyglot Stacks** ($H \in [1.5, 3.5]$): Complex tectonic faults, turbulent volcanic landmasses, and intricate shoreline noise.

#### Surface Shader Uniform Derivations:
$$\text{uNoiseScale} = \text{clamp}(2.2 + H \times 0.85, 2.0, 4.8)$$
$$\text{uRoughness} = \text{clamp}(0.30 + H \times 0.14, 0.25, 0.75)$$

---

### E. Activity Score & Dynamic Axial Rotation

Development momentum (time elapsed since the most recent commit `pushed_at`) governs rotational kinetic energy:

$$\Delta d = \max\left(0, \frac{t_{\text{now}} - t_{\text{pushed}}}{86,400,000}\right)\text{ days}$$
$$\text{ActivityScore} = \text{clamp}\left(1.0 - \frac{\min(\Delta d, 180)}{200}, 0.1, 1.0\right)$$

- **High Activity** ($\Delta d < 7\text{ days}$, Score $\ge 0.95$): High axial rotation ($0.85\text{ rad/s}$), intense atmospheric Rayleigh emission ($\text{uAtmospherePower} \approx 2.2$).
- **Dormant World** ($\Delta d > 180\text{ days}$, Score $\le 0.15$): Slow axial rotation ($0.30\text{ rad/s}$), cooled thin exosphere ($\text{uAtmospherePower} \approx 3.5$).

---

### F. Circumstellar Planetary Ring Formation

Planetary rings develop when a repository achieves high communal mass, signaled by open forks or massive repository size:

$$\text{hasRing} = (\text{forks} \ge 400) \lor (\text{stars} \ge 1,000) \lor (\text{sizeKB} \ge 60,000)$$

The outer ring radius dynamically scales with fork density:
$$R_{\text{ring, outer}} = 1.35 + \text{clamp}\left(\log_{10}(\max(\text{forks}, 10)) \times 0.32, 0.4, 1.2\right)$$

Ring color is harmonically tied to the secondary language in the repository's composition.

---

## 3. Caching & Expiration Model

- **Architecture**: In-Memory LRU Cache with TTL expiration (`src/lib/cache.ts`).
- **Capacity**: 100 repositories.
- **Default TTL**: 15 minutes (900,000 ms).
- **Eviction Protocol**: When capacity exceeds 100 items, the least recently queried repository is evicted ($O(1)$ amortized complexity via JavaScript `Map` insertion ordering).
- **Cache-Control Header**: `public, max-age=600, stale-while-revalidate=300`.

---

## 4. Verification & Guarantees

1. **Determinism**: Given identical `RepoTelemetry`, `generatePlanetaryVisualDNA()` returns an identical object across runs with byte-for-byte consistency.
2. **Zero Ingestion Guarantee**: No file contents or repository code trees are fetched or stored in memory or disk.
3. **Resilience**: Full fallback support for offline networks, GitHub 404, and GitHub 429 rate limit boundaries.
