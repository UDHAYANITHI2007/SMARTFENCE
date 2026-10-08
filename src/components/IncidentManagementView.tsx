import React, { useState } from 'react';
import { IncidentRecord, IncidentStatus } from '../types';
import { AlertOctagon, CheckCircle2, Search, Filter, Clock, User, Shield, MessageSquare, AlertTriangle } from 'lucide-react';

interface IncidentManagementViewProps {
  incidents: IncidentRecord[];
  onAcknowledgeIncident: (incidentId: string, notes: string) => void;
  onResolveIncident: (incidentId: string, notes: string) => void;
  isDarkMode?: boolean;
}

export const IncidentManagementView: React.FC<IncidentManagementViewProps> = ({
  incidents,
  onAcknowledgeIncident,
  onResolveIncident,
  isDarkMode = true,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [actionNotes, setActionNotes] = useState<string>('');

  const filtered = incidents.filter((inc) => {
    if (filterStatus === 'ALL') return true;
    return inc.status === filterStatus;
  });

  const handleAcknowledge = (inc: IncidentRecord) => {
    onAcknowledgeIncident(inc.incident_id, actionNotes || 'Acknowledged by operator');
    setActionNotes('');
    setSelectedIncident(null);
  };

  const handleResolve = (inc: IncidentRecord) => {
    onResolveIncident(inc.incident_id, actionNotes || 'Line inspected and verified safe');
    setActionNotes('');
    setSelectedIncident(null);
  };

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">Emergency Case Tracking</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Incident Lifecycle &amp; Resolution Management</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses ({incidents.length})</option>
            <option value="OPEN">OPEN</option>
            <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs opacity-50 font-mono">
            No active incidents matching the selected criteria.
          </div>
        ) : (
          filtered.map((inc) => {
            const isCrit = inc.risk_level === 'CRITICAL';
            const isOpen = inc.status === 'OPEN';

            return (
              <div
                key={inc.incident_id}
                className={`p-4 rounded-xl border transition-all ${
                  isOpen && isCrit
                    ? 'bg-rose-950/30 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-cyan-300">{inc.incident_id}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-xs font-mono text-slate-400">{inc.event_id}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                          isCrit
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {inc.priority} PRIORITY
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Tier {inc.escalation_level} Escalation
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1.5">{inc.farm_name} ({inc.device_id})</h3>

                    {/* Reasons */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {inc.reasons.map((r, i) => (
                        <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-slate-300">
                          • {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                    <span
                      className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border text-center ${
                        isOpen
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                          : inc.status === 'RESOLVED'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                          : 'bg-amber-500/15 border-amber-500 text-amber-300'
                      }`}
                    >
                      ● {inc.status}
                    </span>

                    <div className="flex items-center gap-2">
                      {isOpen && (
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
                        >
                          Acknowledge
                        </button>
                      )}
                      {inc.status !== 'RESOLVED' && (
                        <button
                          onClick={() => {
                            setSelectedIncident(inc);
                          }}
                          className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer border border-emerald-400/40"
                        >
                          Resolve &amp; Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audit trail details */}
                {inc.acknowledged_by && (
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Acknowledged by: <strong className="text-white">{inc.acknowledged_by}</strong> ({new Date(inc.acknowledged_at || '').toLocaleTimeString()})</span>
                    {inc.resolution_notes && <span>Resolution: <span className="text-emerald-400">{inc.resolution_notes}</span></span>}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Action Dialog */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-950 border border-white/20 rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-base font-bold">
              Update Incident: {selectedIncident.incident_id}
            </h3>
            <p className="text-xs text-slate-400">
              {selectedIncident.farm_name} · Risk: {selectedIncident.risk_score}/100
            </p>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Resolution / Inspection Notes:
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Enter field inspection details, physical line verification..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAcknowledge(selectedIncident)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-xs text-white"
              >
                Mark Acknowledged
              </button>
              <button
                onClick={() => handleResolve(selectedIncident)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white"
              >
                Resolve Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
