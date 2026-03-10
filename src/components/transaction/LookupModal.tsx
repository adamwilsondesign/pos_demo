import { useState, useEffect, useMemo } from 'react';
import { Search, ExternalLink, Plus, Loader2 } from 'lucide-react';
import { Modal } from '../shared/Modal';
import type { CartItem, LookupResult } from '../../stores/demoData';
import { LOOKUP_RESULTS, CONVENIENCE_FEE_CATEGORIES, findSearchMatch } from '../../stores/demoData';
import { Badge } from '../shared/Badge';

interface LookupModalProps {
  category: string | null;
  onClose: () => void;
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
}

export function LookupModal({ category, onClose, addToCart }: LookupModalProps) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');

  useEffect(() => {
    if (category) {
      setQuery('');
      setSearching(false);
      setShowResults(false);
      setSearchedQuery('');
    }
  }, [category]);

  const handleSearch = () => {
    setSearching(true);
    setSearchedQuery(query);
    setTimeout(() => {
      setSearching(false);
      setShowResults(true);
    }, 800);
  };

  // Smart search: if query matches a known demo input, return that specific result
  // even if it belongs to a different category. Otherwise fall back to the current category.
  const results: LookupResult[] = useMemo(() => {
    if (!showResults || !category) return [];

    const q = searchedQuery.trim();

    // If query provided, try smart matching first
    if (q) {
      const match = findSearchMatch(q);
      if (match) {
        const catResults = LOOKUP_RESULTS[match.category];
        if (catResults && catResults[match.resultIndex]) {
          return [catResults[match.resultIndex]];
        }
      }
    }

    // Fallback: return all results for the current category
    return LOOKUP_RESULTS[category] || [];
  }, [showResults, category, searchedQuery]);

  const handleAdd = (result: LookupResult) => {
    const taxRate = ['Permits', 'Parking'].includes(result.category) ? 0.13 : 0;
    const taxLabel = taxRate > 0 ? 'HST 13%' : 'Exempt';

    addToCart({
      name: result.name,
      price: result.amount,
      category: result.category,
      taxRate,
      taxLabel,
      sourceSystem: result.source,
      accountRef: result.ref,
    });
    onClose();
  };

  const placeholderText = category === 'Parking Tickets'
    ? 'Enter plate number or ticket number...'
    : category === 'Property Tax'
    ? 'Enter account number or owner name...'
    : category === 'Transit Pass'
    ? 'Enter transit account or name...'
    : category === 'D365 Invoices'
    ? 'Enter invoice number or account...'
    : `Search ${category?.toLowerCase()}...`;

  return (
    <Modal open={!!category} onClose={onClose} title={`Lookup — ${category}`} wide>
      <div className="space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a6070]" />
            <input
              type="text"
              placeholder={placeholderText}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full bg-[#0d1b21] border border-[#1a3d48] rounded-xl pl-10 pr-4 py-3 text-[14px] text-white placeholder-[#3a6070] focus:outline-none focus:border-blue-500/50 transition-colors"
              autoFocus
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold rounded-xl transition-colors active:scale-[0.98]"
          >
            Search
          </button>
        </div>

        {/* Search state */}
        {searching && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={22} className="text-blue-400 animate-spin mr-3" />
            <span className="text-[13px] text-[#7ab0c0]">Searching {category?.toLowerCase()}...</span>
          </div>
        )}

        {/* Results */}
        {showResults && !searching && (
          <div className="space-y-3 fade-in">
            <div className="text-[11px] text-[#5a8a9a] mb-1">{results.length} result{results.length !== 1 ? 's' : ''} found</div>
            {results.map((r, i) => (
              <div
                key={i}
                className="bg-[#0d1b21] border border-[#1a3d48] rounded-xl p-5 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[15px] font-semibold text-white">{r.name}</h4>
                      <Badge variant="blue">{r.ref}</Badge>
                    </div>
                    <div className="text-[12px] text-[#7ab0c0] mt-2 whitespace-pre-line leading-relaxed">{r.detail}</div>
                    <div className="flex items-center gap-2 mt-3">
                      <ExternalLink size={11} className="text-[#3a6070]" />
                      <span className="text-[11px] text-[#3a6070]">{r.source}</span>
                      {CONVENIENCE_FEE_CATEGORIES.includes(r.category) && (
                        <Badge variant="amber">+2% convenience fee</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className="text-[18px] font-bold text-white">${r.amount.toFixed(2)}</div>
                    <button
                      onClick={() => handleAdd(r)}
                      className="mt-3 flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-semibold rounded-lg transition-colors active:scale-[0.97]"
                    >
                      <Plus size={13} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty initial state */}
        {!searching && !showResults && (
          <div className="text-center py-12 text-[#3a6070]">
            <Search size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-[14px] text-[#5a8a9a]">Enter an account number, name, or reference</p>
            <p className="text-[12px] mt-1">Or press Search to see all {category?.toLowerCase()} records</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
