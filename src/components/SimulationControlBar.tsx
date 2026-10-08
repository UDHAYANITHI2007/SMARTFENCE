import React from 'react';
import { RiskLevel } from '../types';
import { Zap, Activity, Waves, ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2, WifiOff } from 'lucide-react';

interface SimulationControlBarProps {
  currentRiskLevel: RiskLevel;
  onSimulateState: (level: RiskLevel) => void;
  onInjectFault: (faultType: 'VOLTAGE_SPIKE' | 'CURRENT_SPIKE' | 'PULSE_FAILURE' | 'TAMPER' | 'MULTIPLE_FAULT' | 'DEVICE_OFFLINE') => void;
  isDarkMode?: boolean;
}

export const SimulationControlBar: React.FC<SimulationControlBarProps> = ({
  currentRiskLevel,
  onSimulateState,
  onInjectFault,
  isDarkMode = true,
}) => {
  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-xl shadow-xl space-y-3 ${
      isDarkMode ? 'bg-slate-900/60 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Simulation &amp; Fault Injection Lab
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
            DEMO MODE (Non-destructive)
          </span>
        </div>

        {/* 4 Core State Buttons */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => onSimulateState('NORMAL')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              currentRiskLevel === 'NORMAL' ? 'bg-emerald-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            NORMAL
          </button>
          <button
            onClick={() => onSimulateState('SUSPICIOUS')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              currentRiskLevel === 'SUSPICIOUS' ? 'bg-amber-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            SUSPICIOUS
          </button>
          <button
            onClick={() => onSimulateState('UNAUTHORIZED')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              currentRiskLevel === 'UNAUTHORIZED' ? 'bg-orange-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            UNAUTHORIZED
          </button>
          <button
            onClick={() => onSimulateState('CRITICAL')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              currentRiskLevel === 'CRITICAL' ? 'bg-rose-600 text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.7)] animate-pulse' : 'text-rose-400 hover:text-white'
            }`}
          >
            CRITICAL (230V)
          </button>
        </div>
      </div>

      {/* Specific Anomaly Injector Buttons (Section 28) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
        <span className="text-[10px] font-mono uppercase text-slate-400 shrink-0">
          Inject Targeted Anomaly:
        </span>

        <button
          onClick={() => onInjectFault('VOLTAGE_SPIKE')}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-cyan-300 hover:text-white transition-all cursor-pointer"
        >
          ⚡ Voltage Spike (11.2 kV)
        </button>

        <button
          onClick={() => onInjectFault('CURRENT_SPIKE')}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-amber-300 hover:text-white transition-all cursor-pointer"
        >
          📈 Current Spike (0.95 A)
        </button>

        <button
          onClick={() => onInjectFault('PULSE_FAILURE')}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-rose-300 hover:text-white transition-all cursor-pointer"
        >
          ⚠️ 50Hz Mains Hook
        </button>

        <button
          onClick={() => onInjectFault('TAMPER')}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-orange-300 hover:text-white transition-all cursor-pointer"
        >
          🛡️ Enclosure Tamper Open
        </button>

        <button
          onClick={() => onInjectFault('MULTIPLE_FAULT')}
          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-[11px] font-mono text-rose-200 transition-all cursor-pointer"
        >
          🚨 Multi-Fault Compound Threat
        </button>

        <button
          onClick={() => onInjectFault('DEVICE_OFFLINE')}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          📶 Simulate Device Offline
        </button>
      </div>
    </div>
  );
};
