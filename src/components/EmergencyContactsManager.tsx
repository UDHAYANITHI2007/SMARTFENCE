import React, { useState } from 'react';
import { EmergencyContact } from '../types';
import { Plus, Trash2, Edit3, PhoneCall, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EmergencyContactsManagerProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  onDeleteContact: (id: string) => void;
  isDarkMode?: boolean;
}

export const EmergencyContactsManager: React.FC<EmergencyContactsManagerProps> = ({
  contacts,
  onAddContact,
  onDeleteContact,
  isDarkMode = true,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [testSentId, setTestSentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Farm Operator',
    mobile: '',
    notification_type: 'SMS + Push',
    priority: 'PRIMARY (P1)',
    escalation_tier: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;
    onAddContact(formData);
    setFormData({
      name: '',
      role: 'Farm Operator',
      mobile: '',
      notification_type: 'SMS + Push',
      priority: 'PRIMARY (P1)',
      escalation_tier: 1,
    });
    setShowAddModal(false);
  };

  const sendTestSMS = (id: string) => {
    setTestSentId(id);
    setTimeout(() => {
      setTestSentId(null);
    }, 2000);
  };

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-5 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">Emergency Broadcast Network</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Configured Notification Contacts</h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {contact.priority}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">{contact.name}</h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{contact.role}</div>
              </div>

              <button
                onClick={() => onDeleteContact(contact.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg bg-white/5 border border-white/10 transition-colors"
                title="Remove contact"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
              <span className="text-slate-300">{contact.mobile}</span>
              <span className="text-cyan-400 text-[11px]">{contact.notification_type}</span>
            </div>

            <button
              onClick={() => sendTestSMS(contact.id)}
              className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {testSentId === contact.id ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Test SMS Delivered!</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 text-slate-400" />
                  <span>Send Test Notification</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-white/20 rounded-2xl p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-bold">Add Emergency Contact</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Village Forest Ranger"
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Role / Relationship</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Supervisor / Flying Squad"
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Mobile Number (SMS)</label>
                <input
                  type="text"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+91 94400 00000"
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Notification Type</label>
                  <select
                    value={formData.notification_type}
                    onChange={(e) => setFormData({ ...formData, notification_type: e.target.value })}
                    className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none"
                  >
                    <option value="SMS">SMS Only</option>
                    <option value="SMS + Push">SMS + Push</option>
                    <option value="SMS + Call">SMS + Voice Call</option>
                    <option value="SCADA Alert">SCADA Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none"
                  >
                    <option value="PRIMARY (P1)">PRIMARY (P1)</option>
                    <option value="HIGH (P2)">HIGH (P2)</option>
                    <option value="ESCALATION (P3)">ESCALATION (P3)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold text-white"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
