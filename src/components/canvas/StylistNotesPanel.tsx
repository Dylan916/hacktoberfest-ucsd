'use client';

import React from 'react';
import { StylistResponse } from '@/types/closet';
import { Sparkles, ShoppingBag, Watch, ArrowRight, Bookmark, Check } from 'lucide-react';

interface StylistNotesPanelProps {
  stylistResponse: StylistResponse | null;
  onViewWishlist?: () => void;
  onSaveOutfit?: () => void;
  isSaved?: boolean;
}

export function StylistNotesPanel({
  stylistResponse,
  onViewWishlist,
  onSaveOutfit,
  isSaved = false,
}: StylistNotesPanelProps) {
  if (!stylistResponse) return null;

  return (
    <div className="rounded-xl border border-[#E3E1D9] dark:border-[#1E2025] bg-white dark:bg-[#111216] p-5 sm:p-6 space-y-5 shadow-xs transition-colors">
      {/* Title & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E3E1D9] dark:border-[#1C1D24] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Gemma 4 Stylist Consultation</span>
          </div>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">
            {stylistResponse.outfitTitle}
          </h2>
        </div>

        {onSaveOutfit && (
          <button
            onClick={onSaveOutfit}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-[#1C1E26] dark:text-emerald-400 dark:border-emerald-900/50'
                : 'bg-[#EAE8E2] text-zinc-800 hover:bg-[#E0DDD5] dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 shadow-2xs'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved to Outfits</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Outfit</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Proportions & Styling Notes */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
          Silhouette & Color Rationale
        </h3>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          {stylistResponse.stylistNotes}
        </p>
      </div>

      {/* Accessory Advice Callout */}
      {stylistResponse.accessoryAdvice && (
        <div className="rounded-lg bg-[#FAF8F2] dark:bg-[#15161C] border border-[#E8E1CE] dark:border-[#22242E] p-3.5 flex items-start space-x-3 transition-colors">
          <Watch className="w-4 h-4 text-amber-600 dark:text-amber-400/90 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-medium text-amber-800 dark:text-amber-300 uppercase font-mono tracking-wider mb-0.5">
              Accessory & Jewelry Pairing
            </h4>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-normal">
              {stylistResponse.accessoryAdvice}
            </p>
          </div>
        </div>
      )}

      {/* Missing Pieces Online Gap-Filling Alert */}
      {stylistResponse.missingPieces && stylistResponse.missingPieces.length > 0 && (
        <div className="rounded-lg bg-[#FFF9F3] dark:bg-[#181513] border border-[#F2DECC] dark:border-[#33221B] p-4 space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 text-xs font-medium">
              <ShoppingBag className="w-4 h-4" />
              <span>Wardrobe Gap Identified ({stylistResponse.missingPieces.length})</span>
            </div>
            {onViewWishlist && (
              <button
                onClick={onViewWishlist}
                className="text-[11px] text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 inline-flex items-center space-x-1 font-medium cursor-pointer"
              >
                <span>View in Wishlist</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            {stylistResponse.missingPieces.map((piece, idx) => (
              <div key={idx} className="text-xs text-zinc-800 dark:text-zinc-300 flex items-start space-x-2">
                <span className="text-amber-600 dark:text-amber-500 font-mono text-[10px] uppercase shrink-0 mt-0.5">
                  [{piece.category}]
                </span>
                <div>
                  <span className="font-medium text-zinc-900 dark:text-zinc-200">{piece.description}</span> —{' '}
                  <span className="text-zinc-600 dark:text-zinc-400">{piece.reasonNeeded}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
