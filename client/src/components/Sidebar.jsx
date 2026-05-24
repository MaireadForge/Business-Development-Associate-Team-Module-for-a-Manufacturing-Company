import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Target,
  Users,
  CheckSquare,
  UserCircle,
  LogOut,
  Briefcase,
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/leads', label: 'Leads', icon: Target },
    { to: '/clients', label: 'Clients', icon: Users },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/team', label: 'Team', icon: UserCircle },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-[#1e293b] text-slate-300 border-r border-slate-700/50 shadow-xl">
      {/* Top Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-700/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
          <Briefcase className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">BDA Pro</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'hover:bg-slate-700/50 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Logout Button */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
