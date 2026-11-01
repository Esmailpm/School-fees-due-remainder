import { Student, FeePayment, AttendanceRecord, SchoolSettings } from '../types';

export const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'SHIKSHA MARGDARSHAN KENDRA',
  tagline: 'Play Group • Junior KG • Senior KG',
  address: 'Opp. Shivaji Park, Station Road, Maharashtra - 400001',
  phone: '9820012345',
  upiId: 'shikshamargdarshan@oksbi',
  upiName: 'Shiksha Margdarshan Kendra',
  academicYear: '2026-2027',
  defaultMonthlyFee: 1800,
  defaultYearlyFee: 20000,
};

export const INITIAL_STUDENTS: Student[] = [
  // PLAY GROUP
  {
    id: 's-pg-01',
    rollNo: 'PG-01',
    name: 'Aarav Sharma',
    avatarSeed: 'aarav',
    gender: 'boy',
    class: 'Play Group',
    batchTime: '08:30 AM - 11:00 AM',
    parentName: 'Rajesh Sharma',
    parentPhone: '9820198201',
    relation: 'Father',
    feePlan: 'monthly',
    feeAmount: 1800,
    admissionDate: '2026-06-15',
    status: 'active',
  },
  {
    id: 's-pg-02',
    rollNo: 'PG-02',
    name: 'Ananya Patil',
    avatarSeed: 'ananya',
    gender: 'girl',
    class: 'Play Group',
    batchTime: '08:30 AM - 11:00 AM',
    parentName: 'Sunita Patil',
    parentPhone: '9833445566',
    relation: 'Mother',
    feePlan: 'monthly',
    feeAmount: 1800,
    admissionDate: '2026-06-18',
    status: 'active',
  },
  {
    id: 's-pg-03',
    rollNo: 'PG-03',
    name: 'Reyansh Gupta',
    avatarSeed: 'reyansh',
    gender: 'boy',
    class: 'Play Group',
    batchTime: '11:30 AM - 02:00 PM',
    parentName: 'Manoj Gupta',
    parentPhone: '9819223344',
    relation: 'Father',
    feePlan: 'yearly',
    feeAmount: 20000,
    admissionDate: '2026-06-20',
    status: 'active',
  },
  {
    id: 's-pg-04',
    rollNo: 'PG-04',
    name: 'Diya Joshi',
    avatarSeed: 'diya',
    gender: 'girl',
    class: 'Play Group',
    batchTime: '11:30 AM - 02:00 PM',
    parentName: 'Pooja Joshi',
    parentPhone: '9870112233',
    relation: 'Mother',
    feePlan: 'monthly',
    feeAmount: 1800,
    admissionDate: '2026-07-01',
    status: 'active',
  },
  {
    id: 's-pg-05',
    rollNo: 'PG-05',
    name: 'Kabir Verma',
    avatarSeed: 'kabir',
    gender: 'boy',
    class: 'Play Group',
    batchTime: '08:30 AM - 11:00 AM',
    parentName: 'Vikram Verma',
    parentPhone: '9867001122',
    relation: 'Father',
    feePlan: 'monthly',
    feeAmount: 1800,
    admissionDate: '2026-07-05',
    status: 'active',
  },

  // JR. KG
  {
    id: 's-jr-01',
    rollNo: 'JKG-01',
    name: 'Saanvi Kulkarni',
    avatarSeed: 'saanvi',
    gender: 'girl',
    class: 'Jr. KG',
    batchTime: '08:30 AM - 11:00 AM',
    parentName: 'Amol Kulkarni',
    parentPhone: '9821334455',
    relation: 'Father',
    feePlan: 'monthly',
    feeAmount: 1900,
    admissionDate: '2026-06-10',
    status: 'active',
  },
  {
    id: 's-jr-02',
    rollNo: 'JKG-02',
    name: 'Vivaan Deshmukh',
    avatarSeed: 'vivaan',
    gender: 'boy',
    class: 'Jr. KG',
    batchTime: '08:30 AM - 11:00 AM',
    parentName: 'Sanjay Deshmukh',
    parentPhone: '9892113344',
    relation: 'Father',
    feePlan: 'yearly',
    feeAmount: 21000,
    admissionDate: '2026-06-12',
    status: 'active',
  },
  {
    id: 's-jr-03',
    rollNo: 'JKG-03',
    name: 'Myra Khan',
    avatarSeed: 'myra',
    gender: 'girl',
    class: 'Jr. KG',
    batchTime: '11:30 AM - 02:00 PM',
    parentName: 'Farhan Khan',
    parentPhone: '9833887766',
    relation: 'Father',
    feePlan: 'monthly',
    feeAmount: 1900,
    admissionDate: '2026-06-15',
    status: 'active',
  },
  {
    id: 's-jr-04',
    rollNo: 'JKG-04',
    name: 'Arjun Nair',
    avatarSeed: 'arjun',
    gender: 'boy',
    class: 'Jr. KG',
    batchTime: '11:30 AM - 02:00 PM',
    parentName: 'Deepa Nair',
    parentPhone: '9819776655',
    relation: 'Mother',
    feePlan: 'monthly',
    feeAmount: 1900,
    admissionDate: '2026-06-22',
    status: 'active',
  },
  {
    id: 's-jr-05',
    rollNo: 'JKG-05',
    name: 'Isha Mehra',
    avatarSeed: 'isha',
    gender: 'girl',
    class: 'Jr. KG',
    batchTime: '08:30 AM - 11:00 AM',
    parentName: 'Rohan Mehra',
    parentPhone: '9870554433',
    relation: 'Father',
    feePlan: 'monthly',
    feeAmount: 1900,
    admissionDate: '2026-07-02',
    status: 'active',
  },

  // SR. KG
  {
    id: 's-sr-01',
    rollNo: 'SKG-01',
    name: 'Advik Rao',
    avatarSeed: 'advik',
    gender: 'boy',
    class: 'Sr. KG',
    batchTime: '08:30 AM - 11:00 AM',
    parentName: 'Karthik Rao',
    parentPhone: '9820556677',
    relation: 'Father',
    feePlan: 'yearly',
    feeAmount: 22000,
    admissionDate: '2026-06-08',
    status: 'active',
  },
  {
    id: 's-sr-02',
    rollNo: 'SKG-02',
    name: 'Kiara Shinde',
    avatarSeed: 'kiara',
    gender: 'girl',
    class: 'Sr. KG',
    batchTime: '08:30 AM - 11:00 AM',
    parentName: 'Prashant Shinde',
    parentPhone: '9833221199',
    relation: 'Father',
    feePlan: 'monthly',
    feeAmount: 2000,
    admissionDate: '2026-06-09',
    status: 'active',
  },
  {
    id: 's-sr-03',
    rollNo: 'SKG-03',
    name: 'Devansh Tiwari',
    avatarSeed: 'devansh',
    gender: 'boy',
    class: 'Sr. KG',
    batchTime: '11:30 AM - 02:00 PM',
    parentName: 'Alok Tiwari',
    parentPhone: '9819998877',
    relation: 'Father',
    feePlan: 'monthly',
    feeAmount: 2000,
    admissionDate: '2026-06-11',
    status: 'active',
  },
  {
    id: 's-sr-04',
    rollNo: 'SKG-04',
    name: 'Zara Merchant',
    avatarSeed: 'zara',
    gender: 'girl',
    class: 'Sr. KG',
    batchTime: '11:30 AM - 02:00 PM',
    parentName: 'Shabana Merchant',
    parentPhone: '9867114488',
    relation: 'Mother',
    feePlan: 'monthly',
    feeAmount: 2000,
    admissionDate: '2026-06-25',
    status: 'active',
  },
  {
    id: 's-sr-05',
    rollNo: 'SKG-05',
    name: 'Shaurya Chauhan',
    avatarSeed: 'shaurya',
    gender: 'boy',
    class: 'Sr. KG',
    batchTime: '08:30 AM - 11:00 AM',
    parentName: 'Mahesh Chauhan',
    parentPhone: '9870889900',
    relation: 'Father',
    feePlan: 'monthly',
    feeAmount: 2000,
    admissionDate: '2026-07-04',
    status: 'active',
  },
];

