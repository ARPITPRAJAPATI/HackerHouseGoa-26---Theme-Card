import React from "react";
import "./landing.css";

export function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-links">
        <span className="lp-footer-hash">#FrameInGoa</span>
        <span className="lp-footer-bullet">•</span>
        <span className="lp-footer-white">HH GOA 2026</span>
        <span className="lp-footer-bullet">•</span>
        <span className="lp-footer-white">August 28–31, 2026</span>
        <span className="lp-footer-bullet">•</span>
        <span className="lp-footer-white">Goa, India</span>
      </div>

      <p className="lp-footer-sub">
        Built for HH Goa 2026 builders &amp; attendees.
      </p>
    </footer>
  );
}
