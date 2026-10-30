const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const path = require('path');

const { connectDatabase } = require('./config/db');
const {
  users: initialUsers,
  students: initialStudents,
  teachers: initialTeachers,
  departments: initialDepartments,
  courses: initialCourses,
  subjects: initialSubjects,
  attendanceRecords: initialAttendanceRecords,
  feeRecords: initialFeeRecords,
  announcements: initialAnnouncements,
  examSchedules: initialExamSchedules,
  results: initialResults,
  classSections: initialClasses,
} = require('./data/seedData');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required. Set it in server/.env before starting the server.');
}

const store = {
  users: JSON.parse(JSON.stringify(initialUsers)),
  students: JSON.parse(JSON.stringify(initialStudents)),
  teachers: JSON.parse(JSON.stringify(initialTeachers)),
  departments: JSON.parse(JSON.stringify(initialDepartments)),
  courses: JSON.parse(JSON.stringify(initialCourses)),
  subjects: JSON.parse(JSON.stringify(initialSubjects)),
  attendanceRecords: JSON.parse(JSON.stringify(initialAttendanceRecords)),
  feeRecords: JSON.parse(JSON.stringify(initialFeeRecords)),
  announcements: JSON.parse(JSON.stringify(initialAnnouncements)),
  examSchedules: JSON.parse(JSON.stringify(initialExamSchedules)),
  results: JSON.parse(JSON.stringify(initialResults)),
  classSections: JSON.parse(JSON.stringify(initialClasses)),
};

let databaseConnected = false;

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

const sanitizeUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = store.users.find((entry) => entry.id === decoded.id || entry.email === decoded.email);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to access this resource.' });
  }
  next();
};

const getDashboardData = (role = 'admin') => {
  const totalStudents = store.students.length;
  const totalTeachers = store.teachers.length;
  const totalDepartments = store.departments.length;
  const totalCourses = store.courses.length;
  const totalClasses = store.classSections.length;
  const totalFeesCollected = store.feeRecords
    .filter((fee) => fee.status === 'Paid')
    .reduce((sum, fee) => sum + Number(fee.amount), 0);
  const pendingFees = store.feeRecords
    .filter((fee) => fee.status !== 'Paid')
    .reduce((sum, fee) => sum + Number(fee.amount), 0);

  const averageAttendance =
    store.students.reduce((sum, student) => sum + Number(student.attendance || 0), 0) / Math.max(totalStudents, 1);

  const enrollmentTrend = [
    { month: 'Jan', students: 180 },
    { month: 'Feb', students: 210 },
    { month: 'Mar', students: 240 },
    { month: 'Apr', students: 260 },
    { month: 'May', students: 310 },
    { month: 'Jun', students: 360 },
    { month: 'Jul', students: 420 },
  ];

  const feeTrend = [
    { month: 'Jan', amount: 1200000 },
    { month: 'Feb', amount: 1450000 },
    { month: 'Mar', amount: 1500000 },
    { month: 'Apr', amount: 1800000 },
    { month: 'May', amount: 2050000 },
    { month: 'Jun', amount: 2200000 },
  ];

  const recentAdmissions = [...store.students].slice(0, 5).map((student) => ({
    name: student.name,
    course: student.course,
    semester: student.semester,
    date: student.admissionDate,
  }));

  const recentActivities = [
    { title: 'New admission recorded', detail: 'Student ID STU-1006 joined the Computer Science department', time: '2 hours ago' },
    { title: 'Attendance alert', detail: 'Vihaan Nair is below minimum attendance threshold', time: '4 hours ago' },
    { title: 'Fee reminder sent', detail: '3 pending payments were notified to parents', time: '1 day ago' },
    { title: 'Exam schedule published', detail: 'Mid-semester exams are now available to all students', time: '2 days ago' },
  ];

  return {
    role,
    stats: {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalDepartments,
      totalClasses,
      totalFeesCollected,
      pendingFees,
      averageAttendance: Number(averageAttendance.toFixed(1)),
    },
    chartData: enrollmentTrend,
    feeTrend,
    recentAdmissions,
    recentActivities,
    announcements: store.announcements,
    upcomingExams: store.examSchedules.slice(0, 4),
    attendanceSummary: {
      totalPresent: store.attendanceRecords.filter((record) => record.status === 'Present').length,
      totalAbsent: store.attendanceRecords.filter((record) => record.status === 'Absent').length,
      attendancePercentage: Number((store.attendanceRecords.filter((record) => record.status === 'Present').length / Math.max(store.attendanceRecords.length, 1) * 100).toFixed(1)),
    },
  };
};

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseConnected,
    message: databaseConnected ? 'MongoDB connected' : 'Demo mode active',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = store.users.find((entry) => normalizeEmail(entry.email) === normalizeEmail(email));

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

  return res.json({
    token,
    user: sanitizeUser(user),
    message: 'Login successful.',
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  if (store.users.some((user) => normalizeEmail(user.email) === normalizeEmail(email))) {
    return res.status(409).json({ message: 'A user with this email already exists.' });
  }

  const user = {
    id: `USR-${String(store.users.length + 1).padStart(4, '0')}`,
    name,
    email: normalizeEmail(email),
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'student',
    phone: '',
    status: 'Active',
  };

  store.users.push(user);
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

  return res.status(201).json({
    token,
    user: sanitizeUser(user),
    message: 'Registration successful.',
  });
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: req.user });
});

