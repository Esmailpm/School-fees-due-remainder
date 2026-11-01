import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, FeePayment, AttendanceRecord, SchoolSettings, AttendanceStatus } from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_PAYMENTS,
  DEFAULT_SETTINGS,
  generateInitialAttendance,
} from '../data/mockData';

interface AppContextType {
  students: Student[];
  payments: FeePayment[];
  attendance: AttendanceRecord[];
  settings: SchoolSettings;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  // Student actions
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  // Payment actions
  recordPayment: (payment: Omit<FeePayment, 'id' | 'receiptNo'> & { receiptNo?: string }) => FeePayment;
  deletePayment: (paymentId: string) => void;
  // Attendance actions
  markAttendance: (studentId: string, date: string, status: AttendanceStatus, note?: string) => void;
  markBatchAllPresent: (studentIds: string[], date: string) => void;
  // WhatsApp tracking
  markReminderSent: (studentId: string) => void;
  // Settings
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  // Reset
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  STUDENTS: 'smk_students_v1',
  PAYMENTS: 'smk_payments_v1',
  ATTENDANCE: 'smk_attendance_v1',
  SETTINGS: 'smk_settings_v1',
  MONTH: 'smk_selected_month_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [payments, setPayments] = useState<FeePayment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : generateInitialAttendance();
    } catch {
      return generateInitialAttendance();
    }
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.MONTH) || 'November 2026';
    } catch {
      return 'November 2026';
    }
  });

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MONTH, selectedMonth);
  }, [selectedMonth]);

  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const recordPayment = (
    paymentData: Omit<FeePayment, 'id' | 'receiptNo'> & { receiptNo?: string }
  ): FeePayment => {
    const receiptNo =
      paymentData.receiptNo ||
      `SMK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: FeePayment = {
      ...paymentData,
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      receiptNo,
    };

    setPayments((prev) => [newPayment, ...prev]);
    return newPayment;
  };

  const deletePayment = (paymentId: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== paymentId));
  };

  const markAttendance = (
    studentId: string,
    date: string,
    status: AttendanceStatus,
    note?: string
  ) => {
    setAttendance((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.studentId === studentId && r.date === date
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          status,
          note: note !== undefined ? note : copy[existingIdx].note,
        };
        return copy;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${studentId}-${date}`,
          studentId,
          date,
          status,
          note,
        };
        return [...prev, newRecord];
      }
    });
  };

  const markBatchAllPresent = (studentIds: string[], date: string) => {
    setAttendance((prev) => {
      const dateMap = new Map(
        prev
          .filter((r) => r.date === date)
          .map((r) => [r.studentId, r])
      );

      const updatedRecords = [...prev];

      studentIds.forEach((sid) => {
        const existing = dateMap.get(sid);
        if (existing) {
          const idx = updatedRecords.findIndex((r) => r.id === existing.id);
          if (idx !== -1) {
            updatedRecords[idx] = { ...updatedRecords[idx], status: 'present' };
          }
        } else {
          updatedRecords.push({
            id: `att-${sid}-${date}`,
            studentId: sid,
            date,
            status: 'present',
          });
        }
      });

      return updatedRecords;
    });
  };

  const markReminderSent = (studentId: string) => {
    const now = new Date().toISOString();
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, lastReminderSentAt: now } : s))
    );
  };

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToSampleData = () => {
    setStudents(INITIAL_STUDENTS);
    setPayments(INITIAL_PAYMENTS);
    setAttendance(generateInitialAttendance());
    setSettings(DEFAULT_SETTINGS);
    setSelectedMonth('November 2026');
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        students,
        payments,
        attendance,
        settings,
        selectedMonth,
        setSelectedMonth,
        addStudent,
        updateStudent,
        deleteStudent,
        recordPayment,
        deletePayment,
        markAttendance,
        markBatchAllPresent,
        markReminderSent,
        updateSettings,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
