'use client';

import React, { useState } from 'react';
import { Sparkles, Globe, ArrowRight, Loader2 } from 'lucide-react';

interface PromptBarProps {
  onPromptSubmit: (prompt: string, allowOnlineSearch: boolean) => void;
  allowOnlineSearch: boolean;
  onToggleOnlineSearch: (enabled: boolean) => void;
  isLoading?: boolean;
}

export function PromptBar({
  onPromptSubmit,
  allowOnlineSearch,
  onToggleOnlineSearch,
  isLoading = false,
}: PromptBarProps) {
  const [promptText, setPromptText] = useState('');

  const quickScenarios = [
    { label: 'Rainy Day Workwear', prompt: "It's raining, build me a fit with waterproof shoes" },
    { label: 'Concert Grunge', prompt: "I'm going to a concert, build me a fit with jewelry" },
    { label: 'Nonchalant Styling', prompt: 'I want to dress more nonchalantly with wide silhouettes' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || isLoading) return;
    onPromptSubmit(promptText, allowOnlineSearch);
  };

  return (
    <div className="space-y-2.5 mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-[#131418] border border-[#22242B] rounded-xl p-1.5 focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400 transition-all shadow-lg">
          <div className="pl-3 pr-2 text-zinc-500">
            <Sparkles className="w-4 h-4 text-zinc-400" />
          </div>

          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Prompt Gemma Stylist (e.g., 'It's raining, build me a fit', 'Concert fit with jewelry')..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none py-2 px-1"
            disabled={isLoading}
          />

          {/* Online Gap-fill Toggle Button inside prompt bar */}
          <button
            type="button"
            onClick={() => onToggleOnlineSearch(!allowOnlineSearch)}
            className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer mr-1.5 ${
              allowOnlineSearch
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-600'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1A1C22]'
            }`}
            title="Search online retailers with Gemini Google Grounding if closet lacks items"
          >
            <Globe className={`w-3.5 h-3.5 ${allowOnlineSearch ? 'text-amber-400' : 'text-zinc-500'}`} />
            <span className="text-[11px] font-medium whitespace-nowrap">Find missing online</span>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!promptText.trim() || isLoading}
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
              promptText.trim() && !isLoading
                ? 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200'
                : 'bg-[#1C1E25] text-zinc-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Quick Scenario Pills + Mobile Online Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 scrollbar-none">
          <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Try:</span>
          {quickScenarios.map((sc) => (
            <button
              key={sc.label}
              onClick={() => {
                setPromptText(sc.prompt);
                onPromptSubmit(sc.prompt, allowOnlineSearch);
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#16171B] border border-[#22242B] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 hover:bg-[#1C1E24] transition-colors whitespace-nowrap cursor-pointer"
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <div className="sm:hidden flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onToggleOnlineSearch(!allowOnlineSearch)}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded text-xs transition-colors ${
              allowOnlineSearch
                ? 'bg-zinc-800 text-zinc-200 border border-zinc-600'
                : 'text-zinc-500'
            }`}
          >
            <Globe className="w-3 h-3 text-amber-400" />
            <span className="text-[10px]">Complete online: {allowOnlineSearch ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
