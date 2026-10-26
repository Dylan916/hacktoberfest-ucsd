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
        <div className="relative flex items-center bg-white dark:bg-[#131418] border border-[#E3E1D9] dark:border-[#22242B] rounded-xl p-1.5 focus-within:border-zinc-700 dark:focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-700 dark:focus-within:ring-zinc-400 transition-all shadow-sm dark:shadow-lg">
          <div className="pl-3 pr-2 text-zinc-400 dark:text-zinc-500">
            <Sparkles className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </div>

          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Prompt Gemma Stylist (e.g., 'It's raining, build me a fit', 'Concert fit with jewelry')..."
            className="w-full bg-transparent text-sm text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none py-2 px-1"
            disabled={isLoading}
          />

          {/* Online Gap-fill Toggle Button inside prompt bar */}
          <button
            type="button"
            onClick={() => onToggleOnlineSearch(!allowOnlineSearch)}
            className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer mr-1.5 ${
              allowOnlineSearch
                ? 'bg-zinc-100 text-zinc-900 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-[#F2F0E8] dark:hover:text-zinc-300 dark:hover:bg-[#1A1C22]'
            }`}
            title="Use online search context while Gemma styles your closet"
          >
            <Globe className={`w-3.5 h-3.5 ${allowOnlineSearch ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
            <span className="text-[11px] font-medium whitespace-nowrap">Online context</span>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!promptText.trim() || isLoading}
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
              promptText.trim() && !isLoading
                ? 'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-xs'
                : 'bg-[#EAE8E2] text-zinc-400 dark:bg-[#1C1E25] dark:text-zinc-600 cursor-not-allowed'
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
          <span className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase font-mono tracking-wider">Try:</span>
          {quickScenarios.map((sc) => (
            <button
              key={sc.label}
              onClick={() => {
                setPromptText(sc.prompt);
                onPromptSubmit(sc.prompt, allowOnlineSearch);
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#EAE8E2] border border-[#DDD9CE] text-zinc-700 hover:text-zinc-950 hover:bg-[#E2E0D7] dark:bg-[#16171B] dark:border-[#22242B] dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-[#1C1E24] transition-colors whitespace-nowrap cursor-pointer"
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
                ? 'bg-zinc-200 text-zinc-900 border border-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600'
                : 'text-zinc-500'
            }`}
          >
            <Globe className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span className="text-[10px]">Online context: {allowOnlineSearch ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
