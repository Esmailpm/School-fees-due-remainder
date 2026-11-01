import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolSettings } from '../types';
import {
  Settings,
  School,
  Phone,
  QrCode,
  IndianRupee,
  RotateCcw,
  Save,
  CheckCircle2,
  MapPin,
  Sparkles,
  FileDown,
} from 'lucide-react';
import { exportFeesCsv, exportAttendanceCsv } from '../utils/csvExportUtils';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToSampleData, students, payments, attendance, selectedMonth } = useApp();
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all students, attendance, and payments to original sample data?')) {
      resetToSampleData();
      alert('Reset completed successfully!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-16 md:pb-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">School & Payment Settings</h2>
            <p className="text-xs text-slate-500">
              Customize school name, UPI ID for WhatsApp reminders, and default fees.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings saved successfully! WhatsApp reminders will reflect these details.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School Name
              </label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tagline / Classes
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School Contact Phone (10 digits)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School UPI ID (GPay / PhonePe / Paytm)
              </label>
              <input
                type="text"
                value={formData.upiId}
                placeholder="e.g. yourschool@oksbi"
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Included in WhatsApp reminders for parents to pay directly.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Monthly Fee (₹)
              </label>
              <input
                type="number"
                value={formData.defaultMonthlyFee}
                onChange={(e) =>
                  setFormData({ ...formData, defaultMonthlyFee: Number(e.target.value) })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Yearly Fee (₹)
              </label>
              <input
                type="number"
                value={formData.defaultYearlyFee}
                onChange={(e) =>
                  setFormData({ ...formData, defaultYearlyFee: Number(e.target.value) })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* CSV Exports & Backup Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Offline Data Backup & CSV Exports
            </h3>
            <p className="text-xs text-slate-500">
              Export school fees records and attendance registers directly into Excel-compatible CSV files.
            </p>
          </div>
        </div>

        {exportNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-800">Fees Records ({selectedMonth})</div>
              <div className="text-[11px] text-slate-500">Paid & dues list with receipt numbers</div>
            </div>
            <button
              onClick={() => {
                exportFeesCsv({
                  students,
                  payments,
                  period: selectedMonth,
                  schoolName: settings.schoolName,
                });
                setExportNotice(`Exported fees for ${selectedMonth}!`);
                setTimeout(() => setExportNotice(null), 3000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-800">Attendance Register</div>
              <div className="text-[11px] text-slate-500">Monthly attendance % & daily matrix</div>
            </div>
            <button
              onClick={() => {
                exportAttendanceCsv({
                  students,
                  attendance,
                  yearMonth: '2026-11',
                  periodLabel: 'November 2026',
                  schoolName: settings.schoolName,
                });
                setExportNotice('Exported attendance register for November 2026!');
                setTimeout(() => setExportNotice(null), 3000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
