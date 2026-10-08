import React, { useState } from 'react';
import { FenceEvent, RiskLevel } from '../types';
import { Search, Download, Filter, Calendar, MapPin } from 'lucide-react';

interface IncidentHistoryTableProps {
  events: FenceEvent[];
  isDarkMode?: boolean;
}

export const IncidentHistoryTable: React.FC<IncidentHistoryTableProps> = ({ events, isDarkMode = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [farmFilter, setFarmFilter] = useState<string>('ALL');

  // Filter events
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.event_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.farm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.device_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || e.risk_level === riskFilter;
    const matchesFarm = farmFilter === 'ALL' || e.farm_id === farmFilter;
    return matchesSearch && matchesRisk && matchesFarm;
  });

  const exportCSV = () => {
    const headers = 'Event ID,Timestamp,Farm,Device,Voltage(kV),Current(A),Pulse(Hz),Tamper,Risk Score,Risk Level,Relay,Alarm,Notification,Location\n';
    const rows = filteredEvents
      .map(
        (e) =>
          `${e.event_id},"${e.timestamp}","${e.farm_name}",${e.device_id},${e.voltage},${e.current},${e.pulse_frequency},${e.tamper},${e.risk_score},${e.risk_level},${e.relay_status},${e.alarm_status},${e.notification_status},"${e.location}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartFence-Incidents-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const uniqueFarms = Array.from(new Set(events.map((e) => e.farm_id)));

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-4 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">Audit Trail &amp; Logs</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Comprehensive Incident History</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Search event, farm, device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 md:w-56"
            />
          </div>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="NORMAL">NORMAL</option>
            <option value="SUSPICIOUS">SUSPICIOUS</option>
            <option value="UNAUTHORIZED">UNAUTHORIZED</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>

          {/* Farm Filter */}
          <select
            value={farmFilter}
            onChange={(e) => setFarmFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Registered Farms</option>
            {uniqueFarms.map((fId) => (
              <option key={fId} value={fId}>{fId}</option>
            ))}
          </select>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 font-mono uppercase text-slate-400 tracking-wider">
              <th className="py-2.5 px-3">Event ID</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Farm &amp; Device</th>
              <th className="py-2.5 px-3">Voltage</th>
              <th className="py-2.5 px-3">Current</th>
              <th className="py-2.5 px-3">Pulse</th>
              <th className="py-2.5 px-3">Tamper</th>
              <th className="py-2.5 px-3">Risk Score</th>
              <th className="py-2.5 px-3">Relay</th>
              <th className="py-2.5 px-3">Alarm</th>
              <th className="py-2.5 px-3">Notification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500">
                  No matching incident records found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => {
                const isCrit = evt.risk_level === 'CRITICAL';
                const isWarn = evt.risk_level === 'SUSPICIOUS' || evt.risk_level === 'UNAUTHORIZED';

                return (
                  <tr key={evt.event_id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">{evt.event_id}</td>
                    <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="block text-[10px] text-slate-500">
                        {new Date(evt.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-semibold text-white whitespace-nowrap">{evt.farm_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{evt.device_id}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 tabular-nums">
                      {evt.voltage.toFixed(1)} kV
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 tabular-nums">
                      {evt.current.toFixed(2)} A
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 tabular-nums">
                      {evt.pulse_frequency.toFixed(1)} Hz
                    </td>
                    <td className="py-2.5 px-3">
                      {evt.tamper ? (
                        <span className="text-rose-400 font-bold">TAMPERED</span>
                      ) : (
                        <span className="text-emerald-400">SECURE</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${
                          isCrit
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : isWarn
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                        }`}
                      >
                        {evt.risk_score} · {evt.risk_level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={evt.relay_status === 'OFF' ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                        {evt.relay_status === 'OFF' ? 'OFF (Cut)' : 'ON'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={evt.alarm_status === 'ACTIVE' ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-500'}>
                        {evt.alarm_status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400">
                      {evt.notification_status}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
