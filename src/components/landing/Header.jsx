import React from "react";
import "./landing.css";

export function Header({ onBackToHome }) {
  return (
    <header className="lp-header">
      {/* Top Left — 2:47 PM Studio logo */}
      <div>
        <button
          type="button"
          onClick={onBackToHome}
          className="lp-logo-btn"
        >
          <img
            src="/assets/2-47.svg"
            alt="2:47 PM Studio"
            className="lp-logo-img"
          />
        </button>
      </div>
    </header>
  );
}