app.put('/api/auth/change-password', auth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required.' });
  }

  const user = store.users.find((entry) => entry.id === req.user.id);

  if (!user || !bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.status(400).json({ message: 'Current password is incorrect.' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);

  return res.json({ message: 'Password updated successfully.' });
});

app.get('/api/dashboard', auth, (req, res) => {
  const dashboard = getDashboardData(req.user.role);
  return res.json(dashboard);
});

app.get('/api/students', auth, (req, res) => {
  const { search = '', department = '', semester = '' } = req.query;

  const filteredStudents = store.students.filter((student) => {
    const matchesSearch = !search || `${student.name} ${student.studentId}`.toLowerCase().includes(String(search).toLowerCase());
    const matchesDepartment = !department || student.department === department;
    const matchesSemester = !semester || String(student.semester) === String(semester);
    return matchesSearch && matchesDepartment && matchesSemester;
  });

  return res.json(filteredStudents);
});

app.get('/api/students/:id', auth, (req, res) => {
  const student = store.students.find((entry) => entry.id === req.params.id || entry.studentId === req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  return res.json(student);
});

app.post('/api/students', auth, authorize('admin', 'teacher'), (req, res) => {
  const payload = req.body || {};
  const student = {
    id: `STU-${String(store.students.length + 101).padStart(4, '0')}`,
    studentId: `STU-${String(store.students.length + 101).padStart(4, '0')}`,
    name: payload.name || 'New Student',
    profilePhoto: payload.profilePhoto || '',
    dob: payload.dob || '2006-01-01',
    gender: payload.gender || 'Male',
    email: payload.email || 'newstudent@student.edu',
    mobile: payload.mobile || '0000000000',
    address: payload.address || 'Campus',
    parentName: payload.parentName || 'Guardian',
    parentContact: payload.parentContact || '0000000000',
    department: payload.department || 'Computer Science',
    course: payload.course || 'B.Tech Computer Science',
    semester: Number(payload.semester || 1),
    section: payload.section || 'A',
    admissionDate: payload.admissionDate || new Date().toISOString().slice(0, 10),
    academicYear: payload.academicYear || '2026-2027',
    bloodGroup: payload.bloodGroup || 'O+',
    emergencyContact: payload.emergencyContact || '0000000000',
    attendance: Number(payload.attendance || 85),
    status: payload.status || 'Active',
  };

  store.students.push(student);
  res.status(201).json(student);
});

app.put('/api/students/:id', auth, authorize('admin', 'teacher'), (req, res) => {
  const index = store.students.findIndex((student) => student.id === req.params.id || student.studentId === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  store.students[index] = { ...store.students[index], ...req.body };
  return res.json(store.students[index]);
});

app.delete('/api/students/:id', auth, authorize('admin'), (req, res) => {
  const index = store.students.findIndex((student) => student.id === req.params.id || student.studentId === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  const removedStudent = store.students.splice(index, 1)[0];
  return res.json({ message: `${removedStudent.name} removed successfully.`, student: removedStudent });
});

app.get('/api/teachers', auth, (req, res) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const department = String(req.query.department || '').trim();

  const filteredTeachers = store.teachers.filter((teacher) => {
    const matchesSearch = !search || `${teacher.name} ${teacher.teacherId}`.toLowerCase().includes(search);
    const matchesDepartment = !department || teacher.department === department;
    return matchesSearch && matchesDepartment;
  });

  return res.json(filteredTeachers);
});

app.get('/api/courses', auth, (req, res) => {
  return res.json(store.courses);
});

app.get('/api/departments', auth, (req, res) => {
  return res.json(store.departments);
});

app.get('/api/attendance', auth, (req, res) => {
  const summary = {
    totalPresent: store.attendanceRecords.filter((record) => record.status === 'Present').length,
    totalAbsent: store.attendanceRecords.filter((record) => record.status === 'Absent').length,
    totalLate: store.attendanceRecords.filter((record) => record.status === 'Late').length,
    attendancePercentage: Number(
      ((store.attendanceRecords.filter((record) => record.status === 'Present').length / Math.max(store.attendanceRecords.length, 1)) * 100).toFixed(1),
    ),
  };

  return res.json({ records: store.attendanceRecords, summary });
});

app.post('/api/attendance', auth, authorize('admin', 'teacher'), (req, res) => {
  const record = {
    id: `ATT-${String(store.attendanceRecords.length + 1).padStart(3, '0')}`,
    studentId: req.body.studentId,
    studentName: req.body.studentName || 'Student',
    date: req.body.date || new Date().toISOString().slice(0, 10),
    subject: req.body.subject || 'General',
    status: req.body.status || 'Present',
  };

  store.attendanceRecords.unshift(record);
  return res.status(201).json(record);
});

app.get('/api/announcements', auth, (req, res) => {
  return res.json(store.announcements);
});

app.get('/api/exams', auth, (req, res) => {
  return res.json(store.examSchedules);
});

app.get('/api/results', auth, (req, res) => {
  return res.json(store.results);
});

app.get('/api/profile', auth, (req, res) => {
  const user = store.users.find((entry) => entry.id === req.user.id);
  const student = store.students.find((entry) => entry.email === user.email || entry.name === user.name);

  return res.json({ user: sanitizeUser(user), student });
});

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

(async () => {
  const result = await connectDatabase();
  databaseConnected = result.connected;

  app.listen(PORT, () => {
    console.log(`Student Management System backend is running on port ${PORT}`);
    console.log(databaseConnected ? 'Connected to MongoDB.' : 'Running with demo seed data.');
  });
})();

module.exports = app;
