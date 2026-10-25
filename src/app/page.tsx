'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { TabNav, ActiveTab } from '@/components/layout/TabNav';
import { GarmentItem, StylistResponse } from '@/types/closet';
import { MOCK_WARDROBE, MOCK_STYLIST_RESPONSES } from '@/mocks/mockWardrobe';
import { db, initializeLocalDb } from '@/lib/localDb';
import { ClosetGrid } from '@/components/wardrobe/ClosetGrid';
import { FitCanvas } from '@/components/canvas/FitCanvas';
import { VibeCoachView } from '@/components/wardrobe/VibeCoachView';
import { WishlistView } from '@/components/wardrobe/WishlistView';
import { GarmentDetailModal } from '@/components/wardrobe/GarmentDetailModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('canvas');
  const [items, setItems] = useState<GarmentItem[]>([]);
  const [activeOutfit, setActiveOutfit] = useState<StylistResponse | null>(MOCK_STYLIST_RESPONSES.rain);
  const [allowOnlineSearch, setAllowOnlineSearch] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isStylistLoading, setIsStylistLoading] = useState(false);
  const [inspectingItem, setInspectingItem] = useState<GarmentItem | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const loadedItems = await initializeLocalDb();
        setItems(loadedItems);
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
  const handlePromptSubmit = (prompt: string, allowOnline: boolean) => {
    setIsStylistLoading(true);
    const lower = prompt.toLowerCase();

    setTimeout(() => {
      let matchedResponse: StylistResponse;

      if (lower.includes('rain') || lower.includes('water') || lower.includes('wet')) {
        matchedResponse = MOCK_STYLIST_RESPONSES.rain;
      } else if (lower.includes('concert') || lower.includes('music') || lower.includes('grunge') || lower.includes('jewelry')) {
        matchedResponse = MOCK_STYLIST_RESPONSES.concert;
      } else if (lower.includes('nonchalant') || lower.includes('casual') || lower.includes('wide')) {
        matchedResponse = MOCK_STYLIST_RESPONSES.nonchalant;
      } else {
        // Dynamic adaptive fit
        matchedResponse = {
          mode: 'outfit_builder',
          outfitTitle: `Custom Styling for: "${prompt}"`,
          stylistNotes: `Gemma assembled this balanced look based on your natural language prompt. We combined relaxed silhouettes with grounded footwear and metallic accessories to create an intentional, curated aesthetic.`,
          selectedItemIds: [
            'item_carhartt_detroit',
            'item_boxy_white_tee',
            'item_raw_selvedge_denim',
            'item_salomon_xt6',
            'item_cuban_chain',
          ],
          accessoryAdvice: 'The silver Cuban chain and tank watch anchor this look with quiet, refined luxury.',
          missingPieces: allowOnline
            ? [
                {
                  category: 'accessory',
                  description: 'Matte black structured leather tote bag',
                  searchQuery: 'minimalist black leather structured tote bag',
                  reasonNeeded: 'Adds functional elegance and balances the relaxed denim silhouette.',
                },
              ]
            : [],
        };
      }

      setActiveOutfit(matchedResponse);
      setIsStylistLoading(false);
      setActiveTab('canvas');
    }, 600);
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

  // Remove item from currently styled outfit
  const handleRemoveItemFromFit = (itemId: string) => {
    if (!activeOutfit) return;
    setActiveOutfit({
      ...activeOutfit,
      selectedItemIds: activeOutfit.selectedItemIds.filter((id) => id !== itemId),
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F4F5F7] flex flex-col font-sans selection:bg-zinc-800 selection:text-zinc-100">
      <Header
        ownedCount={ownedItems.length}
        wishlistCount={wishlistItems.length}
        onAddClick={() => alert('Camera Ingestion (Track 2) will open client-side background removal')}
      />

      <TabNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        ownedCount={ownedItems.length}
        wishlistCount={wishlistItems.length}
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
              />
            )}

            {/* View 2: My Closet */}
            {activeTab === 'closet' && (
              <div className="py-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
                      My Wardrobe Inventory
                    </h1>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Client-side isolated cutouts stored locally in Dexie.js
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 bg-[#16171B] px-2.5 py-1 rounded border border-[#22242B] tabular-nums">
                    {ownedItems.length} pieces
                  </span>
                </div>

                <ClosetGrid
                  items={ownedItems}
                  selectedItemIds={activeOutfit?.selectedItemIds || []}
                  onToggleItemInFit={(id) => {
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
            )}

            {/* View 3: Vibe Coach */}
            {activeTab === 'vibecoach' && (
              <VibeCoachView
                items={ownedItems}
                onApplyPrompt={(prompt) => handlePromptSubmit(prompt, allowOnlineSearch)}
              />
            )}

            {/* View 4: To-Buy Wishlist */}
            {activeTab === 'wishlist' && (
              <WishlistView
                wishlistItems={wishlistItems}
                onMarkAsOwned={handleMarkAsOwned}
                onRemoveFromWishlist={handleRemoveFromWishlist}
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
