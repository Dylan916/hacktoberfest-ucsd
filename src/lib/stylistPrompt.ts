import type { Category, GarmentItem, StylistResponse } from '@/types/closet';

export const STYLIST_SYSTEM_PROMPT = `You are an elite personal stylist. Use only owned garments in selectedItemIds and never invent item IDs. Respect weather and event constraints, and never claim an item is waterproof or warm unless its metadata supports that. Balance silhouettes such as a fitted top with relaxed bottoms or an oversized layer with relaxed pants. Explicitly inspect accessories (chains, watches, rings, bags). If a crucial item is absent, describe it in missingPieces with category, description, searchQuery, and reasonNeeded. For aesthetic or closet-audit prompts, use mode vibe_coach, audit every closet item by its real metadata in closetAudit, give actionable styling tips such as cuffing or layering, and return exactly three specific wishlistSuggestions. Return only JSON matching the supplied shape.`;

export function buildStylistInput(prompt: string, closet: GarmentItem[]): string {
  return JSON.stringify({
    task: prompt,
    ownedCloset: closet.filter((item) => item.isOwned).map((item) => ({
      id: item.id,
      category: item.category,
      metadata: item.metadata,
    })),
    responseShape: {
      mode: 'outfit_builder | vibe_coach',
      outfitTitle: 'string',
      stylistNotes: 'string: proportion, event/weather fit, and styling actions',
      selectedItemIds: ['owned closet item id'],
      accessoryAdvice: 'string: specifically address available chains, watches, rings, and bags',
      missingPieces: [{
        category: 'top | bottom | outerwear | footwear | accessory',
        description: 'string',
        searchQuery: 'string',
        reasonNeeded: 'string',
      }],
      closetAudit: [{ itemId: 'every owned closet id in vibe_coach mode', whyItWorks: 'string', stylingTip: 'string' }],
      wishlistSuggestions: ['exactly 3 specific staples in vibe_coach mode'],
    },
  });
}

const categories: Category[] = ['top', 'bottom', 'outerwear', 'footwear', 'accessory'];

function defaultWishlist(): string[] {
  return ['Relaxed straight-leg trousers', 'A soft, roomy overshirt', 'Minimal low-profile sneakers'];
}

export function parseStylistResponse(raw: string, closet: GarmentItem[], prompt = ''): StylistResponse {
  const json = raw.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error('Stylist response did not contain JSON.');
  const value = JSON.parse(json) as Partial<StylistResponse>;
  const ownedCloset = closet.filter((item) => item.isOwned);
  const validIds = new Set(ownedCloset.map((item) => item.id));
  const mode = /\baudit\b/i.test(prompt) || value.mode === 'vibe_coach' ? 'vibe_coach' : 'outfit_builder';
  const fallbackAudit = mode === 'vibe_coach' && prompt ? offlineStylistResponse(`Audit: ${prompt}`, ownedCloset) : undefined;
  const wishlistSuggestions = Array.isArray(value.wishlistSuggestions)
    ? value.wishlistSuggestions.filter((item): item is string => typeof item === 'string').slice(0, 3)
    : [];
  while (mode === 'vibe_coach' && wishlistSuggestions.length < 3) {
    wishlistSuggestions.push((fallbackAudit?.wishlistSuggestions ?? defaultWishlist())[wishlistSuggestions.length]);
  }

  const modelAudit = new Map(
    (Array.isArray(value.closetAudit) ? value.closetAudit : [])
      .filter((entry) => typeof entry.itemId === 'string' && validIds.has(entry.itemId))
      .map((entry) => [entry.itemId, {
        itemId: entry.itemId,
        whyItWorks: String(entry.whyItWorks ?? ''),
        stylingTip: String(entry.stylingTip ?? ''),
      }]),
  );

  return {
    mode,
    outfitTitle: typeof value.outfitTitle === 'string' ? value.outfitTitle : 'A considered closet look',
    stylistNotes: typeof value.stylistNotes === 'string' ? value.stylistNotes : 'Start with the selected pieces and adjust the proportions to suit your day.',
    selectedItemIds: Array.isArray(value.selectedItemIds)
      ? [...new Set(value.selectedItemIds.filter((id): id is string => typeof id === 'string' && validIds.has(id)))]
      : [],
    accessoryAdvice: typeof value.accessoryAdvice === 'string' ? value.accessoryAdvice : 'Check whether a chain, watch, rings, or bag would complete the look.',
    missingPieces: Array.isArray(value.missingPieces) ? value.missingPieces.map((piece) => {
      const category = categories.includes(piece.category) ? piece.category : 'accessory';
      const description = String(piece.description ?? 'A versatile missing piece');
      return {
        category,
        description,
        searchQuery: String(piece.searchQuery ?? description),
        reasonNeeded: String(piece.reasonNeeded ?? 'Would help complete the requested look.'),
      };
    }) : [],
    closetAudit: mode === 'vibe_coach' ? ownedCloset.map((item) => modelAudit.get(item.id) ?? fallbackAudit?.closetAudit?.find((entry) => entry.itemId === item.id) ?? {
      itemId: item.id,
      whyItWorks: 'The stylist could not identify a clear match from the available metadata.',
      stylingTip: `Review the ${item.metadata.subcategory} fit and fabric beside the relaxed pieces in your closet.`,
    }) : [],
    wishlistSuggestions,
  };
}

function metadataText(item: GarmentItem): string {
  return [
    item.metadata.name,
    item.metadata.subcategory,
    ...item.metadata.materials,
    ...item.metadata.vibeTags,
  ].join(' ').toLowerCase();
}

