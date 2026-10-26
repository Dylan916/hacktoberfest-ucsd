'use client';

import React, { useMemo } from 'react';
import type { GarmentItem, StylistResponse } from '@/types/closet';
import { Compass, Sliders, Palette, Lightbulb, ArrowRight, ShieldCheck } from 'lucide-react';

interface VibeCoachViewProps {
  items: GarmentItem[];
  stylistResponse?: StylistResponse | null;
  onApplyPrompt?: (prompt: string) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  isLoading?: boolean;
}

export function VibeCoachView({ items, stylistResponse, onApplyPrompt, prompt, onPromptChange, isLoading }: VibeCoachViewProps) {
  // Compute aesthetic vibe distribution
  const vibeAnalysis = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    items.forEach((item) => {
      item.metadata.vibeTags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
        total += 1;
      });
    });

    const sorted = Object.entries(counts)
      .map(([vibe, count]) => ({
        vibe,
        count,
        percent: Math.round((count / (total || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return sorted.slice(0, 6);
  }, [items]);

  // Compute color spectrum
  const colorPalette = useMemo(() => {
    const hexes = Array.from(new Set(items.map((i) => i.metadata.primaryColorHex))).slice(0, 10);
    return hexes;
  }, [items]);

  // Formality average
  const avgFormality = useMemo(() => {
    if (items.length === 0) return 5;
    const sum = items.reduce((acc, curr) => acc + curr.metadata.formalityScore, 0);
    return (sum / items.length).toFixed(1);
  }, [items]);

  const closetNames = useMemo(() => new Map(items.map((item) => [item.id, item.metadata.name])), [items]);

  return (
    <div className="space-y-8 py-2">
      {/* Hero Diagnostic Header */}
      <div className="rounded-xl border border-[#E3E1D9] dark:border-[#1E2025] bg-gradient-to-r from-white to-[#F8F7F2] dark:from-[#121317] dark:to-[#0D0E12] p-6 shadow-xs transition-colors">
        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
          <Compass className="w-4 h-4" />
          <span>{stylistResponse?.provider ? 'Gemma 4 Stylist Consultation' : 'Closet Metadata'}</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-100">
          Closet DNA & Aesthetic Audit
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          {stylistResponse?.mode === 'vibe_coach'
            ? stylistResponse.stylistNotes
            : `Review the recorded vibe tags, color palette, and formality metadata across your ${items.length} owned garments.`}
        </p>
      </div>

      {/* Metrics Row: Vibe Distribution, Colors, Formality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vibe Breakdown */}
        <div className="rounded-lg border border-[#E3E1D9] dark:border-[#1E2025] bg-white dark:bg-[#121317] p-5 shadow-xs transition-colors">
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            <Sliders className="w-3.5 h-3.5" />
            <span>Aesthetic Vibe Profile</span>
          </div>
          <div className="space-y-3">
            {vibeAnalysis.map((item) => (
              <div key={item.vibe} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-800 dark:text-zinc-200 capitalize">#{item.vibe}</span>
                  <span className="text-zinc-500 dark:text-zinc-500 font-mono text-[11px] tabular-nums">
                    {item.percent}%
                  </span>
                </div>
                <div className="w-full bg-[#EAE8E2] dark:bg-[#1A1C22] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-zinc-900 dark:bg-zinc-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Spectrum */}
        <div className="rounded-lg border border-[#E3E1D9] dark:border-[#1E2025] bg-white dark:bg-[#121317] p-5 shadow-xs transition-colors">
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            <Palette className="w-3.5 h-3.5" />
            <span>Extracted Color Palette</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            {colorPalette.length} distinct primary colors recorded across your closet.
          </p>
          <div className="grid grid-cols-5 gap-2">
            {colorPalette.map((hex) => (
              <div key={hex} className="flex flex-col items-center space-y-1">
                <div
                  className="w-10 h-10 rounded-md border border-black/15 dark:border-black/40 shadow-xs"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
                <span className="text-[9px] font-mono text-zinc-500 uppercase">{hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Formality Balance */}
        <div className="rounded-lg border border-[#E3E1D9] dark:border-[#1E2025] bg-white dark:bg-[#121317] p-5 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Formality Index</span>
            </div>
            <div className="text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-100 tabular-nums">
              {avgFormality}{' '}
              <span className="text-xs font-normal text-zinc-500">/ 10</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              {items.length ? `Average formality across ${items.length} owned pieces.` : 'Add garments to see your closet formality.'}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E3E1D9] dark:border-[#1C1E24] text-[11px] text-amber-700 dark:text-amber-400/90 font-mono">
            {stylistResponse?.provider === 'offline-fallback' ? 'Offline closet-based coaching' : 'Computed from your saved garment metadata'}
          </div>
        </div>
      </div>

      {/* Item-by-item stylist audit and wishlist staples */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Closet audit & next staples</span>
        </div>
        {stylistResponse?.mode === 'vibe_coach' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
            <div className="rounded-lg border border-[#E3E1D9] dark:border-[#1E2025] bg-white dark:bg-[#121316] divide-y divide-[#E3E1D9] dark:divide-[#1E2025]">
              {stylistResponse.closetAudit?.map((entry) => (
                <article key={entry.itemId} className="p-4">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{closetNames.get(entry.itemId) ?? 'Closet item'}</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{entry.whyItWorks}</p>
                  <p className="text-xs text-zinc-800 dark:text-zinc-300 mt-1">Styling: {entry.stylingTip}</p>
                </article>
              ))}
            </div>
            <div className="rounded-lg border border-[#E3E1D9] dark:border-[#1E2025] bg-white dark:bg-[#121316] p-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Three staples to consider</h3>
              <ol className="mt-3 list-decimal list-inside space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {stylistResponse.wishlistSuggestions?.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}
              </ol>
              <p className="text-xs text-zinc-500 mt-3">Saved to your Wishlist.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#D8D5CC] dark:border-[#292B32] p-5 text-sm text-zinc-600 dark:text-zinc-400">
            Run a Vibe Coach prompt to get an item-by-item audit of your closet and three wishlist staples.
          </div>
        )}
        {onApplyPrompt && (
          <form onSubmit={(event) => {
            event.preventDefault();
            if (prompt.trim() && !isLoading) onApplyPrompt(`Audit my closet for: ${prompt.trim()}`);
          }}>
            <label htmlFor="audit-prompt" className="block text-sm font-medium">What should your closet audit focus on?</label>
            <input
              id="audit-prompt"
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="For example: a formal office wardrobe"
              disabled={isLoading}
              className="mt-2 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 text-sm"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="inline-flex items-center space-x-1.5 text-xs text-zinc-900 hover:text-black dark:text-zinc-200 dark:hover:text-white pt-2 font-medium cursor-pointer"
            >
              <span>{isLoading ? 'Auditing…' : stylistResponse?.mode === 'vibe_coach' ? 'Refresh closet audit' : 'Audit my closet'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
