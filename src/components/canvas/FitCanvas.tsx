'use client';

import React, { useState } from 'react';
import { GarmentItem, StylistResponse } from '@/types/closet';
import { PromptBar } from '@/components/chat/PromptBar';
import { FlatLayCollage } from './FlatLayCollage';
import { MannequinView } from './MannequinView';
import { StylistNotesPanel } from './StylistNotesPanel';
import { LayoutGrid, User } from 'lucide-react';

interface FitCanvasProps {
  activeOutfit: StylistResponse | null;
  wardrobeItems: GarmentItem[];
  onPromptSubmit: (prompt: string, allowOnlineSearch: boolean) => void;
  allowOnlineSearch: boolean;
  onToggleOnlineSearch: (enabled: boolean) => void;
  onRemoveItemFromFit?: (itemId: string) => void;
  onViewWishlist?: () => void;
  onItemClick?: (item: GarmentItem) => void;
  onSaveOutfit?: () => Promise<void>;
  isLoading?: boolean;
}

export function FitCanvas({
  activeOutfit,
  wardrobeItems,
  onPromptSubmit,
  allowOnlineSearch,
  onToggleOnlineSearch,
  onRemoveItemFromFit,
  onViewWishlist,
  onItemClick,
  onSaveOutfit,
  isLoading = false,
}: FitCanvasProps) {
  const [viewMode, setViewMode] = useState<'flatlay' | 'mannequin'>('flatlay');
  const [isSaved, setIsSaved] = useState(false);

  // Selected items resolved from activeOutfit IDs
  const fitItems = wardrobeItems.filter((item) =>
    activeOutfit?.selectedItemIds.includes(item.id)
  );

  return (
    <div className="space-y-6">
      {/* Top Prompt Engine */}
      <PromptBar
        onPromptSubmit={onPromptSubmit}
        allowOnlineSearch={allowOnlineSearch}
        onToggleOnlineSearch={onToggleOnlineSearch}
        isLoading={isLoading}
      />

      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E3E1D9] dark:border-[#1A1C22]">
        <div className="flex items-center space-x-2">
          <div className="inline-flex p-1 rounded-lg bg-[#EAE8E2] dark:bg-[#14151B] border border-[#DDD9CE] dark:border-[#1E2028] shadow-xs">
            <button
              onClick={() => setViewMode('flatlay')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'flatlay'
                  ? 'bg-white text-zinc-950 font-semibold shadow-xs dark:bg-zinc-100 dark:text-zinc-950'
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Flat-Lay Collage</span>
            </button>
            <button
              onClick={() => setViewMode('mannequin')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'mannequin'
                  ? 'bg-white text-zinc-950 font-semibold shadow-xs dark:bg-zinc-100 dark:text-zinc-950'
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>3D Mannequin View</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <span>Wearing: </span>
          <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{fitItems.length} pieces</span>
        </div>
      </div>

      {/* Main Visual Stage (Collage or Mannequin) */}
      {viewMode === 'flatlay' ? (
        <FlatLayCollage
          items={fitItems}
          onRemoveItem={onRemoveItemFromFit}
          onItemClick={onItemClick}
        />
      ) : (
        <MannequinView
          items={fitItems}
          outfitTitle={activeOutfit?.outfitTitle}
        />
      )}

      {/* Stylist Notes & Advice */}
      <StylistNotesPanel
        stylistResponse={activeOutfit}
        onViewWishlist={onViewWishlist}
        onSaveOutfit={async () => {
          await onSaveOutfit?.();
          setIsSaved(true);
        }}
        isSaved={isSaved}
      />
    </div>
  );
}
