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
        />

        {/* ── Hero: HACKER HOUSE title fills full first screen ── */}
        <HeroSection />

        {/* ── CTA Section: visible when user scrolls down ── */}
        <section
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            padding: "4rem 2rem",
            background: "rgba(0,24,12,0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Mono', monospace",
              color: "#FEE101",
              fontSize: "clamp(1.2rem, 3vw, 2rem)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textAlign: "center",
              margin: 0,
            }}
          >
            Create Your Builder Pass
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
              textAlign: "center",
              maxWidth: "480px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Personalize your official Hacker House Goa 2026 builder ID card.
          </p>
          {/* hhgoa.com-style APPLY button with zigzag stripe borders */}
          <button
            onClick={openGenerator}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FEE101",
              border: "none",
              borderRadius: 0,
              cursor: "pointer",
              padding: "18px 52px",
              minWidth: "220px",
              height: "72px",
              overflow: "hidden",
              transition: "opacity 0.2s ease, transform 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            {/* Top zigzag stripe */}
            <span style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "7px", zIndex: 2,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='7'%3E%3Cpolyline points='0,7 5,0 10,7 15,0 20,7' fill='none' stroke='%230B6839' stroke-width='2'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left top",
              backgroundSize: "20px 7px",
            }} />
            {/* Button label */}
            <p style={{
              position: "relative",
              zIndex: 10,
              margin: 0,
              color: "#0B6839",
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: 700,
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}>
              CREATE MY PASS
            </p>
            {/* Bottom zigzag stripe */}
            <span style={{
              position: "absolute", bottom: 0, left: 0, width: "100%", height: "7px", zIndex: 2,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='7'%3E%3Cpolyline points='0,0 5,7 10,0 15,7 20,0' fill='none' stroke='%230B6839' stroke-width='2'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left top",
              backgroundSize: "20px 7px",
            }} />
          </button>
        </section>

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
