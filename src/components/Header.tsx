import React from 'react';
import { useApp } from '../context/AppContext';
import { School, BellRing, Sparkles, FileDown, MessageCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
  onOpenExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  onOpenExport,
}) => {
  const { settings, selectedMonth, setSelectedMonth } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* School Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <School className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate font-sans">
                {settings.schoolName}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {settings.academicYear}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate font-medium">
              Play Group • Jr. KG • Sr. KG
            </p>
          </div>
        </div>

        {/* Desktop Navigation & Month Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick WhatsApp alert badge button */}
          {pendingCount > 0 && (
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-[#25d366] text-white shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
              }`}
              title="View and Send Due Reminders on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25d366] stroke-none shrink-0" />
              <span className="hidden sm:inline">Due Reminders:</span>
              <span className="bg-[#25d366] text-white text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-bold">
                {pendingCount}
              </span>
            </button>
          )}

          {/* Export CSV button */}
          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
              title="Export Fees & Attendance CSV reports"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}

          {/* Quick Month Switcher */}
          <div className="flex items-center bg-slate-100 hover:bg-slate-200/80 rounded-xl p-1 border border-slate-200/70 transition-colors">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer px-1.5 py-0.5"
            >
              <option value="November 2026">Nov 2026</option>
              <option value="October 2026">Oct 2026</option>
              <option value="December 2026">Dec 2026</option>
              <option value="January 2027">Jan 2027</option>
              <option value="Yearly 2026-2027">Full Year 26-27</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