// Current month is November 2026 as per local time
export const INITIAL_PAYMENTS: FeePayment[] = [
  // Aarav has paid for November 2026
  {
    id: 'pay-01',
    studentId: 's-pg-01',
    amount: 1800,
    period: 'November 2026',
    date: '2026-11-01',
    mode: 'UPI (GPay / PhonePe / Paytm)',
    receiptNo: 'SMK-2026-1101',
    remarks: 'Google Pay transaction by Rajesh',
  },
  // Reyansh has paid yearly
  {
    id: 'pay-02',
    studentId: 's-pg-03',
    amount: 20000,
    period: 'Yearly 2026-2027',
    date: '2026-06-20',
    mode: 'Bank Transfer',
    receiptNo: 'SMK-2026-0042',
    remarks: 'Full year advance discount given',
  },
  // Diya has paid for October 2026, but November 2026 is due!
  {
    id: 'pay-03',
    studentId: 's-pg-04',
    amount: 1800,
    period: 'October 2026',
    date: '2026-10-05',
    mode: 'Cash',
    receiptNo: 'SMK-2026-1033',
  },
  // Saanvi has paid for November 2026
  {
    id: 'pay-04',
    studentId: 's-jr-01',
    amount: 1900,
    period: 'November 2026',
    date: '2026-11-01',
    mode: 'UPI (GPay / PhonePe / Paytm)',
    receiptNo: 'SMK-2026-1102',
    remarks: 'PhonePe QR scan at desk',
  },
  // Vivaan has paid yearly
  {
    id: 'pay-05',
    studentId: 's-jr-02',
    amount: 21000,
    period: 'Yearly 2026-2027',
    date: '2026-06-12',
    mode: 'Cheque',
    receiptNo: 'SMK-2026-0019',
    remarks: 'HDFC Cheque #349201',
  },
  // Arjun paid partial ₹1000 for November 2026
  {
    id: 'pay-06',
    studentId: 's-jr-04',
    amount: 1000,
    period: 'November 2026',
    date: '2026-11-01',
    mode: 'Cash',
    receiptNo: 'SMK-2026-1103',
    remarks: 'Part payment, remaining ₹900 promised by 10th',
  },
  // Advik has paid yearly
  {
    id: 'pay-07',
    studentId: 's-sr-01',
    amount: 22000,
    period: 'Yearly 2026-2027',
    date: '2026-06-08',
    mode: 'UPI (GPay / PhonePe / Paytm)',
    receiptNo: 'SMK-2026-0011',
  },
  // Kiara paid November 2026
  {
    id: 'pay-08',
    studentId: 's-sr-02',
    amount: 2000,
    period: 'November 2026',
    date: '2026-11-01',
    mode: 'Cash',
    receiptNo: 'SMK-2026-1104',
  },
];

// Helper to generate attendance for past 14 days in October and today (Nov 1)
export function generateInitialAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const students = INITIAL_STUDENTS;

  // Generate attendance for past days (e.g. Oct 15 - Oct 31, and Nov 1)
  const sampleDates = [
    '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23',
    '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30',
    '2026-11-01'
  ];

  sampleDates.forEach((date) => {
    students.forEach((student, idx) => {
      // Create realistic attendance pattern:
      // Most kids attend 85%-95% of time
      let status: 'present' | 'absent' | 'late' = 'present';
      const pseudoRandom = (student.name.length * 7 + date.charCodeAt(date.length - 1) * 3 + idx) % 10;
      
      if (pseudoRandom === 0) {
        status = 'absent';
      } else if (pseudoRandom === 1 && idx % 3 === 0) {
        status = 'late';
      }

      records.push({
        id: `att-${student.id}-${date}`,
        studentId: student.id,
        date,
        status,
      });
    });
  });

  return records;
}
