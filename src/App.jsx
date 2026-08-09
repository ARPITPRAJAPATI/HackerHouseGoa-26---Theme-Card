import React, { useState } from "react";
import CardGenerator from "./components/CardGenerator";
import { Header } from "./components/landing/Header";
import { HeroSection } from "./components/landing/HeroSection";

import { HypeVideoModal } from "./components/landing/HypeVideoModal";

import { ArrowLeft } from "lucide-react";
import "./App.css";

import BlendedAgendaGenerator from "./components/BlendedAgendaGenerator";

function App() {
  const [viewMode, setViewMode] = useState("landing"); // "landing" | "generator"
  const [isHypeModalOpen, setIsHypeModalOpen] = useState(false);

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
