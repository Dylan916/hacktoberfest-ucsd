import Dexie, { type Table } from "dexie";
import type { GarmentItem } from "@/types/garment";

export interface SavedOutfit {
  id?: number;
  name: string;
  itemIds: string[];
  notes?: string;
  createdAt: string;
  prompt?: string;
}

class WardrobeDatabase extends Dexie {
  wardrobeItems!: Table<GarmentItem, string>;
  savedOutfits!: Table<SavedOutfit, number>;

  constructor() {
    super("wardrobe-stylist");
    this.version(1).stores({
      wardrobeItems: "id, category, color, season, *tags",
      savedOutfits: "++id, name, createdAt",
    });
  }
}

export const localDb = new WardrobeDatabase();

export async function getWardrobeItems(): Promise<GarmentItem[]> {
  return localDb.wardrobeItems.toArray();
}

export async function saveOutfit(
  outfit: Omit<SavedOutfit, "id" | "createdAt">,
): Promise<number> {
  return localDb.savedOutfits.add({
    ...outfit,
    createdAt: new Date().toISOString(),
  });
}
