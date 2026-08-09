import React, { useState } from "react";
import ReactDOM from "react-dom";
import { exportCardToPng } from "../utils/exportUtils";
import "../styles/Buttons.css";

const ShareButton = ({ cardRef, builderName = "Builder", builderId = "#HH-GOA-2026" }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShareToX = async () => {
    setIsSharing(true);
    setIsCopied(false);
    const nameStr = builderName ? builderName.trim() : "Builder";
    const idStr = builderId ? builderId.trim() : "#HH-GOA-2026";
    const cleanId = idStr.replace(/[^a-zA-Z0-9-]/g, "");

    // ⚡ Optimized caption strictly under X's 280-char free limit
    const tweetText = `🌴 Goa calling, builders answering!\n\nJust minted my Hacker House Builder Card ⚡\n👤 ${nameStr}\n🪪 ${idStr}\n\nReady to build & vibe in Goa! 🚀\n\n🎟️ Create yours → https://hacker-house-goa-26-theme-card.vercel.app\n\n#FrameInGoa #HHGoa2026 #BuildInPublic`;

    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    // 1. Open X intent synchronously in new tab
    window.open(twitterIntentUrl, "_blank", "noopener,noreferrer");
    setShowShareModal(true);

    // 2. Download high-res PNG card image AND copy PNG blob to Clipboard
    try {
      if (cardRef && cardRef.current) {
        const downloadFileName = `HH-Goa-Builder-Card-${cleanId || "Pass"}.png`;

        // Create a promise for the image Blob
        const blobPromise = new Promise(async (resolve, reject) => {
          try {
            const dataUrl = await exportCardToPng(cardRef.current, downloadFileName);
            if (!dataUrl) {
              reject(new Error("Card PNG export returned null"));
              return;
            }
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            resolve(blob);
          } catch (err) {
            reject(err);
          }
        });

        // ⚡ Synchronously initiate navigator.clipboard.write with ClipboardItem Promise
        // This preserves Chrome user activation context so Ctrl+V image paste works 100%!
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            const clipboardItem = new ClipboardItem({ "image/png": blobPromise });
            await navigator.clipboard.write([clipboardItem]);
            setIsCopied(true);
          } catch (clipErr) {
            console.warn("Direct ClipboardItem Promise write error:", clipErr);
            try {
              const blob = await blobPromise;
              const fallbackItem = new ClipboardItem({ [blob.type || "image/png"]: blob });
              await navigator.clipboard.write([fallbackItem]);
              setIsCopied(true);
            } catch (fbErr) {
              console.warn("Clipboard fallback error:", fbErr);
            }
          }
        } else {
          await blobPromise;
        }
      }
    } catch (err) {
      console.error("Error exporting card for share:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <button
        onClick={handleShareToX}
        disabled={isSharing}
        className="btn-secondary-outline"
        style={{
          color: "#FEE101",
          borderColor: "#FEE101",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span style={{ color: "#FEE101" }}>{isSharing ? "Preparing X Post..." : "Share to X"}</span>
      </button>

      {/* ── Lightweight Guidance Modal Overlay via Portal ── */}
      {showShareModal && ReactDOM.createPortal(
        <div className="share-modal-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-status-badges">
              <span className="modal-badge-success">✅ X Post Opened</span>
              {isCopied && <span className="modal-badge-success">📋 Card Copied to Clipboard</span>}
              <span className="modal-badge-success">📸 Saved to Downloads</span>
            </div>

            <h3 className="share-modal-title">Attach Your Builder Card</h3>

            <div className="share-modal-instruction">
              <div className="paperclip-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>
              <p className="instruction-text">
                Press <strong>Ctrl + V</strong> (or Paste) in the X post box to instantly attach your copied Builder Card, or pick it from your Downloads!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="btn-modal-got-it"
            >
              Got it
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ShareButton;
