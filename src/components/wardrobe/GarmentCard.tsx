'use client';

import React from 'react';
import { GarmentItem } from '@/types/closet';
import { CloudRain, Sun, Wind, Snowflake } from 'lucide-react';

interface GarmentCardProps {
  item: GarmentItem;
  onClick?: () => void;
  isSelected?: boolean;
}

export function GarmentCard({
  item,
  onClick,
  isSelected = false,
}: GarmentCardProps) {
  const { metadata, category } = item;

  const weatherIcons: Record<string, React.ReactNode> = {
    rain: <CloudRain className="w-2.5 h-2.5" />,
    sunny: <Sun className="w-2.5 h-2.5" />,
    windy: <Wind className="w-2.5 h-2.5" />,
    snow: <Snowflake className="w-2.5 h-2.5" />,
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col rounded-lg border bg-[#121317] overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-zinc-100 ring-1 ring-zinc-100 shadow-md'
          : 'border-[#1E2025] hover:border-[#343740] hover:bg-[#15171C]'
      }`}
    >
      {/* Image Display */}
      <div className="relative aspect-[4/5] w-full bg-[#17181D] overflow-hidden flex items-center justify-center p-3">
        {/* Color Swatch Dot */}
        <div
          className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full border border-black/30 shadow-sm z-10"
          style={{ backgroundColor: metadata.primaryColorHex }}
          title={`Color: ${metadata.primaryColorHex}`}
        />

        {/* Formality meter */}
        <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-mono z-10 tabular-nums">
          F{metadata.formalityScore}
        </div>

        {/* Product image */}
        <img
          src={item.cutoutImageUrl || item.originalImageUrl}
          alt={metadata.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Weather icons strip */}
        {metadata.weatherSuitability && metadata.weatherSuitability.length > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 backdrop-blur-xs px-1.5 py-0.5 rounded text-zinc-400">
            {metadata.weatherSuitability.slice(0, 3).map((w) => (
              <span key={w} className="opacity-80">
                {weatherIcons[w] || null}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-mono">
            <span>{category}</span>
            <span className="truncate max-w-[100px] text-zinc-400">{metadata.subcategory}</span>
          </div>

          <h3 className="text-xs font-medium text-zinc-200 leading-snug line-clamp-1 group-hover:text-zinc-50 transition-colors">
            {metadata.name}
          </h3>
        </div>

        {/* Vibe Tags */}
        <div className="mt-2.5 flex items-center space-x-1 overflow-hidden">
          {metadata.vibeTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-1.5 py-0.5 rounded bg-[#1B1D23] text-zinc-400 truncate max-w-[80px]"
            >
              #{tag}
            </span>
          ))}
          {metadata.vibeTags.length > 2 && (
            <span className="text-[9px] text-zinc-600 font-mono">
              +{metadata.vibeTags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
