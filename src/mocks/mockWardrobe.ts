import type { Category, GarmentItem, GarmentMetadata, StylistResponse } from '@/types/closet';

type Seed = {
  id: string;
  image: string;
  category: Category;
  name: string;
  subcategory: string;
  color: string;
  materials: string[];
  vibes: string[];
  seasons: GarmentMetadata['seasonality'];
  weather: GarmentMetadata['weatherSuitability'];
  formality: number;
};

// These are the user's 16 supplied photos. Keep their stable IDs so saved
// outfits continue to refer to the same seed records after the image update.
const seeds: Seed[] = [
  { id: 'item_carhartt_detroit', image: 'brown-shearling-jacket', category: 'outerwear', name: 'Brown Sherpa Collar Jacket', subcategory: 'lined jacket', color: '#5A4436', materials: ['suede-like outer', 'sherpa-like lining'], vibes: ['workwear', 'casual', 'vintage'], seasons: ['fall', 'winter'], weather: ['mild', 'windy'], formality: 4 },
  { id: 'item_overcoat_charcoal', image: 'camo-hoodie', category: 'top', name: 'Woodland Camouflage Hoodie', subcategory: 'pullover hoodie', color: '#969589', materials: ['fleece fabric'], vibes: ['streetwear', 'outdoors', 'casual'], seasons: ['fall', 'winter', 'spring'], weather: ['mild', 'windy'], formality: 2 },
  { id: 'item_washed_hoodie', image: 'blue-jordan-hoodie', category: 'top', name: 'Blue Jordan Hoodie', subcategory: 'pullover hoodie', color: '#5481A0', materials: ['sweatshirt fabric'], vibes: ['sportswear', 'streetwear', 'casual'], seasons: ['fall', 'winter', 'spring'], weather: ['mild', 'windy'], formality: 2 },
  { id: 'item_boxy_white_tee', image: 'white-tee', category: 'top', name: 'Plain White Crewneck Tee', subcategory: 't-shirt', color: '#F3F3F2', materials: ['jersey fabric'], vibes: ['minimalist', 'casual', 'staple'], seasons: ['spring', 'summer', 'fall'], weather: ['sunny', 'mild'], formality: 3 },
  { id: 'item_cream_knit', image: 'black-polo', category: 'top', name: 'Black Polo Shirt', subcategory: 'polo shirt', color: '#161719', materials: ['knit fabric'], vibes: ['preppy', 'casual', 'minimalist'], seasons: ['spring', 'summer', 'fall'], weather: ['sunny', 'mild'], formality: 5 },
  { id: 'item_vintage_band_tee', image: 'black-tee', category: 'top', name: 'Plain Black Crewneck Tee', subcategory: 't-shirt', color: '#202020', materials: ['jersey fabric'], vibes: ['minimalist', 'casual', 'staple'], seasons: ['spring', 'summer', 'fall'], weather: ['sunny', 'mild'], formality: 3 },
  { id: 'item_double_knee_pants', image: 'washed-denim-shorts', category: 'bottom', name: 'Washed Denim Cutoff Shorts', subcategory: 'denim shorts', color: '#536675', materials: ['denim'], vibes: ['streetwear', 'casual', 'vintage'], seasons: ['spring', 'summer'], weather: ['sunny', 'mild'], formality: 2 },
  { id: 'item_raw_selvedge_denim', image: 'dark-denim-jeans', category: 'bottom', name: 'Dark Indigo Straight-Leg Jeans', subcategory: 'jeans', color: '#263648', materials: ['denim'], vibes: ['classic', 'minimalist', 'casual'], seasons: ['spring', 'summer', 'fall', 'winter'], weather: ['sunny', 'mild', 'windy'], formality: 4 },
  { id: 'item_pleated_trousers', image: 'gray-joggers', category: 'bottom', name: 'Heather Gray Joggers', subcategory: 'sweatpants', color: '#A8A8A4', materials: ['fleece fabric'], vibes: ['sportswear', 'casual', 'cozy'], seasons: ['fall', 'winter', 'spring'], weather: ['mild'], formality: 2 },
  { id: 'item_lug_chelsea_boots', image: 'blue-white-sneakers', category: 'footwear', name: 'Blue and White Low-Top Sneakers', subcategory: 'sneakers', color: '#4B93BE', materials: ['leather-like upper', 'rubber sole'], vibes: ['streetwear', 'sportswear', 'casual'], seasons: ['spring', 'summer', 'fall'], weather: ['sunny', 'mild'], formality: 3 },
  { id: 'item_salomon_xt6', image: 'taupe-clogs', category: 'footwear', name: 'Taupe Suede-Look Clogs', subcategory: 'clogs', color: '#706252', materials: ['suede-like upper', 'cork-look footbed'], vibes: ['relaxed', 'casual', 'minimalist'], seasons: ['spring', 'summer', 'fall'], weather: ['sunny', 'mild'], formality: 2 },
  { id: 'item_cuban_chain', image: 'silver-wing-ring', category: 'accessory', name: 'Silver Wing Ring', subcategory: 'statement ring', color: '#777B79', materials: ['silver-tone metal'], vibes: ['grunge', 'statement', 'streetwear'], seasons: ['spring', 'summer', 'fall', 'winter'], weather: ['sunny', 'mild', 'windy'], formality: 4 },
  { id: 'item_vintage_tank_watch', image: 'black-beanie', category: 'accessory', name: 'Black Cuffed Beanie', subcategory: 'beanie', color: '#131725', materials: ['knit fabric'], vibes: ['workwear', 'streetwear', 'casual'], seasons: ['fall', 'winter'], weather: ['mild', 'windy'], formality: 2 },
  { id: 'item_silver_signet_ring', image: 'amber-sunglasses', category: 'accessory', name: 'Amber-Lens Black Sunglasses', subcategory: 'sunglasses', color: '#1C1C1C', materials: ['plastic frame', 'tinted lenses'], vibes: ['retro', 'statement', 'streetwear'], seasons: ['spring', 'summer', 'fall'], weather: ['sunny'], formality: 4 },
  { id: 'item_wishlist_leather_trench', image: 'black-nike-shorts', category: 'bottom', name: 'Black Nike Fleece Shorts', subcategory: 'athletic shorts', color: '#1B1B23', materials: ['fleece fabric'], vibes: ['sportswear', 'streetwear', 'casual'], seasons: ['spring', 'summer'], weather: ['sunny', 'mild'], formality: 2 },
  { id: 'item_wishlist_sling_bag', image: 'black-dress-shoes', category: 'footwear', name: 'Black Leather-Look Dress Shoes', subcategory: 'lace-up dress shoes', color: '#1A2026', materials: ['leather-like upper'], vibes: ['classic', 'formal', 'minimalist'], seasons: ['spring', 'summer', 'fall', 'winter'], weather: ['sunny', 'mild'], formality: 8 },
];

