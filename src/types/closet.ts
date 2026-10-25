export type Category = 'top' | 'bottom' | 'outerwear' | 'footwear' | 'accessory';

export interface GarmentMetadata {
  name: string;
  subcategory: string;
  primaryColorHex: string;
  secondaryColorHex?: string;
  materials: string[];
  vibeTags: string[];
  seasonality: ('spring' | 'summer' | 'fall' | 'winter')[];
  weatherSuitability: ('rain' | 'snow' | 'sunny' | 'windy' | 'mild')[];
  formalityScore: number;
}

export interface GarmentItem {
  id: string;
  userId: string;
  originalImageUrl: string;
  cutoutImageUrl: string;
  category: Category;
  metadata: GarmentMetadata;
  isOwned: boolean;
  buyUrl?: string;
  priceEstimate?: string;
  createdAt: string;
}

export interface MissingPieceSpec {
  category: Category;
  description: string;
  searchQuery: string;
  reasonNeeded: string;
}

export interface StylistResponse {
  mode: 'outfit_builder' | 'vibe_coach';
  outfitTitle: string;
  stylistNotes: string;
  selectedItemIds: string[];
  accessoryAdvice: string;
  missingPieces: MissingPieceSpec[];
}
