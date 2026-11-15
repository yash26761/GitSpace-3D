import { Navbar } from "../components/layout/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { Footer } from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-space-950 text-slate-100 font-sans selection:bg-nebula-500/30 selection:text-white">
      {/* Glassmorphic Global Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section & Cosmic Visual Container */}
        <HeroSection />

        {/* Cosmological Features Grid */}
        <FeaturesSection />

        {/* 3-Step Synthesis Walkthrough */}
        <HowItWorksSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
