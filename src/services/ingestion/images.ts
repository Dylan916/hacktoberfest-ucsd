import { MAX_VISION_BYTES, validateImage } from './validation';

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the photo.'));
    reader.onabort = () => reject(new Error('Photo reading was cancelled.'));
    reader.readAsDataURL(blob);
  });
}

async function resize(image: Blob, edge: number): Promise<Blob> {
  const bitmap = await createImageBitmap(image, { imageOrientation: 'from-image' });
  try {
    const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('This browser cannot process images.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('Could not encode the photo.')), 'image/png',
    ));
  } finally { bitmap.close(); }
}

/** Browser only. IMG.LY downloads its model/Wasm assets on first use. */
export async function removeClothingBackground(image: Blob): Promise<Blob> {
  validateImage(image);
  const prepared = await resize(image, 1536);
  const { removeBackground } = await import('@imgly/background-removal');
  return removeBackground(prepared, { output: { format: 'image/png' } });
}

/** Keep base64 below Next's default 1 MB action request limit. */
export async function toVisionBase64(cutout: Blob): Promise<string> {
  for (const edge of [1024, 768, 512, 256]) {
    const image = await resize(cutout, edge);
    if (image.size <= MAX_VISION_BYTES) return (await blobToDataUrl(image)).split(',')[1];
  }
  throw new Error('Could not reduce the image for vision analysis.');
}
