import React, { useRef, useState } from "react";
import "./landing.css";

export function HeroSection() {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width;
    const py = y / rect.height;

    const ry = (px - 0.5) * 24; // Y-axis rotation (-12deg to +12deg)
    const rx = (0.5 - py) * 24; // X-axis rotation (-12deg to +12deg)

    setTilt({ rx, ry, active: true });
  };

  const handleMouseLeave = () => {
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
              src="/assets/Hacker house.png"
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

      </div>
    </main>
  );
}