export const MOCK_WARDROBE: GarmentItem[] = seeds.map((seed, index) => ({
  id: seed.id,
  userId: 'user_default',
  originalImageUrl: `/wardrobe/${seed.image}.png`,
  cutoutImageUrl: '',
  category: seed.category,
  metadata: {
    name: seed.name,
    subcategory: seed.subcategory,
    primaryColorHex: seed.color,
    materials: seed.materials,
    vibeTags: seed.vibes,
    seasonality: seed.seasons,
    weatherSuitability: seed.weather,
    formalityScore: seed.formality,
  },
  isOwned: true,
  createdAt: new Date(Date.UTC(2026, 9, 1 + index)).toISOString(),
}));

export const MOCK_STYLIST_RESPONSES: Record<string, StylistResponse> = {
  rain: {
    mode: 'outfit_builder',
    outfitTitle: 'Layered Everyday Fit',
    stylistNotes: 'Layer the blue hoodie under the brown jacket with dark jeans. Change to weatherproof footwear for heavy rain; the sneakers have no verified water resistance.',
    selectedItemIds: ['item_carhartt_detroit', 'item_washed_hoodie', 'item_raw_selvedge_denim', 'item_lug_chelsea_boots'],
    accessoryAdvice: 'Add the black beanie in cooler weather.',
    missingPieces: [{ category: 'footwear', description: 'Water-resistant boots', searchQuery: 'water-resistant casual boots', reasonNeeded: 'The current shoes are not verified as suitable for heavy rain.' }],
  },
  concert: {
    mode: 'outfit_builder',
    outfitTitle: 'Black Tee and Indigo',
    stylistNotes: 'Pair the black tee with dark jeans and blue sneakers for a simple concert outfit.',
    selectedItemIds: ['item_vintage_band_tee', 'item_raw_selvedge_denim', 'item_lug_chelsea_boots', 'item_silver_signet_ring'],
    accessoryAdvice: 'Amber-lens sunglasses work for an outdoor daytime event.',
    missingPieces: [],
  },
  nonchalant: {
    mode: 'vibe_coach',
    outfitTitle: 'Relaxed Layers',
    stylistNotes: 'Wear the white tee untucked with dark jeans, an open brown jacket, and taupe clogs. Keep the silhouette loose.',
    selectedItemIds: ['item_carhartt_detroit', 'item_boxy_white_tee', 'item_raw_selvedge_denim', 'item_salomon_xt6'],
    accessoryAdvice: 'Use the black beanie for a casual finish.',
    missingPieces: [],
  },
};
