import { useEffect, useState } from 'react';
import api from '../api';

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ totalPresent: 0, totalAbsent: 0, attendancePercentage: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/attendance');
        setRecords(data.records);
        setSummary(data.summary);
      } catch (error) {
        setRecords([]);
        setSummary({ totalPresent: 0, totalAbsent: 0, attendancePercentage: 0 });
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Monitoring</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Attendance tracker</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">Present</p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">{summary.totalPresent}</p>
        </div>
        <div className="rounded-2xl bg-rose-50 p-5">
          <p className="text-sm text-rose-700">Absent</p>
          <p className="mt-2 text-3xl font-bold text-rose-900">{summary.totalAbsent}</p>
        </div>
        <div className="rounded-2xl bg-cyan-50 p-5">
          <p className="text-sm text-cyan-700">Attendance %</p>
          <p className="mt-2 text-3xl font-bold text-cyan-900">{summary.attendancePercentage}%</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No attendance data available.</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="border-t border-slate-200">
                    <td className="px-4 py-4 font-medium text-slate-900">{record.studentName}</td>
                    <td className="px-4 py-4">{record.date}</td>
                    <td className="px-4 py-4">{record.subject}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          record.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-700'
                            : record.status === 'Absent'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
