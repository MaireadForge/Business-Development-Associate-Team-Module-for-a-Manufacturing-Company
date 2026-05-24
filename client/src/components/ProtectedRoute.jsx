import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar — w-64 */}
      <Sidebar />

      {/* Right side: Navbar on top + scrollable page content */}
      <div className="flex-1 pl-64">
        <Navbar />
        <main className="pt-16 p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
