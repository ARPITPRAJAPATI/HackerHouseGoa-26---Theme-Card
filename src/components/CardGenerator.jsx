import React, { useRef, useState, useEffect } from "react";
import UserForm from "./UserForm";
import HHGoaCard from "./HHGoaCard";
import DownloadButton from "./DownloadButton";
import ShareButton from "./ShareButton";
import { generateRandomAttributes } from "../utils/randomGenerator";
import "../styles/CardGenerator.css";

const LOADING_MESSAGES = [
  "Preparing your Builder Pass...",
  "Packing your beach bag...",
  "Stamping your Builder ID...",
  "Generating your QR code...",
  "Finalizing your pass..."
];

const CardGenerator = () => {
  const cardRef = useRef(null);

  // 2-Step Flow State: "form" | "loading" | "card"
  const [step, setStep] = useState("form");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    stackRole: ""
  });

  // Validation Error State
  const [formError, setFormError] = useState("");

  // Photo State & Offset
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoOffset, setPhotoOffset] = useState({ x: 0, y: 0, zoom: 1 });

  // HH Goa Random Attributes
  const [randomAttrs, setRandomAttrs] = useState({
    builderClass: "Prototype Pirate",
    beachBag: ["☕ Coffee", "💻 VS Code", "🎧 Lo-Fi Beats"],
    currentlyShipping: "Building the Future",
    builderId: "#HH-GOA-2026"
  });

  // Loading message index
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Generate initial random attributes on mount
  useEffect(() => {
    setRandomAttrs(generateRandomAttributes());
  }, []);

  // Handle form submission -> transition to loading -> step 2
  const handleGeneratePass = (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Please enter your full name");
      return;
    }
    if (!formData.stackRole.trim()) {
      setFormError("Please enter your stack / role");
      return;
    }

    setFormError("");
    setStep("loading");
    setLoadingMsgIdx(0);

    const msgInterval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 200);

    setTimeout(() => {
      clearInterval(msgInterval);
      setStep("card");
    }, 850);
  };

  // Reset all data and return to Step 1
  const handleGenerateAnother = () => {
    setFormData({ name: "", stackRole: "" });
    setPhotoUrl(null);
    setPhotoOffset({ x: 0, y: 0, zoom: 1 });
    setFormError("");
    setRandomAttrs(generateRandomAttributes());
    setStep("form");
  };

  const cardData = {
    name: formData.name,
    stackRole: formData.stackRole,
    photoUrl: photoUrl,
    builderClass: randomAttrs.builderClass,
    stickerUrl: randomAttrs.stickerUrl,
    beachBag: randomAttrs.beachBag,
    currentlyShipping: randomAttrs.currentlyShipping,
    builderId: randomAttrs.builderId
  };

  return (
    <div className="generator-container">
      {/* ── STEP 1: Builder Details (Landing Page) ── */}
      {step === "form" && (
        <div className="step-container step-form-view">
          <div className="hero-header">
            <h1 className="hero-title">Hacker Goa House Builder Pass</h1>
            <p className="hero-subtitle">
              Personalize & generate your official builder pass for Hacker House Goa 2026
            </p>

            {/* Playful Feature Chips */}
            <div className="hero-chips-row">
              <span className="hero-chip">📸 Upload Photo</span>
              <span className="hero-chip">⚡ Auto Builder</span>
              <span className="hero-chip">🚀 Share Pass</span>
            </div>
          </div>

          <UserForm
            formData={formData}
            onFormChange={(data) => {
              setFormData(data);
              if (formError) setFormError("");
            }}
            photoUrl={photoUrl}
            onPhotoSelect={setPhotoUrl}
            photoOffset={photoOffset}
            onOffsetChange={setPhotoOffset}
            onSubmit={handleGeneratePass}
            formError={formError}
          />
        </div>
      )}

      {/* ── LOADING STATE: Clean Progress Bar ── */}
      {step === "loading" && (
        <div className="step-container step-loading-view">
          <div className="loading-card">
            <h3 className="loading-title">Generating Your Pass</h3>
            <p className="loading-message">{LOADING_MESSAGES[loadingMsgIdx]}</p>

            <div className="loading-progress-track">
              <div className="loading-progress-fill" />
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Generated Pass View ── */}
      {step === "card" && (
        <div className="step-container step-card-view">
          <div className="success-badge-row">
            <span className="success-badge">✓ Your Builder Pass is Ready</span>
          </div>

          <div className="pass-card-frame">
            <HHGoaCard
              ref={cardRef}
              data={cardData}
              photoOffset={photoOffset}
              onOffsetChange={setPhotoOffset}
            />
          </div>

          {/* Action Buttons Row */}
          <div className="pass-actions-row">
            <DownloadButton
              cardRef={cardRef}
              fileName={`HH-Goa-Pass-${formData.name ? formData.name.replace(/\s+/g, "-") : "Builder"}.png`}
            />

            <ShareButton
              cardRef={cardRef}
              builderName={formData.name || "Builder"}
              builderId={randomAttrs.builderId}
            />

            <button
              type="button"
              onClick={handleGenerateAnother}
              className="btn-secondary-outline"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Generate Another Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGenerator;
