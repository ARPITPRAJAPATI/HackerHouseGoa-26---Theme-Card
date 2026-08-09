import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./landing.css";

export function HypeVideoModal({ isOpen, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => {
          console.log("Autoplay blocked:", err);
        });
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="lp-modal-backdrop" onClick={onClose}>
      <div
        className="lp-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="lp-modal-close"
          aria-label="Close Hype Video"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* Video */}
        <div className="lp-modal-video-wrap">
          <video
            ref={videoRef}
            src="/assets/Prehype.mp4"
            autoPlay
            controls
            playsInline
            className="lp-modal-video"
          />
        </div>
      </div>
    </div>
  );
}
