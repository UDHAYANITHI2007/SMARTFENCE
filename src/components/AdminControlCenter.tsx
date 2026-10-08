import React from 'react';
import { Farm, RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, ShieldAlert, AlertOctagon, MapPin, ExternalLink, Users, Cpu, Activity } from 'lucide-react';

interface AdminControlCenterProps {
  farms: Farm[];
  onSelectFarm: (farmId: string) => void;
  selectedFarmId: string;
  isDarkMode?: boolean;
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({
  farms,
  onSelectFarm,
  selectedFarmId,
  isDarkMode = true,
}) => {
  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      <div className="pb-3 border-b border-white/10">
        <span className="text-xs uppercase font-mono tracking-wider opacity-60">Supervisor Multi-Tenant Oversight</span>
        <h2 className="text-lg font-bold text-white mt-0.5">Admin Fleet Operations Center</h2>
      </div>

      {/* Fleet Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Registered Farms</span>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">{farms.length}</div>
          <span className="text-[11px] text-cyan-400">Agricultural Buffer Zones</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Active SmartFence Nodes</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
            {farms.filter((f) => f.status === 'ONLINE').length} / {farms.length}
          </div>
          <span className="text-[11px] text-emerald-400">100% Telemetry Polling</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Active Critical Alerts</span>
          <div className="text-2xl font-mono font-bold text-rose-400 tabular-nums">1</div>
          <span className="text-[11px] text-rose-400">Relay Cutoff Engaged</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Substations Linked</span>
          <div className="text-2xl font-mono font-bold text-indigo-400 tabular-nums">3 Feeders</div>
          <span className="text-[11px] text-slate-400">DT-04, DT-09, DT-12</span>
        </div>
      </div>

      {/* Farm Monitoring Fleet List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Registered Farm Fleet
          </span>
          <span className="text-xs font-mono text-slate-400">Click farm to inspect telemetry</span>
        </div>

        <div className="space-y-2.5">
          {farms.map((farm) => {
            const isSelected = selectedFarmId === farm.farm_id;
            const riskLvl = farm.risk_level || 'NORMAL';
            const isCrit = riskLvl === 'CRITICAL';

            return (
              <div
                key={farm.farm_id}
                onClick={() => onSelectFarm(farm.farm_id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-white/15 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-white'
                    : isCrit
                    ? 'bg-rose-950/30 border-rose-500/50 hover:bg-rose-900/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      isCrit ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-300 font-bold">{farm.farm_id}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-xs font-mono text-slate-400">{farm.device_id}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5">{farm.farm_name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{farm.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between md:justify-end">
                  <div className="text-left md:text-right font-mono text-xs">
                    <span className="text-slate-400 block text-[10px]">OPERATOR</span>
                    <span className="text-white font-semibold">{farm.farmer_name}</span>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
                      isCrit
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                    }`}
                  >
                    {isCrit ? '🔴 CRITICAL (CUT OFF)' : '🟢 SAFE PULSED'}
                  </span>

                  <ExternalLink className="w-4 h-4 text-slate-400 hover:text-white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
