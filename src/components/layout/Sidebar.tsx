import {
  Home, Settings, ShoppingCart, RotateCcw, BarChart3,
  User, LogOut, Shield, Package, Link, Users, Tag,
  CreditCard, CheckCircle, Clock, FileText, Calendar,
  Receipt, MoreHorizontal, Wifi, Lock, FolderOpen
} from 'lucide-react';
import type { DemoMode, SetupScreen, TransactionScreen, RefundScreen } from '../../stores/useStore';

interface SidebarProps {
  mode: DemoMode;
  setMode: (m: DemoMode) => void;
  setupScreen: SetupScreen;
  setSetupScreen: (s: SetupScreen) => void;
  transactionScreen: TransactionScreen;
  setTransactionScreen: (s: TransactionScreen) => void;
  refundScreen: RefundScreen;
  setRefundScreen: (s: RefundScreen) => void;
}

export function Sidebar({
  mode, setMode,
  setupScreen, setSetupScreen,
  transactionScreen, setTransactionScreen,
  refundScreen, setRefundScreen,
}: SidebarProps) {
  return (
    <div className="w-[72px] bg-[#091419] flex flex-col items-center border-r border-[#1a3d48] h-full shrink-0">
      {/* Logo */}
      <div className="py-5 w-full flex justify-center">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-base text-white shadow-lg shadow-blue-500/20">
          K
        </div>
      </div>

      {/* Main nav icons */}
      <div className="flex-1 py-4 w-full flex flex-col items-center gap-3">
        <NavIcon
          active={mode === 'transaction' && transactionScreen === 'home'}
          onClick={() => { setMode('transaction'); setTransactionScreen('home'); }}
          icon={<Home size={22} />}
          tooltip="Home"
        />
        <NavIcon
          active={mode === 'refund'}
          onClick={() => setMode('refund')}
          icon={<FolderOpen size={22} />}
          badge={2}
          tooltip="Orders"
        />
        <NavIcon
          active={mode === 'setup' && setupScreen === 'discounts'}
          onClick={() => { setMode('setup'); setSetupScreen('discounts'); }}
          icon={<Tag size={22} />}
          tooltip="Discounts"
        />
        <NavIcon
          active={mode === 'setup' && setupScreen === 'users'}
          onClick={() => { setMode('setup'); setSetupScreen('users'); }}
          icon={<User size={22} />}
          tooltip="Customers"
        />
        <NavIcon
          active={false}
          onClick={() => {}}
          icon={<MoreHorizontal size={22} />}
          tooltip="More"
        />
      </div>

      {/* Bottom icons */}
      <div className="py-4 w-full flex flex-col items-center gap-2 border-t border-[#1a3d48]">
        <BottomIcon icon={<Users size={18} />} tooltip="Staff" />
        <BottomIcon icon={<Wifi size={18} />} tooltip="Connection" />
        <BottomIcon icon={<Lock size={18} />} tooltip="Lock Screen" />
      </div>
    </div>
  );
}

function NavIcon({ active, onClick, icon, badge, tooltip }: { active: boolean; onClick: () => void; icon: React.ReactNode; badge?: number; tooltip: string }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full flex items-center justify-center h-12 transition-all duration-150"
    >
      {active && (
        <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-blue-500" />
      )}
      <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
        active
          ? 'text-white'
          : 'text-[#5a8a9a] hover:text-white hover:bg-[#112a33] active:scale-95'
      }`}>
        {icon}
      </div>
      {badge !== undefined && (
        <div className="absolute top-0.5 right-2.5 min-w-[16px] h-[16px] rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
          {badge}
        </div>
      )}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <div className="bg-[#1a3d48] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          {tooltip}
        </div>
      </div>
    </button>
  );
}

function BottomIcon({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) {
  return (
    <button className="group relative w-11 h-11 rounded-xl bg-[#112a33] border border-[#1a3d48] flex items-center justify-center text-[#5a8a9a] hover:text-white hover:bg-[#163540] transition-colors">
      {icon}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <div className="bg-[#1a3d48] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          {tooltip}
        </div>
      </div>
    </button>
  );
}
