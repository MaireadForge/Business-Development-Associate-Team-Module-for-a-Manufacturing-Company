import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Shield,
  Briefcase,
  Mail,
  Calendar,
  Target,
  CheckSquare,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const Team = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch if currentUser is admin
    if (currentUser?.role === 'admin') {
      fetchTeamData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch users (admin-only API), leads and tasks to count assignments
      const [usersRes, leadsRes, tasksRes] = await Promise.all([
        api.get('/users'),
        api.get('/leads'),
        api.get('/tasks'),
      ]);
      setUsers(usersRes.data);
      setLeads(leadsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError(
        err.response?.data?.message || 'Failed to fetch team details. Admins only.'
      );
    } finally {
      setLoading(false);
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

  const getAvatarBg = (role) => {
    return role === 'admin'
      ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-indigo-100'
      : 'bg-gradient-to-tr from-emerald-400 to-teal-600 shadow-emerald-100';
  };

  const getRoleBadgeStyle = (role) => {
    return role === 'admin'
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Access check
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
        <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-bold text-amber-800">Access Restricted</h3>
          <p className="text-sm text-amber-700 mt-2">
            Only administrators are authorized to access the Team Directory and view member statistics. If you believe this is an error, please contact your systems admin.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <span className="text-sm font-medium text-gray-500">Loading Team Stats...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 shadow-sm">
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-red-800">Connection Error</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Summary Metrics
  const totalMembers = users.length;
  const adminsCount = users.filter((u) => u.role === 'admin').length;
  const bdasCount = users.filter((u) => u.role === 'bda').length;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header Info */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Team</h2>
        <p className="text-sm text-gray-500 mt-0.5">View member performance and lead/task allocation metrics.</p>
      </div>

      {/* Top summary bar */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Total Members */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-150 p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 text-slate-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Members</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{totalMembers}</p>
          </div>
        </div>

        {/* Admins */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-150 p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admins</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{adminsCount}</p>
          </div>
        </div>

        {/* BDAs */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-150 p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Business Dev Associates</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{bdasCount}</p>
          </div>
        </div>
      </div>

      {/* Grid of Profile Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((member) => {
          // Calculate allocated counts for this user
          const assignedLeadsCount = leads.filter(
            (l) => (l.assignedTo?._id || l.assignedTo) === member._id
          ).length;
          const assignedTasksCount = tasks.filter(
            (t) => (t.assignedTo?._id || t.assignedTo) === member._id
          ).length;

          return (
            <div
              key={member._id}
              className="bg-white rounded-2xl border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col p-6 relative overflow-hidden"
            >
              {/* Header profile summary */}
              <div className="flex items-center gap-4">
                {/* Initials Avatar */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm shadow-sm ${getAvatarBg(
                    member.role
                  )}`}
                >
                  {getInitials(member.name)}
                </div>

                <div className="truncate">
                  <h4 className="font-bold text-gray-900 text-sm truncate leading-snug">
                    {member.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRoleBadgeStyle(
                        member.role
                      )}`}
                    >
                      {member.role === 'admin' ? 'Admin' : 'BDA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate" title={member.email}>
                  {member.email}
                </span>
              </div>

              {/* Join Date */}
              <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                <span>Joined {formatDate(member.createdAt)}</span>
              </div>

              {/* Stats allocated */}
              <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-400 font-semibold mb-0.5">
                    <Target className="h-3.5 w-3.5" />
                    <span>Leads</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{assignedLeadsCount}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-400 font-semibold mb-0.5">
                    <CheckSquare className="h-3.5 w-3.5" />
                    <span>Tasks</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{assignedTasksCount}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
