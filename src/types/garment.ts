export type GarmentCategory =
  | "top"
  | "bottom"
  | "outerwear"
  | "shoes"
  | "accessory"
  | "one-piece"
  | "other";

/** Flexible closet metadata so existing inventory records can be passed through. */
export interface GarmentItem {
  id: string;
  name: string;
  category: GarmentCategory | string;
  color?: string;
  material?: string;
  fit?: string;
  silhouette?: string;
  season?: string | string[];
  occasion?: string | string[];
  weather?: string | string[];
  tags?: string[];
  description?: string;
  [metadata: string]: unknown;
}

export interface OutfitLook {
  name: string;
  itemIds: string[];
  rationale: string;
  stylingNotes: string[];
}

export interface MissingPiece {
  item: string;
  reason: string;
  priority: "essential" | "helpful";
}

export interface StylistResponse {
  mode: "outfit" | "vibe-coach";
  summary: string;
  outfits: OutfitLook[];
  missingPieces: MissingPiece[];
  closetAudit: Array<{ itemId: string; whyItWorks: string; stylingTip: string }>;
  wishlist: string[];
  provider: "gemma-api" | "local-gemma" | "offline-fallback";
}
