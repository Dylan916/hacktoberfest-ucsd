import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGarmentAnalysis, validateImage } from './validation.ts';
import { extractGarmentMetadata } from './vision.ts';

const analysis = {
  category: 'accessory',
  metadata: {
    name: 'Silver chain', subcategory: 'chain', primaryColorHex: '#C0C0C0',
    materials: ['metal'], vibeTags: ['minimalist'], seasonality: ['summer'],
    weatherSuitability: ['mild'], formalityScore: 5,
  },
};

test('accepts an accessory with complete metadata, including fenced model JSON', () => {
  assert.deepEqual(parseGarmentAnalysis(JSON.stringify(analysis)), analysis);
  assert.deepEqual(parseGarmentAnalysis('```json\n' + JSON.stringify(analysis) + '\n```'), analysis);
});

test('rejects invented categories and invalid metadata rather than saving corrupt items', () => {
  for (const invalid of [null, {}, { ...analysis, category: 'jewelry' },
    { ...analysis, metadata: { ...analysis.metadata, formalityScore: 11 } },
    { ...analysis, metadata: { ...analysis.metadata, primaryColorHex: 'silver' } },
    { ...analysis, metadata: { ...analysis.metadata, seasonality: ['monsoon'] } },
    { ...analysis, metadata: { ...analysis.metadata, materials: [] } },
  ]) assert.throws(() => parseGarmentAnalysis(JSON.stringify(invalid)));
  assert.throws(() => parseGarmentAnalysis('not JSON'));
});

test('validates supported image types, empty files, and size before processing', () => {
  assert.doesNotThrow(() => validateImage(new Blob(['image'], { type: 'image/jpeg' })));
  assert.throws(() => validateImage(new Blob([], { type: 'image/png' })));
  assert.throws(() => validateImage(new Blob(['text'], { type: 'text/plain' })));
  assert.throws(() => validateImage(new Blob([new Uint8Array(10 * 1024 * 1024 + 1)], { type: 'image/png' })));
});

test('rejects malformed, oversized, and non-PNG vision requests before calling Google', async () => {
  for (const input of ['', 'not base64', 'AAAA'.repeat(300000), Buffer.from('not a png').toString('base64')]) {
    assert.equal((await extractGarmentMetadata(input)).ok, false);
  }
});

test('returns an actionable configuration error without exposing secrets', async () => {
  const old = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const result = await extractGarmentMetadata(Buffer.from([137,80,78,71,13,10,26,10]).toString('base64'));
    assert.deepEqual(result, { ok: false, error: 'Set GEMINI_API_KEY on the server to enable garment analysis.' });
  } finally {
    if (old === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = old;
  }
});
