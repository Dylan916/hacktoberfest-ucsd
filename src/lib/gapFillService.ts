// src/lib/gapFillService.ts
// Online gap-fill search grounding and price estimation for missing wardrobe pieces

export interface GapFillProduct {
  name: string;
  searchQuery: string;
  retailer: string;
  priceEstimate: string;
  shopUrl: string;
}

/**
 * Generates an active shopping search URL for the specified garment query.
 */
export function generateShoppingLink(query: string): string {
  const cleanQuery = encodeURIComponent(query.trim());
  return `https://www.google.com/search?tbm=shop&q=${cleanQuery}`;
}

/**
 * Estimates realistic market retail price brackets based on silhouette, category, and material hints.
 */
export function estimatePriceRange(description: string): string {
  const lower = description.toLowerCase();

  if (lower.includes('coat') || lower.includes('leather') || lower.includes('outerwear')) {
    return '$180 – $380';
  }
  if (lower.includes('jacket') || lower.includes('parka') || lower.includes('blazer')) {
    return '$120 – $260';
  }
  if (lower.includes('boot') || lower.includes('chelsea') || lower.includes('salomon') || lower.includes('loafer')) {
    return '$140 – $280';
  }
  if (lower.includes('sneaker') || lower.includes('runner') || lower.includes('shoe')) {
    return '$95 – $190';
  }
  if (lower.includes('tote') || lower.includes('bag') || lower.includes('backpack')) {
    return '$75 – $180';
  }
  if (lower.includes('trousers') || lower.includes('wool') || lower.includes('pleated')) {
    return '$90 – $195';
  }
  if (lower.includes('jeans') || lower.includes('denim') || lower.includes('carpenter') || lower.includes('pant')) {
    return '$70 – $150';
  }
  if (lower.includes('cashmere') || lower.includes('sweater') || lower.includes('knit')) {
    return '$85 – $190';
  }
  if (lower.includes('chain') || lower.includes('watch') || lower.includes('ring') || lower.includes('silver')) {
    return '$50 – $160';
  }
  if (lower.includes('hoodie') || lower.includes('sweatshirt')) {
    return '$65 – $130';
  }
  if (lower.includes('tee') || lower.includes('shirt') || lower.includes('top')) {
    return '$35 – $80';
  }

  return '$45 – $110';
}

/**
 * Formats a list of missing piece specs or raw string suggestions into grounded gap-fill items with active shopping links.
 */
export function formatGapFillSuggestions(
  items: Array<{ name: string; reason?: string; searchQuery?: string } | string>,
  prompt: string
) {
  const createdAt = new Date().toISOString();

  return items.map((item) => {
    const rawName = typeof item === 'string' ? item : item.name;
    const name = rawName.trim();
    const reason = typeof item === 'object' && item.reason
      ? item.reason
      : `Recommended by Gemma stylist for: "${prompt}"`;
    const query = typeof item === 'object' && item.searchQuery ? item.searchQuery : name;
    const priceEstimate = estimatePriceRange(name);
    const shopUrl = generateShoppingLink(query);

    const id = `suggestion_${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 60)}`;

    return {
      id,
      name,
      reason,
      prompt,
      priceEstimate,
      shopUrl,
      retailer: 'Google Shopping',
      createdAt,
    };
  });
}
