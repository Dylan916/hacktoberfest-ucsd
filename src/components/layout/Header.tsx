'use client';

import React from 'react';
import { WifiOff, Plus, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  ownedCount: number;
  wishlistCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSetTheme?: (theme: 'light' | 'dark') => void;
  onAddClick?: () => void;
}

export function Header({
  ownedCount,
  wishlistCount,
  theme,
  onToggleTheme,
  onSetTheme,
  onAddClick,
}: HeaderProps) {
  return (
    <header className="border-b border-[#E3E1D9] dark:border-[#1E2025] bg-[#FAF9F6]/90 dark:bg-[#0B0C0E]/90 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-[13px] font-bold tracking-[0.25em] text-zinc-900 dark:text-zinc-100 uppercase font-sans">
                AuraCloset
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#D5D3CA] dark:border-[#2B2D35] bg-[#F2F0E8] dark:bg-[#16171B] text-zinc-600 dark:text-zinc-400 font-mono">
                v1.0
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 tracking-tight hidden sm:inline">
              Multimodal AI Digital Wardrobe & Personal Stylist
            </span>
          </div>
        </div>

        {/* Center / Stats (Desktop) */}
        <div className="hidden md:flex items-center space-x-6 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-800 dark:text-zinc-300 font-medium">{ownedCount} Owned</span>
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="text-zinc-600 dark:text-zinc-400">{wishlistCount} Wishlist</span>
          </div>

          <div className="h-3 w-[1px] bg-[#E3E1D9] dark:bg-[#22242B]" />

          <div className="flex items-center space-x-1.5 text-zinc-500 dark:text-zinc-400 text-[11px]">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline-First (Gemma + Dexie)</span>
          </div>
        </div>

        {/* Actions & Theme Switcher */}
        <div className="flex items-center space-x-3">
          {/* Segmented Light / Dark Mode Toggle */}
          <div
            id="theme-toggle-btn"
            className="flex items-center p-0.5 rounded-full border border-[#E3E1D9] dark:border-[#262831] bg-[#F2F0E8] dark:bg-[#15161A] transition-colors"
          >
            <button
              id="theme-light-btn"
              type="button"
              onClick={() => (onSetTheme ? onSetTheme('light') : onToggleTheme())}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all cursor-pointer select-none ${
                theme === 'light'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title="Switch to Paper Light Theme"
              aria-label="Light Mode"
              aria-pressed={theme === 'light'}
            >
              <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">LIGHT</span>
            </button>
            <button
              id="theme-dark-btn"
              type="button"
              onClick={() => (onSetTheme ? onSetTheme('dark') : onToggleTheme())}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all cursor-pointer select-none ${
                theme === 'dark'
                  ? 'bg-[#22242C] text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title="Switch to Obsidian Dark Theme"
              aria-label="Dark Mode"
              aria-pressed={theme === 'dark'}
            >
              <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">DARK</span>
            </button>
          </div>

          {onAddClick && (
            <button
              onClick={onAddClick}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer shadow-xs"
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
