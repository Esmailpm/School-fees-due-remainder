import { Student, FeePayment } from '../types';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface StudentFeeStatus {
  student: Student;
  period: string;
  expectedAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'paid' | 'partial' | 'due';
  lastPaymentDate?: string;
  payments: FeePayment[];
}

export function getStudentFeeStatus(
  student: Student,
  period: string, // e.g. "November 2026" or "Yearly 2026-2027"
  allPayments: FeePayment[]
): StudentFeeStatus {
  // If student is on yearly plan and we are looking at a monthly period or yearly period:
  if (student.feePlan === 'yearly') {
    // Check if yearly payment exists for current academic year (matching "Yearly")
    const yearlyPayments = allPayments.filter(
      (p) => p.studentId === student.id && p.period.toLowerCase().includes('yearly')
    );
    const paidAmount = yearlyPayments.reduce((acc, p) => acc + p.amount, 0);
    const expectedAmount = student.feeAmount;
    const dueAmount = Math.max(0, expectedAmount - paidAmount);
    
    let status: 'paid' | 'partial' | 'due' = 'due';
    if (paidAmount >= expectedAmount) {
      status = 'paid';
    } else if (paidAmount > 0) {
      status = 'partial';
    }

    return {
      student,
      period: 'Yearly 2026-2027',
      expectedAmount,
      paidAmount,
      dueAmount,
      status,
      lastPaymentDate: yearlyPayments[yearlyPayments.length - 1]?.date,
      payments: yearlyPayments,
    };
  }

  // Monthly plan: check payments for the specific month/period
  const studentPayments = allPayments.filter(
    (p) => p.studentId === student.id && p.period === period
  );
  const paidAmount = studentPayments.reduce((acc, p) => acc + p.amount, 0);
  const expectedAmount = student.feeAmount;
  const dueAmount = Math.max(0, expectedAmount - paidAmount);

  let status: 'paid' | 'partial' | 'due' = 'due';
  if (paidAmount >= expectedAmount) {
    status = 'paid';
  } else if (paidAmount > 0) {
    status = 'partial';
  }

  return {
    student,
    period,
    expectedAmount,
    paidAmount,
    dueAmount,
    status,
    lastPaymentDate: studentPayments[studentPayments.length - 1]?.date,
    payments: studentPayments,
  };
}

export function calculateFeeMetrics(
  students: Student[],
  period: string,
  allPayments: FeePayment[],
  filterClass?: string
) {
  const filteredStudents = filterClass && filterClass !== 'All'
    ? students.filter((s) => s.class === filterClass)
    : students;

  let totalExpected = 0;
  let totalCollected = 0;
  let totalPending = 0;
  let paidCount = 0;
  let partialCount = 0;
  let dueCount = 0;

  const statuses: StudentFeeStatus[] = filteredStudents.map((student) => {
    const feeStatus = getStudentFeeStatus(student, period, allPayments);
    totalExpected += feeStatus.expectedAmount;
    totalCollected += feeStatus.paidAmount;
    totalPending += feeStatus.dueAmount;

    if (feeStatus.status === 'paid') paidCount++;
    else if (feeStatus.status === 'partial') partialCount++;
    else dueCount++;

    return feeStatus;
  });

  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  return {
    totalExpected,
    totalCollected,
    totalPending,
    paidCount,
    partialCount,
    dueCount,
    collectionRate,
    statuses,
  };
}

export const MONTH_OPTIONS = [
  'June 2026',
  'July 2026',
  'August 2026',
  'September 2026',
  'October 2026',
  'November 2026',
  'December 2026',
  'January 2027',
  'February 2027',
  'March 2027',
  'April 2027',
];
