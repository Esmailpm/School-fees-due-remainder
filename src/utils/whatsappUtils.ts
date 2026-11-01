import { Student, SchoolSettings } from '../types';
import { formatINR } from './feeUtils';

export type ReminderTone = 'polite_english' | 'polite_hinglish' | 'short_direct';

export interface WhatsAppMessageOptions {
  student: Student;
  period: string;
  dueAmount: number;
  settings: SchoolSettings;
  tone?: ReminderTone;
}

export function cleanPhoneNumber(phone: string): string {
  // Strip non-digits
  const digits = phone.replace(/\D/g, '');
  // If 10 digits (standard Indian mobile), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // If already starts with 91 and has 12 digits
  if (digits.startsWith('91') && digits.length === 12) {
    return digits;
  }
  // Otherwise if starts with 0 and 11 digits
  if (digits.startsWith('0') && digits.length === 11) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

export function generateFeeReminderMessage({
  student,
  period,
  dueAmount,
  settings,
  tone = 'polite_english',
}: WhatsAppMessageOptions): string {
  const formattedAmount = formatINR(dueAmount);
  const upiInfo = settings.upiId ? `\n💳 *UPI ID:* ${settings.upiId} (${settings.upiName})` : '';

  if (tone === 'polite_hinglish') {
    return (
`Namaste ${student.relation === 'Father' ? 'Sir' : student.relation === 'Mother' ? 'Ma\'am' : 'Parent'} 🙏

Asha hai aap aur aapka parivaar kushal-mangal hain.

Ye ek vinamra sandesh hai *${settings.schoolName}* ki or se.

Bachhe ka Naam: *${student.name}*
Kaksha (Class): *${student.class}* (${student.batchTime})
Baqi Fee (Due): *${formattedAmount}* for *${period}*
${upiInfo}

Aap se nivedan hai ki suvidhanusar fee jama kara dein. Agar aap pehle hi bhugtan kar chuke hain, kripya receipt share karein ya is sandesh ko nazarandaz karein.

Dhanyawaad & Regards,
*${settings.schoolName}*
📞 ${settings.phone}`
    );
  }

  if (tone === 'short_direct') {
    return (
`Dear ${student.parentName},

Greetings from *${settings.schoolName}*!

This is a friendly reminder that the fee for *${student.name}* (${student.class}) of *${formattedAmount}* for *${period}* is due.
${upiInfo}

Kindly clear the dues at your earliest convenience. Thank you!

Regards,
*${settings.schoolName}*`
    );
  }

  // Default: polite_english
  return (
`Dear ${student.parentName} (${student.relation}),

Greetings from *${settings.schoolName}*! 🙏

We hope ${student.name} is enjoying their learning journey in *${student.class}*.

This is a gentle reminder regarding the school fees for the month/period:
👤 Student: *${student.name}*
🏫 Class: *${student.class}* (${student.batchTime})
💰 Due Amount: *${formattedAmount}*
📅 Period: *${period}*
${upiInfo}

Kindly arrange to clear the pending fees at your earliest convenience via UPI or cash at school office. If already paid, please share the transaction screenshot.

Thank you for your continuous support and trust in our school.

Warm regards,
*Principal & Management*
*${settings.schoolName}*
📞 Contact: +91 ${settings.phone}`
  );
}

export function generateAbsentNotificationMessage({
  student,
  date,
  settings,
}: {
  student: Student;
  date: string;
  settings: SchoolSettings;
}): string {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
`Dear ${student.parentName},

Greetings from *${settings.schoolName}*! 🏫

This is to kindly inform you that your child *${student.name}* (${student.class}, Batch: ${student.batchTime}) was marked *ABSENT* today (*${formattedDate}*).

We hope everything is well. Please let us know if there is any health concern or prior leave application.

Warm regards,
*Class Teacher*
*${settings.schoolName}*
📞 +91 ${settings.phone}`
  );
}

export function createWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
