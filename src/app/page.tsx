'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { TabNav, ActiveTab } from '@/components/layout/TabNav';
import type { GarmentItem, StylistResponse, WishlistSuggestion } from '@/types/closet';
import { MOCK_WARDROBE } from '@/mocks/mockWardrobe';
import { db, getWishlistSuggestions, initializeLocalDb, removeWishlistSuggestion, saveOutfit, saveWishlistSuggestions } from '@/lib/localDb';
import { askGemmaStylist } from '@/lib/gemmaStylist';
import { ingestClothingImage } from '@/services/ingestion';
import { ClosetGrid } from '@/components/wardrobe/ClosetGrid';
import { FitCanvas } from '@/components/canvas/FitCanvas';
import { VibeCoachView } from '@/components/wardrobe/VibeCoachView';
import { WishlistView } from '@/components/wardrobe/WishlistView';
import { GarmentDetailModal } from '@/components/wardrobe/GarmentDetailModal';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('auracloset-theme');
        if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      } catch {
        // fallback to light
      }
    }
    return 'light';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('canvas');
  const [items, setItems] = useState<GarmentItem[]>([]);
  const [activeOutfit, setActiveOutfit] = useState<StylistResponse | null>(null);
  const [vibeCoachResponse, setVibeCoachResponse] = useState<StylistResponse | null>(null);
  const [wishlistSuggestions, setWishlistSuggestions] = useState<WishlistSuggestion[]>([]);
  const [lastPrompt, setLastPrompt] = useState('');
  const [allowOnlineSearch, setAllowOnlineSearch] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isStylistLoading, setIsStylistLoading] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [inspectingItem, setInspectingItem] = useState<GarmentItem | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Synchronize document root and body classes whenever theme state changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body?.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body?.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('auracloset-theme', newTheme);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }

    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      document.body?.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body?.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  };

  const toggleTheme = () => {
    handleSetTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const loadedItems = await initializeLocalDb();
        setItems(loadedItems);
        setWishlistSuggestions(await getWishlistSuggestions());
      } catch (err) {
        console.error('Failed to load local DB, falling back to mock wardrobe:', err);
        setItems(MOCK_WARDROBE);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const ownedItems = items.filter((item) => item.isOwned);
  const wishlistItems = items.filter((item) => !item.isOwned);

  // Handle prompt submission
  const handlePromptSubmit = async (prompt: string, allowOnline: boolean) => {
    setIsStylistLoading(true);
    setStatusMessage('');
    setLastPrompt(prompt);
    try {
      const response = await askGemmaStylist(prompt, ownedItems, allowOnline);
      setActiveOutfit(response);
      if (response.mode === 'vibe_coach') {
        setVibeCoachResponse(response);
      }
      const wishlistNames = [
        ...(response.wishlistSuggestions ?? []),
        ...response.missingPieces.map((piece) => piece.description),
      ];
      if (wishlistNames.length) {
        const saved = await saveWishlistSuggestions(wishlistNames, prompt);
        setWishlistSuggestions(saved);
      }
      setActiveTab(response.mode === 'vibe_coach' ? 'vibecoach' : 'canvas');
      setStatusMessage(response.provider === 'offline-fallback'
        ? 'Gemma is unavailable; showing an offline closet-based suggestion.'
        : '');
    } catch (error) {
      console.error('Stylist request failed:', error);
      setStatusMessage('The stylist could not create a response. Please try again.');
    } finally {
      setIsStylistLoading(false);
    }
  };

  const handlePhotoSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file || isIngesting) return;
    setIsIngesting(true);
    setStatusMessage('Removing the background and identifying garment details…');
    try {
      const garment = await ingestClothingImage(file);
      const item: GarmentItem = {
        ...garment,
        id: crypto.randomUUID(),
        userId: 'user_local_auracloset',
        createdAt: new Date().toISOString(),
      };
      await db.wardrobeItems.put(item);
      setItems((current) => [...current, item]);
      setActiveTab('closet');
      setStatusMessage(`${item.metadata.name} was added to your closet.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Could not add that photo. Please try another.');
    } finally {
      setIsIngesting(false);
    }
  };

  const handleSaveOutfit = async () => {
    if (!activeOutfit) return;
    await saveOutfit({
      userId: 'user_local_auracloset',
      title: activeOutfit.outfitTitle,
      prompt: lastPrompt,
      selectedItemIds: activeOutfit.selectedItemIds,
      stylistNotes: activeOutfit.stylistNotes,
      accessoryAdvice: activeOutfit.accessoryAdvice,
    });
  };

  // Mark an item as owned (moves from Wishlist to My Closet)
  const handleMarkAsOwned = async (itemId: string) => {
    try {
      await db.wardrobeItems.update(itemId, { isOwned: true });
    } catch (e) {
      console.warn('Dexie update bypassed:', e);
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isOwned: true } : item))
    );
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await db.wardrobeItems.delete(itemId);
    } catch (e) {
      console.warn('Dexie delete bypassed:', e);
    }
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleRemoveSuggestion = async (id: string) => {
    await removeWishlistSuggestion(id);
    setWishlistSuggestions((current) => current.filter((suggestion) => suggestion.id !== id));
  };

  // Remove item from currently styled outfit
  const handleRemoveItemFromFit = (itemId: string) => {
    if (!activeOutfit) return;
    setActiveOutfit({
      ...activeOutfit,
      selectedItemIds: activeOutfit.selectedItemIds.filter((id) => id !== itemId),
    });
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-[#FAF9F6] text-[#111215] dark:bg-[#0B0C0E] dark:text-[#F4F5F7] flex flex-col font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-200`}>
      <Header
        ownedCount={ownedItems.length}
        wishlistCount={wishlistItems.length + wishlistSuggestions.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSetTheme={handleSetTheme}
        onAddClick={() => uploadInputRef.current?.click()}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="sr-only"
        onChange={handlePhotoSelected}
        aria-label="Choose a garment photo"
      />
      {(statusMessage || isIngesting) && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3" role="status" aria-live="polite">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{statusMessage}</p>
        </div>
      )}

      <TabNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        ownedCount={ownedItems.length}
        wishlistCount={wishlistItems.length + wishlistSuggestions.length}
        hasActiveFit={!!activeOutfit}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-zinc-500 text-xs tracking-wider uppercase font-mono">
            Loading digital wardrobe from local memory...
          </div>
        ) : (
          <div>
            {/* View 1: Fit Studio Canvas */}
            {activeTab === 'canvas' && (
              <FitCanvas
                activeOutfit={activeOutfit}
                wardrobeItems={items}
                onPromptSubmit={handlePromptSubmit}
                allowOnlineSearch={allowOnlineSearch}
                onToggleOnlineSearch={setAllowOnlineSearch}
                onRemoveItemFromFit={handleRemoveItemFromFit}
                onViewWishlist={() => setActiveTab('wishlist')}
                onItemClick={(item) => setInspectingItem(item)}
                isLoading={isStylistLoading}
                onSaveOutfit={handleSaveOutfit}
              />
            )}

            {/* View 2: My Closet */}
            {activeTab === 'closet' && (
              <div className="py-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                      My Wardrobe Inventory
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Your wardrobe, stored on this device
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-700 dark:text-zinc-400 bg-[#E8E6DF] dark:bg-[#16171B] px-2.5 py-1 rounded border border-[#D8D5CC] dark:border-[#22242B] tabular-nums">
                    {ownedItems.length} pieces
                  </span>
                </div>

                <ClosetGrid
                  items={ownedItems}
                  selectedItemIds={activeOutfit?.selectedItemIds || []}
                  onToggleItemInFit={(id) => {
                    const current = activeOutfit ?? {
                      mode: 'outfit_builder' as const,
                      outfitTitle: 'Manual fit',
                      stylistNotes: 'Select pieces from your closet to build a fit.',
                      selectedItemIds: [],
                      accessoryAdvice: '',
                      missingPieces: [],
                    };
                    const exists = current.selectedItemIds.includes(id);
                    const newIds = exists
                      ? current.selectedItemIds.filter((item) => item !== id)
                      : [...current.selectedItemIds, id];
                    setActiveOutfit({
                      ...current,
                      selectedItemIds: newIds,
                    });
                  }}
                />
              </div>
            )}

            {/* View 3: Vibe Coach */}
            {activeTab === 'vibecoach' && (
              <VibeCoachView
                items={ownedItems}
                stylistResponse={vibeCoachResponse}
                onApplyPrompt={(prompt) => handlePromptSubmit(prompt, allowOnlineSearch)}
              />
            )}

            {/* View 4: To-Buy Wishlist */}
            {activeTab === 'wishlist' && (
              <WishlistView
                wishlistItems={wishlistItems}
                suggestions={wishlistSuggestions}
                onMarkAsOwned={handleMarkAsOwned}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onRemoveSuggestion={handleRemoveSuggestion}
              />
            )}
          </div>
        )}
      </main>

      {/* Global Garment Detail Modal */}
      <GarmentDetailModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        isIncludedInFit={
          inspectingItem && activeOutfit
            ? activeOutfit.selectedItemIds.includes(inspectingItem.id)
            : false
        }
        onSelectForFit={(id) => {
          if (!activeOutfit) return;
          const exists = activeOutfit.selectedItemIds.includes(id);
          const newIds = exists
            ? activeOutfit.selectedItemIds.filter((item) => item !== id)
            : [...activeOutfit.selectedItemIds, id];
          setActiveOutfit({
            ...activeOutfit,
            selectedItemIds: newIds,
          });
        }}
      />
    </div>
  );
}
