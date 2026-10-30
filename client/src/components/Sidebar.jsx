import { NavLink } from 'react-router-dom';
import { BookOpenText, ClipboardCheck, GraduationCap, LayoutDashboard, LogOut, User, Users } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Students', to: '/students', icon: Users },
  { label: 'Teachers', to: '/teachers', icon: GraduationCap },
  { label: 'Attendance', to: '/attendance', icon: ClipboardCheck },
  { label: 'Courses', to: '/courses', icon: BookOpenText },
  { label: 'Profile', to: '/profile', icon: User },
];

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="min-h-screen w-full max-w-[260px] bg-slate-950 text-slate-50 p-5 shadow-xl">
      <div className="mb-8 border-b border-slate-800 pb-5">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">SMS</p>
        <h1 className="mt-2 text-2xl font-bold">CampusHQ</h1>
      </div>

      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 px-3 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in as</p>
        <p className="mt-2 text-lg font-semibold">{user?.name || 'User'}</p>
        <p className="text-sm capitalize text-slate-300">{user?.role || 'student'}</p>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive ? 'bg-cyan-500 text-slate-950' : 'text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
