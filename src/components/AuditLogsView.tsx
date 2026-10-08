import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import { Shield, Search, Download, Filter, CheckCircle2, AlertTriangle, User, Lock } from 'lucide-react';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
  isDarkMode?: boolean;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, isDarkMode = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<string>('ALL');

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchResult = filterResult === 'ALL' || log.result === filterResult;
    return matchSearch && matchResult;
  });

  const exportAudit = () => {
    const headers = 'ID,Timestamp,User,Role,Action,Entity,Result,IP Address,Details\n';
    const rows = filtered
      .map(
        (l) =>
          `${l.id},"${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.entity}",${l.result},"${l.ip_address}","${l.details}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartFenceX-Audit-Log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">Compliance &amp; Governance</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Tamper-Proof System Security Audit Logs</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Search actor, action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48"
            />
          </div>

          <button
            onClick={exportAudit}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Log ID</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">User &amp; Role</th>
              <th className="py-2.5 px-3">Action Type</th>
              <th className="py-2.5 px-3">Entity / Device</th>
              <th className="py-2.5 px-3">Result</th>
              <th className="py-2.5 px-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="py-2.5 px-3 text-cyan-300 font-bold">{log.id}</td>
                <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-2.5 px-3 font-sans">
                  <div className="font-semibold text-white">{log.user}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{log.role}</div>
                </td>
                <td className="py-2.5 px-3 text-slate-200 font-bold">{log.action}</td>
                <td className="py-2.5 px-3 text-slate-300">{log.entity}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.result === 'TRIGGERED' || log.result === 'BLOCKED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {log.result}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate" title={log.details}>
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
