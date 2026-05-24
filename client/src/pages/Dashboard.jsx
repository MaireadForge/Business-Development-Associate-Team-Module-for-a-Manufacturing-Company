import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  Target,
  TrendingUp,
  Users,
  CheckSquare,
  Loader2,
  AlertCircle,
  Briefcase,
  User,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [leadsRes, clientsRes, tasksRes] = await Promise.all([
          api.get('/leads'),
          api.get('/clients'),
          api.get('/tasks'),
        ]);
        setLeads(leadsRes.data);
        setClients(clientsRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <span className="text-sm font-medium text-gray-500">Loading metrics...</span>
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

  // Calculate Metrics
  const totalLeads = leads.length;
  const wonDeals = leads.filter((l) => l.status === 'Won').length;
  const activeClients = clients.filter((c) => c.status === 'Active').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Done').length;

  // Chart 1: BarChart of Leads by Status
  const statusOrder = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const barChartData = statusOrder.map((status) => {
    const count = leads.filter((l) => l.status === status).length;
    return { status, count };
  });

  // Chart 2: PieChart of Task Status Distribution
  const taskStatuses = ['Todo', 'In Progress', 'Done'];
  const statusColors = {
    'Todo': '#f97316',        // Orange
    'In Progress': '#3b82f6', // Blue
    'Done': '#10b981',         // Green
  };
  const pieChartData = taskStatuses
    .map((status) => {
      const count = tasks.filter((t) => t.status === status).length;
      return { name: status, value: count };
    })
    .filter((item) => item.value > 0);

  // Bottom Table: Recent 5 Leads
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Contacted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Qualified':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Proposal':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Negotiation':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Won':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Top row: 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Leads */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Leads</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{totalLeads}</p>
          </div>
        </div>

        {/* Won Deals */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Won Deals</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{wonDeals}</p>
          </div>
        </div>

        {/* Active Clients */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="p-3.5 rounded-xl bg-purple-50 text-purple-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Clients</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{activeClients}</p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="p-3.5 rounded-xl bg-orange-50 text-orange-600">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Tasks</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* 2. Middle row: Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: BarChart (60%) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-800">Leads count by status</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: PieChart (40%) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <CheckSquare className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-800">Tasks Distribution</h3>
          </div>
          <div className="h-80 w-full flex items-center justify-center">
            {pieChartData.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="mx-auto h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-400 mt-2">No tasks available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} tick={{ fill: '#64748b', fontSize: 11 }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom row: Recent Leads */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <h3 className="text-lg font-bold text-gray-800">Recent Leads</h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
            Showing last 5
          </span>
        </div>
        <div className="overflow-x-auto">
          {recentLeads.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Target className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm">No leads added yet</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead className="bg-slate-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Value</th>
                  <th className="px-6 py-3">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 font-semibold text-gray-900 truncate max-w-xs">{lead.title}</td>
                    <td className="px-6 py-4 text-gray-500">{lead.company || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(lead.value)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <User className="h-3 w-3 text-slate-500" />
                        </div>
                        <span className="text-gray-600">{lead.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
