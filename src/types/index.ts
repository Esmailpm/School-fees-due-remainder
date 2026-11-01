export type SchoolClass = 'Play Group' | 'Jr. KG' | 'Sr. KG';

export type BatchTime = '08:30 AM - 11:00 AM' | '11:30 AM - 02:00 PM';

export type FeePlanType = 'monthly' | 'yearly';

export type PaymentMode = 'Cash' | 'UPI (GPay / PhonePe / Paytm)' | 'Bank Transfer' | 'Cheque';

export interface FeePayment {
  id: string;
  studentId: string;
  amount: number;
  period: string; // e.g. "November 2026" or "Yearly 2026-2027"
  date: string; // YYYY-MM-DD
  mode: PaymentMode;
  receiptNo: string;
  remarks?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  avatarSeed: string; // for consistent cute avatar
  gender: 'boy' | 'girl';
  class: SchoolClass;
  batchTime: BatchTime;
  parentName: string;
  parentPhone: string; // e.g. "9876543210"
  relation: 'Father' | 'Mother' | 'Guardian';
  feePlan: FeePlanType;
  feeAmount: number; // e.g. 1800 for monthly or 20000 for yearly
  admissionDate: string;
  lastReminderSentAt?: string;
  status: 'active' | 'inactive';
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  address: string;
  phone: string;
  upiId: string;
  upiName: string;
  academicYear: string;
  defaultMonthlyFee: number;
  defaultYearlyFee: number;
}
