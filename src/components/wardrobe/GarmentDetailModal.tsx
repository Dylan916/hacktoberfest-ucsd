'use client';

import React from 'react';
import { GarmentItem } from '@/types/closet';
import { X, Check } from 'lucide-react';

interface GarmentDetailModalProps {
  item: GarmentItem | null;
  onClose: () => void;
  onSelectForFit?: (itemId: string) => void;
  isIncludedInFit?: boolean;
}

export function GarmentDetailModal({
  item,
  onClose,
  onSelectForFit,
  isIncludedInFit = false,
}: GarmentDetailModalProps) {
  if (!item) return null;

  const { metadata, category } = item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#121316] border border-[#E3E1D9] dark:border-[#22242B] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 dark:bg-black/60 text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-100 hover:bg-black/20 dark:hover:bg-black/80 z-20 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Image Canvas */}
        <div className="md:w-1/2 bg-[#F5F4EE] dark:bg-[#17181D] flex items-center justify-center p-6 relative transition-colors">
          <img
            src={item.cutoutImageUrl || item.originalImageUrl}
            alt={metadata.name}
            className="max-h-[300px] w-auto object-contain drop-shadow-md"
          />
          <div className="absolute bottom-3 left-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/80 dark:bg-black/60 text-zinc-700 dark:text-zinc-400 border border-black/5 dark:border-transparent">
            {category}
          </div>
        </div>

        {/* Right: Rich Metadata Panel */}
        <div className="md:w-1/2 p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-0.5">
                {metadata.subcategory}
              </div>
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100 leading-tight">
                {metadata.name}
              </h2>
            </div>

            {/* Colors */}
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-500 mb-1.5 flex items-center space-x-1">
                <span>Color Palette</span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1.5 bg-[#F5F4EE] dark:bg-[#18191E] px-2 py-1 rounded border border-[#E3E1D9] dark:border-[#22242B]">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: metadata.primaryColorHex }}
                  />
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 text-[11px]">{metadata.primaryColorHex}</span>
                </div>
                {metadata.secondaryColorHex && (
                  <div className="flex items-center space-x-1.5 bg-[#F5F4EE] dark:bg-[#18191E] px-2 py-1 rounded border border-[#E3E1D9] dark:border-[#22242B]">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: metadata.secondaryColorHex }}
                    />
                    <span className="font-mono text-zinc-700 dark:text-zinc-300 text-[11px]">{metadata.secondaryColorHex}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Materials */}
            {metadata.materials && metadata.materials.length > 0 && (
              <div>
                <div className="text-[10px] uppercase font-mono text-zinc-500 mb-1">Materials</div>
                <div className="flex flex-wrap gap-1">
                  {metadata.materials.map((mat) => (
                    <span
                      key={mat}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#F2F0E8] text-zinc-800 dark:bg-[#1A1C22] dark:text-zinc-300 border border-[#E3E1D9] dark:border-[#24262E]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Formality meter */}
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase font-mono text-zinc-500 mb-1">
                <span>Formality Level</span>
                <span className="text-zinc-800 dark:text-zinc-300 font-mono">{metadata.formalityScore} / 10</span>
              </div>
              <div className="w-full bg-[#EAE8E2] dark:bg-[#1A1C22] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-zinc-900 dark:bg-zinc-200 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(metadata.formalityScore / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Weather & Seasonality */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#FAF9F6] dark:bg-[#18191E] p-2 rounded border border-[#E3E1D9] dark:border-[#22242B]">
                <div className="text-[9px] uppercase font-mono text-zinc-500 mb-1">Weather</div>
                <div className="text-zinc-800 dark:text-zinc-300 capitalize">
                  {metadata.weatherSuitability?.join(', ') || 'All seasons'}
                </div>
              </div>
              <div className="bg-[#FAF9F6] dark:bg-[#18191E] p-2 rounded border border-[#E3E1D9] dark:border-[#22242B]">
                <div className="text-[9px] uppercase font-mono text-zinc-500 mb-1">Season</div>
                <div className="text-zinc-800 dark:text-zinc-300 capitalize">
                  {metadata.seasonality?.join(', ') || 'Anytime'}
                </div>
              </div>
            </div>

            {/* Vibe Tags */}
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-500 mb-1">Aesthetic Vibes</div>
              <div className="flex flex-wrap gap-1">
                {metadata.vibeTags.map((vibe) => (
                  <span
                    key={vibe}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#ECEAE3] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    #{vibe}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 mt-4 border-t border-[#E3E1D9] dark:border-[#1E2025]">
            {onSelectForFit && (
              <button
                onClick={() => onSelectForFit(item.id)}
                className={`w-full py-2 px-3 rounded-md text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                  isIncludedInFit
                    ? 'bg-[#EAE8E2] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-[#E0DDD5] dark:hover:bg-zinc-700'
                    : 'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-xs'
                }`}
              >
                {isIncludedInFit ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Included in Current Fit</span>
                  </>
                ) : (
                  <span>Add to Fit Studio Canvas</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
