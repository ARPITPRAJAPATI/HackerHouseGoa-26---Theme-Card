'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Upload, RefreshCw, AlertCircle } from 'lucide-react';

type Props = {
  label: string;
  hasImage: boolean;
  onImageReady: (image: HTMLImageElement) => void;
};

async function fileToImage(file: File): Promise<HTMLImageElement> {
  let workingFile: File | Blob = file;

  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.heic$|\.heif$/i.test(file.name);

  if (isHeic) {
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92,
    });
    workingFile = Array.isArray(converted) ? converted[0] : converted;
  }

  const url = URL.createObjectURL(workingFile);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export default function PhotoUploader({ label, hasImage, onImageReady }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setConverting(true);
      try {
        const img = await fileToImage(file);
        onImageReady(img);
      } catch (e) {
        setError("Couldn't read photo. Try JPG, PNG, or iPhone HEIC file.");
      } finally {
        setConverting(false);
      }
    },
    [onImageReady]
  );

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={converting}
        className="w-full hh-button-yellow flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer"
      >
        {converting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-black" />
            <span>CONVERTING HEIC PHOTO...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 text-black" />
            <span>{hasImage ? `REPLACE ${label.toUpperCase()} PHOTO` : `UPLOAD ${label.toUpperCase()} PHOTO`}</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 text-xs font-mono text-[#FF2A85] flex items-center justify-center gap-1.5 font-bold">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
