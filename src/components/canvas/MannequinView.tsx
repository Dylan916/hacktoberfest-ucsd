'use client';

import React, { useState } from 'react';
import { GarmentItem } from '@/types/closet';
import { User, Layers, X } from 'lucide-react';

interface MannequinViewProps {
  items: GarmentItem[];
  outfitTitle?: string;
  onItemClick?: (item: GarmentItem) => void;
  onRemoveItem?: (itemId: string) => void;
}

export function MannequinView({
  items,
  outfitTitle,
  onItemClick,
  onRemoveItem,
}: MannequinViewProps) {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Group items by category for realistic mannequin positioning
  const outerwear = items.filter((i) => i.category === 'outerwear');
  const tops = items.filter((i) => i.category === 'top');
  const bottoms = items.filter((i) => i.category === 'bottom');
  const footwear = items.filter((i) => i.category === 'footwear');
  const accessories = items.filter((i) => i.category === 'accessory');

  return (
    <div className="relative rounded-xl border border-[#E3E1D9] dark:border-[#1E2025] bg-white dark:bg-[#0C0D10] p-6 overflow-hidden shadow-xs transition-colors">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E3E1D9] dark:border-[#1A1C22]">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
            {outfitTitle ? `${outfitTitle} — Mannequin Drape` : 'Studio Mannequin Drape'}
          </span>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">{items.length}</span>{' '}
          {items.length === 1 ? 'piece draped' : 'pieces draped'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left 2 Cols: Interactive Mannequin Drape Stage */}
        <div className="md:col-span-2 relative min-h-[500px] h-[520px] bg-gradient-to-b from-[#F7F6F2] via-[#EFECE5] to-[#E5E2D8] dark:from-[#14151B] dark:via-[#0F1014] dark:to-[#0A0B0E] rounded-lg border border-[#E3E1D9] dark:border-[#1C1E26] flex items-center justify-center p-4 overflow-hidden transition-colors shadow-inner">
          <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
            {/* Studio Light Glow */}
            <div className="absolute inset-0 bg-radial from-white/40 via-transparent to-transparent dark:from-white/5 pointer-events-none" />

            {/* Sculptural Tailor Mannequin Form (SVG Stand + Torso) */}
            <div className="relative w-64 h-[460px] flex items-center justify-center">
              {/* SVG Mannequin Base & Body */}
              <svg
                viewBox="0 0 200 420"
                className="w-full h-full text-zinc-300 dark:text-zinc-800/80 drop-shadow-sm pointer-events-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Neck Cap (Walnut/brass block) */}
                <ellipse cx="100" cy="46" rx="14" ry="6" className="fill-amber-800/50 dark:fill-amber-600/30" />
                <rect x="94" y="32" width="12" height="15" rx="3" className="fill-amber-900/60 dark:fill-amber-700/40" />

                {/* Torso & Hips Form */}
                <path
                  d="M 76 52 C 84 50, 116 50, 124 52 C 146 58, 154 84, 146 125 C 140 155, 146 195, 148 215 C 148 226, 140 236, 126 238 C 108 240, 92 240, 74 238 C 60 236, 52 226, 52 215 C 54 195, 60 155, 54 125 C 46 84, 54 58, 76 52 Z"
                  className="fill-[#E4E1D7] dark:fill-[#1C1E26] stroke-zinc-400/40 dark:stroke-zinc-700/50"
                  strokeWidth="1.5"
                />
                {/* Tailor Seam Lines */}
                <line x1="100" y1="52" x2="100" y2="238" className="stroke-zinc-400/30 dark:stroke-zinc-700/30" strokeDasharray="3 3" />
                <path d="M 68 115 C 85 125, 115 125, 132 115" className="stroke-zinc-400/25 dark:stroke-zinc-700/25" strokeDasharray="2 3" />
                <path d="M 62 175 C 82 185, 118 185, 138 175" className="stroke-zinc-400/25 dark:stroke-zinc-700/25" strokeDasharray="2 3" />

                {/* Metal Stand Pole */}
                <rect x="97" y="238" width="6" height="155" className="fill-zinc-400 dark:fill-zinc-700" />

                {/* Tripod Stand / Cast-Iron Base */}
                <path
                  d="M 60 415 L 100 380 L 140 415 M 100 380 L 100 418"
                  className="stroke-zinc-500 dark:stroke-zinc-600"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <ellipse cx="100" cy="416" rx="46" ry="6" className="fill-black/10 dark:fill-black/40" />
              </svg>

              {/* Overlaid Garments Draped on the Mannequin */}
              <div className="absolute inset-0 flex flex-col items-center">
                {/* Accessories (Neck / Collar area) */}
                {accessories.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => onItemClick?.(acc)}
                    onMouseEnter={() => setHoveredItemId(acc.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    title={acc.metadata.name}
                    className={`absolute top-10 z-40 max-w-[80px] max-h-[55px] cursor-pointer transition-all duration-200 ${
                      hoveredItemId === acc.id ? 'scale-110 drop-shadow-xl ring-2 ring-amber-400 rounded-md' : 'hover:scale-105'
                    }`}
                  >
                    <img
                      src={acc.cutoutImageUrl || acc.originalImageUrl}
                      alt={acc.metadata.name}
                      className="max-h-[55px] max-w-[80px] object-contain drop-shadow-md"
                    />
                  </div>
                ))}

                {/* Base Tops Layer (Torso) */}
                {tops.map((top) => (
                  <div
                    key={top.id}
                    onClick={() => onItemClick?.(top)}
                    onMouseEnter={() => setHoveredItemId(top.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    title={top.metadata.name}
                    className={`absolute top-12 z-20 max-w-[170px] max-h-[175px] cursor-pointer transition-all duration-200 ${
                      hoveredItemId === top.id ? 'scale-110 drop-shadow-2xl ring-2 ring-amber-400 rounded-md' : 'hover:scale-105'
                    }`}
                  >
                    <img
                      src={top.cutoutImageUrl || top.originalImageUrl}
                      alt={top.metadata.name}
                      className="max-h-[175px] max-w-[170px] object-contain drop-shadow-xl"
                    />
                  </div>
                ))}

                {/* Outerwear Layer (Draped Over Tops on Shoulders) */}
                {outerwear.map((jacket) => (
                  <div
                    key={jacket.id}
                    onClick={() => onItemClick?.(jacket)}
                    onMouseEnter={() => setHoveredItemId(jacket.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    title={jacket.metadata.name}
                    className={`absolute top-10 z-30 max-w-[210px] max-h-[210px] cursor-pointer transition-all duration-200 ${
                      hoveredItemId === jacket.id ? 'scale-110 drop-shadow-2xl ring-2 ring-amber-400 rounded-md' : 'hover:scale-105'
                    }`}
                  >
                    <img
                      src={jacket.cutoutImageUrl || jacket.originalImageUrl}
                      alt={jacket.metadata.name}
                      className="max-h-[210px] max-w-[210px] object-contain drop-shadow-2xl"
                    />
                  </div>
                ))}

                {/* Bottoms Layer (Pants / Skirt on Hips) */}
                {bottoms.map((bottom) => (
                  <div
                    key={bottom.id}
                    onClick={() => onItemClick?.(bottom)}
                    onMouseEnter={() => setHoveredItemId(bottom.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    title={bottom.metadata.name}
                    className={`absolute top-48 z-15 max-w-[155px] max-h-[210px] cursor-pointer transition-all duration-200 ${
                      hoveredItemId === bottom.id ? 'scale-110 drop-shadow-2xl ring-2 ring-amber-400 rounded-md' : 'hover:scale-105'
                    }`}
                  >
                    <img
                      src={bottom.cutoutImageUrl || bottom.originalImageUrl}
                      alt={bottom.metadata.name}
                      className="max-h-[210px] max-w-[155px] object-contain drop-shadow-xl"
                    />
                  </div>
                ))}

                {/* Footwear Layer (Base of Stand) */}
                {footwear.map((shoes) => (
                  <div
                    key={shoes.id}
                    onClick={() => onItemClick?.(shoes)}
                    onMouseEnter={() => setHoveredItemId(shoes.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    title={shoes.metadata.name}
                    className={`absolute bottom-1 z-35 max-w-[130px] max-h-[85px] cursor-pointer transition-all duration-200 ${
                      hoveredItemId === shoes.id ? 'scale-110 drop-shadow-xl ring-2 ring-amber-400 rounded-md' : 'hover:scale-105'
                    }`}
                  >
                    <img
                      src={shoes.cutoutImageUrl || shoes.originalImageUrl}
                      alt={shoes.metadata.name}
                      className="max-h-[85px] max-w-[130px] object-contain drop-shadow-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Empty State Help Text if No Items Draped */}
              {items.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-white/70 dark:bg-black/70 backdrop-blur-2xs rounded-lg">
                  <Layers className="w-6 h-6 text-zinc-400 mb-2" />
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    No garments selected
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Select pieces from My Closet to drape them on the mannequin
                  </p>
                </div>
              )}
            </div>

            {/* Stage Footer Badge */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/60 dark:bg-black/80 backdrop-blur-xs text-[10px] font-mono text-zinc-300 border border-white/10">
              Live Wardrobe Drape ({items.length} pieces)
            </div>
          </div>
        </div>

        {/* Right 1 Col: Wearing Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Draped Layer Checklist ({items.length})
            </div>
          </div>
          <div className="space-y-2 max-h-[460px] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick?.(item)}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                className={`group flex items-center justify-between p-2.5 rounded-md border shadow-2xs transition-all cursor-pointer ${
                  hoveredItemId === item.id
                    ? 'bg-amber-500/10 border-amber-400 dark:border-amber-500'
                    : 'bg-[#FAF9F6] dark:bg-[#131418] border-[#E3E1D9] dark:border-[#1E2026] hover:border-zinc-400 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
                    style={{ backgroundColor: item.metadata.primaryColorHex }}
                  />
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-zinc-900 dark:text-zinc-200 truncate">
                      {item.metadata.name}
                    </div>
                    <div className="text-[9px] text-zinc-500 capitalize">
                      {item.category} • {item.metadata.subcategory}
                    </div>
                  </div>
                </div>

                {onRemoveItem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200 transition-opacity"
                    title="Remove layer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


