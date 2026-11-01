import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/feeUtils';
import { createWhatsAppUrl } from '../utils/whatsappUtils';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  School,
  MessageCircle,
} from 'lucide-react';

interface FeeReceiptModalProps {
  paymentId: string;
  onClose: () => void;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  paymentId,
  onClose,
}) => {
  const { payments, students, settings } = useApp();

  const payment = payments.find((p) => p.id === paymentId);
  const student = payment ? students.find((s) => s.id === payment.studentId) : null;

  if (!payment || !student) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsAppReceipt = () => {
    const text = (
`Dear ${student.parentName},

Thank you for your payment! 🙏

We have received the school fee payment for *${student.name}* at *${settings.schoolName}*.

📄 *Receipt No:* ${payment.receiptNo}
💰 *Amount Received:* ${formatINR(payment.amount)}
📅 *Period:* ${payment.period}
💳 *Mode:* ${payment.mode}
🗓️ *Date:* ${payment.date}

${payment.remarks ? `📝 *Note:* ${payment.remarks}\n` : ''}
Thank you for your continued cooperation!

Warm regards,
*Accounts Office*
*${settings.schoolName}*
📞 +91 ${settings.phone}`
    );

    const url = createWhatsAppUrl(student.parentPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto print:p-0 print:shadow-none print:max-w-full">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">Official Payment Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div
          id="printable-receipt"
          className="border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-amber-50/20 to-white print:border print:border-black print:rounded-none"
        >
          {/* School Header */}
          <div className="text-center pb-3 border-b-2 border-amber-500/30">
            <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold mb-1 shadow-sm">
              <School className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
              {settings.schoolName}
            </h2>
            <p className="text-[11px] font-semibold text-amber-800 tracking-wide uppercase">
              {settings.tagline}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 max-w-sm mx-auto">
              {settings.address} • Ph: +91 {settings.phone}
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
              FEE RECEIPT
            </div>
          </div>

          {/* Receipt Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs py-3 border-b border-slate-200">
            <div>
              <span className="text-slate-400 font-medium">Receipt No: </span>
              <span className="font-mono font-bold text-slate-900">{payment.receiptNo}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 font-medium">Date: </span>
              <span className="font-bold text-slate-800">{payment.date}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Academic Year: </span>
              <span className="font-semibold text-slate-800">{settings.academicYear}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 font-medium">Payment Mode: </span>
              <span className="font-semibold text-slate-800">{payment.mode}</span>
            </div>
          </div>

          {/* Student Info */}
          <div className="py-3 border-b border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-900">{student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Roll No & Class:</span>
              <span className="font-semibold text-slate-800">
                {student.rollNo} • {student.class} ({student.batchTime})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Parent / Guardian:</span>
              <span className="font-semibold text-slate-800">
                {student.parentName} ({student.relation}) • +91 {student.parentPhone}
              </span>
            </div>
          </div>

          {/* Particulars Table */}
          <div className="py-3 border-b-2 border-slate-200 text-xs">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1">
              <span>Fee Description</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-800 py-1">
              <span>Tuition & Activities Fee ({payment.period})</span>
              <span className="font-bold font-mono text-slate-900">{formatINR(payment.amount)}</span>
            </div>
            {payment.remarks && (
              <div className="text-[11px] text-slate-500 italic mt-0.5">
                Note: {payment.remarks}
              </div>
            )}
          </div>

          {/* Total & Words */}
          <div className="pt-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total Paid
              </span>
              <div className="text-xl font-black text-emerald-700">
                {formatINR(payment.amount)}
              </div>
            </div>

            <div className="text-right">
              <div className="w-24 border-b border-slate-400 mt-6" />
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                Authorized Signatory
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Print, WhatsApp Share, Close) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 print:hidden">
          <button
            onClick={handleSendWhatsAppReceipt}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Send Receipt on WhatsApp</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
