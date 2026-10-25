'use client';

import type { GarmentItem } from '../../types/closet';
import { blobToDataUrl, removeClothingBackground, toVisionBase64 } from './images';
import { extractGarmentMetadata } from './vision';
import { validateImage } from './validation';

export { removeClothingBackground } from './images';

/** Returns durable data URLs for Track 3's IndexedDB store; caller supplies identity. */
export async function ingestClothingImage(file: File): Promise<Omit<GarmentItem, 'id' | 'userId' | 'createdAt'>> {
  validateImage(file);
  if (typeof window === 'undefined') throw new Error('Photo ingestion must run in the browser.');
  const cutout = await removeClothingBackground(file);
  const result = await extractGarmentMetadata(await toVisionBase64(cutout));
  if (!result.ok) throw new Error(result.error);
  const [originalImageUrl, cutoutImageUrl] = await Promise.all([blobToDataUrl(file), blobToDataUrl(cutout)]);
  return { ...result.analysis, originalImageUrl, cutoutImageUrl, isOwned: true };
}
