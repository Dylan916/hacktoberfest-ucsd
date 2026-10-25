'use client';

import React from 'react';
import { Layers, Wand2, Compass, BookmarkCheck } from 'lucide-react';

export type ActiveTab = 'closet' | 'canvas' | 'vibecoach' | 'wishlist';

interface TabNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  ownedCount: number;
  wishlistCount: number;
  hasActiveFit?: boolean;
}

export function TabNav({
  activeTab,
  onChangeTab,
  ownedCount,
  wishlistCount,
  hasActiveFit = false,
}: TabNavProps) {
  const tabs = [
    {
      id: 'closet' as ActiveTab,
      label: 'My Closet',
      icon: Layers,
      badge: ownedCount.toString(),
    },
    {
      id: 'canvas' as ActiveTab,
      label: 'Fit Studio',
      icon: Wand2,
      dot: hasActiveFit,
    },
    {
      id: 'vibecoach' as ActiveTab,
      label: 'Vibe Coach',
      icon: Compass,
    },
    {
      id: 'wishlist' as ActiveTab,
      label: 'To-Buy Wishlist',
      icon: BookmarkCheck,
      badge: wishlistCount.toString(),
    },
  ];

  return (
    <div className="border-b border-[#1E2025] bg-[#0E0F12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`group inline-flex items-center space-x-2 py-2.5 px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-zinc-100 text-zinc-100'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 font-semibold'
                        : 'bg-[#1D1F24] text-zinc-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {tab.dot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
