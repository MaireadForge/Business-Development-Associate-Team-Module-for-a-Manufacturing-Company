import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const path = pathname.split('/')[1];
    switch (path) {
      case 'dashboard':
        return 'Dashboard';
      case 'leads':
        return 'Leads Pipeline';
      case 'clients':
        return 'Client Directory';
      case 'tasks':
        return 'Task Manager';
      case 'team':
        return 'My Team';
      default:
        return 'Overview';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 right-0 left-64 z-10 flex h-16 items-center justify-between bg-white px-8 shadow-sm border-b border-gray-100">
      <h1 className="text-xl font-bold text-gray-800">
        {getPageTitle(location.pathname)}
      </h1>
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-gray-800">{user.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow-sm border border-gray-100">
            {getInitials(user.name)}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
