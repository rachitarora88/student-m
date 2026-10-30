import { useEffect, useState } from 'react';
import api from '../api';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/teachers');
        setTeachers(data);
      } catch (error) {
        setTeachers([]);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Faculty</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Teacher management</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {teachers.length === 0 ? (
          <p className="text-slate-500">No teacher records available.</p>
        ) : (
          teachers.map((teacher) => (
            <div key={teacher.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold text-slate-900">{teacher.name}</p>
                  <p className="text-sm text-slate-500">{teacher.department}</p>
                </div>
                <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700">{teacher.status}</span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold">Qualification:</span> {teacher.qualification}</p>
                <p><span className="font-semibold">Experience:</span> {teacher.experience}</p>
                <p><span className="font-semibold">Subjects:</span> {teacher.subjects.join(', ')}</p>
                <p><span className="font-semibold">Schedule:</span> {teacher.schedule}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
