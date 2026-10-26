import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(specifier === '@/lib/stylistPrompt' ? new URL('./stylistPrompt.ts', import.meta.url).href : specifier, context);
} });
const { askGemmaStylist } = await import('./gemmaStylist.ts');

test('turning off web context still sends the custom prompt to the hosted stylist', async (t) => {
  t.mock.getter(globalThis, 'navigator', () => ({ onLine: true }));
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    requests.push({url: String(url), body: JSON.parse(init.body)});
    if (url !== '/api/stylist') throw new Error('Local model unavailable');
    return Response.json({mode: 'outfit_builder', outfitTitle: 'Formal silk shirt', selectedItemIds: ['shirt'], missingPieces: [], stylistNotes: 'For the office', accessoryAdvice: '', provider: 'gemma-api'});
  });
  const result = await askGemmaStylist('Formal office with a silk shirt', [], false);
  assert.equal(result.provider, 'gemma-api');
  assert.equal(requests[0].url, '/api/stylist');
  assert.equal(requests[0].body.prompt, 'Formal office with a silk shirt');
  assert.equal(requests[0].body.allowOnlineSearch, false);
});
