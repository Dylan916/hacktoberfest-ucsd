// src/lib/localDb.ts
// Offline-first Dexie.js IndexedDB storage for wardrobe items and saved outfits
import Dexie, { type Table } from 'dexie';
import type { GarmentItem, SavedOutfit, WishlistSuggestion } from '@/types/closet';
import { MOCK_WARDROBE } from '@/mocks/mockWardrobe';

export class AuraClosetDatabase extends Dexie {
  wardrobeItems!: Table<GarmentItem, string>;
  savedOutfits!: Table<SavedOutfit, string>;
  wishlistSuggestions!: Table<WishlistSuggestion, string>;

  constructor() {
    super('AuraClosetDB');
    this.version(1).stores({
      wardrobeItems: 'id, userId, category, isOwned, createdAt, *metadata.vibeTags, *metadata.seasonality',
      savedOutfits: 'id, userId, createdAt',
    });
    this.version(2).stores({
      wardrobeItems: 'id, userId, category, isOwned, createdAt, *metadata.vibeTags, *metadata.seasonality',
      savedOutfits: 'id, userId, createdAt',
      wishlistSuggestions: 'id, createdAt',
    });
  }
}

export const db = new AuraClosetDatabase();
export const localDb = db;

/**
 * Initializes the local database and seeds it with mock wardrobe data if empty.
 * Ensures the app works 100% offline with zero latency on first launch.
 */
export async function initializeLocalDb(): Promise<GarmentItem[]> {
  try {
    await db.transaction('rw', db.wardrobeItems, async () => {
      const count = await db.wardrobeItems.count();
      if (count === 0) {
        await db.wardrobeItems.bulkPut(MOCK_WARDROBE);
        return;
      }

      // Earlier releases stored the default wardrobe in IndexedDB, so simply
      // changing the seed would leave existing browsers showing old photos.
      // Replace only untouched remote demo records and preserve uploaded items.
      const previousDefaults = await db.wardrobeItems
        .where('userId').equals('user_default').toArray();
      const newDefaults = new Map(MOCK_WARDROBE.map((item) => [item.id, item]));
      const replacements = previousDefaults
        .filter((item) => item.originalImageUrl.startsWith('https://images.unsplash.com/') && newDefaults.has(item.id))
        .map((item) => newDefaults.get(item.id)!);
      if (replacements.length) await db.wardrobeItems.bulkPut(replacements);
    });
    return await db.wardrobeItems.toArray();
  } catch (error) {
    console.error('Dexie initialization error, falling back to mock wardrobe in memory:', error);
    return MOCK_WARDROBE;
  }
}

export async function getWardrobeItems(): Promise<GarmentItem[]> {
  return db.wardrobeItems.toArray();
}

export async function saveOutfit(
  outfit: Omit<SavedOutfit, 'id' | 'createdAt'> & { id?: string },
): Promise<string> {
  const outfitId = outfit.id || `outfit_${Date.now()}`;
  const record: SavedOutfit = {
    ...outfit,
    id: outfitId,
    createdAt: new Date().toISOString(),
  };
  await db.savedOutfits.put(record);
  return outfitId;
}

export async function getWishlistSuggestions(): Promise<WishlistSuggestion[]> {
  return db.wishlistSuggestions.orderBy('createdAt').reverse().toArray();
}

import { formatGapFillSuggestions } from './gapFillService';

export async function saveWishlistSuggestions(
  items: Array<{ name: string; reason?: string; searchQuery?: string } | string>,
  prompt: string
): Promise<WishlistSuggestion[]> {
  const records = formatGapFillSuggestions(items, prompt);
  await db.wishlistSuggestions.bulkPut(records);
  return getWishlistSuggestions();
}

export async function removeWishlistSuggestion(id: string): Promise<void> {
  await db.wishlistSuggestions.delete(id);
}
