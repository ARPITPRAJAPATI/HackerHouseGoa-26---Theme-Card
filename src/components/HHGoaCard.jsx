import React, { useRef, useState } from "react";
import QRCode from "./QRCode";
import "../styles/HHGoaCard.css";

/**
 * Compute an inline font-size for a text that must not overflow a container.
 */
function scaledFontSize(str, maxChars, maxCqi, minCqi) {
  const len = (str || "").length;
  const ratio = Math.min(1, maxChars / Math.max(len, 1));
  const cqi = Math.max(minCqi, maxCqi * ratio);
  return `clamp(${minCqi}px, ${cqi.toFixed(2)}cqi, ${(maxCqi * 6).toFixed(0)}px)`;
}

const HHGoaCard = React.forwardRef(({ cardRef, data, photoOffset, onPhotoDrag }, ref) => {
  const localRef = useRef(null);
  const targetRef = ref || cardRef || localRef;
  const [isDragging, setIsDragging] = useState(false);
  const [templateDataUrl, setTemplateDataUrl] = useState("/idCardTemplate.png");
  
  // 3D Holographic Foil Tilt & Mouse Gyroscope Tracking State
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glossX: 50, glossY: 50, active: false });

  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialOffsetRef = useRef({ x: 0, y: 0, zoom: 1 });

  React.useEffect(() => {
    fetch("/idCardTemplate.png")
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) setTemplateDataUrl(reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {});
  }, []);

  const {
    name = "",
    stackRole = "",
    photoUrl = null,
    builderClass = "",
    stickerUrl = "/stickers/terminal-surfer.png",
    beachBag = ["☕ Coffee", "💻 VS Code", "🎧 Lo-Fi Beats"],
    currentlyShipping = "",
    builderId = ""
  } = data || {};

  // ── Drag handlers for photo positioning ──
  const startDrag = (clientX, clientY) => {
    if (!photoUrl) return;
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    initialOffsetRef.current = { ...(photoOffset || { x: 0, y: 0, zoom: 1 }) };
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    onPhotoDrag?.({
      ...initialOffsetRef.current,
      x: initialOffsetRef.current.x + dx,
      y: initialOffsetRef.current.y + dy,
    });
  };

  const endDrag = () => setIsDragging(false);

  const cardRafRef = useRef(null);

  // ── 3D Card Gyroscope & Holographic Reflection Handler ──
  const handleCardMouseMove = (e) => {
    if (isDragging) {
      moveDrag(e.clientX, e.clientY);
      return;
    }

    const container = targetRef?.current || e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width;
    const py = y / rect.height;

    // Rotate range: -12deg to +12deg
    const ry = (px - 0.5) * 20;
    const rx = (0.5 - py) * 20;
    const glossX = Math.round(px * 100);
    const glossY = Math.round(py * 100);

    if (cardRafRef.current) cancelAnimationFrame(cardRafRef.current);
    cardRafRef.current = requestAnimationFrame(() => {
      setTilt({
        rx,
        ry,
        glossX,
        glossY,
        active: true,
      });
    });
  };

  const handleCardMouseLeave = () => {
    if (cardRafRef.current) cancelAnimationFrame(cardRafRef.current);
    setTilt((prev) => ({ ...prev, rx: 0, ry: 0, active: false }));
    endDrag();
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const zoom = photoOffset?.zoom ?? 1;
  const offsetX = photoOffset?.x ?? 0;
  const offsetY = photoOffset?.y ?? 0;

  const nameFontSize = scaledFontSize(name, 14, 4.2, 1.6);
  const roleFontSize = scaledFontSize(stackRole, 14, 3.4, 1.9);

  return (
    <div className="hh-card-wrapper-3d">
      <div
        ref={targetRef}
        className={`hh-card-container ${tilt.active ? "hologram-active" : ""}`}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        onMouseUp={endDrag}
        onTouchMove={(e) => e.touches.length === 1 && moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={endDrag}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {/* ── Holographic Foil Shimmer Overlay ── */}
        <div
          className="hh-holographic-foil"
          style={{
            background: `radial-gradient(circle at ${tilt.glossX}% ${tilt.glossY}%, rgba(255, 232, 0, 0.45) 0%, rgba(255, 42, 133, 0.3) 35%, rgba(0, 240, 255, 0.25) 70%, transparent 90%)`,
            opacity: tilt.active ? 0.85 : 0,
          }}
        />

        {/* ── Template Background ── */}
        <img
          src={templateDataUrl || "/idCardTemplate.png"}
          alt="Template background"
          className="hh-card-background"
          crossOrigin="anonymous"
          draggable={false}
        />

        {/* ── Photo ── */}
        <div
          className={`hh-photo-frame${isDragging ? " dragging" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
          onTouchStart={handleTouchStart}
          title={photoUrl ? "Drag to reposition" : "Upload a photo"}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name || "Builder photo"}
              className="hh-photo-img"
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom * 1.05})`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              draggable={false}
            />
          ) : (
            <div className="hh-photo-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Upload Photo</span>
            </div>
          )}
        </div>

        {/* ── Name Banner ── */}
        <div className="hh-name-overlay">
          <span className="hh-name-text" style={{ fontSize: nameFontSize }}>
            {name || ""}
          </span>
        </div>

        {/* ── Stack / Role Badge ── */}
        <div className="hh-role-overlay">
          <span className="hh-role-text" style={{ fontSize: roleFontSize }}>
            {stackRole || ""}
          </span>
        </div>

        {/* ── Builder ID ── */}
        <div className="hh-builder-id-overlay">
          <span className="hh-id-text">{builderId || "#HH-GOA-2026"}</span>
        </div>

        {/* VIP Hologram Watermark Badge */}
        <div className="hh-vip-hologram-badge">
          <span>VIP ACCESS · 2:47PM STUDIO</span>
        </div>
      </div>
    </div>
  );
});

export default HHGoaCard;
