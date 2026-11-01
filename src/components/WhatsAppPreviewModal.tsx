import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, getStudentFeeStatus } from '../utils/feeUtils';
import {
  generateFeeReminderMessage,
  createWhatsAppUrl,
  ReminderTone,
} from '../utils/whatsappUtils';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  CheckCheck,
  RefreshCw,
  ExternalLink,
  Phone,
} from 'lucide-react';

interface WhatsAppPreviewModalProps {
  studentId: string;
  onClose: () => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  studentId,
  onClose,
}) => {
  const { students, payments, settings, selectedMonth, markReminderSent } = useApp();

  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const feeStatus = getStudentFeeStatus(student, selectedMonth, payments);
  const dueAmount = feeStatus.dueAmount > 0 ? feeStatus.dueAmount : student.feeAmount;

  const [tone, setTone] = useState<ReminderTone>('polite_english');
  const [message, setMessage] = useState<string>(() =>
    generateFeeReminderMessage({
      student,
      period: selectedMonth,
      dueAmount,
      settings,
      tone: 'polite_english',
    })
  );
  const [isCopied, setIsCopied] = useState(false);

  const handleToneChange = (newTone: ReminderTone) => {
    setTone(newTone);
    setMessage(
      generateFeeReminderMessage({
        student,
        period: selectedMonth,
        dueAmount,
        settings,
        tone: newTone,
      })
    );
  };

  const handleSendWhatsApp = () => {
    markReminderSent(student.id);
    const url = createWhatsAppUrl(student.parentPhone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-3.5 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                WhatsApp Fee Reminder
              </h3>
              <p className="text-xs text-slate-500">
                {student.name} ({student.class}) • Due: {formatINR(dueAmount)}
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

        {/* Parent & Tone Controls */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-slate-500">Parent: </span>
            <span className="font-bold text-slate-800">
              {student.parentName} ({student.relation})
            </span>{' '}
            • <span className="font-mono text-slate-700">+91 {student.parentPhone}</span>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
            {[
              { id: 'polite_english', label: 'English' },
              { id: 'polite_hinglish', label: 'Hinglish' },
              { id: 'short_direct', label: 'Crisp' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleToneChange(t.id as ReminderTone)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  tone === t.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp Chat Preview Box */}
        <div className="rounded-xl border border-slate-300 overflow-hidden bg-[#efeae2]">
          <div className="bg-[#075e54] text-white px-3 py-2 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                {student.parentName.slice(0, 2)}
              </div>
              <span>{student.parentName}</span>
            </div>
            <span className="text-[10px] text-emerald-200 font-mono">
              +91 {student.parentPhone}
            </span>
          </div>

          <div className="p-3 bg-[radial-gradient(#d1d7db_1px,transparent_1px)] bg-[size:16px_16px]">
            <div className="bg-[#d9fdd3] text-slate-800 rounded-xl rounded-tr-xs p-3 shadow-xs text-xs font-sans border border-emerald-200/50">
              <textarea
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent resize-none border-none p-0 focus:outline-none focus:ring-0 text-slate-800 leading-relaxed font-sans text-xs"
              />
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500">
                <span>Today</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>Send on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
