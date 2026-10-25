import type { GarmentItem, StylistResponse } from "@/types/garment";

export const STYLIST_SYSTEM_PROMPT = `You are an elite, practical personal stylist. Use only the supplied closet items for outfit components. Respect event and weather constraints when present; never claim an item is waterproof, warm, formal, or otherwise suitable unless its metadata supports that. Balance silhouettes (for example, fitted top with relaxed/baggy bottom, or oversized layer with relaxed pants). Always inspect accessories, including chains, watches, rings, belts, and bags, and say when an accessory would complete the look. Name required pieces the closet lacks in missingPieces. Give actionable styling notes such as cuffing, layering, tucking, or adjusting proportions. If the request is about an aesthetic or how to dress more [adjective/adverb], enter vibe-coach mode: inspect the metadata for every closet item and include every closet ID in closetAudit, noting whether/how it supports the aesthetic and how to style it; provide exactly three specific staple additions in wishlist. Never invent closet item IDs. Return only a JSON object matching the requested shape.`;

export function buildStylistInput(prompt: string, closet: GarmentItem[]): string {
  return JSON.stringify({
    task: prompt,
    closet,
    responseShape: {
      mode: "outfit | vibe-coach",
      summary: "string",
      outfits: [{ name: "string", itemIds: ["existing closet id"], rationale: "string", stylingNotes: ["string"] }],
      missingPieces: [{ item: "string", reason: "string", priority: "essential | helpful" }],
      closetAudit: [{ itemId: "every existing closet id in vibe-coach mode", whyItWorks: "string", stylingTip: "string" }],
      wishlist: ["string (exactly 3 in vibe-coach mode)"]
    }
  });
}

export function parseStylistResponse(raw: string, closet: GarmentItem[]): Omit<StylistResponse, "provider"> {
  const json = raw.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error("Stylist response did not contain JSON.");
  const value = JSON.parse(json) as Partial<StylistResponse>;
  const validIds = new Set(closet.map((item) => item.id));
  const mode = value.mode === "vibe-coach" ? "vibe-coach" : "outfit";
  const wishlist = Array.isArray(value.wishlist) ? value.wishlist.filter((item): item is string => typeof item === "string").slice(0, 3) : [];
  const defaultWishlist = ["Relaxed straight-leg trousers", "A soft, roomy overshirt", "Minimal low-profile sneakers"];
  while (mode === "vibe-coach" && wishlist.length < 3) wishlist.push(defaultWishlist[wishlist.length]);

  return {
    mode,
    summary: typeof value.summary === "string" ? value.summary : "Here’s a direction for your look.",
    outfits: Array.isArray(value.outfits) ? value.outfits.map((outfit) => ({
      name: String(outfit.name ?? "Look"),
      itemIds: Array.isArray(outfit.itemIds) ? outfit.itemIds.filter((id): id is string => typeof id === "string" && validIds.has(id)) : [],
      rationale: String(outfit.rationale ?? ""),
      stylingNotes: Array.isArray(outfit.stylingNotes) ? outfit.stylingNotes.filter((note): note is string => typeof note === "string") : [],
    })) : [],
    missingPieces: Array.isArray(value.missingPieces) ? value.missingPieces.map((piece) => ({
      item: String(piece.item ?? "Unspecified item"),
      reason: String(piece.reason ?? "Would help complete the look."),
      priority: piece.priority === "essential" ? "essential" : "helpful",
    })) : [],
    closetAudit: Array.isArray(value.closetAudit) ? value.closetAudit
      .filter((entry) => typeof entry.itemId === "string" && validIds.has(entry.itemId))
      .map((entry) => ({ itemId: entry.itemId, whyItWorks: String(entry.whyItWorks ?? ""), stylingTip: String(entry.stylingTip ?? "") })) : [],
    wishlist,
  };
}

export function offlineStylistResponse(prompt: string, closet: GarmentItem[]): Omit<StylistResponse, "provider"> {
  const isVibeCoach = /nonchalant|aesthetic|vibe|style more|dress more/i.test(prompt);
  const byCategory = (...categories: string[]) => closet.filter((item) => categories.includes(item.category.toLowerCase()));
  const top = byCategory("top")[0];
  const bottom = byCategory("bottom")[0];
  const layer = byCategory("outerwear")[0];
  const shoes = byCategory("shoes")[0];
  const accessories = byCategory("accessory");
  const selected = [top, bottom, layer, shoes, ...accessories.slice(0, 2)].filter((item): item is GarmentItem => Boolean(item));
  const accessoryNames = accessories.map((item) => item.name);

  return {
    mode: isVibeCoach ? "vibe-coach" : "outfit",
    summary: isVibeCoach
      ? "For a more nonchalant feel, start with relaxed proportions and low-effort finishing. This is an offline closet scan; connect a Gemma model for a personalized audit."
      : "A quick closet-based starting point. Connect a Gemma model for more nuanced weather and event coaching.",
    outfits: !isVibeCoach && selected.length ? [{
      name: "Easy proportion play",
      itemIds: selected.map((item) => item.id),
      rationale: "Pair a top and bottom, then add a layer and shoes if they suit the occasion and weather.",
      stylingNotes: ["Try a single cuff at the hem or sleeve to make the proportions feel intentional.", ...(accessoryNames.length ? [`Consider finishing with ${accessoryNames.join(", ")}.`] : ["Check whether a chain, watch, rings, or a bag would finish the look."])],
    }] : [],
    missingPieces: !isVibeCoach && (!top || !bottom || !shoes) ? [{
      item: !top ? "A versatile top" : !bottom ? "A versatile bottom" : "Occasion-appropriate shoes",
      reason: "Your closet is missing a core outfit category for this starting look.",
      priority: "helpful",
    }] : [],
    closetAudit: isVibeCoach ? closet.map((item) => ({
      itemId: item.id,
      whyItWorks: `${item.name} can contribute to a relaxed wardrobe depending on its fit and fabric.`,
      stylingTip: item.category.toLowerCase() === "bottom" ? "Try a casual cuff and keep the top half simple." : "Wear it with relaxed layers and an unforced finish.",
    })) : [],
    wishlist: isVibeCoach ? ["Relaxed straight-leg trousers", "A soft, roomy overshirt", "Minimal low-profile sneakers"] : [],
  };
}
