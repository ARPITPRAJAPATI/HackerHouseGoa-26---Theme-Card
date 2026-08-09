import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCode = ({ value, size = 120 }) => {
  if (!value) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={"#FFF8EB"}
        fgColor={"#063725"}
        level={"M"}
        includeMargin={false}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

export default QRCode;
