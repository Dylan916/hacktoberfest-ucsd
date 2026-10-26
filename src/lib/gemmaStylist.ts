import type { GarmentItem, StylistResponse } from "@/types/closet";
import { buildStylistInput, offlineStylistResponse, parseStylistResponse, STYLIST_SYSTEM_PROMPT } from "@/lib/stylistPrompt";

const LOCAL_GEMMA_URL = process.env.NEXT_PUBLIC_LOCAL_GEMMA_URL ?? "http://localhost:11434/api/chat";
const LOCAL_GEMMA_MODEL = process.env.NEXT_PUBLIC_LOCAL_GEMMA_MODEL ?? "gemma4:latest";

async function askLocalGemma(prompt: string, closet: GarmentItem[]): Promise<StylistResponse> {
  const response = await fetch(LOCAL_GEMMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LOCAL_GEMMA_MODEL,
      stream: false,
      format: "json",
      messages: [
        { role: "system", content: STYLIST_SYSTEM_PROMPT },
        { role: "user", content: buildStylistInput(prompt, closet) },
      ],
    }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`Local Gemma returned ${response.status}.`);
  const result = await response.json() as { message?: { content?: string } };
  if (!result.message?.content) throw new Error("Local Gemma returned an empty response.");
  return { ...parseStylistResponse(result.message.content, closet), provider: "local-gemma" };
}

/** Uses the hosted Gemma API when allowed and available; otherwise tries local Gemma, then a no-network fallback. */
export async function askGemmaStylist(
  prompt: string,
  closet: GarmentItem[],
  allowOnlineSearch: boolean,
): Promise<StylistResponse> {
  if (allowOnlineSearch && typeof navigator !== "undefined" && navigator.onLine) {
    try {
      const response = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, closet, allowOnlineSearch }),
      });
      if (!response.ok) throw new Error(`Stylist service returned ${response.status}.`);
      return await response.json() as StylistResponse;
    } catch {
      // Network/API unavailable: continue with local inference.
    }
  }

  try {
    return await askLocalGemma(prompt, closet);
  } catch {
    return { ...offlineStylistResponse(prompt, closet), provider: "offline-fallback" };
  }
}
