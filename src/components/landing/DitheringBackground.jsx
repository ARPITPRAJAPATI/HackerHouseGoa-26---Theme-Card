import React, { memo } from "react";
import { Dithering } from "@paper-design/shaders-react";
import "./landing.css";

const MemoizedDithering = memo(Dithering);

export function DitheringBackground({
  colorBack = "#02683400",
  colorFront = "#FEE101",
  backgroundColor = "#026834",
  speed = 0.25,
  shape = "wave",
  type = "4x4",
  pxSize = 5,
  scale = 1.0,
}) {
  return (
    <div className="lp-bg" style={{ backgroundColor }}>
      <MemoizedDithering
        colorBack={colorBack}
        colorFront={colorFront}
        speed={speed}
        shape={shape}
        type={type}
        pxSize={pxSize}
        scale={scale}
        style={{
          backgroundColor,
          height: "100%",
          width: "100%",
          opacity: 0.65,
        }}
      />
    </div>
  );
}
