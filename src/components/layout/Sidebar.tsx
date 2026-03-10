import { useState } from 'react';
import {
  Home, User, Users, Tag,
  MoreHorizontal, Wifi, Lock, FolderOpen,
  Package, Link, Shield
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
  onLock: () => void;
}

export function Sidebar({
  mode, setMode,
  setupScreen, setSetupScreen,
  transactionScreen, setTransactionScreen,
  onLock,
}: SidebarProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  const isSetupAdmin = mode === 'setup' && !['discounts', 'users'].includes(setupScreen);

  const navigateSetup = (screen: SetupScreen) => {
    setMode('setup');
    setSetupScreen(screen);
    setMoreOpen(false);
  };

  return (
    <div className="relative shrink-0">
      <div className="w-[72px] bg-[#091419] flex flex-col items-center border-r border-[#1a3d48] h-full">
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
            onClick={() => { setMode('transaction'); setTransactionScreen('home'); setMoreOpen(false); }}
            icon={<Home size={22} />}
            tooltip="Home"
          />
          <NavIcon
            active={mode === 'refund'}
            onClick={() => { setMode('refund'); setMoreOpen(false); }}
            icon={<FolderOpen size={22} />}
            badge={2}
            tooltip="Orders"
          />
          <NavIcon
            active={mode === 'setup' && setupScreen === 'discounts'}
            onClick={() => navigateSetup('discounts')}
            icon={<Tag size={22} />}
            tooltip="Discounts"
          />
          <NavIcon
            active={mode === 'setup' && setupScreen === 'users'}
            onClick={() => navigateSetup('users')}
            icon={<User size={22} />}
            tooltip="Customers"
          />
          <NavIcon
            active={moreOpen || isSetupAdmin}
            onClick={() => setMoreOpen(!moreOpen)}
            icon={<MoreHorizontal size={22} />}
            tooltip="More"
          />
        </div>

        {/* Bottom icons */}
        <div className="py-4 w-full flex flex-col items-center gap-2 border-t border-[#1a3d48]">
          <BottomIcon icon={<Users size={18} />} tooltip="Staff" onClick={() => navigateSetup('staff')} />
          <BottomIcon icon={<Wifi size={18} />} tooltip="Connection" />
          <BottomIcon icon={<Lock size={18} />} tooltip="Lock Screen" onClick={onLock} />
        </div>
      </div>

      {/* More menu flyout */}
      {moreOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setMoreOpen(false)} />
          <div className="absolute left-[72px] top-0 bottom-0 w-[240px] bg-[#091419] border-r border-[#1a3d48] z-40 flex flex-col fade-in">
            <div className="px-4 py-5 border-b border-[#1a3d48]">
              <h3 className="text-[14px] font-semibold text-white">Administration</h3>
              <p className="text-[11px] text-[#5a8a9a] mt-0.5">Setup & Configuration</p>
            </div>
            <div className="flex-1 py-2">
              <MenuLink icon={<Shield size={16} />} label="Staff Access" active={mode === 'setup' && setupScreen === 'staff'} onClick={() => navigateSetup('staff')} />
              <MenuLink icon={<Package size={16} />} label="Static Items" active={mode === 'setup' && setupScreen === 'static-item'} onClick={() => navigateSetup('static-item')} />
              <MenuLink icon={<Link size={16} />} label="Integrated Items" active={mode === 'setup' && setupScreen === 'integrated-item'} onClick={() => navigateSetup('integrated-item')} />
              <MenuLink icon={<Users size={16} />} label="Users & Roles" active={mode === 'setup' && setupScreen === 'users'} onClick={() => navigateSetup('users')} />
              <MenuLink icon={<Tag size={16} />} label="Discounts" active={mode === 'setup' && setupScreen === 'discounts'} onClick={() => navigateSetup('discounts')} />
            </div>
            <div className="px-4 py-3 border-t border-[#1a3d48]">
              <div className="text-[10px] text-[#3a6070]">Kingston Staff POS v1.0</div>
            </div>
          </div>
        </>
      )}
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

function BottomIcon({ icon, tooltip, onClick }: { icon: React.ReactNode; tooltip: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-11 h-11 rounded-xl bg-[#112a33] border border-[#1a3d48] flex items-center justify-center text-[#5a8a9a] hover:text-white hover:bg-[#163540] transition-colors"
    >
      {icon}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <div className="bg-[#1a3d48] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          {tooltip}
        </div>
      </div>
    </button>
  );
}

function MenuLink({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
        active ? 'text-white bg-[#112a33]' : 'text-[#7ab0c0] hover:text-white hover:bg-[#112a33]'
      }`}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      {label}
    </button>
  );
}
