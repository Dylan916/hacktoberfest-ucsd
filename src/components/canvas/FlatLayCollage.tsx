'use client';

import React from 'react';
import { GarmentItem } from '@/types/closet';
import { X, Sparkles } from 'lucide-react';

interface FlatLayCollageProps {
  items: GarmentItem[];
  onRemoveItem?: (itemId: string) => void;
  onItemClick?: (item: GarmentItem) => void;
}

export function FlatLayCollage({
  items,
  onRemoveItem,
  onItemClick,
}: FlatLayCollageProps) {
  const outerwear = items.filter((i) => i.category === 'outerwear');
  const tops = items.filter((i) => i.category === 'top');
  const bottoms = items.filter((i) => i.category === 'bottom');
  const footwear = items.filter((i) => i.category === 'footwear');
  const accessories = items.filter((i) => i.category === 'accessory');

  if (items.length === 0) {
    return (
      <div className="h-[460px] rounded-xl border border-dashed border-[#22242B] bg-[#101115] flex flex-col items-center justify-center p-8 text-center">
        <Sparkles className="w-8 h-8 text-zinc-600 mb-3" />
        <h3 className="text-sm font-medium text-zinc-300">Fit Studio Canvas is Empty</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
          Prompt the stylist with a scenario above or select garments from &quot;My Closet&quot; to build a custom fit collage.
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-[#1E2025] bg-[#0E0F13] p-4 sm:p-6 overflow-hidden">
      {/* Editorial Watermark */}
      <div className="absolute top-4 right-4 pointer-events-none select-none text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-700/60">
        Aura Studio / Editorial Flat-Lay
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Core Silhouette (Tops + Outerwear on Upper half, Bottoms + Shoes below) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upper Half: Outerwear & Tops */}
          <div className="rounded-lg bg-[#14151A] border border-[#1F2128] p-4 relative min-h-[220px]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Upper Torso Layering
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {outerwear.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onItemClick?.(item)}
                  className="group relative bg-[#181920] rounded-md p-3 border border-[#242630] hover:border-zinc-500 cursor-pointer transition-all flex items-center space-x-3"
                >
                  <div className="w-20 h-24 bg-[#121317] rounded flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={item.cutoutImageUrl || item.originalImageUrl}
                      alt={item.metadata.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Outerwear</span>
                    <h4 className="text-xs font-medium text-zinc-200 truncate">{item.metadata.name}</h4>
                    <span className="text-[10px] text-zinc-400 capitalize">{item.metadata.subcategory}</span>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-zinc-200 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {tops.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onItemClick?.(item)}
                  className="group relative bg-[#181920] rounded-md p-3 border border-[#242630] hover:border-zinc-500 cursor-pointer transition-all flex items-center space-x-3"
                >
                  <div className="w-20 h-24 bg-[#121317] rounded flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={item.cutoutImageUrl || item.originalImageUrl}
                      alt={item.metadata.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Base Top</span>
                    <h4 className="text-xs font-medium text-zinc-200 truncate">{item.metadata.name}</h4>
                    <span className="text-[10px] text-zinc-400 capitalize">{item.metadata.subcategory}</span>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-zinc-200 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lower Half: Bottoms & Footwear */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bottoms */}
            <div className="rounded-lg bg-[#14151A] border border-[#1F2128] p-4 min-h-[200px]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                Legwear / Silhouette
              </div>
              {bottoms.length === 0 ? (
                <div className="text-xs text-zinc-600 italic py-6 text-center">No bottoms selected</div>
              ) : (
                bottoms.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onItemClick?.(item)}
                    className="group relative bg-[#181920] rounded-md p-3 border border-[#242630] hover:border-zinc-500 cursor-pointer transition-all flex items-center space-x-3"
                  >
                    <div className="w-20 h-24 bg-[#121317] rounded flex items-center justify-center p-1 overflow-hidden">
                      <img
                        src={item.cutoutImageUrl || item.originalImageUrl}
                        alt={item.metadata.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Trousers</span>
                      <h4 className="text-xs font-medium text-zinc-200 truncate">{item.metadata.name}</h4>
                      <span className="text-[10px] text-zinc-400 capitalize">{item.metadata.materials?.[0] || item.metadata.subcategory}</span>
                    </div>
                    {onRemoveItem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-zinc-200 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footwear */}
            <div className="rounded-lg bg-[#14151A] border border-[#1F2128] p-4 min-h-[200px]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                Footwear
              </div>
              {footwear.length === 0 ? (
                <div className="text-xs text-zinc-600 italic py-6 text-center">No footwear selected</div>
              ) : (
                footwear.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onItemClick?.(item)}
                    className="group relative bg-[#181920] rounded-md p-3 border border-[#242630] hover:border-zinc-500 cursor-pointer transition-all flex items-center space-x-3"
                  >
                    <div className="w-20 h-24 bg-[#121317] rounded flex items-center justify-center p-1 overflow-hidden">
                      <img
                        src={item.cutoutImageUrl || item.originalImageUrl}
                        alt={item.metadata.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Shoes</span>
                      <h4 className="text-xs font-medium text-zinc-200 truncate">{item.metadata.name}</h4>
                      <span className="text-[10px] text-zinc-400 capitalize">{item.metadata.subcategory}</span>
                    </div>
                    {onRemoveItem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-zinc-200 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Accessories Display Tray */}
        <div className="lg:col-span-1 rounded-lg bg-[#14151A] border border-[#1F2128] p-4 flex flex-col">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-3">
            <span>Accessories Rack</span>
            <span className="text-zinc-400 tabular-nums">{accessories.length}</span>
          </div>

          {accessories.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-zinc-600 italic">
              No accessories in this fit
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {accessories.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onItemClick?.(item)}
                  className="group relative bg-[#181920] rounded-md p-2.5 border border-[#242630] hover:border-zinc-500 cursor-pointer transition-all flex items-center space-x-2.5"
                >
                  <div className="w-12 h-12 bg-[#121317] rounded flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={item.cutoutImageUrl || item.originalImageUrl}
                      alt={item.metadata.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[11px] font-medium text-zinc-200 truncate">{item.metadata.name}</h5>
                    <span className="text-[9px] text-zinc-500 capitalize">{item.metadata.subcategory}</span>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-zinc-200 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
