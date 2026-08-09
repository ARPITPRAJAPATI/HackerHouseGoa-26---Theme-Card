// Core 2D canvas compositing engine for the HH Goa 2026 frame.
// Renders entirely on <canvas> — no WebGL, no external image assets required.
// Used for live interactive preview and high-res 1200x1200px PNG export.

export type PhotoSlot = {
  image: HTMLImageElement;
  offsetX: number; // -1..1, fraction of pannable range horizontally
  offsetY: number; // -1..1, fraction of pannable range vertically
  zoom: number; // 1 = fills circle, >1 = zoomed in
} | null;

export type RenderParams = {
  size: number;
  slots: PhotoSlot[]; // 1, 2, or 3 entries
  name: string;
  stack: string;
  builderTitle: string;
  badgeId: string; // e.g. "HHG-2026-4471"
  selectedSticker?: string;
};

const COLORS = {
  bgGreen: "#036437",
  bgDark: "#002413",
  yellow: "#FEE800",
  pink: "#FF2A85",
  sand: "#FFFFFF",
  line: "rgba(254, 232, 0, 0.35)",
};

function noise1D(theta: number): number {
  return (
    (Math.sin(theta * 7.3) +
      Math.sin(theta * 13.1 + 1.7) +
      Math.sin(theta * 3.7 + 4.2)) /
    3
  );
}

const DEG = Math.PI / 180;

function tideRadius(theta: number, baseRadius: number): number {
  const norm = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

  const near = (target: number, windowVal: number) => {
    const d = Math.min(
      Math.abs(norm - target),
      Math.abs(norm - target + Math.PI * 2),
      Math.abs(norm - target - Math.PI * 2)
    );
    return d < windowVal;
  };

  const win = 12 * DEG;

  if (near(Math.PI, win)) return baseRadius; // 9 o'clock: smooth arc
  if (near(-Math.PI / 2, win)) return baseRadius + 1; // 12 o'clock: notch

  if (near(Math.PI / 2, win)) {
    // 6 o'clock: coastline wave
    const wave = Math.sin(norm * 3) * 4;
    const noiseVal = noise1D(norm) * 5;
    return baseRadius + wave + noiseVal;
  }

  const wave = Math.sin(norm * 3) * 4;
  const noiseVal = noise1D(norm) * 2;
  return baseRadius + wave + noiseVal;
}

function buildTidePath(cx: number, cy: number, baseRadius: number): Path2D {
  const path = new Path2D();
  const steps = 240;
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const r = tideRadius(theta, baseRadius);
    const x = cx + Math.cos(theta) * r;
    const y = cy + Math.sin(theta) * r;
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  }
  path.closePath();
  return path;
}

