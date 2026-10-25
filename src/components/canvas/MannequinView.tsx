'use client';

import React, { useState } from 'react';
import { GarmentItem } from '@/types/closet';
import { Sparkles, Camera, Layers, Loader2 } from 'lucide-react';

interface MannequinViewProps {
  items: GarmentItem[];
  outfitTitle?: string;
  onGenerateMannequin?: () => Promise<string | void>;
  customRenderUrl?: string;
}

export function MannequinView({
  items,
  outfitTitle,
  onGenerateMannequin,
  customRenderUrl,
}: MannequinViewProps) {
  const [isRendering, setIsRendering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(customRenderUrl || null);

  const handleRender = async () => {
    if (onGenerateMannequin) {
      setIsRendering(true);
      try {
        const url = await onGenerateMannequin();
        if (typeof url === 'string') {
          setPreviewUrl(url);
        }
      } catch (err) {
        console.error('Failed to generate mannequin render:', err);
      } finally {
        setIsRendering(false);
      }
    } else {
      setIsRendering(true);
      setTimeout(() => {
        // High fashion studio dummy silhouette render
        setPreviewUrl('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85');
        setIsRendering(false);
      }, 1500);
    }
  };

  return (
    <div className="relative rounded-xl border border-[#E3E1D9] dark:border-[#1E2025] bg-white dark:bg-[#0C0D10] p-6 overflow-hidden shadow-xs transition-colors">
      {/* Studio Lighting Indicator */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E1D9] dark:border-[#1A1C22]">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200">
            {outfitTitle ? `${outfitTitle} — Studio Mannequin` : 'Studio Mannequin Synthesis (Gemini + Imagen 3)'}
          </span>
        </div>
        <button
          onClick={handleRender}
          disabled={isRendering || items.length === 0}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-[#ECEAE3] dark:disabled:bg-[#1E2026] disabled:text-zinc-400 dark:disabled:text-zinc-600 cursor-pointer transition-colors shadow-xs"
        >
          {isRendering ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Rendering Studio Light...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-zinc-800" />
              <span>Generate 3D Mannequin</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left 2 Cols: Mannequin Stage */}
        <div className="md:col-span-2 relative min-h-[420px] bg-gradient-to-b from-[#F5F4EE] to-[#EAE8E2] dark:from-[#14151B] dark:to-[#0A0B0E] rounded-lg border border-[#E3E1D9] dark:border-[#1C1E26] flex items-center justify-center p-6 overflow-hidden transition-colors">
          {previewUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Mannequin Studio Render"
                className="max-h-[380px] w-auto object-contain rounded-md shadow-2xl"
              />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-zinc-300">
                Imagen 3 Studio Synthesis
              </div>
            </div>
          ) : (
            /* Minimalist Mannequin Silhouette wireframe */
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm">
              <div className="w-24 h-44 border-2 border-dashed border-zinc-400 dark:border-zinc-700 rounded-t-full rounded-b-3xl flex items-center justify-center mb-4 relative opacity-60">
                <span className="w-10 h-10 rounded-full border border-zinc-400 dark:border-zinc-600 absolute -top-12" />
                <Layers className="w-6 h-6 text-zinc-500" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-300">
                3D Studio Mannequin Simulator
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1">
                Composites all {items.length} selected garments onto a studio-lit headless mannequin with tailored silhouette draping.
              </p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Wearing Checklist */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
            Composite Layer Checklist ({items.length})
          </div>
          <div className="space-y-2 max-h-[380px] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-2.5 p-2 rounded-md bg-[#FAF9F6] dark:bg-[#131418] border border-[#E3E1D9] dark:border-[#1E2026] shadow-2xs transition-colors"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
                  style={{ backgroundColor: item.metadata.primaryColorHex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-zinc-900 dark:text-zinc-200 truncate">
                    {item.metadata.name}
                  </div>
                  <div className="text-[9px] text-zinc-500 capitalize">
                    {item.category} • {item.metadata.subcategory}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
