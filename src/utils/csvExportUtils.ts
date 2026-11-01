import { Student, FeePayment, AttendanceRecord, SchoolSettings } from '../types';
import { getStudentFeeStatus, calculateFeeMetrics } from './feeUtils';
import { calculateStudentMonthlyAttendance, getMonthKey } from './attendanceUtils';

/**
 * Clean string for CSV cell, escaping quotes and wrapping in quotes if needed
 */
function escapeCsvCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Trigger browser file download with UTF-8 BOM so Excel opens it with correct encoding
 */
function downloadCsv(filename: string, csvContent: string) {
  // UTF-8 BOM (\uFEFF) ensures Excel opens special characters (₹, accents, Indian names) correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Fee Records for a given month/period
 */
export function exportFeesCsv({
  students,
  payments,
  period,
  schoolName,
}: {
  students: Student[];
  payments: FeePayment[];
  period: string;
  schoolName: string;
}) {
  const headers = [
    'Roll No',
    'Student Name',
    'Class',
    'Batch Time',
    'Parent Name',
    'Relation',
    'Parent Mobile',
    'Fee Plan',
    'Expected Amount (INR)',
    'Paid Amount (INR)',
    'Due Amount (INR)',
    'Payment Status',
    'Period',
    'Receipt Numbers',
    'Payment Modes',
    'Payment Dates',
    'Remarks',
  ];

  const rows: string[][] = [];

  students.forEach((student) => {
    const feeStatus = getStudentFeeStatus(student, period, payments);
    const receiptNos = feeStatus.payments.map((p) => p.receiptNo).join('; ');
    const paymentModes = feeStatus.payments.map((p) => p.mode).join('; ');
    const paymentDates = feeStatus.payments.map((p) => p.date).join('; ');
    const remarks = feeStatus.payments.map((p) => p.remarks).filter(Boolean).join('; ');

    rows.push([
      student.rollNo,
      student.name,
      student.class,
      student.batchTime,
      student.parentName,
      student.relation,
      `+91${student.parentPhone}`,
      student.feePlan.toUpperCase(),
      feeStatus.expectedAmount.toString(),
      feeStatus.paidAmount.toString(),
      feeStatus.dueAmount.toString(),
      feeStatus.status.toUpperCase(),
      period,
      receiptNos || 'N/A',
      paymentModes || 'N/A',
      paymentDates || 'N/A',
      remarks || '',
    ]);
  });

  // Calculate totals for footer
  const totalExpected = students.reduce((sum, s) => sum + getStudentFeeStatus(s, period, payments).expectedAmount, 0);
  const totalPaid = students.reduce((sum, s) => sum + getStudentFeeStatus(s, period, payments).paidAmount, 0);
  const totalDue = Math.max(0, totalExpected - totalPaid);

  const footerRow = [
    'TOTAL',
    `Total Students: ${students.length}`,
    '',
    '',
    '',
    '',
    '',
    '',
    totalExpected.toString(),
    totalPaid.toString(),
    totalDue.toString(),
    '',
    period,
    '',
    '',
    '',
    '',
  ];

  const csvRows = [
    [`# ${schoolName} - Fee Records Report (${period})`],
    [`# Generated on: ${new Date().toLocaleString('en-IN')}`],
    [],
    headers.map(escapeCsvCell),
    ...rows.map((r) => r.map(escapeCsvCell)),
    [],
    footerRow.map(escapeCsvCell),
  ];

  const csvString = csvRows.map((r) => r.join(',')).join('\r\n');
  const safeFilename = `${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_Fees_${period.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
  downloadCsv(safeFilename, csvString);
}

/**
 * Export Attendance Records for a given month
 */
export function exportAttendanceCsv({
  students,
  attendance,
  yearMonth, // e.g. "2026-11"
  periodLabel, // e.g. "November 2026"
  schoolName,
}: {
  students: Student[];
  attendance: AttendanceRecord[];
  yearMonth: string;
  periodLabel: string;
  schoolName: string;
}) {
  // Find all distinct dates recorded in this month
  const monthDates = Array.from(
    new Set(
      attendance
        .filter((r) => r.date.startsWith(yearMonth))
        .map((r) => r.date)
    )
  ).sort();

  const headers = [
    'Roll No',
    'Student Name',
    'Class',
    'Batch Time',
    'Parent Mobile',
    'Working Days',
    'Present (P)',
    'Late (L)',
    'Absent (A)',
    'Attendance %',
    ...monthDates.map((d) => d.slice(8)), // e.g. "01", "02", ... day of month
  ];

  const rows: string[][] = [];

  students.forEach((student) => {
    const summary = calculateStudentMonthlyAttendance(student.id, yearMonth, attendance);

    const dayStatuses = monthDates.map((date) => {
      const rec = attendance.find((r) => r.studentId === student.id && r.date === date);
      if (!rec) return '-';
      if (rec.status === 'present') return 'P';
      if (rec.status === 'absent') return 'A';
      if (rec.status === 'late') return 'L';
      return 'H';
    });

    rows.push([
      student.rollNo,
      student.name,
      student.class,
      student.batchTime,
      `+91${student.parentPhone}`,
      summary.totalWorkingDays.toString(),
      summary.presentDays.toString(),
      summary.lateDays.toString(),
      summary.absentDays.toString(),
      `${summary.percentage}%`,
      ...dayStatuses,
    ]);
  });

  const csvRows = [
    [`# ${schoolName} - Attendance Register (${periodLabel})`],
    [`# Generated on: ${new Date().toLocaleString('en-IN')}`],
    [`# Legend: P = Present, A = Absent, L = Late, - = Not Marked`],
    [],
    headers.map(escapeCsvCell),
    ...rows.map((r) => r.map(escapeCsvCell)),
  ];

  const csvString = csvRows.map((r) => r.join(',')).join('\r\n');
  const safeFilename = `${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_Attendance_${periodLabel.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
  downloadCsv(safeFilename, csvString);
}
