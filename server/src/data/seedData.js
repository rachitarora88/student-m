const { hashSync } = require('bcryptjs');

const departments = [
  { id: 'DEP-001', name: 'Computer Science', head: 'Dr. Meera Nair', studentCount: 320 },
  { id: 'DEP-002', name: 'Electronics', head: 'Prof. Rohit Sharma', studentCount: 180 },
  { id: 'DEP-003', name: 'Mechanical', head: 'Dr. Nitin Verma', studentCount: 210 },
  { id: 'DEP-004', name: 'Business Administration', head: 'Prof. Kavita Sethi', studentCount: 140 },
];

const courses = [
  { id: 'CRS-001', name: 'B.Tech Computer Science', department: 'Computer Science', duration: '4 Years', semesters: 8, fee: 820000 },
  { id: 'CRS-002', name: 'B.E. Electronics', department: 'Electronics', duration: '4 Years', semesters: 8, fee: 760000 },
  { id: 'CRS-003', name: 'BBA', department: 'Business Administration', duration: '3 Years', semesters: 6, fee: 340000 },
  { id: 'CRS-004', name: 'B.Sc Mechanical', department: 'Mechanical', duration: '3 Years', semesters: 6, fee: 450000 },
];

const subjects = [
  { id: 'SUB-001', name: 'Data Structures', code: 'CS201', semester: 2, department: 'Computer Science', teacher: 'Dr. Meera Nair' },
  { id: 'SUB-002', name: 'Operating Systems', code: 'CS301', semester: 3, department: 'Computer Science', teacher: 'Prof. Ananya Rao' },
  { id: 'SUB-003', name: 'Database Management', code: 'CS305', semester: 4, department: 'Computer Science', teacher: 'Dr. Arjun Pillai' },
  { id: 'SUB-004', name: 'Circuit Analysis', code: 'EC201', semester: 2, department: 'Electronics', teacher: 'Prof. Rohit Sharma' },
  { id: 'SUB-005', name: 'Marketing Principles', code: 'BA201', semester: 2, department: 'Business Administration', teacher: 'Prof. Kavita Sethi' },
  { id: 'SUB-006', name: 'Thermodynamics', code: 'ME205', semester: 3, department: 'Mechanical', teacher: 'Dr. Nitin Verma' },
];

const teachers = [
  { id: 'TCH-101', teacherId: 'TCH-101', name: 'Dr. Meera Nair', email: 'meera.nair@college.edu', phone: '9876541200', department: 'Computer Science', qualification: 'PhD in Computer Science', experience: '12 years', joiningDate: '2014-08-15', status: 'Active', subjects: ['Data Structures', 'Operating Systems'], schedule: 'Mon,Wed 09:00 - 11:00' },
  { id: 'TCH-102', teacherId: 'TCH-102', name: 'Prof. Ananya Rao', email: 'ananya.rao@college.edu', phone: '9807654200', department: 'Computer Science', qualification: 'M.Tech', experience: '8 years', joiningDate: '2018-01-10', status: 'Active', subjects: ['Operating Systems', 'Discrete Mathematics'], schedule: 'Tue,Thu 12:00 - 14:00' },
  { id: 'TCH-103', teacherId: 'TCH-103', name: 'Prof. Rohit Sharma', email: 'rohit.sharma@college.edu', phone: '9988776655', department: 'Electronics', qualification: 'M.E.', experience: '10 years', joiningDate: '2016-07-02', status: 'Active', subjects: ['Circuit Analysis', 'Signals & Systems'], schedule: 'Mon,Fri 10:00 - 12:00' },
  { id: 'TCH-104', teacherId: 'TCH-104', name: 'Prof. Kavita Sethi', email: 'kavita.sethi@college.edu', phone: '9812340000', department: 'Business Administration', qualification: 'MBA', experience: '9 years', joiningDate: '2017-06-25', status: 'Active', subjects: ['Marketing Principles', 'Organizational Behavior'], schedule: 'Wed,Thu 11:00 - 13:00' },
];

