import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';

const COLUMNS = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dropdown/Menu state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef({});

  // Drag and Drop dragover state
  const [dragOverCol, setDragOverCol] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    contactName: '',
    contactEmail: '',
    phone: '',
    status: 'New',
    value: '',
    notes: '',
    assignedTo: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [leadsRes, usersRes] = await Promise.all([
          api.get('/leads'),
          api.get('/auth'),
        ]);
        setLeads(leadsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Error fetching leads data:', err);
        setError('Failed to fetch lead pipeline data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenuId && !event.target.closest('.menu-container')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuId]);

  const resetForm = () => {
    setEditingLead(null);
    setFormData({
      title: '',
      company: '',
      contactName: '',
      contactEmail: '',
      phone: '',
      status: 'New',
      value: '',
      notes: '',
      assignedTo: '',
    });
  };

  const handleEditClick = (lead) => {
    setEditingLead(lead);
    setFormData({
      title: lead.title || '',
      company: lead.company || '',
      contactName: lead.contactName || '',
      contactEmail: lead.contactEmail || '',
      phone: lead.phone || '',
      status: lead.status || 'New',
      value: lead.value || '',
      notes: lead.notes || '',
      assignedTo: lead.assignedTo?._id || lead.assignedTo || '',
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteClick = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${leadId}`);
        setLeads((prev) => prev.filter((l) => l._id !== leadId));
      } catch (err) {
        console.error('Error deleting lead:', err);
        alert('Failed to delete the lead. Please try again.');
      }
    }
    setActiveMenuId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        // Update existing lead
        const res = await api.put(`/leads/${editingLead._id}`, formData);
        setLeads((prev) => prev.map((l) => (l._id === editingLead._id ? res.data : l)));
      } else {
        // Create new lead
        const res = await api.post('/leads', formData);
        setLeads((prev) => [...prev, res.data]);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving lead:', err);
      alert(err.response?.data?.message || 'Error occurred while saving lead.');
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (!leadId) return;

    // Optimistic Update
    const originalLeads = [...leads];
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === leadId ? { ...lead, status: targetStatus } : lead
      )
    );

    try {
      await api.put(`/leads/${leadId}`, { status: targetStatus });
    } catch (err) {
      console.error('Failed to update lead status:', err);
      setLeads(originalLeads); // Revert on error
    }
  };

  const formatRupee = (val) => {
    if (val === undefined || val === null || val === '') return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getColumnStyles = (col) => {
    switch (col) {
      case 'New':
        return { border: 'border-t-4 border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'Contacted':
        return { border: 'border-t-4 border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700' };
      case 'Qualified':
        return { border: 'border-t-4 border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' };
      case 'Proposal':
        return { border: 'border-t-4 border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' };
      case 'Negotiation':
        return { border: 'border-t-4 border-orange-500', bg: 'bg-orange-50', text: 'text-orange-700' };
      case 'Won':
        return { border: 'border-t-4 border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' };
      case 'Lost':
        return { border: 'border-t-4 border-rose-500', bg: 'bg-rose-50', text: 'text-rose-700' };
      default:
        return { border: 'border-t-4 border-gray-500', bg: 'bg-gray-50', text: 'text-gray-700' };
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
          <span className="text-sm font-medium text-gray-500">Loading Pipeline...</span>
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

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Pipeline</h2>
          <p className="text-sm text-gray-500 mt-1">
            Drag & drop leads across columns to update their status.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-indigo-600/10 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-4 flex gap-4 items-stretch select-none">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col);
          const styles = getColumnStyles(col);
          const isOver = dragOverCol === col;

          return (
            <div
              key={col}
              onDragOver={handleDragOver}
              onDragEnter={() => setDragOverCol(col)}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => handleDrop(e, col)}
              className={`w-80 shrink-0 rounded-xl flex flex-col border border-gray-200 bg-slate-50 transition-colors duration-200 ${
                styles.border
              } ${isOver ? 'bg-indigo-50/50 border-indigo-300' : ''}`}
            >
              {/* Column Header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-150">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold uppercase tracking-wider ${styles.text}`}>
                    {col}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.bg} ${styles.text}`}>
                    {colLeads.length}
                  </span>
                </div>
              </div>

              {/* Column Card Body */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 max-h-[calc(100vh-18rem)]">
                {colLeads.map((lead) => (
                  <div
                    key={lead._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead._id)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-150 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative group"
                  >
                    {/* Card Title & More Button */}
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight truncate pr-6">
                        {lead.title}
                      </h4>
                      <div className="absolute right-3 top-3 menu-container">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === lead._id ? null : lead._id)}
                          className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {activeMenuId === lead._id && (
                          <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                            <button
                              onClick={() => handleEditClick(lead)}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(lead._id)}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company */}
                    {lead.company && (
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3 truncate">
                        {lead.company}
                      </p>
                    )}

                    {/* Contact Details */}
                    {lead.contactName && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                        <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{lead.contactName}</span>
                      </div>
                    )}

                    {/* Deal Value */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-gray-900">
                        {formatRupee(lead.value)}
                      </span>
                      {/* Assigned Initials */}
                      <div
                        className="flex items-center gap-1 text-xs text-gray-500"
                        title={lead.assignedTo?.name || 'Unassigned'}
                      >
                        <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <User className="h-3 w-3 text-slate-500" />
                        </div>
                        <span className="max-w-[80px] truncate">
                          {lead.assignedTo?.name ? lead.assignedTo.name.split(' ')[0] : 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
                    No leads here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-in Backdrop Blurred Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingLead ? 'Edit Lead Details' : 'Create New Lead'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Lead Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud Licensing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              {/* Contact Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
              </div>

              {/* Phone & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 99999 99999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Deal Value (₹)</label>
                  <input
                    type="number"
                    placeholder="500000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
              </div>

              {/* Status & Assigned To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {COLUMNS.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned To</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <textarea
                  rows="3"
                  placeholder="Details about requirements or meeting minutes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-indigo-600/10 transition-colors cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
