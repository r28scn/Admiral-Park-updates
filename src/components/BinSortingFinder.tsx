import React, { useState, useMemo } from 'react';
import { Search, Recycle, Trash2, Apple, Trees, Package, AlertCircle, Info, Sparkles } from 'lucide-react';
import { WASTE_ITEMS } from '../data/wasteGuide';
import { WasteItem } from '../types';

export const BinSortingFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBinFilter, setSelectedBinFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'packaging', label: 'Boxes & Packaging' },
    { id: 'food', label: 'Food & Organic' },
    { id: 'household', label: 'Household Items' },
    { id: 'electronics', label: 'Batteries & Small Tech' },
    { id: 'garden', label: 'Garden Waste' },
    { id: 'hazardous', label: 'Chemicals & Tips' }
  ];

  const filteredItems = useMemo(() => {
    return WASTE_ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instructions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.binLabel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesBin = selectedBinFilter === 'all' || item.bin === selectedBinFilter;

      return matchesSearch && matchesCat && matchesBin;
    });
  }, [searchQuery, selectedCategory, selectedBinFilter]);

  const getBinBadge = (bin: WasteItem['bin']) => {
    switch (bin) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Recycle className="w-3.5 h-3.5" />
            <span>Green Wheelie Bin</span>
          </span>
        );
      case 'food':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Apple className="w-3.5 h-3.5" />
            <span>Food Caddy (Weekly)</span>
          </span>
        );
      case 'black':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Black General Bin</span>
          </span>
        );
      case 'garden':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 border border-lime-200 dark:border-lime-800">
            <Trees className="w-3.5 h-3.5" />
            <span>Brown Garden Bin</span>
          </span>
        );
      case 'special':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Package className="w-3.5 h-3.5" />
            <span>Bag Placed on Bin Lid</span>
          </span>
        );
      case 'tip':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Slyfield Recycling Tip</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            What Goes Where? Bin Sorting Guide
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official Guildford Borough Council rules for Admiral Park residents (GU10)
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any item (e.g., pizza boxes, batteries, foil, plastic film, toasters, paint)..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kerbside Bag Rules Highlight */}
      <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-slate-900 dark:text-white">Special Guildford Kerbside Bagging Service:</strong>
            <span className="block mt-0.5 text-slate-600 dark:text-slate-300">
              Put household batteries in a small clear bag, or small electricals & clean textiles in standard carrier bags, and place directly <em>on top of your bin lid</em> on any collection morning!
            </span>
          </div>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {filteredItems.length} items
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching waste items</h4>
            <p className="text-xs text-slate-500 mt-1">Try a simpler search term, or check the general household categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {item.name}
                    </h4>
                    {getBinBadge(item.bin)}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.instructions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