const students = [
  { id: 'STU-1001', studentId: 'STU-1001', name: 'Aarav Sharma', profilePhoto: '', dob: '2005-03-12', gender: 'Male', email: 'aarav.sharma@student.edu', mobile: '9876543210', address: 'Delhi', parentName: 'Rajesh Sharma', parentContact: '9876501234', department: 'Computer Science', course: 'B.Tech Computer Science', semester: 4, section: 'A', admissionDate: '2023-07-15', academicYear: '2023-2024', bloodGroup: 'O+', emergencyContact: '9898001122', attendance: 84.5, status: 'Active' },
  { id: 'STU-1002', studentId: 'STU-1002', name: 'Diya Patel', profilePhoto: '', dob: '2006-01-22', gender: 'Female', email: 'diya.patel@student.edu', mobile: '9887654321', address: 'Ahmedabad', parentName: 'Kiran Patel', parentContact: '9887603456', department: 'Computer Science', course: 'B.Tech Computer Science', semester: 4, section: 'A', admissionDate: '2023-08-01', academicYear: '2023-2024', bloodGroup: 'A+', emergencyContact: '9899111222', attendance: 88.0, status: 'Active' },
  { id: 'STU-1003', studentId: 'STU-1003', name: 'Rohan Gupta', profilePhoto: '', dob: '2004-11-10', gender: 'Male', email: 'rohan.gupta@student.edu', mobile: '9765432109', address: 'Lucknow', parentName: 'Sanjay Gupta', parentContact: '9765432100', department: 'Electronics', course: 'B.E. Electronics', semester: 3, section: 'B', admissionDate: '2022-07-11', academicYear: '2022-2023', bloodGroup: 'B+', emergencyContact: '9090909090', attendance: 76.5, status: 'Active' },
  { id: 'STU-1004', studentId: 'STU-1004', name: 'Meher Khan', profilePhoto: '', dob: '2005-06-19', gender: 'Female', email: 'meher.khan@student.edu', mobile: '9955667788', address: 'Jaipur', parentName: 'Imran Khan', parentContact: '9955667789', department: 'Business Administration', course: 'BBA', semester: 2, section: 'C', admissionDate: '2024-01-10', academicYear: '2024-2025', bloodGroup: 'AB-', emergencyContact: '9811122233', attendance: 91.0, status: 'Active' },
  { id: 'STU-1005', studentId: 'STU-1005', name: 'Vihaan Nair', profilePhoto: '', dob: '2005-08-05', gender: 'Male', email: 'vihaan.nair@student.edu', mobile: '9871234567', address: 'Bengaluru', parentName: 'Vijay Nair', parentContact: '9871234568', department: 'Mechanical', course: 'B.Sc Mechanical', semester: 5, section: 'D', admissionDate: '2021-08-02', academicYear: '2021-2022', bloodGroup: 'O-', emergencyContact: '9988774400', attendance: 72.2, status: 'Warning' },
  { id: 'STU-1006', studentId: 'STU-1006', name: 'Saanvi Joshi', profilePhoto: '', dob: '2004-10-08', gender: 'Female', email: 'saanvi.joshi@student.edu', mobile: '9009988776', address: 'Pune', parentName: 'Nitin Joshi', parentContact: '9009988777', department: 'Computer Science', course: 'B.Tech Computer Science', semester: 6, section: 'B', admissionDate: '2022-07-10', academicYear: '2022-2023', bloodGroup: 'A-', emergencyContact: '9766554433', attendance: 90.4, status: 'Active' },
];

const classSections = [
  { id: 'CLS-001', name: 'Computer Science - A', department: 'Computer Science', semester: 4, advisor: 'Dr. Meera Nair' },
  { id: 'CLS-002', name: 'Computer Science - B', department: 'Computer Science', semester: 6, advisor: 'Prof. Ananya Rao' },
  { id: 'CLS-003', name: 'Electronics - B', department: 'Electronics', semester: 3, advisor: 'Prof. Rohit Sharma' },
  { id: 'CLS-004', name: 'Business Administration - C', department: 'Business Administration', semester: 2, advisor: 'Prof. Kavita Sethi' },
];

const attendanceRecords = [
  { id: 'ATT-001', studentId: 'STU-1001', studentName: 'Aarav Sharma', date: '2026-10-20', subject: 'Data Structures', status: 'Present' },
  { id: 'ATT-002', studentId: 'STU-1002', studentName: 'Diya Patel', date: '2026-10-20', subject: 'Data Structures', status: 'Present' },
  { id: 'ATT-003', studentId: 'STU-1003', studentName: 'Rohan Gupta', date: '2026-10-20', subject: 'Circuit Analysis', status: 'Late' },
  { id: 'ATT-004', studentId: 'STU-1004', studentName: 'Meher Khan', date: '2026-10-20', subject: 'Marketing Principles', status: 'Present' },
  { id: 'ATT-005', studentId: 'STU-1005', studentName: 'Vihaan Nair', date: '2026-10-20', subject: 'Thermodynamics', status: 'Absent' },
  { id: 'ATT-006', studentId: 'STU-1006', studentName: 'Saanvi Joshi', date: '2026-10-20', subject: 'Operating Systems', status: 'Present' },
];

