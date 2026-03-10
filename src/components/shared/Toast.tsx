import { CheckCircle } from 'lucide-react';

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[90] bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg text-[13px] font-semibold flex items-center gap-2 fade-in">
      <CheckCircle size={16} />
      {message}
    </div>
  );
}
