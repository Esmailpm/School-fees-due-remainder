import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateFeeMetrics, formatINR, MONTH_OPTIONS } from '../utils/feeUtils';
import { SchoolClass, FeePlanType } from '../types';
import {
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  MessageCircle,
  Receipt,
  FileText,
  Printer,
  ChevronDown,
  FileDown,
} from 'lucide-react';
import { exportFeesCsv } from '../utils/csvExportUtils';

interface FeesViewProps {
  onOpenRecordPayment: (studentId?: string) => void;
  onOpenWhatsAppPreview: (studentId: string) => void;
  onViewReceipt: (paymentId: string) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  onOpenRecordPayment,
  onOpenWhatsAppPreview,
  onViewReceipt,
}) => {
  const { students, payments, selectedMonth, setSelectedMonth, settings } = useApp();
  const [exportSuccess, setExportSuccess] = useState(false);

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'paid' | 'due' | 'partial'>('All');
  const [selectedPlan, setSelectedPlan] = useState<'All' | FeePlanType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'status' | 'history'>('status');

  const feeMetrics = calculateFeeMetrics(students, selectedMonth, payments, selectedClass);

  // Filtered student fee statuses
  const filteredStatuses = feeMetrics.statuses.filter(({ student, status }) => {
    // Status filter
    if (selectedStatus !== 'All' && status !== selectedStatus) return false;
    // Plan filter
    if (selectedPlan !== 'All' && student.feePlan !== selectedPlan) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchParent = student.parentName.toLowerCase().includes(q);
      const matchPhone = student.parentPhone.includes(q);
      const matchRoll = student.rollNo.toLowerCase().includes(q);
      if (!matchName && !matchParent && !matchPhone && !matchRoll) return false;
    }
    return true;
  });

  // Recent payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30);

  return (
    <div className="space-y-4 pb-16 md:pb-6">
      {/* Top Banner with Total Collected vs Pending */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                School Fees Dashboard
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                {selectedMonth}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track collected fees, pending balances, and record payments for all batches.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Month Switcher Dropdown */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm py-2 pl-3 pr-8 rounded-xl border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                <option value="Yearly 2026-2027">Full Academic Year 2026-27</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={() => {
                exportFeesCsv({
                  students,
                  payments,
                  period: selectedMonth,
                  schoolName: settings.schoolName,
                });
                setExportSuccess(true);
                setTimeout(() => setExportSuccess(false), 2500);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 transition-all cursor-pointer"
              title="Download fees record as CSV spreadsheet"
            >
              <FileDown className="w-4 h-4 text-emerald-600" />
              <span>{exportSuccess ? 'Exported!' : 'Export CSV'}</span>
            </button>

            <button
              onClick={() => onOpenRecordPayment()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <IndianRupee className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Total Expected
            </span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {formatINR(feeMetrics.totalExpected)}
            </div>
            <span className="text-[11px] text-slate-400">
              {students.length} students enrolled
            </span>
          </div>

          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase">
                Total Collected
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-700 mt-1">
              {formatINR(feeMetrics.totalCollected)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${feeMetrics.collectionRate}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-emerald-800">
                {feeMetrics.collectionRate}%
              </span>
            </div>
          </div>

          <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-rose-800 uppercase">
                Total Pending
              </span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-rose-600 mt-1">
              {formatINR(feeMetrics.totalPending)}
            </div>
            <span className="text-[11px] font-semibold text-rose-700">
              {feeMetrics.dueCount + feeMetrics.partialCount} students pending
            </span>
          </div>

          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-100">
            <span className="text-[11px] font-semibold text-amber-800 uppercase">
              Status Breakdown
            </span>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                {feeMetrics.paidCount} Paid
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
                {feeMetrics.partialCount} Partial
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800">
                {feeMetrics.dueCount} Due
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher: Fees Status vs Payment History */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('status')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'status'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Student Fees ({filteredStatuses.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'history'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Payment Receipts ({payments.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'status' ? (
        <>
          {/* Filters Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 space-y-3 shadow-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student by name, parent, phone, or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Class:
              </span>
              {['All', 'Play Group', 'Jr. KG', 'Sr. KG'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                    selectedClass === cls
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cls}
                </button>
              ))}

              <span className="text-slate-300">|</span>

              <span className="text-slate-400 font-semibold shrink-0">Status:</span>
              {[
                { id: 'All', label: 'All' },
                { id: 'paid', label: 'Paid' },
                { id: 'due', label: 'Due / Unpaid' },
                { id: 'partial', label: 'Partial' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                    selectedStatus === st.id
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Student Fee List */}
          {filteredStatuses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <IndianRupee className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No matching student fees found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search query or filter options above.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredStatuses.map((feeStatus) => {
                const { student, status, paidAmount, dueAmount, expectedAmount } = feeStatus;
                const isPaid = status === 'paid';
                const isPartial = status === 'partial';
                const isDue = status === 'due';

                return (
                  <div
                    key={student.id}
                    className={`bg-white rounded-2xl border transition-all p-3.5 sm:p-4 shadow-xs hover:shadow-sm ${
                      isPaid
                        ? 'border-emerald-200/70 hover:border-emerald-300'
                        : isPartial
                        ? 'border-amber-200 hover:border-amber-300 bg-amber-50/20'
                        : 'border-rose-200 hover:border-rose-300 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Student Info */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm uppercase shrink-0 border ${
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
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                              {student.name}
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {student.rollNo}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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

                          <p className="text-xs text-slate-500 mt-0.5">
                            <span className="font-medium text-slate-700">{student.parentName}</span> ({student.relation}) •{' '}
                            <span className="font-mono text-slate-600">+91 {student.parentPhone}</span>
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                              ⏰ {student.batchTime}
                            </span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 capitalize">
                              Plan: {student.feePlan} ({formatINR(student.feeAmount)})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fee Amounts and Status */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Amount Numbers */}
                        <div className="text-left sm:text-right">
                          <div className="flex items-center gap-2 sm:justify-end">
                            <span
                              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isPaid
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isPartial
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isPaid ? 'PAID' : isPartial ? 'PARTIAL' : 'DUE'}
                            </span>
                          </div>

                          <div className="mt-1">
                            {isPaid ? (
                              <div className="text-sm font-bold text-emerald-700">
                                {formatINR(paidAmount)}{' '}
                                <span className="text-[11px] font-normal text-slate-400">Paid</span>
                              </div>
                            ) : (
                              <div className="text-sm font-black text-rose-600">
                                {formatINR(dueAmount)}{' '}
                                <span className="text-[11px] font-normal text-slate-500">
                                  {isPartial ? `(Paid ${formatINR(paidAmount)})` : 'Pending'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {dueAmount > 0 && (
                            <button
                              onClick={() => onOpenWhatsAppPreview(student.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                              title="Send WhatsApp Fee Reminder"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                              <span className="hidden sm:inline">Send on WhatsApp</span>
                              <span className="sm:hidden">WhatsApp</span>
                            </button>
                          )}

                          <button
                            onClick={() => onOpenRecordPayment(student.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                              isPaid
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                            }`}
                          >
                            <IndianRupee className="w-3.5 h-3.5" />
                            <span>{isPaid ? 'Add Extra' : 'Collect'}</span>
                          </button>

                          {feeStatus.payments.length > 0 && (
                            <button
                              onClick={() => onViewReceipt(feeStatus.payments[feeStatus.payments.length - 1].id)}
                              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                              title="View & Print Receipt"
                            >
                              <Receipt className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Payment History Sub-Tab */
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Recent Payment Receipts
              </h3>
              <p className="text-xs text-slate-500">
                All recorded cash, UPI, and bank transactions with generated receipts.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {recentPayments.length} records
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentPayments.map((payment) => {
              const student = students.find((s) => s.id === payment.studentId);
              return (
                <div
                  key={payment.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50 px-2 -mx-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {student?.name || 'Unknown Student'}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {payment.receiptNo}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {payment.period}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {payment.date} • {payment.mode}
                        {payment.remarks && ` • "${payment.remarks}"`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-sm font-extrabold text-emerald-700">
                      {formatINR(payment.amount)}
                    </div>
                    <button
                      onClick={() => onViewReceipt(payment.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
