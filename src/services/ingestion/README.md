# Track 2: image ingestion

In a Next.js Client Component, call:

```ts
import { ingestClothingImage } from '@/services/ingestion';

const garment = await ingestClothingImage(file);
// Track 3 saves { ...garment, id: crypto.randomUUID(), userId, createdAt: new Date().toISOString() }.
```

Use a file input with `accept="image/jpeg,image/png,image/webp"` and optionally `capture="environment"`. Show pending state and catch the rejected promise to display errors. Disable duplicate submissions while processing. Track 1 owns the actual picker/UI.

The function returns the exact blueprint contract, with `isOwned: true`. Original and transparent PNG cutout URLs are data URLs, so they survive IndexedDB persistence and page reloads. They consume storage proportional to the image size; Track 4 can replace them with cloud storage URLs during sync.

`removeClothingBackground(blob)` is also exported separately. It runs only in a browser, resizes to at most 1536 pixels, and lazily loads IMG.LY. Inputs must be nonempty JPEG/PNG/WebP images up to 10 MB. HEIC must be converted first. A smaller transparent PNG is sent to vision, bounded to 600 KB before base64 encoding so it fits Next's default action limit.

## Configuration and runtime

- Server `.env`: `GEMINI_API_KEY` (never `NEXT_PUBLIC_GEMINI_API_KEY`).
- Optional `GEMMA_VISION_MODEL`, default `gemma-4-26b-a4b-it`. Google documents this model; the blueprint's `gemma-4-27b-it` and `gemma-4-12b-it` are not the documented API identifiers. Model access/quota must be available to the configured key.
- Existing dependencies: `@imgly/background-removal`, `@google/genai`. No new production packages.
- IMG.LY downloads model/Wasm assets on first use. Cold offline ingestion is not supported. Asset caching depends on the browser; a fully offline deployment must prehost/precache those assets. Cloud metadata extraction always needs network access. Track 3 owns the local AI fallback.
- The server action lives here to respect the blueprint's directory ownership. Before exposing it in a public UI, integrate Track 4 authentication and deployment-level rate limits; Next origin checks alone do not provide user authorization.
- Metadata is inferred, not a material or weather-resistance guarantee. Invalid model output is rejected instead of saved. Provider exceptions are replaced with a safe retry message.

## Verification

`npm test` uses Node 22.18+ native TypeScript stripping. `npx next typegen`, `npx tsc --noEmit`, `npm run lint`, and `npm run build` verify integration. Tests do not call paid APIs or download vision assets.

Manual acceptance after Track 1 integration: upload a shirt and a watch; verify transparent edges, correct categories and all metadata fields, persist/reload the item, then test offline/error behavior. Real browser cutout quality and live model output require this acceptance check.

Model reference: https://ai.google.dev/api/interactions-api
