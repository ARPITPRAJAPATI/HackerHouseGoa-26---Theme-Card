import React, { useRef, useState, useEffect } from "react";
import HHGoaCard from "./HHGoaCard";
import UploadPhoto from "./UploadPhoto";
import DownloadButton from "./DownloadButton";
import ShareButton from "./ShareButton";
import { generateRandomAttributes } from "../utils/randomGenerator";
import { ArrowLeft, RefreshCw, Sparkles, Camera } from "lucide-react";
import "../styles/BlendedAgendaGenerator.css";

export default function BlendedAgendaGenerator({ onBackToHome }) {
  const cardRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "Arpit Singh",
    stackRole: "Solana / AI Engineer",
  });

  // Photo State & Offset
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoOffset, setPhotoOffset] = useState({ x: 0, y: 0, zoom: 1 });

  // HH Goa Attributes
  const [randomAttrs, setRandomAttrs] = useState({
    builderClass: "Prototype Pirate",
    beachBag: ["☕ Coffee", "💻 VS Code", "🎧 Lo-Fi Beats"],
    currentlyShipping: "Building the Future",
    builderId: "#HH-GOA-2026",
  });

  useEffect(() => {
    setRandomAttrs(generateRandomAttributes());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRerollClass = () => {
    setRandomAttrs(generateRandomAttributes());
  };

  const cardData = {
    name: formData.name || "YOUR NAME",
    stackRole: formData.stackRole || "BUILDER / STACK",
    photoUrl: photoUrl,
    builderClass: randomAttrs.builderClass,
    stickerUrl: randomAttrs.stickerUrl,
    beachBag: randomAttrs.beachBag,
    currentlyShipping: randomAttrs.currentlyShipping,
    builderId: randomAttrs.builderId,
  };

  return (
    <div className="blended-agenda-wrapper">
      {/* ── Top Header Navigation Bar ── */}
      <div className="shack-header-bar">
        <button
          type="button"
          onClick={onBackToHome}
          className="shack-home-btn"
        >
          <ArrowLeft size={16} />
          <span>← BACK TO HOME</span>
        </button>

        <img
          src="/assets/2-47.svg"
          alt="2:47 PM Studio"
          style={{ height: "32px" }}
        />
      </div>

      {/* ── Main Stage (Aspect-Ratio Grid matching agenda-bg.png) ── */}
      <div className="blended-stage">

        {/* ── FRAME 1 (Top Left - Yellow Board): BUILDER PROFILE ── */}
        <div className="hanging-frame frame-top-left">
          <div>
            <div className="frame-title">
              <span>1. BUILDER INFO</span>
              <Sparkles size={16} />
            </div>

            <div className="blended-input-group">
              <label className="blended-input-label">FULL NAME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Satoshi Nakamoto"
                className="blended-field"
                maxLength={25}
              />
            </div>

            <div className="blended-input-group" style={{ marginTop: "0.4rem" }}>
              <label className="blended-input-label">STACK / ROLE</label>
              <input
                type="text"
                name="stackRole"
                value={formData.stackRole}
                onChange={handleInputChange}
                placeholder="e.g. Full-Stack / Rust"
                className="blended-field"
                maxLength={30}
              />
            </div>
          </div>
        </div>

        {/* ── FRAME 2 (Bottom Left - Pink Board): AVATAR PHOTO ── */}
        <div className="hanging-frame frame-bottom-left">
          <div>
            <div className="frame-title">
              <span>2. AVATAR PHOTO</span>
              <Camera size={16} />
            </div>

            <UploadPhoto
              photoUrl={photoUrl}
              onPhotoSelect={setPhotoUrl}
              photoOffset={photoOffset}
              onOffsetChange={setPhotoOffset}
              hideLabel={true}
            />
          </div>
        </div>

        {/* ── CENTER LIVE CARD PREVIEW (Clean centered card without black laptop frame) ── */}
        <div className="center-card-stage">
          <HHGoaCard
            ref={cardRef}
            data={cardData}
            photoOffset={photoOffset}
            onPhotoDrag={(newOffset) => setPhotoOffset(newOffset)}
          />
        </div>

        {/* ── FRAME 3 (Top Right - Pink Board): BUILDER CLASS & STACK ── */}
        <div className="hanging-frame frame-top-right">
          <div>
            <div className="frame-title">
              <span>3. BUILDER CLASS</span>
              <button
                type="button"
                onClick={handleRerollClass}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
                title="Reroll class attributes"
              >
                <RefreshCw size={14} />
                <span>REROLL</span>
              </button>
            </div>

            <div style={{ margin: "0.3rem 0" }}>
              <span
                style={{
                  display: "inline-block",
                  background: "#FEE101",
                  color: "#000",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  fontFamily: "'Space Mono', monospace",
                  marginBottom: "0.5rem",
                }}
              >
                {randomAttrs.builderClass}
              </span>
            </div>

            <div className="blended-input-label" style={{ opacity: 0.9 }}>
              BEACH BAG PERKS:
            </div>
            <div className="perks-list">
              {randomAttrs.beachBag.map((perk, i) => (
                <span key={i} className="perk-chip">
                  {perk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── FRAME 4 (Bottom Right - Yellow Board): EXPORT & SHARE ── */}
        <div className="hanging-frame frame-bottom-right">
          <div>
            <div className="frame-title">
              <span>4. SHIP & SHARE</span>
              <Sparkles size={16} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              <DownloadButton
                cardRef={cardRef}
                fileName={`HH-Goa-Pass-${formData.name ? formData.name.replace(/\s+/g, "-") : "Builder"}.png`}
              />

              <ShareButton
                cardRef={cardRef}
                builderName={formData.name || "Builder"}
                builderId={randomAttrs.builderId}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
