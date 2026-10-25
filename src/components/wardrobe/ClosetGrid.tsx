'use client';

import React, { useState, useMemo } from 'react';
import { GarmentItem, Category } from '@/types/closet';
import { FilterBar } from './FilterBar';
import { GarmentCard } from './GarmentCard';
import { GarmentDetailModal } from './GarmentDetailModal';
import { Shirt } from 'lucide-react';

interface ClosetGridProps {
  items: GarmentItem[];
  selectedItemIds?: string[];
  onToggleItemInFit?: (itemId: string) => void;
}

export function ClosetGrid({
  items,
  selectedItemIds = [],
  onToggleItemInFit,
}: ClosetGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingItem, setInspectingItem] = useState<GarmentItem | null>(null);

  // Extract unique vibes across all owned items
  const availableVibes = useMemo(() => {
    const vibesSet = new Set<string>();
    items.forEach((item) => {
      item.metadata.vibeTags.forEach((v) => vibesSet.add(v));
    });
    return Array.from(vibesSet);
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Vibe filter
      if (selectedVibe && !item.metadata.vibeTags.includes(selectedVibe)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = item.metadata.name.toLowerCase().includes(query);
        const subcategoryMatch = item.metadata.subcategory.toLowerCase().includes(query);
        const materialMatch = item.metadata.materials.some((m) =>
          m.toLowerCase().includes(query)
        );
        const vibeMatch = item.metadata.vibeTags.some((v) =>
          v.toLowerCase().includes(query)
        );
        if (!nameMatch && !subcategoryMatch && !materialMatch && !vibeMatch) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedCategory, selectedVibe, searchQuery]);

  return (
    <div>
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedVibe={selectedVibe}
        onSelectVibe={setSelectedVibe}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        availableVibes={availableVibes}
      />

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-[#1E2025] bg-[#121316] p-12 text-center my-6">
          <Shirt className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-zinc-300">No clothing pieces found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, clearing your vibe filter, or switching category tabs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
            <GarmentCard
              key={item.id}
              item={item}
              isSelected={selectedItemIds.includes(item.id)}
              onClick={() => setInspectingItem(item)}
            />
          ))}
        </div>
      )}

      {/* Detail Inspection Modal */}
      <GarmentDetailModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        isIncludedInFit={inspectingItem ? selectedItemIds.includes(inspectingItem.id) : false}
        onSelectForFit={(id) => {
          if (onToggleItemInFit) {
            onToggleItemInFit(id);
          }
        }}
      />
    </div>
  );
}
