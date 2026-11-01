/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OverviewView } from './components/OverviewView';
import { FeesView } from './components/FeesView';
import { WhatsAppRemindersView } from './components/WhatsAppRemindersView';
import { AttendanceView } from './components/AttendanceView';
import { StudentsView } from './components/StudentsView';
import { SettingsView } from './components/SettingsView';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { FeeReceiptModal } from './components/FeeReceiptModal';
import { AddEditStudentModal } from './components/AddEditStudentModal';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { ExportModal } from './components/ExportModal';
import { calculateFeeMetrics } from './utils/feeUtils';
import { Student } from './types';

function MainApp() {
  const { students, payments, selectedMonth, settings } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [recordPaymentStudentId, setRecordPaymentStudentId] = useState<string | undefined>(undefined);
  const [activeReceiptPaymentId, setActiveReceiptPaymentId] = useState<string | null>(null);
  const [isAddEditStudentOpen, setIsAddEditStudentOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [whatsAppPreviewStudentId, setWhatsAppPreviewStudentId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const feeMetrics = calculateFeeMetrics(students, selectedMonth, payments);
  const pendingCount = feeMetrics.dueCount + feeMetrics.partialCount;

  const handleOpenRecordPayment = (studentId?: string) => {
    setRecordPaymentStudentId(studentId);
    setIsRecordPaymentOpen(true);
  };

  const handleReceiptCreated = (paymentId: string) => {
    setIsRecordPaymentOpen(false);
    setActiveReceiptPaymentId(paymentId);
  };

  const handleOpenAddStudent = () => {
    setStudentToEdit(null);
    setIsAddEditStudentOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsAddEditStudentOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-amber-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Navigation Sub-bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-20 md:pb-8">
        {activeTab === 'overview' && (
          <OverviewView
            setActiveTab={setActiveTab}
            onOpenRecordPayment={handleOpenRecordPayment}
            onOpenAddStudent={handleOpenAddStudent}
            onOpenWhatsAppPreview={(id) => setWhatsAppPreviewStudentId(id)}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'fees' && (
          <FeesView
            onOpenRecordPayment={handleOpenRecordPayment}
            onOpenWhatsAppPreview={(id) => setWhatsAppPreviewStudentId(id)}
            onViewReceipt={(id) => setActiveReceiptPaymentId(id)}
          />
        )}

        {activeTab === 'whatsapp' && <WhatsAppRemindersView />}

        {activeTab === 'attendance' && <AttendanceView />}

        {activeTab === 'students' && (
          <StudentsView
            onOpenAddStudent={handleOpenAddStudent}
            onOpenEditStudent={handleOpenEditStudent}
            onOpenRecordPayment={handleOpenRecordPayment}
            onOpenWhatsAppPreview={(id) => setWhatsAppPreviewStudentId(id)}
          />
        )}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Modals */}
      {isRecordPaymentOpen && (
        <RecordPaymentModal
          initialStudentId={recordPaymentStudentId}
          onClose={() => setIsRecordPaymentOpen(false)}
          onReceiptCreated={handleReceiptCreated}
        />
      )}

      {activeReceiptPaymentId && (
        <FeeReceiptModal
          paymentId={activeReceiptPaymentId}
          onClose={() => setActiveReceiptPaymentId(null)}
        />
      )}

      {isAddEditStudentOpen && (
        <AddEditStudentModal
          studentToEdit={studentToEdit}
          onClose={() => {
            setIsAddEditStudentOpen(false);
            setStudentToEdit(null);
          }}
        />
      )}

      {whatsAppPreviewStudentId && (
        <WhatsAppPreviewModal
          studentId={whatsAppPreviewStudentId}
          onClose={() => setWhatsAppPreviewStudentId(null)}
        />
      )}

      {isExportModalOpen && (
        <ExportModal onClose={() => setIsExportModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
