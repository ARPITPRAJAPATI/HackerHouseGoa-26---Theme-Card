import React, { useState } from "react";
import { exportCardToPng } from "../utils/exportUtils";
import "../styles/Buttons.css";

const DownloadButton = ({ cardRef, fileName = "HH-Goa-Builder-Pass.png" }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!cardRef || !cardRef.current) return;
    try {
      setIsExporting(true);
      await exportCardToPng(cardRef.current, fileName);
    } catch (error) {
      console.error("Error exporting card:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isExporting}
      className="btn-primary-action"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span>{isExporting ? "Exporting Pass..." : "Download Pass"}</span>
    </button>
  );
};

export default DownloadButton;
