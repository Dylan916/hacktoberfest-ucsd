// src/lib/localDb.ts
// Offline-first Dexie.js IndexedDB storage for wardrobe items and saved outfits
import Dexie, { type Table } from 'dexie';
import { GarmentItem, SavedOutfit } from '@/types/closet';
import { MOCK_WARDROBE } from '@/mocks/mockWardrobe';

export class AuraClosetDatabase extends Dexie {
  wardrobeItems!: Table<GarmentItem, string>;
  savedOutfits!: Table<SavedOutfit, string>;

  constructor() {
    super('AuraClosetDB');
    this.version(1).stores({
      wardrobeItems: 'id, userId, category, isOwned, createdAt, *metadata.vibeTags, *metadata.seasonality',
      savedOutfits: 'id, userId, createdAt',
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
    const count = await db.wardrobeItems.count();
    if (count === 0) {
      console.log('Seeding AuraCloset local Dexie database with initial editorial wardrobe...');
      await db.wardrobeItems.bulkPut(MOCK_WARDROBE);
    }
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
