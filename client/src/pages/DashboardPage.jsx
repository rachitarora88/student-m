import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import api from '../api';

const defaultDashboard = {
  stats: {
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalDepartments: 0,
    totalClasses: 0,
    totalFeesCollected: 0,
    pendingFees: 0,
    averageAttendance: 0,
  },
  chartData: [],
  feeTrend: [],
  recentAdmissions: [],
  recentActivities: [],
  announcements: [],
  upcomingExams: [],
  attendanceSummary: {
    totalPresent: 0,
    totalAbsent: 0,
    attendancePercentage: 0,
  },
};

export default function DashboardPage({ user }) {
  const [dashboard, setDashboard] = useState(defaultDashboard);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setDashboard(data);
      } catch (error) {
        setDashboard(defaultDashboard);
      }
    };

    load();
  }, []);

  const stats = [
    { label: 'Total Students', value: dashboard.stats.totalStudents },
    { label: 'Total Teachers', value: dashboard.stats.totalTeachers },
    { label: 'Total Courses', value: dashboard.stats.totalCourses },
    { label: 'Total Departments', value: dashboard.stats.totalDepartments },
    { label: 'Fees Collected', value: `₹${dashboard.stats.totalFeesCollected.toLocaleString()}` },
    { label: 'Pending Fees', value: `₹${dashboard.stats.pendingFees.toLocaleString()}` },
    { label: 'Attendance', value: `${dashboard.stats.averageAttendance}%` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Overview</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">{user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} dashboard` : 'Dashboard'}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Student enrollment</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.chartData}>
                <defs>
                  <linearGradient id="studentsFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="students" stroke="#0891b2" fill="url(#studentsFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Fee collection</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.feeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">Recent admissions</h3>
          <div className="mt-4 space-y-3">
            {dashboard.recentAdmissions.length === 0 ? (
              <p className="text-sm text-slate-500">No recent admissions.</p>
            ) : (
              dashboard.recentAdmissions.map((student) => (
                <div key={student.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.course}</p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <p>{student.semester}th Semester</p>
                    <p>{student.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Attendance</h3>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-slate-500">Attendance %</p>
              <p className="mt-1 text-4xl font-bold text-slate-900">{dashboard.attendanceSummary.attendancePercentage}%</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <p className="font-medium">Present</p>
                <p className="text-2xl font-bold">{dashboard.attendanceSummary.totalPresent}</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-3 text-rose-700">
                <p className="font-medium">Absent</p>
                <p className="text-2xl font-bold">{dashboard.attendanceSummary.totalAbsent}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent activities</h3>
          <div className="mt-4 space-y-3">
            {dashboard.recentActivities.map((activity) => (
              <div key={activity.title} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="font-medium text-slate-800">{activity.title}</p>
                <p className="mt-1 text-sm text-slate-500">{activity.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming examinations</h3>
          <div className="mt-4 space-y-3">
            {dashboard.upcomingExams.map((exam) => (
              <div key={exam.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="font-medium text-slate-800">{exam.subject}</p>
                <p className="mt-1 text-sm text-slate-500">{exam.date} • {exam.time}</p>
                <p className="mt-1 text-xs text-slate-400">{exam.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
