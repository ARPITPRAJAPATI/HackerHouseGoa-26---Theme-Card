'use client';

import React, { useEffect, useRef, useState } from 'react';
import { renderFrame, RenderParams } from '@/lib/canvasRenderer';

type Props = {
  params: RenderParams;
  activeSlotIndex: number;
  onSlotChange: (index: number, patch: Partial<{ offsetX: number; offsetY: number; zoom: number }>) => void;
  previewSize?: number;
};

export default function InteractiveCanvasPreview({
  params,
  activeSlotIndex,
  onSlotChange,
  previewSize = 520,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragging = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const pinchDist = useRef<number | null>(null);

  // 3D Perspective Tilt & Holographic Foil Glare State
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glossX: 50, glossY: 50, active: false });

  useEffect(() => {
    if (canvasRef.current) {
      renderFrame(canvasRef.current, { ...params, size: previewSize });
    }
  }, [params, previewSize]);

  const activeSlot = params.slots[activeSlotIndex];

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  // ── Gyroscope 3D Tilt Mouse Tracker ──
  function handleMouseMove(e: React.MouseEvent) {
    if (dragging.current) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width;
    const py = y / rect.height;

    const ry = (px - 0.5) * 20;
    const rx = (0.5 - py) * 20;

    setTilt({
      rx,
      ry,
      glossX: Math.round(px * 100),
      glossY: Math.round(py * 100),
      active: true,
    });
  }

  function handleMouseLeave() {
    setTilt((prev) => ({ ...prev, rx: 0, ry: 0, active: false }));
    dragging.current = false;
  }

  // ── Drag & Pan Handlers ──
  function handlePointerDown(e: React.PointerEvent) {
    if (!activeSlot) return;
    dragging.current = true;
    lastPoint.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current || !activeSlot) return;
    const dx = e.clientX - lastPoint.current.x;
    const dy = e.clientY - lastPoint.current.y;
    lastPoint.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 2.4 / previewSize;
    onSlotChange(activeSlotIndex, {
      offsetX: clamp(activeSlot.offsetX - dx * sensitivity, -1, 1),
      offsetY: clamp(activeSlot.offsetY - dy * sensitivity, -1, 1),
    });
  }

  function handlePointerUp(e: React.PointerEvent) {
    dragging.current = false;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
  }

  function handleWheel(e: React.WheelEvent) {
    if (!activeSlot) return;
    e.preventDefault();
    const next = clamp(activeSlot.zoom - e.deltaY * 0.0015, 1, 3);
    onSlotChange(activeSlotIndex, { zoom: next });
  }

  function touchDistance(touches: React.TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      pinchDist.current = touchDistance(e.touches);
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchDist.current && activeSlot) {
      e.preventDefault();
      const dist = touchDistance(e.touches);
      const ratio = dist / pinchDist.current;
      pinchDist.current = dist;
      const next = clamp(activeSlot.zoom * ratio, 1, 3);
      onSlotChange(activeSlotIndex, { zoom: next });
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) pinchDist.current = null;
  }

  return (
    <div
      ref={containerRef}
      className="card-wrapper-3d relative w-full flex justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="card-container-3d relative w-full max-w-[520px]"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: dragging.current ? 'none' : 'transform 0.12s ease-out',
        }}
      >
        {/* Holographic Reflection Foil Glare Layer */}
        <div
          className="holographic-glare"
          style={{
            background: `radial-gradient(circle at ${tilt.glossX}% ${tilt.glossY}%, rgba(254, 232, 0, 0.4) 0%, rgba(255, 42, 133, 0.3) 40%, rgba(0, 240, 255, 0.2) 75%, transparent 95%)`,
            opacity: tilt.active ? 0.9 : 0,
          }}
        />

        <canvas
          ref={canvasRef}
          width={previewSize}
          height={previewSize}
          className="w-full h-auto block touch-none cursor-grab active:cursor-grabbing rounded-xl"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* 3D VIP Pass Holographic Ribbon Tag */}
        <div className="absolute bottom-3 right-3 z-30 bg-black/80 border-2 border-[#FEE800] px-3 py-1 rounded-md text-[10px] font-mono font-bold text-[#FEE800] tracking-widest uppercase shadow-[2px_2px_0px_#000]">
          VIP ACCESS · 2:47PM STUDIO
        </div>
      </div>
    </div>
  );
}
