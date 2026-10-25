'use client';

import React from 'react';
import { Category } from '@/types/closet';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: Category | 'all';
  onSelectCategory: (cat: Category | 'all') => void;
  selectedVibe: string | null;
  onSelectVibe: (vibe: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  availableVibes: string[];
}

export function FilterBar({
  selectedCategory,
  onSelectCategory,
  selectedVibe,
  onSelectVibe,
  searchQuery,
  onSearchChange,
  availableVibes,
}: FilterBarProps) {
  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'top', label: 'Tops' },
    { id: 'bottom', label: 'Bottoms' },
    { id: 'footwear', label: 'Footwear' },
    { id: 'accessory', label: 'Accessories' },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Top row: Category tabs & Search input */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs'
                    : 'bg-[#EAE8E2] text-zinc-700 hover:text-zinc-950 hover:bg-[#E0DDD5] dark:bg-[#15161A] dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#1E2026]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search material, vibe, item..."
            className="w-full bg-[#FFFFFF] dark:bg-[#15161A] border border-[#E3E1D9] dark:border-[#22242B] rounded-md pl-8 pr-8 py-1.5 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Vibe Tags row */}
      {availableVibes.length > 0 && (
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none text-[11px]">
          <span className="text-zinc-500 dark:text-zinc-500 flex items-center space-x-1 pr-1 font-mono text-[10px] uppercase">
            <SlidersHorizontal className="w-3 h-3 mr-1" />
            Vibe:
          </span>
          {selectedVibe && (
            <button
              onClick={() => onSelectVibe(null)}
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 text-[11px] hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <span>Clear</span>
              <X className="w-2.5 h-2.5" />
            </button>
          )}
          {availableVibes.map((vibe) => {
            const isSelected = selectedVibe === vibe;
            return (
              <button
                key={vibe}
                onClick={() => onSelectVibe(isSelected ? null : vibe)}
                className={`px-2.5 py-0.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-zinc-50 dark:bg-zinc-200 dark:text-zinc-950 font-medium'
                    : 'bg-[#ECEAE3] text-zinc-700 hover:text-zinc-950 hover:bg-[#E0DDD5] dark:bg-[#18191E] dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#202228]'
                }`}
              >
                #{vibe}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
