import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Student, SchoolClass, BatchTime, FeePlanType } from '../types';
import { X, UserPlus, Save, Users } from 'lucide-react';

interface AddEditStudentModalProps {
  studentToEdit?: Student | null;
  onClose: () => void;
}

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  studentToEdit,
  onClose,
}) => {
  const { addStudent, updateStudent, settings, students } = useApp();

  const isEditing = Boolean(studentToEdit);

  // Auto-generate roll number for new admission
  const generateRollNo = (cls: SchoolClass) => {
    const prefix = cls === 'Play Group' ? 'PG' : cls === 'Jr. KG' ? 'JKG' : 'SKG';
    const classCount = students.filter((s) => s.class === cls).length + 1;
    return `${prefix}-${classCount < 10 ? '0' : ''}${classCount}`;
  };

  const [name, setName] = useState(studentToEdit?.name || '');
  const [gender, setGender] = useState<'boy' | 'girl'>(studentToEdit?.gender || 'boy');
  const [schoolClass, setSchoolClass] = useState<SchoolClass>(studentToEdit?.class || 'Play Group');
  const [rollNo, setRollNo] = useState(studentToEdit?.rollNo || generateRollNo('Play Group'));
  const [batchTime, setBatchTime] = useState<BatchTime>(
    studentToEdit?.batchTime || '08:30 AM - 11:00 AM'
  );
  const [parentName, setParentName] = useState(studentToEdit?.parentName || '');
  const [relation, setRelation] = useState<'Father' | 'Mother' | 'Guardian'>(
    studentToEdit?.relation || 'Father'
  );
  const [parentPhone, setParentPhone] = useState(studentToEdit?.parentPhone || '');
  const [feePlan, setFeePlan] = useState<FeePlanType>(studentToEdit?.feePlan || 'monthly');
  const [feeAmount, setFeeAmount] = useState<number>(
    studentToEdit?.feeAmount || settings.defaultMonthlyFee
  );
  const [admissionDate, setAdmissionDate] = useState(
    studentToEdit?.admissionDate || '2026-07-01'
  );

  // Update roll number and fee when class or plan changes (if new student)
  useEffect(() => {
    if (!isEditing) {
      setRollNo(generateRollNo(schoolClass));
    }
  }, [schoolClass, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      if (feePlan === 'monthly') {
        setFeeAmount(settings.defaultMonthlyFee);
      } else {
        setFeeAmount(settings.defaultYearlyFee);
      }
    }
  }, [feePlan, isEditing, settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !parentPhone.trim()) return;

    // Clean phone to digits
    const cleanedPhone = parentPhone.replace(/\D/g, '');

    if (isEditing && studentToEdit) {
      updateStudent({
        ...studentToEdit,
        name: name.trim(),
        gender,
        class: schoolClass,
        rollNo: rollNo.trim(),
        batchTime,
        parentName: parentName.trim(),
        relation,
        parentPhone: cleanedPhone,
        feePlan,
        feeAmount: Number(feeAmount),
        admissionDate,
      });
    } else {
      addStudent({
        name: name.trim(),
        gender,
        class: schoolClass,
        rollNo: rollNo.trim(),
        batchTime,
        parentName: parentName.trim(),
        relation,
        parentPhone: cleanedPhone,
        feePlan,
        feeAmount: Number(feeAmount),
        admissionDate,
        avatarSeed: name.toLowerCase().replace(/\s+/g, '-'),
        status: 'active',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              {isEditing ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isEditing ? 'Edit Student Details' : 'New Admission Form'}
              </h3>
              <p className="text-xs text-slate-500">
                Play Group • Jr. KG • Sr. KG Student Profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Child Name & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Child's Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'boy' | 'girl')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>
            </div>
          </div>

          {/* Class, Roll No & Batch */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Class *
              </label>
              <select
                value={schoolClass}
                onChange={(e) => setSchoolClass(e.target.value as SchoolClass)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="Play Group">Play Group</option>
                <option value="Jr. KG">Jr. KG</option>
                <option value="Sr. KG">Sr. KG</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Roll / Adm No.
              </label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Batch Time *
              </label>
              <select
                value={batchTime}
                onChange={(e) => setBatchTime(e.target.value as BatchTime)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="08:30 AM - 11:00 AM">Morning (8:30 - 11:00 AM)</option>
                <option value="11:30 AM - 02:00 PM">Mid-Day (11:30 AM - 2:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Parent Name & Relation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Sharma"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Relation
              </label>
              <select
                value={relation}
                onChange={(e) =>
                  setRelation(e.target.value as 'Father' | 'Mother' | 'Guardian')
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
          </div>

          {/* Parent Phone for WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Parent WhatsApp Number (10 Digits) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs font-semibold">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={13}
                placeholder="9876543210"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-3 py-2 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              WhatsApp fee reminders and absent alerts will be sent to this number.
            </p>
          </div>

          {/* Fee Plan & Fee Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fee Plan *
              </label>
              <select
                value={feePlan}
                onChange={(e) => setFeePlan(e.target.value as FeePlanType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="monthly">Monthly Fee</option>
                <option value="yearly">Yearly Fee (Full Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fee Amount (₹) *
              </label>
              <input
                type="number"
                required
                min={100}
                value={feeAmount}
                onChange={(e) => setFeeAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Admission Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admission Date
            </label>
            <input
              type="date"
              value={admissionDate}
              onChange={(e) => setAdmissionDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Complete Admission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
