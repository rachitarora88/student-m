import { useEffect, useState } from 'react';
import api from '../api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [coursesResponse, departmentsResponse] = await Promise.all([
          api.get('/courses'),
          api.get('/departments'),
        ]);
        setCourses(coursesResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (error) {
        setCourses([]);
        setDepartments([]);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Academic structure</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Departments & courses</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {departments.map((department) => (
          <div key={department.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Department</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{department.name}</h3>
            <p className="mt-2 text-sm text-slate-500">Head: {department.head}</p>
            <p className="mt-1 text-sm text-slate-500">Students: {department.studentCount}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {courses.map((course) => (
          <div key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Course</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{course.name}</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><span className="font-semibold">Department:</span> {course.department}</p>
              <p><span className="font-semibold">Duration:</span> {course.duration}</p>
              <p><span className="font-semibold">Semesters:</span> {course.semesters}</p>
              <p><span className="font-semibold">Fee:</span> ₹{course.fee.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
