import { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@college.edu', password: 'admin123' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await onLogin(form);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900 p-10 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-100">Student management</p>
          <h1 className="mt-8 text-4xl font-bold">CampusHQ</h1>
          <p className="mt-4 max-w-md text-cyan-50/90">
            Centralized academic operations, attendance monitoring, examinations, and parent visibility for colleges and universities.
          </p>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-cyan-100">Demo access</p>
            <ul className="mt-3 space-y-2 text-sm text-cyan-50/90">
              <li>Admin: admin@college.edu / admin123</li>
              <li>Teacher: meera.nair@college.edu / teacher123</li>
              <li>Student: aarav.sharma@student.edu / student123</li>
              <li>Parent: rajesh.sharma@parent.edu / parent123</li>
            </ul>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Welcome back</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Login to dashboard</h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  placeholder="you@college.edu"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              Need an account? <a href="/register" className="font-semibold text-cyan-700">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
