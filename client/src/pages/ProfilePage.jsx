import { useEffect, useState } from 'react';
import api from '../api';

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/profile');
        setProfile(data);
      } catch (error) {
        setProfile({ user, student: null });
      }
    };

    load();
  }, [user]);

  if (!profile) {
    return <div className="text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Account</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Profile settings</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Basic information</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Name:</span> {profile.user?.name}</p>
            <p><span className="font-semibold text-slate-900">Email:</span> {profile.user?.email}</p>
            <p><span className="font-semibold text-slate-900">Role:</span> {profile.user?.role}</p>
            <p><span className="font-semibold text-slate-900">Phone:</span> {profile.user?.phone || 'Not provided'}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Academic profile</h3>
          {profile.student ? (
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Department:</span> {profile.student.department}</p>
              <p><span className="font-semibold text-slate-900">Course:</span> {profile.student.course}</p>
              <p><span className="font-semibold text-slate-900">Semester:</span> {profile.student.semester}</p>
              <p><span className="font-semibold text-slate-900">Attendance:</span> {profile.student.attendance}%</p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">No student profile attached for this account.</p>
          )}
        </div>
      </div>
    </div>
  );
}
