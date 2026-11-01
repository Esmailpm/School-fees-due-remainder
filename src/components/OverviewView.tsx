import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateFeeMetrics, formatINR } from '../utils/feeUtils';
import { getBatchAttendanceStats, getTodayDateString } from '../utils/attendanceUtils';
import {
  Users,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  CalendarCheck2,
  MessageCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  FileDown,
} from 'lucide-react';

interface OverviewViewProps {
  setActiveTab: (tab: string) => void;
  onOpenRecordPayment: (studentId?: string) => void;
  onOpenAddStudent: () => void;
  onOpenWhatsAppPreview: (studentId: string) => void;
  onOpenExport?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  setActiveTab,
  onOpenRecordPayment,
  onOpenAddStudent,
  onOpenWhatsAppPreview,
  onOpenExport,
}) => {
  const { students, payments, attendance, selectedMonth } = useApp();
  const today = getTodayDateString();

  const feeMetrics = calculateFeeMetrics(students, selectedMonth, payments);
  const todayStats = getBatchAttendanceStats(students, today, attendance);

  const pgStudents = students.filter((s) => s.class === 'Play Group');
  const jrStudents = students.filter((s) => s.class === 'Jr. KG');
  const srStudents = students.filter((s) => s.class === 'Sr. KG');

  // Top pending students
  const pendingStatuses = feeMetrics.statuses.filter((s) => s.dueAmount > 0);

  return (
    <div className="space-y-5 pb-16 md:pb-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-xs mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Early Education Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
              Shiksha Margdarshan Kendra
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
              Daily fees tracking, automated polite WhatsApp reminders, and quick attendance for Play Group, Jr. KG, and Sr. KG.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenRecordPayment()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-orange-700 text-xs sm:text-sm font-bold shadow-sm hover:bg-amber-50 active:scale-95 transition-all"
            >
              <IndianRupee className="w-4 h-4 text-orange-600" />
              <span>Record Fee</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs sm:text-sm font-bold backdrop-blur-xs active:scale-95 transition-all"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Take Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Enrolled
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {students.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Kids</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>PG: {pgStudents.length}</span>
            <span>Jr: {jrStudents.length}</span>
            <span>Sr: {srStudents.length}</span>
          </div>
        </div>

        {/* Total Collected */}
        <div
          onClick={() => setActiveTab('fees')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Collected ({selectedMonth.split(' ')[0]})
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">
              {formatINR(feeMetrics.totalCollected)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${feeMetrics.collectionRate}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 whitespace-nowrap">
              {feeMetrics.collectionRate}%
            </span>
          </div>
        </div>

        {/* Total Pending / Due */}
        <div
          onClick={() => setActiveTab('whatsapp')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-400 bg-gradient-to-br from-white to-rose-50/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Pending Dues
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-rose-600">
              {formatINR(feeMetrics.totalPending)}
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px]">
            <span className="text-rose-700 font-semibold">{pendingStatuses.length} students due</span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              WhatsApp <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Today's Attendance */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today's Attendance
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {todayStats.total > 0
                ? Math.round(((todayStats.present + todayStats.late) / todayStats.total) * 100)
                : 0}
              %
            </span>
            <span className="text-xs text-slate-400 font-medium">Present</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="text-emerald-600 font-semibold">P: {todayStats.present}</span>
            <span className="text-rose-600 font-semibold">A: {todayStats.absent}</span>
            <span className="text-amber-600 font-semibold">L: {todayStats.late}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Fee Reminders Quick List + Class Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 spans): Urgent WhatsApp Reminders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Polite Fee Reminders Ready
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                  {pendingStatuses.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Preview polite message and send via WhatsApp with 1 tap.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingStatuses.length === 0 ? (
            <div className="text-center py-8 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">All Fees Collected!</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                There are no pending fees for {selectedMonth}. Great job!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingStatuses.slice(0, 5).map((feeStatus) => {
                const { student, dueAmount } = feeStatus;
                return (
                  <div
                    key={student.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 -mx-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 uppercase border border-amber-200">
                        {student.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {student.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {student.class}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {student.parentName} ({student.relation}) • +91 {student.parentPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-black text-rose-600">
                          {formatINR(dueAmount)}
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Due
                        </span>
                      </div>

                      <button
                        onClick={() => onOpenWhatsAppPreview(student.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                        title="Send Fee Reminder on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                        <span className="hidden sm:inline">Send on WhatsApp</span>
                        <span className="sm:hidden">WhatsApp</span>
                      </button>

                      <button
                        onClick={() => onOpenRecordPayment(student.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                        title="Record Payment"
                      >
                        Paid
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Class Summary & Quick Links */}
        <div className="space-y-4">
          {/* Class Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Classes at a Glance</span>
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Play Group', students: pgStudents, color: 'amber' },
                { name: 'Jr. KG', students: jrStudents, color: 'emerald' },
                { name: 'Sr. KG', students: srStudents, color: 'indigo' },
              ].map((c) => {
                const metrics = calculateFeeMetrics(c.students, selectedMonth, payments);
                return (
                  <div
                    key={c.name}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900">{c.name}</div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {c.students.length} students
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-semibold">
                        {formatINR(metrics.totalCollected)} collected
                      </span>
                      <span className="text-rose-600 font-semibold">
                        {formatINR(metrics.totalPending)} pending
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1 rounded-full"
                        style={{ width: `${metrics.collectionRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl border border-amber-200/80 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Quick Management</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenAddStudent}
                className="flex items-center gap-2 p-2.5 bg-white hover:bg-amber-100/50 rounded-xl border border-amber-200/60 text-slate-800 text-xs font-bold transition-all text-left shadow-2xs"
              >
                <PlusCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>New Admission</span>
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className="flex items-center gap-2 p-2.5 bg-white hover:bg-amber-100/50 rounded-xl border border-amber-200/60 text-slate-800 text-xs font-bold transition-all text-left shadow-2xs"
              >
                <CalendarCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Attendance</span>
              </button>
              {onOpenExport && (
                <button
                  onClick={onOpenExport}
                  className="col-span-2 flex items-center justify-center gap-2 p-2 bg-white hover:bg-amber-100/60 rounded-xl border border-amber-300 text-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Export Monthly CSV Reports</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
