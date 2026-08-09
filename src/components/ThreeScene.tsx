'use client';

import React, { useEffect, useRef } from 'react';

export default function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating 3D particles & sun glow mesh
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      vy: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Ambient 3D Radial Sun Glow in upper corner
      const sunGradient = ctx.createRadialGradient(
        width * 0.8,
        height * 0.2,
        20,
        width * 0.8,
        height * 0.2,
        width * 0.4
      );
      sunGradient.addColorStop(0, 'rgba(254, 232, 0, 0.12)');
      sunGradient.addColorStop(0.5, 'rgba(255, 42, 133, 0.05)');
      sunGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw floating particles
      particles.forEach((p) => {
        p.y -= p.vy;
        p.pulse += 0.03;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.15;
        ctx.fillStyle = `rgba(254, 232, 0, ${Math.max(0.05, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