function drawCircuitAccents(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseRadius: number
) {
  ctx.save();

  // 12 o'clock: circuit notch
  const topAngle = -Math.PI / 2;
  const notchHalf = 10 * DEG;
  const p1 = {
    x: cx + Math.cos(topAngle - notchHalf) * (baseRadius + 1),
    y: cy + Math.sin(topAngle - notchHalf) * (baseRadius + 1),
  };
  const p2 = {
    x: cx + Math.cos(topAngle + notchHalf) * (baseRadius + 1),
    y: cy + Math.sin(topAngle + notchHalf) * (baseRadius + 1),
  };
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();

  // 3 o'clock: pink branch line
  const rightAngle = 0;
  const rStart = tideRadius(rightAngle, baseRadius);
  const start = {
    x: cx + Math.cos(rightAngle) * rStart,
    y: cy + Math.sin(rightAngle) * rStart,
  };
  const end = {
    x: cx + Math.cos(rightAngle) * (rStart - 26),
    y: cy + Math.sin(rightAngle) * (rStart - 26),
  };
  ctx.strokeStyle = COLORS.pink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.fillStyle = COLORS.pink;
  ctx.beginPath();
  ctx.arc(end.x, end.y, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 6 o'clock: dot matrix
  const bottomAngle = Math.PI / 2;
  ctx.fillStyle = COLORS.yellow;
  ctx.globalAlpha = 0.75;
  for (let i = -3; i <= 3; i++) {
    const a = bottomAngle + i * 4 * DEG;
    const r = tideRadius(a, baseRadius) + Math.abs(i) * 3;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawPhoto(
  ctx: CanvasRenderingContext2D,
  slot: PhotoSlot,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (!slot || !slot.image) {
    // Default cyber-builder vector silhouette placeholder
    ctx.fillStyle = "#00180C";
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    // Glowing sun disc behind silhouette
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    glow.addColorStop(0, "rgba(254, 232, 0, 0.4)");
    glow.addColorStop(1, "rgba(0, 36, 19, 0.9)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    // Head circle
    ctx.fillStyle = COLORS.yellow;
    ctx.beginPath();
    ctx.arc(cx, cy - radius * 0.15, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Hot pink visor bar
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(cx - radius * 0.28, cy - radius * 0.22, radius * 0.56, radius * 0.12);

    // Shoulder curve
    ctx.fillStyle = COLORS.yellow;
    ctx.beginPath();
    ctx.ellipse(cx, cy + radius * 0.7, radius * 0.65, radius * 0.45, 0, Math.PI, 0);
    ctx.fill();

    ctx.restore();
    return;
  }

  const { image, offsetX, offsetY, zoom } = slot;
  const diameter = radius * 2;
  const imgAspect = image.width / image.height;
  let drawW: number, drawH: number;
  if (imgAspect > 1) {
    drawH = diameter * zoom;
    drawW = drawH * imgAspect;
  } else {
    drawW = diameter * zoom;
    drawH = drawW / imgAspect;
  }

  const maxOffsetX = Math.max(0, (drawW - diameter) / 2);
  const maxOffsetY = Math.max(0, (drawH - diameter) / 2);

  const dx = cx - drawW / 2 + offsetX * maxOffsetX;
  const dy = cy - drawH / 2 + offsetY * maxOffsetY;

  ctx.drawImage(image, dx, dy, drawW, drawH);
  ctx.restore();
}

function drawTideBorder(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  const path = buildTidePath(cx, cy, radius);
  ctx.save();
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = Math.max(4, radius * 0.025);
  ctx.lineJoin = "round";
  ctx.stroke(path);
  ctx.restore();

  drawCircuitAccents(ctx, cx, cy, radius);
}

function drawSlot(
  ctx: CanvasRenderingContext2D,
  slot: PhotoSlot,
  cx: number,
  cy: number,
  radius: number
) {
  drawPhoto(ctx, slot, cx, cy, radius - Math.max(4, radius * 0.025));
  drawTideBorder(ctx, cx, cy, radius);
}

function layoutCenters(
  size: number,
  count: number
): { cx: number; cy: number; radius: number }[] {
  const cx = size / 2;
  const cy = size * 0.44;

  if (count === 1) return [{ cx, cy, radius: size * 0.32 }];
  if (count === 2) {
    const r = size * 0.23;
    const gap = size * 0.26;
    return [
      { cx: cx - gap, cy, radius: r },
      { cx: cx + gap, cy, radius: r },
    ];
  }
  const r = size * 0.19;
  const spread = size * 0.24;
  return [
    { cx, cy: cy - spread * 0.55, radius: r },
    { cx: cx - spread, cy: cy + spread * 0.5, radius: r },
    { cx: cx + spread, cy: cy + spread * 0.5, radius: r },
  ];
}

function drawBackground(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = COLORS.bgGreen;
  ctx.fillRect(0, 0, size, size);

  // Dark card block
  ctx.fillStyle = COLORS.bgDark;
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = size * 0.008;
  const margin = size * 0.04;
  ctx.strokeRect(margin, margin, size - margin * 2, size - margin * 2);
  ctx.fillRect(margin, margin, size - margin * 2, size - margin * 2);
}

function drawTypography(
  ctx: CanvasRenderingContext2D,
  size: number,
  params: RenderParams
) {
  const cx = size / 2;

  // Header wordmark
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.yellow;
  ctx.font = `bold ${size * 0.05}px "Bodoni Moda", serif`;
  ctx.fillText("HACKER HOUSE GOA", cx, size * 0.11);

  // Tilted Hot Pink "गोवा" Badge
  ctx.save();
  ctx.translate(cx, size * 0.155);
  ctx.rotate(-0.1);
  ctx.fillStyle = COLORS.pink;
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = size * 0.004;
  const badgeW = size * 0.18;
  const badgeH = size * 0.055;
  ctx.fillRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH);
  ctx.strokeRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH);
  ctx.fillStyle = COLORS.yellow;
  ctx.font = `bold ${size * 0.035}px "Inter", sans-serif`;
  ctx.fillText("गोवा", 0, size * 0.012);
  ctx.restore();

  // Subheader bar
  ctx.fillStyle = COLORS.yellow;
  ctx.font = `bold ${size * 0.016}px "JetBrains Mono", monospace`;
  ctx.fillText("OCTOBER 28–31, 2026  ·  GOA, INDIA", cx, size * 0.205);

  // Name & Title block below photo
  const blockY = size * 0.78;
  ctx.fillStyle = COLORS.yellow;
  ctx.font = `bold ${size * 0.042}px "Bodoni Moda", serif`;
  ctx.fillText((params.name || "BUILDER").toUpperCase(), cx, blockY);

  ctx.fillStyle = COLORS.pink;
  ctx.font = `bold ${size * 0.02}px "JetBrains Mono", monospace`;
  ctx.fillText(
    (params.stack || "FULL-STACK").toUpperCase(),
    cx,
    blockY + size * 0.034
  );

  ctx.fillStyle = COLORS.yellow;
  ctx.font = `bold ${size * 0.024}px "Bodoni Moda", serif`;
  ctx.fillText(params.builderTitle, cx, blockY + size * 0.068);

  // Selected sticker badge text
  if (params.selectedSticker) {
    ctx.fillStyle = COLORS.pink;
    ctx.font = `bold ${size * 0.018}px "JetBrains Mono", monospace`;
    ctx.fillText(
      `STAMP: [ ${params.selectedSticker.toUpperCase()} ]`,
      cx,
      blockY + size * 0.105
    );
  }

  // Footer strap line
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = `bold ${size * 0.015}px "JetBrains Mono", monospace`;
  ctx.fillText("LESS NOISE  ·  MORE SIGNAL  ·  #FRAMEINGOA", cx, size * 0.945);

  // Corner ID tags
  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.yellow;
  ctx.font = `bold ${size * 0.014}px "JetBrains Mono", monospace`;
  ctx.fillText(params.badgeId, size * 0.06, size * 0.97);

  ctx.textAlign = "right";
  ctx.fillText("2:47PM STUDIO", size * 0.94, size * 0.97);
}

export function renderFrame(
  canvas: HTMLCanvasElement,
  params: RenderParams
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { size, slots } = params;
  canvas.width = size;
  canvas.height = size;

  drawBackground(ctx, size);

  const centers = layoutCenters(size, slots.length);
  slots.forEach((slot, i) => {
    const c = centers[i];
    if (c) drawSlot(ctx, slot, c.cx, c.cy, c.radius);
  });

  drawTypography(ctx, size, params);
}
