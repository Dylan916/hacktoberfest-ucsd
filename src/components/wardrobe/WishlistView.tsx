'use client';

import React from 'react';
import { GarmentItem } from '@/types/closet';
import { BookmarkCheck, ExternalLink, Check, Trash2, Globe } from 'lucide-react';

interface WishlistViewProps {
  wishlistItems: GarmentItem[];
  onMarkAsOwned?: (itemId: string) => void;
  onRemoveFromWishlist?: (itemId: string) => void;
}

export function WishlistView({
  wishlistItems,
  onMarkAsOwned,
  onRemoveFromWishlist,
}: WishlistViewProps) {
  if (wishlistItems.length === 0) {
    return (
      <div className="rounded-xl border border-[#1E2025] bg-[#101115] p-12 text-center my-6">
        <BookmarkCheck className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-zinc-300">Your Wishlist is Empty</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          When you prompt the Fit Studio with &quot;Complete missing pieces online&quot; enabled, Gemini Search Grounding will curate real purchasable pieces to fill wardrobe gaps here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1E2025] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Gemini Google Search Grounded Buys</span>
          </div>
          <h1 className="text-xl font-semibold text-zinc-100">
            To-Buy Wardrobe Wishlist
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real purchasable garments curated to complete your outfit silhouettes.
          </p>
        </div>

        <span className="text-xs font-mono text-zinc-400 bg-[#16171B] px-3 py-1 rounded border border-[#22242B] self-start sm:self-auto tabular-nums">
          {wishlistItems.length} potential additions
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl border border-[#1E2025] bg-[#121316] overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            {/* Image */}
            <div className="relative aspect-[4/5] bg-[#17181D] flex items-center justify-center p-4">
              {item.priceEstimate && (
                <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-mono text-amber-300 font-semibold tabular-nums z-10">
                  {item.priceEstimate}
                </div>
              )}

              <img
                src={item.cutoutImageUrl || item.originalImageUrl}
                alt={item.metadata.name}
                className="max-h-full max-w-full object-contain"
              />

              <div className="absolute bottom-2 right-2 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/60 text-zinc-400">
                {item.category}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500">
                  {item.metadata.subcategory}
                </span>
                <h3 className="text-xs font-semibold text-zinc-200 line-clamp-2 mt-0.5">
                  {item.metadata.name}
                </h3>
                <div className="flex items-center space-x-1.5 mt-2">
                  <div
                    className="w-3 h-3 rounded-full border border-black/30"
                    style={{ backgroundColor: item.metadata.primaryColorHex }}
                  />
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {item.metadata.primaryColorHex}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-[#1C1E24]">
                {item.buyUrl && (
                  <a
                    href={item.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-2.5 rounded bg-zinc-100 text-zinc-950 text-xs font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>View Retailer Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <div className="flex items-center space-x-1.5">
                  {onMarkAsOwned && (
                    <button
                      onClick={() => onMarkAsOwned(item.id)}
                      className="flex-1 py-1.5 px-2 rounded bg-[#1A1C22] hover:bg-[#22252C] text-zinc-300 text-[11px] font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Mark as Owned</span>
                    </button>
                  )}

                  {onRemoveFromWishlist && (
                    <button
                      onClick={() => onRemoveFromWishlist(item.id)}
                      className="p-1.5 rounded bg-[#1A1C22] hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
