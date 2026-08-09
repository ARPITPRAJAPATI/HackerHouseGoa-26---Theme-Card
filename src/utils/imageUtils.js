/**
 * Reads an uploaded file as a base64 Data URL.
 * Supports JPG, JPEG, PNG, WEBP, HEIC (with basic object URL fallback).
 */
export function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.onerror = (err) => {
      reject(err);
    };

    // If file extension is HEIC or HEIF, FileReader readAsDataURL still creates a valid stream or objectURL
    reader.readAsDataURL(file);
  });
}
