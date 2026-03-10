import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { CASHIER } from '../../stores/demoData';

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#060e12]/95 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer" onClick={onUnlock}>
      <div className="text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#112a33] border border-[#1a3d48] flex items-center justify-center mx-auto">
          <Lock size={32} className="text-blue-400" />
        </div>

        <div className="text-[48px] font-light text-white tracking-tight">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div>
          <div className="text-[18px] font-semibold text-white">POS-KC-01 Locked</div>
          <div className="text-[14px] text-[#5a8a9a] mt-1">{CASHIER.name} — {CASHIER.location}</div>
        </div>

        <button className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[14px] font-semibold rounded-xl transition-colors active:scale-[0.98]">
          Tap to Unlock
        </button>

        <div className="text-[11px] text-[#3a6070] mt-4">
          Microsoft Entra ID — Single Sign-On
        </div>
      </div>
    </div>
  );
}
