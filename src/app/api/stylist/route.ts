import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import type { GarmentItem } from "@/types/closet";
import { buildStylistInput, parseStylistResponse, STYLIST_SYSTEM_PROMPT } from "@/lib/stylistPrompt";

interface StylistRequest {
  prompt?: unknown;
  closet?: unknown;
  allowOnlineSearch?: unknown;
}

export async function POST(request: Request) {
  let body: StylistRequest;
  try {
    body = await request.json() as StylistRequest;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (typeof body.prompt !== "string" || !body.prompt.trim() || !Array.isArray(body.closet)) {
    return NextResponse.json({ error: "Provide a prompt and closet array." }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 503 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { timeout: 60_000 } });
    let currentContext = "";
    if (body.allowOnlineSearch === true) {
      try {
        const research = await ai.interactions.create({
          model: "gemini-3.8-flash",
          input: `Find only useful current context for styling this request (such as current weather if a location is specified or event dress guidance). Do not invent a location or forecast.\n\nRequest: ${body.prompt}`,
          tools: [{ type: "google_search" }],
        });
        currentContext = research.output_text ?? "";
      } catch {
        // Optional context must not prevent styling the user's actual request.
        console.warn("Stylist web context unavailable; continuing without research.");
      }
    }

    const interaction = await ai.interactions.create({
      model: process.env.GEMMA_MODEL ?? "gemma-4-26b-a4b-it",
      system_instruction: STYLIST_SYSTEM_PROMPT,
      input: `${buildStylistInput(body.prompt, body.closet as GarmentItem[])}\n\nCurrent online context (if any): ${currentContext || "none"}`,
    });
    const response = parseStylistResponse(interaction.output_text ?? "", body.closet as GarmentItem[], body.prompt);
    return NextResponse.json({ ...response, provider: "gemma-api" });
  } catch (error) {
    console.error("Gemma stylist request failed", error);
    return NextResponse.json({ error: "The online stylist could not complete this request." }, { status: 502 });
  }
}
