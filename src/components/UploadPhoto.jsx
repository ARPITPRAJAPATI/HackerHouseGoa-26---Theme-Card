import React, { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { readImageAsDataUrl } from "../utils/imageUtils";
import "../styles/UploadPhoto.css";

const UploadPhoto = ({ photoUrl, onPhotoSelect, photoOffset, onOffsetChange, hideLabel = false }) => {
  const fileInputRef = useRef(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialOffsetRef = useRef({ x: 0, y: 0 });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const dataUrl = await readImageAsDataUrl(file);
        onPhotoSelect(dataUrl);
      } catch (err) {
        console.error("Error reading image:", err);
      }
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      try {
        const dataUrl = await readImageAsDataUrl(e.dataTransfer.files[0]);
        onPhotoSelect(dataUrl);
      } catch (err) {
        console.error("Error reading dropped image:", err);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleZoomChange = (e) => {
    const zoomVal = parseFloat(e.target.value);
    onOffsetChange({
      ...photoOffset,
      zoom: zoomVal
    });
  };

  const handleResetPosition = (e) => {
    e.stopPropagation();
    onOffsetChange({ x: 0, y: 0, zoom: 1 });
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    onPhotoSelect(null);
    onOffsetChange({ x: 0, y: 0, zoom: 1 });
  };

  // Live Crop Preview Dragging handlers
  const startCropDrag = (clientX, clientY) => {
    setIsDraggingPhoto(true);
    dragStartRef.current = { x: clientX, y: clientY };
    initialOffsetRef.current = { x: photoOffset.x || 0, y: photoOffset.y || 0 };
  };

  const moveCropDrag = (clientX, clientY) => {
    if (!isDraggingPhoto) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    onOffsetChange({
      ...photoOffset,
      x: initialOffsetRef.current.x + dx,
      y: initialOffsetRef.current.y + dy
    });
  };

  const endCropDrag = () => setIsDraggingPhoto(false);

  return (
    <div className="upload-photo-container">
      {!hideLabel && (
        <label className="form-label">
          Builder Photo
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {!photoUrl ? (
        /* ── IDLE / DROPZONE STATE ── */
        <div
          className="photo-dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          tabIndex={0}
          role="button"
          aria-label="Upload builder photo"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <div className="dropzone-prompt">
            <div className="upload-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="upload-text-group">
              <p className="upload-title">Drop your photo here or click to browse</p>
              <p className="upload-subtitle">JPG, PNG, WEBP or HEIC • Max 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        /* ── PHOTO UPLOADED: LIVE CROP PREVIEW & CONTROLS ── */
        <div className="crop-preview-card">
          <div className="crop-preview-header">
            <span className="crop-preview-badge">✓ Photo Added</span>
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="remove-photo-btn"
              title="Remove photo"
            >
              Remove
            </button>
          </div>

          <div className="crop-preview-body">
            {/* Circular Live Crop Preview */}
            <div
              className={`crop-preview-circle ${isDraggingPhoto ? "is-dragging" : ""}`}
              onMouseDown={(e) => { e.preventDefault(); startCropDrag(e.clientX, e.clientY); }}
              onMouseMove={(e) => moveCropDrag(e.clientX, e.clientY)}
              onMouseUp={endCropDrag}
              onMouseLeave={endCropDrag}
              onTouchStart={(e) => {
                if (e.touches.length === 1) startCropDrag(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 1) moveCropDrag(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={endCropDrag}
              title="Drag photo inside this circle to align your face"
            >
              <img
                src={photoUrl}
                alt="Live pass preview crop"
                style={{
                  transform: `translate(${photoOffset.x || 0}px, ${photoOffset.y || 0}px) scale(${(photoOffset.zoom || 1) * 1.05})`,
                  transformOrigin: "center center",
                  userSelect: "none",
                  pointerEvents: "none"
                }}
              />
              <div className="crop-overlay-hint">Drag</div>
            </div>

            {/* Controls Side */}
            <div className="crop-controls-group">
              <div className="zoom-slider-row">
                <span className="control-label">Zoom</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={photoOffset.zoom || 1}
                  onChange={handleZoomChange}
                  className="zoom-slider"
                  aria-label="Photo zoom level"
                />
                <button
                  type="button"
                  onClick={handleResetPosition}
                  className="reset-pos-btn"
                  title="Reset photo position & zoom"
                  aria-label="Reset photo position & zoom"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="change-photo-btn"
              >
                Change Photo
              </button>

              <p className="crop-helper-text">
                💡 Drag inside the circle to position your photo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPhoto;
