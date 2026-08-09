import React, { useState } from "react";
import { exportCardToPng } from "../utils/exportUtils";
import "../styles/Buttons.css";

const ShareButton = ({ cardRef, builderName = "Builder", builderId = "#HH-GOA-2026" }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShareToX = async () => {
    const nameStr = builderName ? builderName.trim() : "Builder";
    const idStr = builderId ? builderId.trim() : "#HH-GOA-2026";
    const cleanId = idStr.replace(/[^a-zA-Z0-9-]/g, "");

    const tweetText = `🌴 Built my Hacker Goa House Builder Card!\n\n👤 ${nameStr}\n🪪 Builder ID: ${idStr}\n\nExcited to build, ship, and connect with amazing builders in Goa. 🚀\n\nCreate your own Builder Card:\nhttps://hhgoa-own-id-card.vercel.app\n\n#FrameInGoa #HHGoa2026`;
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    // ✅ Open X SYNCHRONOUSLY during the user-gesture frame.
    // Any `await` before window.open() causes browsers to detach the popup
    // permission, resulting in the blank tab that never navigates.
    window.open(twitterIntentUrl, "_blank", "noopener,noreferrer");

    // Show guidance modal right away
    setShowShareModal(true);

    // Download the card image independently (async, after popup is safely open)
    try {
      setIsSharing(true);
      if (cardRef && cardRef.current) {
        const downloadFileName = `HH-Goa-Builder-Card-${cleanId || "Pass"}.png`;
        await exportCardToPng(cardRef.current, downloadFileName);
      }
    } catch (err) {
      console.error("Error exporting card:", err);
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
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>{isSharing ? "Preparing X Post..." : "Share to X"}</span>
      </button>

      {/* ── Lightweight Guidance Modal Overlay ── */}
      {showShareModal && (
        <div className="share-modal-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-status-badges">
              <span className="modal-badge-success">✅ X Post Opened</span>
              <span className="modal-badge-success">📸 Builder Card Downloaded</span>
            </div>

            <h3 className="share-modal-title">Attach Image to Your X Post</h3>

            <div className="share-modal-instruction">
              <div className="paperclip-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>
              <p className="instruction-text">
                Your high-resolution Builder Card has been downloaded. Attach the downloaded image to your X post before hitting <strong>Publish</strong>!
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
        </div>
      )}
    </>
  );
};

export default ShareButton;
