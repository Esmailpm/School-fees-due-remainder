import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student, SchoolClass, BatchTime, FeePlanType } from '../types';
import { formatINR } from '../utils/feeUtils';
import { calculateStudentMonthlyAttendance, getTodayDateString, getMonthKey } from '../utils/attendanceUtils';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Clock,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck2,
} from 'lucide-react';

interface StudentsViewProps {
  onOpenAddStudent: () => void;
  onOpenEditStudent: (student: Student) => void;
  onOpenRecordPayment: (studentId: string) => void;
  onOpenWhatsAppPreview: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onOpenAddStudent,
  onOpenEditStudent,
  onOpenRecordPayment,
  onOpenWhatsAppPreview,
}) => {
  const { students, deleteStudent, attendance } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedPlan, setSelectedPlan] = useState<string>('All');

  const currentMonthKey = getMonthKey(getTodayDateString());

  const filteredStudents = students.filter((s) => {
    if (selectedClass !== 'All' && s.class !== selectedClass) return false;
    if (selectedPlan !== 'All' && s.feePlan !== selectedPlan) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchParent = s.parentName.toLowerCase().includes(q);
      const matchPhone = s.parentPhone.includes(q);
      const matchRoll = s.rollNo.toLowerCase().includes(q);
      if (!matchName && !matchParent && !matchPhone && !matchRoll) return false;
    }
    return true;
  });

  const handleDelete = (student: Student) => {
    if (confirm(`Are you sure you want to delete ${student.name} (${student.rollNo})?`)) {
      deleteStudent(student.id);
    }
  };

  return (
    <div className="space-y-4 pb-16 md:pb-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Student Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {students.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage student admissions, batch timings, fee structures, and parent contact information.
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Admission</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll number, parent name, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Class:
          </span>
          {['All', 'Play Group', 'Jr. KG', 'Sr. KG'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all ${
                selectedClass === cls
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}

          <span className="text-slate-300">|</span>

          <span className="text-slate-400 font-semibold shrink-0">Fee Plan:</span>
          {['All', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlan(p)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all capitalize ${
                selectedPlan === p
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No students match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredStudents.map((student) => {
            const att = calculateStudentMonthlyAttendance(student.id, currentMonthKey, attendance);

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top line with Avatar and Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base uppercase shrink-0 border ${
                          student.class === 'Play Group'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : student.class === 'Jr. KG'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                        }`}
                      >
                        {student.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                            {student.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                            {student.rollNo}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                              student.class === 'Play Group'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : student.class === 'Jr. KG'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}
                          >
                            {student.class}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Edit and Delete icons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditStudent(student)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Edit Student"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(student)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Student Details Info */}
                  <div className="mt-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Batch Time</span>
                      </span>
                      <span className="font-semibold text-slate-800">{student.batchTime}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Parent Phone</span>
                      </span>
                      <span className="font-mono font-semibold text-slate-900">
                        +91 {student.parentPhone} ({student.relation})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                        <span className="capitalize">{student.feePlan} Fee</span>
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {formatINR(student.feeAmount)}
                        <span className="text-[10px] text-slate-400 font-normal">
                          /{student.feePlan === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </span>
                    </div>

                    {/* Attendance percentage indicator */}
                    <div className="flex items-center justify-between text-slate-600 px-1 pt-1">
                      <span className="text-[11px] flex items-center gap-1 text-slate-500">
                        <CalendarCheck2 className="w-3.5 h-3.5 text-slate-400" />
                        Monthly Attendance
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          att.percentage >= 85
                            ? 'text-emerald-700'
                            : att.percentage >= 70
                            ? 'text-amber-700'
                            : 'text-rose-600'
                        }`}
                      >
                        {att.percentage}% ({att.presentDays + att.lateDays}/{att.totalWorkingDays} days)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onOpenWhatsAppPreview(student.id)}
                    className="py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1 border border-emerald-200 transition-colors"
                  >
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => onOpenRecordPayment(student.id)}
                    className="py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center gap-1 border border-amber-200 transition-colors"
                  >
                    <span>Record Fee</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
