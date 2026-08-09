import React, { useState, useEffect } from "react";
import { Header } from "./components/landing/Header";
import { HeroSection } from "./components/landing/HeroSection";
import { HypeVideoModal } from "./components/landing/HypeVideoModal";
import BlendedAgendaGenerator from "./components/BlendedAgendaGenerator";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./App.css";

function App() {
  const [viewMode, setViewMode] = useState("landing"); // "landing" | "generator"
  const [isHypeModalOpen, setIsHypeModalOpen] = useState(false);

  // Initialize Lenis Smooth Scroll for buttery fluid momentum scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true,
      touchMultiplier: 2.0,
    });

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  const openGenerator = () => {
    setViewMode("generator");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openLanding = () => {
    setViewMode("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (viewMode === "landing") {
    return (
      <div className="lp-page bg-[#026834]">
        <Header
          onBackToHome={openLanding}
          onOpenGenerator={openGenerator}
          onOpenHypeModal={() => setIsHypeModalOpen(true)}
        />

        {/* ── Hero: HACKER HOUSE title fills full screen ── */}
        <HeroSection onOpenGenerator={openGenerator} />

        {/* Hype Video Overlay Modal */}
        <HypeVideoModal
          isOpen={isHypeModalOpen}
          onClose={() => setIsHypeModalOpen(false)}
        />
      </div>
    );
  }

  return <BlendedAgendaGenerator onBackToHome={openLanding} />;
}

export default App;
