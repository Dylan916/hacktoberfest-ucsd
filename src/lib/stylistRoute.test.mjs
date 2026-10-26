import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { GoogleGenAI } from '@google/genai';
registerHooks({ resolve(specifier, context, nextResolve) {
  const resolved = specifier === '@/lib/stylistPrompt' ? new URL('./stylistPrompt.ts', import.meta.url).href : specifier === 'next/server' ? 'next/server.js' : specifier;
  return nextResolve(resolved, context);
} });
const { POST } = await import('../app/api/stylist/route.ts');

test('optional research failure does not discard the custom styling request', async (t) => {
  const previousKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test-key';
  t.after(() => { if (previousKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = previousKey; });
  const ai = new GoogleGenAI({apiKey: 'test-key'});
  let stylingInput = '';
  t.mock.method(Object.getPrototypeOf(ai.interactions), 'create', async (options) => {
    if (options.tools) throw new Error('Search unavailable');
    stylingInput = options.input;
    return {output_text: JSON.stringify({mode:'outfit_builder', outfitTitle:'Office outfit', selectedItemIds:[], missingPieces:[]})};
  });
  const response = await POST(new Request('http://localhost/api/stylist', {method:'POST', body:JSON.stringify({prompt:'Formal silk shirt for the office', closet:[], allowOnlineSearch:true})}));
  assert.equal(response.status, 200);
  assert.match(stylingInput, /Formal silk shirt for the office/);
  assert.equal((await response.json()).provider, 'gemma-api');
});
