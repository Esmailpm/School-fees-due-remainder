import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolClass, BatchTime, AttendanceStatus } from '../types';
import {
  calculateStudentMonthlyAttendance,
  getBatchAttendanceStats,
  getTodayDateString,
  getMonthKey,
} from '../utils/attendanceUtils';
import {
  generateAbsentNotificationMessage,
  createWhatsAppUrl,
} from '../utils/whatsappUtils';
import {
  CalendarCheck2,
  Check,
  X,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  MessageCircle,
  AlertCircle,
  Filter,
  BarChart2,
  ChevronRight,
  FileDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportAttendanceCsv } from '../utils/csvExportUtils';

export const AttendanceView: React.FC = () => {
  const { students, attendance, markAttendance, markBatchAllPresent, settings } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedClass, setSelectedClass] = useState<SchoolClass>('Play Group');
  const [selectedBatch, setSelectedBatch] = useState<BatchTime | 'All'>('All');
  const [activeStudentModal, setActiveStudentModal] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const currentMonthKey = getMonthKey(selectedDate); // e.g. "2026-11"

  // Filter students for the active class and batch
  const batchStudents = students.filter((s) => {
    if (s.class !== selectedClass) return false;
    if (selectedBatch !== 'All' && s.batchTime !== selectedBatch) return false;
    return true;
  });

  const batchStats = getBatchAttendanceStats(batchStudents, selectedDate, attendance);

  const handleMarkStatus = (studentId: string, status: AttendanceStatus) => {
    markAttendance(studentId, selectedDate, status);
  };

  const handleMarkAllPresent = () => {
    const studentIds = batchStudents.map((s) => s.id);
    markBatchAllPresent(studentIds, selectedDate);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
  };

  const handleSendAbsentWhatsApp = (student: any) => {
    const msg = generateAbsentNotificationMessage({
      student,
      date: selectedDate,
      settings,
    });
    const url = createWhatsAppUrl(student.parentPhone, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Active student for calendar breakdown modal
  const modalStudent = students.find((s) => s.id === activeStudentModal);
  const modalStudentRecords = modalStudent
    ? attendance.filter((r) => r.studentId === modalStudent.id && r.date.startsWith(currentMonthKey))
    : [];
  const modalSummary = modalStudent
    ? calculateStudentMonthlyAttendance(modalStudent.id, currentMonthKey, attendance)
    : null;

  return (
    <div className="space-y-4 pb-16 md:pb-6">
      {/* Attendance Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Daily Batch Attendance
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Register
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Quick tap for Present, Absent, or Late. Track each student's monthly attendance %.
            </p>
          </div>

          {/* Date Picker & Export Action */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200/80 font-bold text-xs sm:text-sm text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <button
              onClick={() => {
                const parts = selectedDate.split('-');
                const monthNames = [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ];
                const monthName = monthNames[parseInt(parts[1], 10) - 1] || 'November';
                const periodLabel = `${monthName} ${parts[0]}`;

                exportAttendanceCsv({
                  students,
                  attendance,
                  yearMonth: currentMonthKey,
                  periodLabel,
                  schoolName: settings.schoolName,
                });
                setExportSuccess(true);
                setTimeout(() => setExportSuccess(false), 2500);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
              title="Export this month's attendance matrix as CSV"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600" />
              <span>{exportSuccess ? 'Exported!' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Batch Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {/* Class Select */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['Play Group', 'Jr. KG', 'Sr. KG'] as SchoolClass[]).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  selectedClass === cls
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Batch Time Select */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'All', label: 'All Batches' },
              { id: '08:30 AM - 11:00 AM', label: 'Morning (8:30 AM)' },
              { id: '11:30 AM - 02:00 PM', label: 'Mid-Day (11:30 AM)' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBatch(b.id as any)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center truncate ${
                  selectedBatch === b.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Live Stats & Quick "Mark All Present" Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 bg-slate-50/60 p-3 rounded-xl">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold flex-wrap">
            <span className="text-slate-600">
              Total in Batch: <strong className="text-slate-900">{batchStats.total}</strong>
            </span>
            <span className="text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-bold">
              ✓ {batchStats.present} Present
            </span>
            <span className="text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full font-bold">
              ✗ {batchStats.absent} Absent
            </span>
            {batchStats.late > 0 && (
              <span className="text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full font-bold">
                ⏰ {batchStats.late} Late
              </span>
            )}
            {batchStats.unmarked > 0 && (
              <span className="text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full text-xs">
                {batchStats.unmarked} Unmarked
              </span>
            )}
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Student Attendance List */}
      {batchStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No students in this batch</h3>
          <p className="text-xs text-slate-500 mt-1">
            Change class or batch filter to view enrolled students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {batchStudents.map((student) => {
            const todayRecord = attendance.find(
              (r) => r.studentId === student.id && r.date === selectedDate
            );
            const currentStatus = todayRecord?.status;
            const monthlySummary = calculateStudentMonthlyAttendance(
              student.id,
              currentMonthKey,
              attendance
            );

            return (
              <div
                key={student.id}
                className={`bg-white rounded-2xl border p-3.5 transition-all shadow-xs ${
                  currentStatus === 'present'
                    ? 'border-emerald-300/80 bg-emerald-50/15'
                    : currentStatus === 'absent'
                    ? 'border-rose-300/80 bg-rose-50/20'
                    : currentStatus === 'late'
                    ? 'border-amber-300/80 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Student Details */}
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm uppercase shrink-0 border ${
                        student.gender === 'girl'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      {student.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm truncate">
                          {student.name}
                        </h4>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                          {student.rollNo}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {student.parentName} • +91 {student.parentPhone}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Batch: {student.batchTime.split(' - ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Monthly Percentage Badge (Clickable for History) */}
                  <button
                    onClick={() => setActiveStudentModal(student.id)}
                    className="flex flex-col items-end shrink-0 hover:opacity-80 transition-opacity"
                    title="Click to view full attendance history"
                  >
                    <div
                      className={`px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 ${
                        monthlySummary.percentage >= 85
                          ? 'bg-emerald-100 text-emerald-800'
                          : monthlySummary.percentage >= 70
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      <span>{monthlySummary.percentage}%</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {monthlySummary.presentDays + monthlySummary.lateDays}/{monthlySummary.totalWorkingDays} days
                    </span>
                  </button>
                </div>

                {/* Monthly attendance progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1 mt-2.5 overflow-hidden">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      monthlySummary.percentage >= 85
                        ? 'bg-emerald-500'
                        : monthlySummary.percentage >= 70
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${monthlySummary.percentage}%` }}
                  />
                </div>

                {/* Tactile Tap Buttons for Present / Absent / Late */}
                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                  <button
                    onClick={() => handleMarkStatus(student.id, 'present')}
                    className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      currentStatus === 'present'
                        ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Present</span>
                  </button>

                  <button
                    onClick={() => handleMarkStatus(student.id, 'absent')}
                    className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      currentStatus === 'absent'
                        ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-500/20'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Absent</span>
                  </button>

                  <button
                    onClick={() => handleMarkStatus(student.id, 'late')}
                    className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      currentStatus === 'late'
                        ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-500/20'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Late</span>
                  </button>
                </div>

                {/* Absent WhatsApp Alert Button if child is absent */}
                {currentStatus === 'absent' && (
                  <div className="mt-2 pt-2 border-t border-rose-100 flex items-center justify-between">
                    <span className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      Marked Absent Today
                    </span>
                    <button
                      onClick={() => handleSendAbsentWhatsApp(student)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-2xs"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Notify Parent</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Student Monthly Attendance Matrix Modal */}
      {modalStudent && modalSummary && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  {modalStudent.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{modalStudent.name}</h3>
                  <p className="text-xs text-slate-500">
                    {modalStudent.class} • {modalStudent.batchTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Monthly Attendance Stats */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Monthly Attendance</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {modalSummary.percentage}%
                </div>
                <div className="text-[11px] text-slate-500">
                  {modalSummary.presentDays} Present • {modalSummary.lateDays} Late • {modalSummary.absentDays} Absent
                </div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-sm text-emerald-700 bg-white shadow-xs">
                {modalSummary.percentage}%
              </div>
            </div>

            {/* Attendance Logs for the month */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Recorded Days ({modalStudentRecords.length})
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {modalStudentRecords.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No attendance records for this month yet.
                  </p>
                ) : (
                  modalStudentRecords.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs"
                    >
                      <span className="font-medium text-slate-700 font-mono">{r.date}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                          r.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'absent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveStudentModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
