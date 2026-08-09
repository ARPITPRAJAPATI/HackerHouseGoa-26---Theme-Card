import React, { useRef, useState } from "react";
import "./landing.css";

export function HeroSection({ onOpenGenerator }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width;
    const py = y / rect.height;

    const ry = (px - 0.5) * 20; // Y-axis rotation (-10deg to +10deg)
    const rx = (0.5 - py) * 20; // X-axis rotation (-10deg to +10deg)

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ rx, ry, active: true });
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTilt({ rx: 0, ry: 0, active: false });
  };

  return (
    <main className="lp-hero">
      <div className="lp-hero-inner">
        {/* ── Outer row: 3D perspective wrapper ── */}
        <div
          ref={containerRef}
          className="lp-hero-title-wrap hero-3d-perspective-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* ── Inner box: 3D tilting container ── */}
          <div
            className={`lp-title-img-box hero-3d-tilter ${tilt.active ? "tilting" : "floating-3d"}`}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateZ(40px)`,
              transition: tilt.active ? "transform 0.08s ease-out" : "transform 0.5s ease-out",
            }}
          >
            <img
              src="/assets/hacker-house-title.png"
              alt="HACKER HOUSE"
              className="lp-hacker-house-img hero-3d-logo-img"
            />

            {/* 3D Floating Hot Pink "गोवा" Stamp Badge */}
            <div className="lp-stamp-wrap hero-3d-stamp-badge">
              <img
                src="/assets/goa_hindi.svg"
                alt="गोवा"
                className="lp-stamp-img hero-3d-stamp-img"
              />
            </div>
          </div>
        </div>

        {/* ── Mobile Center CTA: Displayed in the center of the hero section on mobile screens ── */}
        <div className="mobile-center-cta-wrap">
          <button
            type="button"
            onClick={onOpenGenerator}
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
              padding: "16px 48px",
              minWidth: "220px",
              height: "72px",
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
                fontSize: "clamp(1.3rem, 4vw, 2rem)",
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

      </div>
    </main>
  );
}
