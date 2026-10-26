// src/types/closet.ts
// 🔒 LOCKED CONTRACT: Shared across Track 1 (UI), Track 2 (Vision), Track 3 (Stylist Brain), and Track 4 (Cloud/Gemini)

export type Category = 'top' | 'bottom' | 'outerwear' | 'footwear' | 'accessory';

export interface GarmentMetadata {
  name: string;               // e.g., "Vintage Faded Black Carhartt Jacket"
  subcategory: string;        // e.g., "work jacket", "baggy jeans", "silver chain"
  primaryColorHex: string;    // e.g., "#1C1C1E"
  secondaryColorHex?: string;
  materials: string[];        // e.g., ["heavy duck canvas", "cotton"]
  vibeTags: string[];         // e.g., ["nonchalant", "streetwear", "workwear", "grunge"]
  seasonality: ('spring' | 'summer' | 'fall' | 'winter')[];
  weatherSuitability: ('rain' | 'snow' | 'sunny' | 'windy' | 'mild')[];
  formalityScore: number;     // 1 (sweatpants) to 10 (tuxedo)
}

export interface GarmentItem {
  id: string;
  userId: string;
  originalImageUrl: string;
  cutoutImageUrl: string;     // Transparent PNG from Track 2
  category: Category;
  metadata: GarmentMetadata;
  isOwned: boolean;           // true = User's Closet | false = Potential Buy (Wishlist)
  buyUrl?: string;            // Populated by Track 4 if isOwned === false
  priceEstimate?: string;     // Populated by Track 4 if isOwned === false
  createdAt: string;
}

export interface MissingPieceSpec {
  category: Category;
  description: string;        // e.g., "Chunky silver Cuban link chain"
  searchQuery: string;        // e.g., "minimalist sterling silver 5mm cuban chain men"
  reasonNeeded: string;       // e.g., "Elevates the plain black tee for a concert setting"
}

export interface StylistResponse {
  mode: 'outfit_builder' | 'vibe_coach';
  outfitTitle: string;        // e.g., "Rainy Day Effortless Workwear"
  stylistNotes: string;       // Explanation of proportions, color, and how to wear it
  selectedItemIds: string[];  // IDs of owned items from the user's closet
  accessoryAdvice: string;    // Specific watch/chain/ring pairing advice
  missingPieces: MissingPieceSpec[]; // Used by Track 4 if "Find online" toggle is ON
  closetAudit?: ClosetAuditEntry[];
  wishlistSuggestions?: string[];
  provider?: 'gemma-api' | 'local-gemma' | 'offline-fallback';
  mannequinImageUrl?: string;
  mannequinVisionCritique?: string;
}

export interface ClosetAuditEntry {
  itemId: string;
  whyItWorks: string;
  stylingTip: string;
}

export interface WishlistSuggestion {
  id: string;
  name: string;
  reason: string;
  prompt: string;
  priceEstimate?: string;
  shopUrl?: string;
  retailer?: string;
  createdAt: string;
}

export interface SavedOutfit {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  selectedItemIds: string[];
  stylistNotes: string;
  accessoryAdvice?: string;
  mannequinImageUrl?: string;
  mannequinVisionCritique?: string;
  createdAt: string;
}