const feeRecords = [
  { id: 'FEE-001', studentId: 'STU-1001', studentName: 'Aarav Sharma', amount: 32000, status: 'Paid', dueDate: '2026-10-30' },
  { id: 'FEE-002', studentId: 'STU-1002', studentName: 'Diya Patel', amount: 32000, status: 'Paid', dueDate: '2026-10-25' },
  { id: 'FEE-003', studentId: 'STU-1003', studentName: 'Rohan Gupta', amount: 28000, status: 'Pending', dueDate: '2026-11-05' },
  { id: 'FEE-004', studentId: 'STU-1004', studentName: 'Meher Khan', amount: 18000, status: 'Paid', dueDate: '2026-10-21' },
  { id: 'FEE-005', studentId: 'STU-1005', studentName: 'Vihaan Nair', amount: 30000, status: 'Pending', dueDate: '2026-11-02' },
  { id: 'FEE-006', studentId: 'STU-1006', studentName: 'Saanvi Joshi', amount: 32000, status: 'Paid', dueDate: '2026-10-23' },
];

const announcements = [
  { id: 'ANN-001', title: 'Mid-semester schedule published', content: 'Students are requested to check their exam timetable in the student portal.', date: '2026-10-18', priority: 'High' },
  { id: 'ANN-002', title: 'Parent orientation program', content: 'Parents are invited for the orientation on 25 October at 10:00 AM.', date: '2026-10-17', priority: 'Medium' },
  { id: 'ANN-003', title: 'Scholarship portal open', content: 'Meritorious students can apply for the institutional scholarship grant.', date: '2026-10-10', priority: 'Low' },
];

const examSchedules = [
  { id: 'EXM-001', subject: 'Data Structures', date: '2026-11-02', time: '09:00 AM', venue: 'Room 301', semester: 4 },
  { id: 'EXM-002', subject: 'Operating Systems', date: '2026-11-04', time: '11:00 AM', venue: 'Lab 2', semester: 4 },
  { id: 'EXM-003', subject: 'Marketing Principles', date: '2026-11-06', time: '10:00 AM', venue: 'Room 118', semester: 2 },
  { id: 'EXM-004', subject: 'Thermodynamics', date: '2026-11-08', time: '01:00 PM', venue: 'Workshop Hall', semester: 5 },
];

const results = [
  { id: 'RES-001', studentId: 'STU-1001', studentName: 'Aarav Sharma', subject: 'Data Structures', marks: 86, grade: 'A' },
  { id: 'RES-002', studentId: 'STU-1001', studentName: 'Aarav Sharma', subject: 'Operating Systems', marks: 91, grade: 'A+' },
  { id: 'RES-003', studentId: 'STU-1002', studentName: 'Diya Patel', subject: 'Data Structures', marks: 92, grade: 'A+' },
  { id: 'RES-004', studentId: 'STU-1003', studentName: 'Rohan Gupta', subject: 'Circuit Analysis', marks: 74, grade: 'B+' },
  { id: 'RES-005', studentId: 'STU-1005', studentName: 'Vihaan Nair', subject: 'Thermodynamics', marks: 63, grade: 'B' },
];

const users = [
  { id: 'USR-001', name: 'Admin User', email: 'admin@college.edu', passwordHash: hashSync('admin123', 10), role: 'admin', phone: '9999999999', status: 'Active' },
  { id: 'USR-002', name: 'Dr. Meera Nair', email: 'meera.nair@college.edu', passwordHash: hashSync('teacher123', 10), role: 'teacher', phone: '9876541200', status: 'Active' },
  { id: 'USR-003', name: 'Aarav Sharma', email: 'aarav.sharma@student.edu', passwordHash: hashSync('student123', 10), role: 'student', phone: '9876543210', status: 'Active' },
  { id: 'USR-004', name: 'Rajesh Sharma', email: 'rajesh.sharma@parent.edu', passwordHash: hashSync('parent123', 10), role: 'parent', phone: '9876501234', status: 'Active' },
];

module.exports = {
  users,
  students,
  teachers,
  departments,
  courses,
  subjects,
  attendanceRecords,
  feeRecords,
  announcements,
  examSchedules,
  results,
  classSections,
};
