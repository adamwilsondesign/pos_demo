import { Modal } from '../shared/Modal';
import { AVAILABLE_TILES } from '../../stores/demoData';
import { Building, Bus, Coffee, CheckCircle } from 'lucide-react';

const tileIconMap: Record<string, React.ReactNode> = {
  Building: <Building size={20} />,
  Bus: <Bus size={20} />,
  Coffee: <Coffee size={20} />,
};

interface AddTileModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (tileId: string) => void;
  existingTiles: string[];
}

export function AddTileModal({ open, onClose, onAdd, existingTiles }: AddTileModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Add Tile to Terminal">
      <div className="space-y-2">
        <p className="text-[12px] text-[#5a8a9a] mb-4">Select a service category to add to your terminal home screen.</p>
        {AVAILABLE_TILES.map(tile => {
          const alreadyAdded = existingTiles.includes(tile.id);
          return (
            <button
              key={tile.id}
              onClick={() => !alreadyAdded && onAdd(tile.id)}
              disabled={alreadyAdded}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                alreadyAdded
                  ? 'bg-[#0d1b21] border-emerald-500/30 cursor-default'
                  : 'bg-[#0d1b21] border-[#1a3d48] hover:border-blue-500/30 hover:bg-[#163540] active:scale-[0.99]'
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: tile.color }}
              >
                {tileIconMap[tile.icon]}
              </div>
              <div className="flex-1 text-left">
                <div className="text-[14px] font-semibold text-white">{tile.label}</div>
                <div className="text-[12px] text-[#5a8a9a]">{tile.description}</div>
              </div>
              {alreadyAdded && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-[12px] font-medium">
                  <CheckCircle size={14} />
                  Added
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