export function offlineStylistResponse(prompt: string, closet: GarmentItem[]): StylistResponse {
  const ownedCloset = closet.filter((item) => item.isOwned);
  const lowerPrompt = prompt.toLowerCase();
  const isVibeCoach = /audit|nonchalant|aesthetic|vibe|style more|dress more/i.test(prompt);
  const hasRainConstraint = /rain|waterproof|wet|storm/i.test(prompt);
  const isConcert = /concert|music|show/i.test(prompt);
  const formal = /\b(formal|office|business|wedding|interview|smart)\b/i.test(prompt);
  const casual = /\b(casual|relaxed|streetwear|grunge|concert|nonchalant\w*)\b/i.test(prompt);
  const tokens = lowerPrompt.match(/[a-z]+/g)?.filter((word) => word.length > 2 && !['the', 'with', 'for', 'outfit', 'closet', 'build', 'want', 'more', 'dress', 'audit'].includes(word)) ?? [];
  const score = (item: GarmentItem) => {
    const text = metadataText(item);
    const matches = tokens.filter((token) => text.includes(token)).length;
    return matches * 10 + (formal ? item.metadata.formalityScore : casual ? 10 - item.metadata.formalityScore : 0);
  };
  const byCategory = (category: Category) => ownedCloset.filter((item) => item.category === category)
    .sort((a, b) => score(b) - score(a));
  const top = byCategory('top')[0];
  const bottom = byCategory('bottom')[0];
  const layer = byCategory('outerwear')[0];
  const footwear = byCategory('footwear');
  const shoes = hasRainConstraint
    ? footwear.find((item) => item.metadata.weatherSuitability.includes('rain'))
    : footwear[0];
  const accessories = byCategory('accessory');
  const chain = accessories.find((item) => /chain|necklace|pendant/.test(metadataText(item)));
  const selected = [top, bottom, layer, shoes, ...accessories.slice(0, 2)].filter((item): item is GarmentItem => Boolean(item));
  const missingPieces: StylistResponse['missingPieces'] = [];

  if (!top) missingPieces.push({ category: 'top', description: 'A versatile top', searchQuery: 'versatile everyday top', reasonNeeded: 'Your closet has no top to anchor this outfit.' });
  if (!bottom) missingPieces.push({ category: 'bottom', description: 'A versatile bottom', searchQuery: 'versatile everyday trousers', reasonNeeded: 'Your closet has no bottom to complete this outfit.' });
  if (!shoes) missingPieces.push({
    category: 'footwear',
    description: hasRainConstraint ? 'Waterproof or rain-rated footwear' : 'Occasion-appropriate footwear',
    searchQuery: hasRainConstraint ? 'waterproof shoes' : 'versatile everyday shoes',
    reasonNeeded: hasRainConstraint ? 'No owned shoes are tagged as suitable for rain.' : 'No shoes are recorded in your owned closet.',
  });
  if (isConcert && !chain && !accessories.some((item) => /ring|watch|bag/.test(metadataText(item)))) {
    missingPieces.push({ category: 'accessory', description: 'A silver chain or statement accessory', searchQuery: 'silver chain necklace', reasonNeeded: 'A jewelry accent can complete the concert look.' });
  }

  const requestedAesthetic = prompt.trim();
  return {
    mode: isVibeCoach ? 'vibe_coach' : 'outfit_builder',
    outfitTitle: isVibeCoach ? `Closet audit: ${requestedAesthetic}` : `Closet look for: ${prompt}`,
    stylistNotes: isVibeCoach
      ? `For “${requestedAesthetic}”, compare the recorded style tags and formality of each piece below. This offline audit uses keyword matches, not a full model interpretation.`
      : `For “${prompt}”, pair ${top?.metadata.name ?? 'a top'} with ${bottom?.metadata.name ?? 'a bottom'}. These are the closest metadata matches; offline matching may not cover every constraint. Waterproofing is only supported for pieces tagged for rain.`,
    selectedItemIds: isVibeCoach ? [] : selected.map((item) => item.id),
    accessoryAdvice: accessories.length
      ? `Your closet includes ${accessories.map((item) => item.metadata.name).join(', ')}. Use one or two accents; ${chain ? `${chain.metadata.name} can anchor the neckline.` : 'check how a chain, watch, ring, or bag balances the outfit.'}`
      : 'No accessories are recorded yet; a chain, watch, rings, or bag could finish the look.',
    missingPieces: isVibeCoach ? [] : missingPieces,
    closetAudit: isVibeCoach ? ownedCloset.map((item) => {
      const text = metadataText(item);
      const matches = tokens.some((token) => text.includes(token));
      return {
        itemId: item.id,
        whyItWorks: matches
          ? `${item.metadata.name} shares recorded style details with your request: “${requestedAesthetic}”. Formality: ${item.metadata.formalityScore}/10.`
          : `${item.metadata.name} has no direct keyword match for “${requestedAesthetic}”. Recorded tags: ${item.metadata.vibeTags.join(', ')}; formality: ${item.metadata.formalityScore}/10.`,
        stylingTip: formal
          ? 'Pair with your highest-formality pieces and check the required dress code; a neat tuck can sharpen the proportions.'
          : casual
            ? 'Try relaxed proportions and a casual cuff, checking the result against your requested style.'
            : `Compare this ${item.metadata.subcategory} with your goal before adding it; offline matching cannot infer styling details beyond its metadata.`,
      };
    }) : [],
    wishlistSuggestions: isVibeCoach ? (formal
      ? ['Tailored trousers for your requested dress code', 'A structured blazer', 'Polished leather dress shoes']
      : ['top', 'bottom', 'footwear'].map((category) => `${category} to explore for “${requestedAesthetic}” — verify fit and style before buying`)) : [],
  };
}
