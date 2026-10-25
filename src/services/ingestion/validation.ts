import type { Category, GarmentMetadata } from '../../types/closet';

export type GarmentAnalysis = { category: Category; metadata: GarmentMetadata };
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VISION_BYTES = 600 * 1024;

export function validateImage(image: Blob): void {
  if (!(image instanceof Blob) || !image.size) throw new Error('Choose a nonempty image.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) {
    throw new Error('Use a JPEG, PNG, or WebP photo. Convert HEIC photos first.');
  }
  if (image.size > MAX_IMAGE_BYTES) throw new Error('Choose an image smaller than 10 MB.');
}

export function parseGarmentAnalysis(text: string): GarmentAnalysis {
  const fail = (): never => { throw new Error('Vision returned invalid garment metadata. Please try another photo.'); };
  let data: unknown;
  try { data = JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')); }
  catch { return fail(); }
  if (!data || typeof data !== 'object') return fail();
  const { category, metadata } = data as Record<string, unknown>;
  if (typeof category !== 'string' || !['top', 'bottom', 'outerwear', 'footwear', 'accessory'].includes(category)) return fail();
  if (!metadata || typeof metadata !== 'object') return fail();
  const m = metadata as Record<string, unknown>;
  const string = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= 300;
  const strings = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.length <= 20 && v.every(string);
  const hex = (v: unknown): v is string => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
  if (!string(m.name) || !string(m.subcategory) || !hex(m.primaryColorHex) ||
    (m.secondaryColorHex !== undefined && !hex(m.secondaryColorHex)) ||
    !strings(m.materials) || !strings(m.vibeTags) || !strings(m.seasonality) ||
    !m.seasonality.every(s => ['spring', 'summer', 'fall', 'winter'].includes(s)) ||
    !strings(m.weatherSuitability) || !m.weatherSuitability.every(s => ['rain', 'snow', 'sunny', 'windy', 'mild'].includes(s)) ||
    !Number.isInteger(m.formalityScore) || Number(m.formalityScore) < 1 || Number(m.formalityScore) > 10) return fail();
  // Copy only contract fields; never persist arbitrary model properties.
  return { category: category as Category, metadata: {
    name: m.name, subcategory: m.subcategory, primaryColorHex: m.primaryColorHex,
    ...(m.secondaryColorHex === undefined ? {} : { secondaryColorHex: m.secondaryColorHex as string }),
    materials: m.materials, vibeTags: m.vibeTags,
    seasonality: m.seasonality as GarmentMetadata['seasonality'],
    weatherSuitability: m.weatherSuitability as GarmentMetadata['weatherSuitability'],
    formalityScore: m.formalityScore as number,
  } };
}
