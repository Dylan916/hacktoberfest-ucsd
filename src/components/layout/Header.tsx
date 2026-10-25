'use client';

import React from 'react';
import { WifiOff, Plus } from 'lucide-react';

interface HeaderProps {
  ownedCount: number;
  wishlistCount: number;
  onAddClick?: () => void;
}

export function Header({ ownedCount, wishlistCount, onAddClick }: HeaderProps) {
  return (
    <header className="border-b border-[#1E2025] bg-[#0B0C0E]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-[13px] font-bold tracking-[0.25em] text-zinc-100 uppercase font-sans">
                AuraCloset
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#2B2D35] bg-[#16171B] text-zinc-400 font-mono">
                v1.0
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 tracking-tight hidden sm:inline">
              Multimodal AI Digital Wardrobe & Personal Stylist
            </span>
          </div>
        </div>

        {/* Center / Stats (Desktop) */}
        <div className="hidden md:flex items-center space-x-6 text-xs text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-300 font-medium">{ownedCount} Owned</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">{wishlistCount} Wishlist</span>
          </div>

          <div className="h-3 w-[1px] bg-[#22242B]" />

          <div className="flex items-center space-x-1.5 text-zinc-400 text-[11px]">
            <WifiOff className="w-3.5 h-3.5 text-zinc-400" />
            <span>Offline-First (Gemma + Dexie)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-950 text-xs font-medium hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Garment</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
