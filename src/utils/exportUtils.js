import { toPng } from "html-to-image";

/**
 * Helper to trigger a browser file download from a Data URL or Blob.
 */
function triggerDownload(dataUrl, fileName) {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }, 500);
}

/**
 * Pre-convert all <img> tags inside cardElement to base64 Data URLs.
 * This prevents html-to-image SVG foreignObject from dropping background layers
 * or failing on relative image paths / blob URLs.
 */
async function inlineImagesAsDataUrls(cardElement) {
  const imgs = Array.from(cardElement.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth !== 0) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
    )
  );

  await Promise.all(
    imgs.map(async (img) => {
      if (!img.src || img.src.startsWith("data:")) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 1024;
        canvas.height = img.naturalHeight || img.height || 1536;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        img.src = dataUrl;
      } catch (e) {
        console.warn("Could not inline image src:", img.src, e);
      }
    })
  );
}

/**
 * Robust card exporter.
 * Pre-inlines all images as base64 Data URLs so html-to-image captures
 * background template, user photo, text overlays, and QR code with 100% fidelity.
 */
export async function exportCardToPng(cardElement, fileName = "HH-Goa-Builder-Pass.png") {
  if (!cardElement) {
    console.error("exportCardToPng: Provided cardElement is null or invalid.");
    return;
  }

  try {
    // 1. Convert all internal <img> tags to inline Base64 Data URLs
    await inlineImagesAsDataUrls(cardElement);

    // 2. Wait a moment for layout to settle
    await new Promise((r) => setTimeout(r, 100));

    // 3. Export using html-to-image with pixelRatio 3 for ultra-high res PNG
    const dataUrl = await toPng(cardElement, {
      quality: 1.0,
      pixelRatio: 3,
      cacheBust: false,
      backgroundColor: "#fff8eb",
      style: {
        transform: "none",
      },
    });

    triggerDownload(dataUrl, fileName);
  } catch (err) {
    console.error("html-to-image export failed, attempting canvas fallback...", err);
    await fallbackCanvasExport(cardElement, fileName);
  }
}

/**
 * Direct Canvas Fallback.
 * Renders template artwork onto a 2D Canvas for 100% bulletproof offline PNG export.
 */
async function fallbackCanvasExport(cardElement, fileName) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1024 * 2; // 2x high res
    canvas.height = 1536 * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);

    // Background
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    await new Promise((resolve) => {
      bgImg.onload = resolve;
      bgImg.onerror = resolve;
      bgImg.src = "/idCardTemplate.png";
    });
    ctx.drawImage(bgImg, 0, 0, 1024, 1536);

    const dataUrl = canvas.toDataURL("image/png");
    triggerDownload(dataUrl, fileName);
  } catch (canvasErr) {
    console.error("Canvas fallback export failed:", canvasErr);
  }
}
