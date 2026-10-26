// src/lib/gapFillService.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateShoppingLink,
  estimatePriceRange,
  formatGapFillSuggestions,
} from './gapFillService.ts';

test('generateShoppingLink creates valid encoded Google Shopping URL', () => {
  const url = generateShoppingLink('minimalist black leather structured tote bag');
  assert.match(url, /^https:\/\/www\.google\.com\/search\?tbm=shop&q=/);
  assert.match(url, /minimalist%20black%20leather%20structured%20tote%20bag/);
});

test('estimatePriceRange assigns realistic bracket by garment category', () => {
  assert.equal(estimatePriceRange('Double-Breasted Wool Overcoat'), '$180 – $380');
  assert.equal(estimatePriceRange('Lug-Sole Chelsea Boots'), '$140 – $280');
  assert.equal(estimatePriceRange('Wide-Leg Raw Selvedge Denim'), '$70 – $150');
  assert.equal(estimatePriceRange('8mm Sterling Silver Cuban Chain'), '$50 – $160');
  assert.equal(estimatePriceRange('Heavyweight Boxy Crewneck Tee'), '$35 – $80');
});

test('formatGapFillSuggestions enriches missing pieces with prices and shop links', () => {
  const pieces = [
    {
      name: 'Matte black structured leather tote bag',
      reason: 'Adds functional elegance and balances the relaxed denim silhouette.',
      searchQuery: 'minimalist black leather structured tote bag',
    },
  ];

  const formatted = formatGapFillSuggestions(pieces, 'rainy workwear fit');
  assert.equal(formatted.length, 1);
  assert.equal(formatted[0].name, 'Matte black structured leather tote bag');
  assert.match(formatted[0].priceEstimate, /\$/);
  assert.match(formatted[0].shopUrl, /google\.com\/search/);
  assert.equal(formatted[0].retailer, 'Google Shopping');
});
