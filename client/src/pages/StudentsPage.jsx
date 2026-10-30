import { useEffect, useState } from 'react';
import api from '../api';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/students', { params: { search: query } });
        setStudents(data);
      } catch (error) {
        setStudents([]);
      }
    };

    load();
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Academics</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Student records</h2>
        </div>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or student ID"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm md:max-w-md"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No student records found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-t border-slate-200">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.studentId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">{student.department}</td>
                    <td className="px-4 py-4">{student.semester}</td>
                    <td className="px-4 py-4">{student.attendance}%</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {student.status}
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
