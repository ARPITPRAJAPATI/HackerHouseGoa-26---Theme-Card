import React, { useState, useEffect, useRef } from "react";

export default function SeamlessVideoBackground({ src, blurAmount = "6px", overlayColor = "rgba(1, 31, 15, 0.45)" }) {
  const videoRefA = useRef(null);
  const videoRefB = useRef(null);
  const [opacityA, setOpacityA] = useState(1);
  const [opacityB, setOpacityB] = useState(0);
  const activeRef = useRef("A");

  useEffect(() => {
    let animId;
    const CROSSFADE_DURATION = 1.2; // 1.2s smooth blend window

    const checkTime = () => {
      const vA = videoRefA.current;
      const vB = videoRefB.current;

      if (vA && vB && vA.duration && vB.duration) {
        if (activeRef.current === "A") {
          const timeLeftA = vA.duration - vA.currentTime;
          if (timeLeftA <= CROSSFADE_DURATION) {
            if (vB.paused) {
              vB.currentTime = 0;
              vB.play().catch(() => {});
            }
            const progress = Math.min(1, Math.max(0, 1 - timeLeftA / CROSSFADE_DURATION));
            setOpacityA(1 - progress);
            setOpacityB(progress);

            if (timeLeftA <= 0.08) {
              activeRef.current = "B";
              vA.pause();
              setOpacityA(0);
              setOpacityB(1);
            }
          } else {
            setOpacityA(1);
            setOpacityB(0);
          }
        } else if (activeRef.current === "B") {
          const timeLeftB = vB.duration - vB.currentTime;
          if (timeLeftB <= CROSSFADE_DURATION) {
            if (vA.paused) {
              vA.currentTime = 0;
              vA.play().catch(() => {});
            }
            const progress = Math.min(1, Math.max(0, 1 - timeLeftB / CROSSFADE_DURATION));
            setOpacityB(1 - progress);
            setOpacityA(progress);

            if (timeLeftB <= 0.08) {
              activeRef.current = "A";
              vB.pause();
              setOpacityB(0);
              setOpacityA(1);
            }
          } else {
            setOpacityB(1);
            setOpacityA(0);
          }
        }
      }
      animId = requestAnimationFrame(checkTime);
    };

    animId = requestAnimationFrame(checkTime);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="lp-video-bg-wrap">
      <video
        ref={videoRefA}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="lp-video-bg"
        style={{
          opacity: opacityA,
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `blur(${blurAmount})`,
          transform: "scale(1.05) translateZ(0)",
          willChange: "opacity, transform",
        }}
      />
      <video
        ref={videoRefB}
        src={src}
        muted
        playsInline
        preload="auto"
        className="lp-video-bg"
        style={{
          opacity: opacityB,
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `blur(${blurAmount})`,
          transform: "scale(1.05) translateZ(0)",
          willChange: "opacity, transform",
        }}
      />
      <div className="lp-video-overlay" style={{ background: overlayColor }} />
    </div>
  );
}
