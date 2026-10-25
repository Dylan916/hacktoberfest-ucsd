'use client';

import React, { useMemo } from 'react';
import { GarmentItem } from '@/types/closet';
import { Compass, Sliders, Palette, Lightbulb, ArrowRight, ShieldCheck } from 'lucide-react';

interface VibeCoachViewProps {
  items: GarmentItem[];
  onApplyPrompt?: (prompt: string) => void;
}

export function VibeCoachView({ items, onApplyPrompt }: VibeCoachViewProps) {
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

  const coachingFormulas = [
    {
      title: 'High-Low Silhouette Tension',
      formula: 'Voluminous Layering + Cropped Base',
      rule: 'Pair your double-knee relaxed trousers with the boxy tee, leaving the heavy Detroit canvas jacket unzipped for effortless architectural drape.',
      triggerPrompt: 'Style an effortless high-low workwear outfit',
    },
    {
      title: 'Monochrome Jewelry Stacking',
      formula: 'Cold Silver Over Heavy 500gsm Cotton',
      rule: 'The 8mm Cuban link chain creates a sharp focal point over dark washed charcoal fleece. Complement it with the onyx signet ring on the opposite hand.',
      triggerPrompt: 'Build me an outfit with silver chain and jewelry highlights',
    },
    {
      title: 'Quiet Nonchalance Audit',
      formula: 'Tailored Wool + Tech Footwear',
      rule: 'The biggest style unlock is juxtaposing formal pleated wool trousers with Salomon tech runners. It communicates you care about craft without looking try-hard.',
      triggerPrompt: 'I want to dress nonchalantly with tailored trousers',
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Hero Diagnostic Header */}
      <div className="rounded-xl border border-[#1E2025] bg-gradient-to-r from-[#121317] to-[#0D0E12] p-6">
        <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-2">
          <Compass className="w-4 h-4" />
          <span>Gemma 4 Multimodal Wardrobe Diagnostic</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-100">
          Closet DNA & Aesthetic Audit
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Gemma analyzes the silhouette cuts, fabric weights, color hex spectrums, and formality scores of your {items.length} owned garments to reveal styling blind spots.
        </p>
      </div>

      {/* Metrics Row: Vibe Distribution, Colors, Formality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vibe Breakdown */}
        <div className="rounded-lg border border-[#1E2025] bg-[#121317] p-5">
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-4">
            <Sliders className="w-3.5 h-3.5" />
            <span>Aesthetic Vibe Profile</span>
          </div>
          <div className="space-y-3">
            {vibeAnalysis.map((item) => (
              <div key={item.vibe} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-200 capitalize">#{item.vibe}</span>
                  <span className="text-zinc-500 font-mono text-[11px] tabular-nums">
                    {item.percent}%
                  </span>
                </div>
                <div className="w-full bg-[#1A1C22] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-zinc-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Spectrum */}
        <div className="rounded-lg border border-[#1E2025] bg-[#121317] p-5">
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-4">
            <Palette className="w-3.5 h-3.5" />
            <span>Extracted Color Palette</span>
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            Predominantly dark earth tones, charcoal neutrals, and brushed silver metallics.
          </p>
          <div className="grid grid-cols-5 gap-2">
            {colorPalette.map((hex) => (
              <div key={hex} className="flex flex-col items-center space-y-1">
                <div
                  className="w-10 h-10 rounded-md border border-black/40 shadow-sm"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
                <span className="text-[9px] font-mono text-zinc-500 uppercase">{hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Formality Balance */}
        <div className="rounded-lg border border-[#1E2025] bg-[#121317] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Formality Index</span>
            </div>
            <div className="text-3xl font-bold font-mono text-zinc-100 tabular-nums">
              {avgFormality}{' '}
              <span className="text-xs font-normal text-zinc-500">/ 10</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Your wardrobe is centered around <strong className="text-zinc-200">Elevated Casual / Streetwear Luxury</strong>. You have strong casual staples and high-end formal accents.
            </p>
          </div>

          <div className="pt-4 border-t border-[#1C1E24] text-[11px] text-amber-400/90 font-mono">
            ★ Recommendation: Add one relaxed knit polo to bridge the 5–7 formality gap.
          </div>
        </div>
      </div>

      {/* Styling Formulas Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Curated Styling Formulas from Gemma Vibe Coach</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coachingFormulas.map((formula, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#1E2025] bg-[#121316] p-5 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400/80 tracking-wider">
                  Formula 0{idx + 1}
                </span>
                <h3 className="text-sm font-semibold text-zinc-100 mt-0.5">
                  {formula.title}
                </h3>
                <div className="text-[11px] font-mono text-zinc-400 bg-[#17181F] px-2 py-1 rounded my-2 border border-[#22242D]">
                  {formula.formula}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {formula.rule}
                </p>
              </div>

              {onApplyPrompt && (
                <button
                  onClick={() => onApplyPrompt(formula.triggerPrompt)}
                  className="inline-flex items-center space-x-1.5 text-xs text-zinc-200 hover:text-white pt-2 font-medium cursor-pointer"
                >
                  <span>Build this look in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
