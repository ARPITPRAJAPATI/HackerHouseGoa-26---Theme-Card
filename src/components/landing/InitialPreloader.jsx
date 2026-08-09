import React, { useEffect, useState } from "react";
import "./landing.css";

export function InitialPreloader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const imagesToPreload = [
      "/assets/2-47.svg",
      "/assets/hacker-house-title.png",
      "/assets/goa_hindi.svg",
      "/assets/frame-a.svg",
      "/assets/BuilderPass.png",
    ];

    let loadedCount = 0;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= imagesToPreload.length) {
        setTimeout(() => setIsLoaded(true), 700);
      }
    };

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.onload = checkComplete;
      img.onerror = checkComplete;
      img.src = src;
    });

    // Fallback safety timer so loader never stalls
    const timer = setTimeout(() => setIsLoaded(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShouldRender(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!shouldRender) return null;

  return (
    <div className={`lp-preloader${isLoaded ? " loaded" : ""}`}>
      {/* 2:47 PM Studio Logo */}
      <img
        src="/assets/2-47.svg"
        alt="2:47 PM Studio"
        className="lp-preloader-logo"
      />

      {/* Spinner Ring — dual-color yellow/pink */}
      <div className="lp-spinner-wrap">
        <div className="lp-spinner" />
      </div>

      {/* Status Text */}
      <div className="lp-preloader-text">
        <p className="lp-preloader-title">HH GOA 2026 STUDIO</p>
        <p className="lp-preloader-sub">
          Initializing Shader Background &amp; Brand Assets...
        </p>
      </div>
    </div>
  );
}
