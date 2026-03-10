import { useState } from 'react';
import { BarChart3, Download, Printer, ChevronRight, ArrowLeft } from 'lucide-react';
import { DEMO_REPORTS } from '../../stores/demoData';

type ReportView = 'list' | 'item-sales' | 'gl-activity' | 'user-activity';

export function Reports() {
  const [view, setView] = useState<ReportView>('list');

  if (view === 'list') {
    return (
      <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
        <div className="max-w-3xl mx-auto space-y-5">
          <div>
            <h1 className="text-[20px] font-bold text-white tracking-tight">Reports</h1>
            <p className="text-[13px] text-[#5a8a9a] mt-1">View transaction and operational reports</p>
          </div>

          <div className="space-y-2">
            <ReportCard
              title="Item Sales Report"
              description="Revenue breakdown by item category"
              period="Today — Mar 9, 2026"
              onClick={() => setView('item-sales')}
            />
            <ReportCard
              title="GL Account Activity"
              description="General ledger posting summary"
              period="Today — Mar 9, 2026"
              onClick={() => setView('gl-activity')}
            />
            <ReportCard
              title="User Activity Report"
              description="Transaction activity by cashier"
              period="Today — Mar 9, 2026"
              onClick={() => setView('user-activity')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('list')}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#163540] text-[#5a8a9a] hover:text-white transition-colors active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-white tracking-tight">
                {view === 'item-sales' && 'Item Sales Report'}
                {view === 'gl-activity' && 'GL Account Activity'}
                {view === 'user-activity' && 'User Activity Report'}
              </h1>
              <p className="text-[13px] text-[#5a8a9a]">March 9, 2026 — Kingston Service Counter</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#112a33] border border-[#1a3d48] rounded-xl text-[12px] font-medium text-white hover:bg-[#163540] hover:border-[#245560] transition-all active:scale-[0.98]">
              <Printer size={13} />
              Print
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#112a33] border border-[#1a3d48] rounded-xl text-[12px] font-medium text-white hover:bg-[#163540] hover:border-[#245560] transition-all active:scale-[0.98]">
              <Download size={13} />
              Export
            </button>
          </div>
        </div>

        {view === 'item-sales' && (
          <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#0d1b21]">
                  <th className="text-left px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Item</th>
                  <th className="text-right px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Qty</th>
                  <th className="text-right px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Revenue</th>
                  <th className="text-left px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">GL Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a3d48]">
                {DEMO_REPORTS.itemSales.map((row, i) => (
                  <tr key={i} className="hover:bg-[#0d1b21]/50">
                    <td className="px-5 py-3 text-white">{row.item}</td>
                    <td className="px-5 py-3 text-[#c8dce4] text-right">{row.qty}</td>
                    <td className="px-5 py-3 text-white text-right font-medium">${row.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3 text-[#5a8a9a] font-mono text-[11px]">{row.gl}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#0d1b21] font-bold">
                  <td className="px-5 py-3 text-white">Total</td>
                  <td className="px-5 py-3 text-white text-right">{DEMO_REPORTS.itemSales.reduce((s, r) => s + r.qty, 0)}</td>
                  <td className="px-5 py-3 text-white text-right">${DEMO_REPORTS.itemSales.reduce((s, r) => s + r.revenue, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {view === 'gl-activity' && (
          <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#0d1b21]">
                  <th className="text-left px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">GL Code</th>
                  <th className="text-left px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Description</th>
                  <th className="text-right px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Debits</th>
                  <th className="text-right px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a3d48]">
                {DEMO_REPORTS.glActivity.map((row, i) => (
                  <tr key={i} className="hover:bg-[#0d1b21]/50">
                    <td className="px-5 py-3 text-white font-mono text-[11px]">{row.code}</td>
                    <td className="px-5 py-3 text-white">{row.description}</td>
                    <td className="px-5 py-3 text-[#c8dce4] text-right">${row.debits.toFixed(2)}</td>
                    <td className="px-5 py-3 text-emerald-400 text-right font-medium">${row.credits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'user-activity' && (
          <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#0d1b21]">
                  <th className="text-left px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Cashier</th>
                  <th className="text-right px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Transactions</th>
                  <th className="text-right px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Total</th>
                  <th className="text-right px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Refunds</th>
                  <th className="text-right px-5 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Voids</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a3d48]">
                {DEMO_REPORTS.userActivity.map((row, i) => (
                  <tr key={i} className="hover:bg-[#0d1b21]/50">
                    <td className="px-5 py-3 text-white">{row.user}</td>
                    <td className="px-5 py-3 text-[#c8dce4] text-right">{row.transactions}</td>
                    <td className="px-5 py-3 text-white text-right font-medium">${row.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3 text-[#c8dce4] text-right">{row.refunds}</td>
                    <td className="px-5 py-3 text-[#c8dce4] text-right">{row.voids}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportCard({ title, description, period, onClick }: { title: string; description: string; period: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#112a33] hover:bg-[#163540] border border-[#1a3d48] hover:border-[#245560] rounded-2xl p-5 text-left transition-all group flex items-center justify-between active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
          <BarChart3 size={20} className="text-blue-400" />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-white">{title}</div>
          <div className="text-[12px] text-[#5a8a9a] mt-0.5">{description}</div>
          <div className="text-[10px] text-[#3a6070] mt-0.5">{period}</div>
        </div>
      </div>
      <ChevronRight size={18} className="text-[#3a6070] group-hover:text-white transition-colors" />
    </button>
  );
}
