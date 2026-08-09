import { toPng } from "html-to-image";

/**
 * Helper to trigger a browser file download from a Data URL.
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
 * Robust card exporter using html-to-image.
 * Captures background template, user photo, text overlays, and QR code with high fidelity.
 */
export async function exportCardToPng(cardElement, fileName = "HH-Goa-Builder-Pass.png") {
  if (!cardElement) {
    console.error("exportCardToPng: Provided cardElement is null or invalid.");
    alert("Pass element not found. Please try again.");
    return null;
  }

  // Preserve original inline 3D transform & transition
  const originalTransform = cardElement.style.transform;
  const originalTransition = cardElement.style.transition;

  try {
    // 1. Temporarily reset 3D tilt transform to flat layout for screenshot engine
    cardElement.style.transform = "none";
    cardElement.style.transition = "none";

    // 2. Wait for all <img> elements inside cardElement to finish loading
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

    // 3. Wait 120ms for DOM layout and base64 fonts to settle
    await new Promise((r) => setTimeout(r, 120));

    // 4. Export high resolution PNG using html-to-image
    let dataUrl;
    try {
      dataUrl = await toPng(cardElement, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: false,
        backgroundColor: "#fff8eb",
        filter: (node) => {
          // Exclude dynamic holographic shimmer layer during PNG export
          if (node.classList && node.classList.contains("hh-holographic-foil")) {
            return false;
          }
          return true;
        },
      });
    } catch (primaryErr) {
      console.warn("Primary toPng failed, retrying fallback...", primaryErr);
      dataUrl = await toPng(cardElement, {
        quality: 0.95,
        pixelRatio: 1.5,
        cacheBust: false,
        backgroundColor: "#fff8eb",
      });
    }

    if (dataUrl) {
      triggerDownload(dataUrl, fileName);
    }
    return dataUrl;
  } catch (err) {
    console.error("Card PNG export failed:", err);
    alert("Export failed: " + (err?.message || err));
    return null;
  } finally {
    // Restore original tilt transform
    cardElement.style.transform = originalTransform;
    cardElement.style.transition = originalTransition;
  }
}
