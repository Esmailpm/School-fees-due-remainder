import { AttendanceRecord, AttendanceStatus, Student } from '../types';

export interface StudentAttendanceSummary {
  studentId: string;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
  statusToday?: AttendanceStatus;
}

export function getMonthKey(dateStr: string): string {
  // e.g. "2026-11-01" -> "2026-11"
  return dateStr.substring(0, 7);
}

export function calculateStudentMonthlyAttendance(
  studentId: string,
  yearMonth: string, // "2026-11" or "2026-10"
  allRecords: AttendanceRecord[]
): StudentAttendanceSummary {
  const monthRecords = allRecords.filter(
    (r) => r.studentId === studentId && r.date.startsWith(yearMonth) && r.status !== 'holiday'
  );

  const totalWorkingDays = monthRecords.length;
  const presentDays = monthRecords.filter((r) => r.status === 'present').length;
  const lateDays = monthRecords.filter((r) => r.status === 'late').length;
  const absentDays = monthRecords.filter((r) => r.status === 'absent').length;

  // Late counts as 0.8 attendance or full attendance depending on school policy, here let's count present + late
  const effectivePresent = presentDays + lateDays;
  const percentage = totalWorkingDays > 0 ? Math.round((effectivePresent / totalWorkingDays) * 100) : 100;

  return {
    studentId,
    totalWorkingDays,
    presentDays,
    absentDays,
    lateDays,
    percentage,
  };
}

export function getBatchAttendanceStats(
  students: Student[],
  date: string,
  allRecords: AttendanceRecord[]
) {
  const dateRecords = allRecords.filter((r) => r.date === date);
  const studentIds = new Set(students.map((s) => s.id));

  let present = 0;
  let absent = 0;
  let late = 0;
  let unmarked = 0;

  students.forEach((student) => {
    const rec = dateRecords.find((r) => r.studentId === student.id);
    if (!rec) {
      unmarked++;
    } else if (rec.status === 'present') {
      present++;
    } else if (rec.status === 'absent') {
      absent++;
    } else if (rec.status === 'late') {
      late++;
    }
  });

  return {
    total: students.length,
    present,
    absent,
    late,
    unmarked,
  };
}

export function getTodayDateString(): string {
  // Use current local date YYYY-MM-DD
  return '2026-11-01';
}
