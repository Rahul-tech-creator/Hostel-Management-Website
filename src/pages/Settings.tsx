import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Bell, Database, Save, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'data'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const { clearAllData, bootstrapData, students, rooms, floors } = useStore();

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 800);
  };

  const handleExportData = () => {
    const headers = ['ID', 'Name', 'Phone', 'Course', 'College', 'Room ID', 'Floor', 'Govt ID', 'Guardian Name', 'Emergency Contact', 'Fee Total', 'Fee Paid', 'Fee Status', 'Status', 'Joined At'];
    
    const csvContent = [
      headers.join(','),
      ...students.map(s => [
        s.id,
        `"${s.name}"`,
        `"${s.phone}"`,
        `"${s.course}"`,
        `"${s.college}"`,
        s.roomId,
        s.floor,
        `"${s.govtId}"`,
        `"${s.guardianName || ''}"`,
        `"${s.emergencyContact || ''}"`,
        s.feeTotal,
        s.feePaid,
        s.feeStatus || 'pending',
        s.status || 'active',
        s.joinedAt
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostel-students-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Students data exported as CSV successfully');
  };

  const handleResetData = () => {
    if (window.confirm('WARNING: This will permanently delete ALL data. Are you sure?')) {
      if (window.confirm('This is your last warning. Type OK to continue.')) {
        clearAllData();
        toast.success('All data has been wiped');
      }
    }
  };

  const handleGenerateMockData = () => {
    if (window.confirm('This will wipe current data and generate fresh mock data. Continue?')) {
      clearAllData();
      bootstrapData();
      toast.success('Fresh mock data generated');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6 shrink-0">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-slate-900 tracking-tight"
        >
          Settings
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 font-medium mt-1"
        >
          Manage your hostel configuration and system data
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'profile' 
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <Building2 size={18} />
            Hostel Profile
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'data' 
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <Database size={18} />
            Data Management
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel rounded-2xl p-6 md:p-8">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-2xl"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900">Hostel Profile</h2>
                <p className="text-sm text-slate-500 mb-6">Update your business details and contact information.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Hostel Name</label>
                  <input type="text" defaultValue="Premium Boys Hostel" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 font-medium" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Contact Email</label>
                    <input type="email" defaultValue="admin@hostelos.com" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 font-medium" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                  <textarea rows={3} defaultValue="123 Education Hub, Silicon Valley, CA 94025" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 font-medium resize-none"></textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}



          {activeTab === 'data' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-2xl"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900">Data Management</h2>
                <p className="text-sm text-slate-500 mb-6">Export your data or reset the system.</p>
              </div>

              <div className="p-5 bg-white/40 border border-slate-200/60 rounded-xl space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-100 text-brand-600 rounded-xl shrink-0">
                    <Download size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Export System Data</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-3">Download a complete JSON backup of all your students, rooms, and configuration data.</p>
                    <button 
                      onClick={handleExportData}
                      className="glass-btn inline-flex items-center gap-2 text-sm"
                    >
                      <Download size={16} /> Download Backup
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-warning-bg border border-warning-base/20 rounded-xl space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/50 text-warning-base rounded-xl shrink-0">
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Generate Mock Data</h3>
                    <p className="text-sm text-slate-600 mt-1 mb-3">Clear all current data and fill the system with 60 fake students across 100 rooms for testing purposes.</p>
                    <button 
                      onClick={handleGenerateMockData}
                      className="px-4 py-2 bg-white text-warning-base border border-warning-base/20 hover:bg-warning-50 rounded-lg font-bold text-sm transition-colors"
                    >
                      Generate Demo Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-danger-bg border border-danger-base/20 rounded-xl space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/50 text-danger-base rounded-xl shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Danger Zone</h3>
                    <p className="text-sm text-slate-600 mt-1 mb-3">Permanently delete all students, rooms, and system configurations. This action cannot be undone.</p>
                    <button 
                      onClick={handleResetData}
                      className="px-4 py-2 bg-danger-base text-white hover:bg-danger-hover rounded-lg font-bold text-sm transition-colors"
                    >
                      Reset Entire System
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
