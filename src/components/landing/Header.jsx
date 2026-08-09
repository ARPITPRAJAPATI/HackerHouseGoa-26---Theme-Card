import React from "react";
import { Sparkles } from "lucide-react";
import "./landing.css";

export function Header({ onBackToHome, onOpenGenerator, onOpenHypeModal }) {
  return (
    <header className="lp-header">
      {/* Left — 2:47 PM Studio logo */}
      <div className="lp-header-left">
        <button
          type="button"
          onClick={onBackToHome}
          className="lp-logo-btn"
        >
          <img
            src="/assets/2-47.svg"
            alt="2:47 PM Studio"
            width="160"
            height="40"
            className="lp-logo-img"
          />
        </button>
      </div>

      {/* Center — Custom CREATE MY PASS Button */}
      <div className="lp-header-center">
        <button
          type="button"
          onClick={onOpenGenerator}
          className="lp-header-custom-btn"
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgb(254, 225, 1)",
            borderWidth: "medium",
            borderStyle: "none",
            borderColor: "currentcolor",
            borderImage: "none",
            borderRadius: "0px",
            cursor: "pointer",
            padding: "14px 36px",
            minWidth: "180px",
            height: "60px",
            overflow: "hidden",
            transition: "opacity 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {/* Top zigzag stripe */}
          <span
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "100%",
              height: "7px",
              zIndex: 2,
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'7\'%3E%3Cpolyline points=\'0,7 5,0 10,7 15,0 20,7\' fill=\'none\' stroke=\'%230B6839\' stroke-width=\'2\'/%3E%3C/svg%3E")',
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left top",
              backgroundSize: "20px 7px",
            }}
          />
          {/* Button label */}
          <p
            style={{
              position: "relative",
              zIndex: 10,
              margin: "0px",
              color: "rgb(11, 104, 57)",
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            CREATE MY PASS
          </p>
          {/* Bottom zigzag stripe */}
          <span
            style={{
              position: "absolute",
              bottom: "0px",
              left: "0px",
              width: "100%",
              height: "7px",
              zIndex: 2,
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'7\'%3E%3Cpolyline points=\'0,0 5,7 10,0 15,7 20,0\' fill=\'none\' stroke=\'%230B6839\' stroke-width=\'2\'/%3E%3C/svg%3E")',
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left top",
              backgroundSize: "20px 7px",
            }}
          />
        </button>
      </div>

      {/* Right — VIBE CHECK Pill Button */}
      <div className="lp-header-right">
        <button
          type="button"
          onClick={onOpenHypeModal}
          className="lp-vibe-btn"
        >

          <span>VIBE CHECK</span>
        </button>
      </div>
    </header>
  );
}

