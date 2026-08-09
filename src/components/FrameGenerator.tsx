'use client';

import React, { useState } from 'react';
import PhotoUploader from './PhotoUploader';
import InteractiveCanvasPreview from './InteractiveCanvasPreview';
import { RenderParams } from '@/lib/canvasRenderer';
import { RefreshCw } from 'lucide-react';

export default function FrameGenerator() {
  const [params, setParams] = useState<RenderParams>({
    slots: [],
    stickers: [],
    teamMode: 'solo',
    title: 'BUILDER ID',
  });
  
  const [activeSlot, setActiveSlot] = useState(0);

  const handleImageReady = (image: HTMLImageElement) => {
    setParams(prev => {
      const newSlots = [...prev.slots];
      newSlots[activeSlot] = {
        image,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      };
      return { ...prev, slots: newSlots };
    });
  };

  const handleSlotChange = (index: number, patch: any) => {
    setParams(prev => {
      const newSlots = [...prev.slots];
      if (newSlots[index]) {
        newSlots[index] = { ...newSlots[index], ...patch };
      }
      return { ...prev, slots: newSlots };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Interactive 3D Canvas Preview */}
      <div className="relative w-full max-w-[500px] mx-auto perspective-[1200px]">
        <InteractiveCanvasPreview 
          params={params}
          activeSlotIndex={activeSlot}
          onSlotChange={handleSlotChange}
        />
      </div>

      {/* Controls */}
      <div className="space-y-6 rounded-2xl bg-black/40 p-6 backdrop-blur-md border border-white/5 shadow-inner">
        <h2 className="text-2xl font-bold uppercase text-[var(--yellow)] tracking-wider">
          Customize Your Pass
        </h2>
        
        <div className="space-y-4">
          <label className="block text-sm font-semibold uppercase text-white/70">
            Upload Avatar
          </label>
          <PhotoUploader 
            label="Drop your PFP here"
            hasImage={!!params.slots[activeSlot]}
            onImageReady={handleImageReady}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold uppercase text-white/70">
            Team Mode
          </label>
          <div className="flex gap-2">
            {['solo', 'duo', 'squad'].map((mode) => (
              <button
                key={mode}
                onClick={() => setParams(prev => ({ ...prev, teamMode: mode as any }))}
                className={`flex-1 rounded-lg py-2 text-sm font-bold uppercase transition-all duration-300 ${
                  params.teamMode === mode
                    ? 'bg-[var(--yellow)] text-black shadow-[0_0_15px_rgba(254,232,0,0.4)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold uppercase text-white/70 flex justify-between items-center">
            Pass Title
            <button 
              onClick={() => {
                const titles = ['BUILDER ID', 'VIP ACCESS', 'SHIPPED IT', '500 ELITE', 'NIGHT OWL'];
                setParams(prev => ({ ...prev, title: titles[Math.floor(Math.random() * titles.length)] }));
              }}
              className="text-white/40 hover:text-[var(--pink)] transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </label>
          <input 
            type="text"
            value={params.title}
            onChange={(e) => setParams(prev => ({ ...prev, title: e.target.value.toUpperCase() }))}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white font-mono uppercase focus:outline-none focus:border-[var(--pink)] focus:ring-1 focus:ring-[var(--pink)] transition-all"
            maxLength={15}
          />
        </div>
      </div>
    </div>
  );
}
