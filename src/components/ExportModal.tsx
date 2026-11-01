import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportFeesCsv, exportAttendanceCsv } from '../utils/csvExportUtils';
import { MONTH_OPTIONS } from '../utils/feeUtils';
import {
  X,
  FileDown,
  Table,
  CalendarCheck2,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
  defaultType?: 'fees' | 'attendance' | 'all';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  onClose,
  defaultType = 'all',
}) => {
  const { students, payments, attendance, settings, selectedMonth } = useApp();

  const [exportMonth, setExportMonth] = useState<string>(selectedMonth);
  const [exportedSuccess, setExportedSuccess] = useState<string | null>(null);

  // Derive Year-Month string (e.g., "November 2026" -> "2026-11")
  const getYearMonth = (periodStr: string): string => {
    const monthMap: Record<string, string> = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    };
    const parts = periodStr.split(' ');
    if (parts.length === 2 && monthMap[parts[0]]) {
      return `${parts[1]}-${monthMap[parts[0]]}`;
    }
    return '2026-11';
  };

  const handleExportFees = () => {
    exportFeesCsv({
      students,
      payments,
      period: exportMonth,
      schoolName: settings.schoolName,
    });
    setExportedSuccess('Fees CSV exported successfully!');
    setTimeout(() => setExportedSuccess(null), 3000);
  };

  const handleExportAttendance = () => {
    const yearMonth = getYearMonth(exportMonth);
    exportAttendanceCsv({
      students,
      attendance,
      yearMonth,
      periodLabel: exportMonth,
      schoolName: settings.schoolName,
    });
    setExportedSuccess('Attendance CSV exported successfully!');
    setTimeout(() => setExportedSuccess(null), 3000);
  };

  const handleExportBoth = () => {
    handleExportFees();
    setTimeout(() => {
      handleExportAttendance();
      setExportedSuccess('Both Fees and Attendance CSV files exported!');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Export CSV Reports</h3>
              <p className="text-xs text-slate-500">Offline backup & spreadsheet sharing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {exportedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportedSuccess}</span>
          </div>
        )}

        {/* Month Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Select Month / Period to Export:
          </label>
          <select
            value={exportMonth}
            onChange={(e) => setExportMonth(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value="Yearly 2026-2027">Yearly 2026-2027</option>
          </select>
          <p className="text-[11px] text-slate-400 mt-1">
            CSV files open in Microsoft Excel, Google Sheets, Numbers, or any spreadsheet tool.
          </p>
        </div>

        {/* Export Options Cards */}
        <div className="space-y-2.5 pt-1">
          {/* Fees CSV Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/20 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Fees Records CSV</h4>
                <p className="text-[11px] text-slate-500">
                  Paid, pending dues, receipt numbers, payment modes & totals
                </p>
              </div>
            </div>
            <button
              onClick={handleExportFees}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
            >
              Export
            </button>
          </div>

          {/* Attendance CSV Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/20 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Attendance Register CSV</h4>
                <p className="text-[11px] text-slate-500">
                  Monthly attendance %, working days, P/A/L day-by-day matrix
                </p>
              </div>
            </div>
            <button
              onClick={handleExportAttendance}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
            >
              Export
            </button>
          </div>
        </div>

        {/* Quick Bulk Action */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleExportBoth}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Export Both (All Records)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
