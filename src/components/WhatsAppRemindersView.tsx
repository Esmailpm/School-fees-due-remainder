import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateFeeMetrics, formatINR } from '../utils/feeUtils';
import {
  generateFeeReminderMessage,
  createWhatsAppUrl,
  ReminderTone,
  cleanPhoneNumber,
} from '../utils/whatsappUtils';
import {
  MessageCircle,
  Send,
  Copy,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  Filter,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Phone,
  User,
  ShieldCheck,
} from 'lucide-react';

export const WhatsAppRemindersView: React.FC = () => {
  const { students, payments, settings, selectedMonth, markReminderSent } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [tone, setTone] = useState<ReminderTone>('polite_english');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

  const feeMetrics = calculateFeeMetrics(students, selectedMonth, payments, selectedClass);
  const pendingStudents = feeMetrics.statuses.filter((s) => s.dueAmount > 0);

  // Default active student
  const activeStatus =
    pendingStudents.find((s) => s.student.id === activeStudentId) || pendingStudents[0];

  const getMessageForStudent = (studentId: string, dueAmount: number, student: any) => {
    if (customMessages[studentId]) {
      return customMessages[studentId];
    }
    return generateFeeReminderMessage({
      student,
      period: selectedMonth,
      dueAmount,
      settings,
      tone,
    });
  };

  const handleMessageChange = (studentId: string, val: string) => {
    setCustomMessages((prev) => ({ ...prev, [studentId]: val }));
  };

  const handleResetMessage = (studentId: string, dueAmount: number, student: any) => {
    const defaultMsg = generateFeeReminderMessage({
      student,
      period: selectedMonth,
      dueAmount,
      settings,
      tone,
    });
    setCustomMessages((prev) => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });
  };

  const handleSendWhatsApp = (phone: string, text: string, studentId: string) => {
    markReminderSent(studentId);
    const url = createWhatsAppUrl(phone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = (text: string, studentId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(studentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-16 md:pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>WhatsApp Parent Communication</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight">
              Polite Fee Reminders for Parents
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-0.5 max-w-xl">
              Preview courteous WhatsApp reminder messages customized for each child with pending dues, and send directly via WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-800/60 p-2.5 rounded-xl border border-emerald-500/30">
            <div className="text-center px-2">
              <div className="text-xl font-black text-white">{pendingStudents.length}</div>
              <div className="text-[10px] text-emerald-200 font-medium uppercase">Pending</div>
            </div>
            <div className="h-7 w-px bg-emerald-500/40" />
            <div className="text-center px-2">
              <div className="text-xl font-black text-amber-300">
                {formatINR(feeMetrics.totalPending)}
              </div>
              <div className="text-[10px] text-emerald-200 font-medium uppercase">Total Due</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tone Switcher & Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Class Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['All', 'Play Group', 'Jr. KG', 'Sr. KG'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                selectedClass === cls
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Message Tone Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs">
          <span className="text-slate-500 px-2 font-semibold hidden sm:inline">Message Style:</span>
          {[
            { id: 'polite_english', label: '🌸 Polite English' },
            { id: 'polite_hinglish', label: '🙏 Hinglish / Hindi' },
            { id: 'short_direct', label: '⚡ Short & Crisp' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTone(t.id as ReminderTone);
                setCustomMessages({});
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                tone === t.id
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {pendingStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center shadow-xs">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">All Parents Have Cleared Their Fees!</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            No pending fee reminders found for {selectedClass !== 'All' ? selectedClass : 'any class'} for {selectedMonth}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (5 cols): List of Pending Students */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Due Reminders ({pendingStudents.length})
                </span>
              </div>
              {pendingStudents.length > 0 && (
                <button
                  onClick={() => {
                    const target =
                      pendingStudents.find((s) => !s.student.lastReminderSentAt) ||
                      pendingStudents[0];
                    if (target) {
                      setActiveStudentId(target.student.id);
                      handleSendWhatsApp(
                        target.student.parentPhone,
                        getMessageForStudent(target.student.id, target.dueAmount, target.student),
                        target.student.id
                      );
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  title="Send WhatsApp reminder to next pending parent"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                  <span>Send Next Due</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {pendingStudents.map((feeStatus) => {
                const { student, dueAmount } = feeStatus;
                const isSelected = activeStatus?.student.id === student.id;

                return (
                  <div
                    key={student.id}
                    onClick={() => setActiveStudentId(student.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {student.name.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {student.name}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">
                            {student.parentName} ({student.relation})
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-rose-600">
                          {formatINR(dueAmount)}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">Due</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-slate-700 font-semibold flex items-center gap-1 truncate">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          +91 {student.parentPhone}
                        </span>
                        {student.lastReminderSentAt ? (
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
                            <CheckCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                            Sent recently
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-semibold mt-0.5">
                            Reminder pending
                          </span>
                        )}
                      </div>

                      {/* Explicit Send on WhatsApp Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveStudentId(student.id);
                          handleSendWhatsApp(
                            student.parentPhone,
                            getMessageForStudent(student.id, dueAmount, student),
                            student.id
                          );
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
                        title="Send polite fee reminder on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                        <span>Send on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 cols): WhatsApp Preview Box & Action Panel */}
          {activeStatus && (
            <div className="lg:col-span-7 space-y-3">
              {/* Active Student Header Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    {activeStatus.student.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">
                        {activeStatus.student.name}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {activeStatus.student.class}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Parent: <span className="font-medium text-slate-700">{activeStatus.student.parentName}</span> ({activeStatus.student.relation}) •{' '}
                      <span className="font-mono text-slate-700 font-semibold">
                        +91 {activeStatus.student.parentPhone}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Pending Dues</div>
                  <div className="text-base font-black text-rose-600">
                    {formatINR(activeStatus.dueAmount)}
                  </div>
                </div>
              </div>

              {/* Realistic WhatsApp Chat Preview Container */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-[#efeae2]">
                {/* WhatsApp Chat Header */}
                <div className="bg-[#075e54] text-white px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                      {activeStatus.student.parentName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                        <span>{activeStatus.student.parentName}</span>
                        <span className="text-[10px] font-normal text-emerald-200">
                          ({activeStatus.student.name}'s {activeStatus.student.relation})
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-100">
                        +91 {activeStatus.student.parentPhone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full text-emerald-100">
                      Live Preview Box
                    </span>
                  </div>
                </div>

                {/* WhatsApp Chat Body */}
                <div className="p-4 sm:p-5 bg-[radial-gradient(#d1d7db_1px,transparent_1px)] bg-[size:16px_16px] min-h-[300px] flex flex-col justify-end">
                  {/* Message Bubble (Outgoing) */}
                  <div className="self-end max-w-[92%] sm:max-w-[85%] bg-[#d9fdd3] text-slate-800 rounded-2xl rounded-tr-xs p-3.5 shadow-sm text-xs sm:text-sm font-sans relative border border-emerald-200/50">
                    {/* Editable Message Box */}
                    <textarea
                      rows={11}
                      value={getMessageForStudent(
                        activeStatus.student.id,
                        activeStatus.dueAmount,
                        activeStatus.student
                      )}
                      onChange={(e) =>
                        handleMessageChange(activeStatus.student.id, e.target.value)
                      }
                      className="w-full bg-transparent resize-none border-none p-0 focus:outline-none focus:ring-0 text-slate-800 leading-relaxed font-sans text-xs sm:text-sm"
                      placeholder="Type fee reminder message..."
                    />

                    {/* Chat Bubble Footer */}
                    <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-slate-500">
                      <span>Today, 10:30 AM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>

                  <div className="mt-2 text-center text-[10px] text-slate-500">
                    🔒 Messages are sent directly from your WhatsApp to the parent's phone.
                  </div>
                </div>

                {/* WhatsApp Chat Actions Bar */}
                <div className="bg-white p-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() =>
                        handleResetMessage(
                          activeStatus.student.id,
                          activeStatus.dueAmount,
                          activeStatus.student
                        )
                      }
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Reset message to default template"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Template</span>
                    </button>

                    <button
                      onClick={() =>
                        handleCopy(
                          getMessageForStudent(
                            activeStatus.student.id,
                            activeStatus.dueAmount,
                            activeStatus.student
                          ),
                          activeStatus.student.id
                        )
                      }
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      {copiedId === activeStatus.student.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Send on WhatsApp Button */}
                  <button
                    onClick={() =>
                      handleSendWhatsApp(
                        activeStatus.student.parentPhone,
                        getMessageForStudent(
                          activeStatus.student.id,
                          activeStatus.dueAmount,
                          activeStatus.student
                        ),
                        activeStatus.student.id
                      )
                    }
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                    <span>Send on WhatsApp</span>
                    <ExternalLink className="w-4 h-4 ml-0.5 opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
