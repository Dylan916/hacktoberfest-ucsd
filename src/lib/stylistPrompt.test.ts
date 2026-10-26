import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { GarmentItem } from '@/types/closet';
import { buildStylistInput, offlineStylistResponse, parseStylistResponse } from './stylistPrompt.ts';

const closet: GarmentItem[] = [
  {
    id: 'tee', userId: 'local', originalImageUrl: '', cutoutImageUrl: '', category: 'top', isOwned: true, createdAt: '2026-10-25',
    metadata: { name: 'Boxy cotton tee', subcategory: 'oversized tee', primaryColorHex: '#F2F2F2', materials: ['cotton'], vibeTags: ['nonchalant'], seasonality: ['summer'], weatherSuitability: ['sunny'], formalityScore: 2 },
  },
  {
    id: 'trousers', userId: 'local', originalImageUrl: '', cutoutImageUrl: '', category: 'bottom', isOwned: true, createdAt: '2026-10-25',
    metadata: { name: 'Wide trousers', subcategory: 'relaxed trouser', primaryColorHex: '#222222', materials: ['wool'], vibeTags: ['minimalist'], seasonality: ['fall'], weatherSuitability: ['mild'], formalityScore: 6 },
  },
  {
    id: 'rain-boots', userId: 'local', originalImageUrl: '', cutoutImageUrl: '', category: 'footwear', isOwned: true, createdAt: '2026-10-25',
    metadata: { name: 'Rain boots', subcategory: 'waterproof boot', primaryColorHex: '#111111', materials: ['rubber'], vibeTags: ['utility'], seasonality: ['fall', 'winter'], weatherSuitability: ['rain', 'snow'], formalityScore: 1 },
  },
  {
    id: 'silver-chain', userId: 'local', originalImageUrl: '', cutoutImageUrl: '', category: 'accessory', isOwned: true, createdAt: '2026-10-25',
    metadata: { name: 'Silver chain', subcategory: 'chain necklace', primaryColorHex: '#C0C0C0', materials: ['silver'], vibeTags: ['minimalist'], seasonality: ['spring', 'summer', 'fall', 'winter'], weatherSuitability: ['mild'], formalityScore: 4 },
  },
  {
    id: 'wish-boots', userId: 'local', originalImageUrl: '', cutoutImageUrl: '', category: 'footwear', isOwned: false, createdAt: '2026-10-25',
    metadata: { name: 'Wishlist boots', subcategory: 'boot', primaryColorHex: '#111111', materials: ['leather'], vibeTags: [], seasonality: ['fall'], weatherSuitability: ['rain'], formalityScore: 3 },
  },
];

test('Track 1 prompt data carries only owned Track 2 closet records into Track 3', () => {
  const input = JSON.parse(buildStylistInput('rainy concert', closet)) as { ownedCloset: Array<Pick<GarmentItem, 'id' | 'category' | 'metadata'>>; responseShape: { selectedItemIds: string[] } };
  assert.deepEqual(input.ownedCloset.map((item) => item.id), ['tee', 'trousers', 'rain-boots', 'silver-chain']);
  assert.ok(input.ownedCloset.every((item) => !('originalImageUrl' in item) && !('userId' in item)));
  assert.ok(input.responseShape.selectedItemIds.includes('owned closet item id'));
});

test('response normalization keeps only owned IDs and returns a complete Vibe Coach audit and wishlist', () => {
  const response = parseStylistResponse(JSON.stringify({
    mode: 'vibe_coach', outfitTitle: 'Nonchalant closet', stylistNotes: 'Cuff and layer.', selectedItemIds: ['wish-boots', 'tee'],
    accessoryAdvice: 'Wear the chain.', missingPieces: [],
    closetAudit: [{ itemId: 'tee', whyItWorks: 'Loose shape.', stylingTip: 'Cuff the sleeve.' }],
    wishlistSuggestions: ['Relaxed trousers'],
  }), closet);
  assert.deepEqual(response.selectedItemIds, ['tee']);
  assert.deepEqual(response.closetAudit?.map((item) => item.itemId), ['tee', 'trousers', 'rain-boots', 'silver-chain']);
  assert.equal(response.wishlistSuggestions?.length, 3);
});

test('offline outfit builder respects rain suitability and checks concert accessories', () => {
  const rainy = offlineStylistResponse("It's raining, build me a fit", closet);
  assert.ok(rainy.selectedItemIds.includes('rain-boots'));
  assert.ok(!rainy.missingPieces.some((piece) => piece.category === 'footwear'));
  const concert = offlineStylistResponse("Concert outfit with a silver chain", closet.filter((item) => item.id !== 'silver-chain'));
  assert.ok(concert.missingPieces.some((piece) => piece.category === 'accessory' && /chain/i.test(piece.description)));
});

test('offline Vibe Coach audits every owned garment and returns three staples', () => {
  const response = offlineStylistResponse('I want to dress more nonchalantly', closet);
  assert.equal(response.mode, 'vibe_coach');
  assert.deepEqual(response.closetAudit?.map((item) => item.itemId), ['tee', 'trousers', 'rain-boots', 'silver-chain']);
  assert.equal(response.wishlistSuggestions?.length, 3);
});
