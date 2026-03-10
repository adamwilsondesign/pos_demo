import { Search, ShoppingBag, Car, Zap, FileText, Building, Bus, Plus, ScanBarcode, Coffee } from 'lucide-react';
import type { CartItem } from '../../stores/demoData';
import { TILE_CATEGORIES, AVAILABLE_TILES } from '../../stores/demoData';

const iconMap: Record<string, React.ReactNode> = {
  ShoppingBag: <ShoppingBag size={22} strokeWidth={1.8} />,
  Car: <Car size={22} strokeWidth={1.8} />,
  Zap: <Zap size={22} strokeWidth={1.8} />,
  FileText: <FileText size={22} strokeWidth={1.8} />,
  Search: <Search size={22} strokeWidth={1.8} />,
  Building: <Building size={22} strokeWidth={1.8} />,
  Bus: <Bus size={22} strokeWidth={1.8} />,
  Plus: <Plus size={22} strokeWidth={1.8} />,
  Coffee: <Coffee size={22} strokeWidth={1.8} />,
};

interface SmartGridProps {
  onOpenLookup: (category: string) => void;
  onOpenProducts: () => void;
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  customTiles?: string[];
  onAddTile?: () => void;
}

export function SmartGrid({ onOpenLookup, onOpenProducts, addToCart: _addToCart, customTiles = [], onAddTile }: SmartGridProps) {
  const handleTileClick = (tileId: string) => {
    if (tileId === 'products') onOpenProducts();
    else if (tileId === 'parking') onOpenLookup('Parking Tickets');
    else if (tileId === 'utilities') onOpenLookup('D365 Invoices');
    else if (tileId === 'permits') onOpenLookup('Permits');
    else if (tileId === 'lookup') onOpenLookup('D365 Invoices');
    else if (tileId === 'property-tax') onOpenLookup('Property Tax');
    else if (tileId === 'transit') onOpenLookup('Transit Pass');
    else if (tileId === 'prepared-food') onOpenProducts();
    else if (tileId === 'add-tile') onAddTile?.();
  };

  const baseTiles = TILE_CATEGORIES.filter(t => t.id !== 'add-tile');
  const customTileData = customTiles
    .map(id => AVAILABLE_TILES.find(t => t.id === id))
    .filter(Boolean) as typeof AVAILABLE_TILES;
  const addTile = TILE_CATEGORIES.find(t => t.id === 'add-tile')!;

  const allTiles = [...baseTiles, ...customTileData, addTile];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0d1b21]">
      {/* Search bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a6070]" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#112a33] border border-[#1a3d48] rounded-xl pl-11 pr-12 py-3.5 text-[15px] text-white placeholder-[#3a6070] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            onFocus={() => onOpenLookup('Parking Tickets')}
            readOnly
          />
          <ScanBarcode size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3a6070]" />
        </div>
      </div>

      {/* Service tiles — 2 columns */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          {allTiles.map(tile => (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile.id)}
              className={`group relative text-left rounded-2xl border transition-all duration-150 active:scale-[0.98] ${
                tile.id === 'add-tile'
                  ? 'bg-[#0a1e28] border-[#1a3d48] border-dashed hover:bg-[#112a33]'
                  : 'bg-[#0f2530] border-[#1a3d48] hover:bg-[#163540] hover:border-[#245560]'
              }`}
              style={{ minHeight: '150px' }}
            >
              <div className="absolute top-5 left-5">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: tile.id === 'add-tile' ? 'transparent' : 'rgba(59, 130, 246, 0.15)',
                    color: tile.id === 'add-tile' ? '#3a6070' : '#3b82f6',
                  }}
                >
                  {iconMap[tile.icon]}
                </div>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <span className={`text-[15px] font-semibold leading-tight ${
                  tile.id === 'add-tile' ? 'text-[#3a6070]' : 'text-[#c8dce4] group-hover:text-white'
                } transition-colors`}>
                  {tile.id === 'add-tile' ? 'Add tile' : tile.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
