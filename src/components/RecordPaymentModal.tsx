import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMode } from '../types';
import { formatINR, MONTH_OPTIONS, getStudentFeeStatus } from '../utils/feeUtils';
import {
  X,
  IndianRupee,
  Receipt,
  CheckCircle2,
  Calendar,
  CreditCard,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecordPaymentModalProps {
  initialStudentId?: string;
  onClose: () => void;
  onReceiptCreated: (paymentId: string) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  initialStudentId,
  onClose,
  onReceiptCreated,
}) => {
  const { students, payments, recordPayment, selectedMonth } = useApp();

  const [studentId, setStudentId] = useState<string>(
    initialStudentId || (students[0]?.id ?? '')
  );
  const [period, setPeriod] = useState<string>(selectedMonth);
  const [amount, setAmount] = useState<number>(1800);
  const [mode, setMode] = useState<PaymentMode>('UPI (GPay / PhonePe / Paytm)');
  const [date, setDate] = useState<string>('2026-11-01');
  const [receiptNo, setReceiptNo] = useState<string>(
    `SMK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [remarks, setRemarks] = useState<string>('');

  const selectedStudent = students.find((s) => s.id === studentId);

  // Update suggested amount when student or period changes
  useEffect(() => {
    if (selectedStudent) {
      if (selectedStudent.feePlan === 'yearly') {
        setPeriod('Yearly 2026-2027');
      }
      const feeStatus = getStudentFeeStatus(selectedStudent, period, payments);
      const suggestedAmount = feeStatus.dueAmount > 0 ? feeStatus.dueAmount : selectedStudent.feeAmount;
      setAmount(suggestedAmount);
    }
  }, [studentId, period, selectedStudent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || amount <= 0) return;

    const newPayment = recordPayment({
      studentId,
      amount: Number(amount),
      period,
      date,
      mode,
      receiptNo,
      remarks: remarks.trim() || undefined,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    onReceiptCreated(newPayment.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Record Fee Payment</h3>
              <p className="text-xs text-slate-500">Collect fee & auto-generate printable receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Select Student */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Student *
            </label>
            <select
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo} • {s.class} • Plan: {s.feePlan})
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500">Parent: </span>
                <span className="font-semibold text-slate-800">
                  {selectedStudent.parentName} ({selectedStudent.relation})
                </span>
              </div>
              <div>
                <span className="text-slate-500">Batch: </span>
                <span className="font-semibold text-slate-800">{selectedStudent.batchTime}</span>
              </div>
            </div>
          )}

          {/* Period & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fee Period *
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                <option value="Yearly 2026-2027">Yearly 2026-2027</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Payment Mode *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'UPI (GPay / PhonePe / Paytm)',
                'Cash',
                'Bank Transfer',
                'Cheque',
              ].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMode(m as PaymentMode)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-1.5 ${
                    mode === m
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{m}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Receipt Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Receipt Number
              </label>
              <input
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Remarks / Transaction Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via Google Pay by Father, Reference ID..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Confirm & Generate Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
