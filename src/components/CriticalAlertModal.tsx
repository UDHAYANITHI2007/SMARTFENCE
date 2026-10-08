import React from 'react';
import { CriticalAlertModalData } from '../types';
import { AlertOctagon, CheckCircle2, ShieldCheck, MapPin, Send, PowerOff, X } from 'lucide-react';

interface CriticalAlertModalProps {
  data: CriticalAlertModalData;
  onAcknowledge: () => void;
  onViewIncident: () => void;
  onViewLocation: () => void;
  onResetRelay: () => void;
}

export const CriticalAlertModal: React.FC<CriticalAlertModalProps> = ({
  data,
  onAcknowledge,
  onViewIncident,
  onViewLocation,
  onResetRelay,
}) => {
  if (!data.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-rose-500 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(244,63,94,0.4)] text-white space-y-6">
        {/* Urgent Header */}
        <div className="flex items-start justify-between pb-4 border-b border-rose-500/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/60 flex items-center justify-center text-rose-400 shrink-0 animate-pulse">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-rose-400 font-bold">
                  CRITICAL EMERGENCY INTERVENTION
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-0.5">
                Unauthorized Fence Activity Detected
              </h2>
            </div>
          </div>

          <button
            onClick={onAcknowledge}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Alert Banner with Risk Score */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block">FARM</span>
            <span className="text-sm font-bold text-white block mt-0.5">{data.farmName}</span>
          </div>

          <div>
            <span className="text-slate-400 block">RISK SCORE</span>
            <span className="text-xl font-black text-rose-400 block mt-0.5 tabular-nums">
              {data.riskScore} / 100
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">FENCE SUPPLY</span>
            <span className="text-sm font-bold text-emerald-400 block mt-0.5">
              {data.fenceSupply} (CUT OFF)
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">SIREN ALARM</span>
            <span className="text-sm font-bold text-rose-400 block mt-0.5 animate-pulse">
              {data.alarm}
            </span>
          </div>
        </div>

        {/* Telemetry Snapshot Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 block font-mono">VOLTAGE</span>
            <span className="text-sm font-bold text-rose-300 mt-1 block">{data.voltage}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 block font-mono">CURRENT</span>
            <span className="text-sm font-bold text-rose-300 mt-1 block">{data.current}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 block font-mono">PULSE BEHAVIOUR</span>
            <span className="text-sm font-bold text-rose-300 mt-1 block">{data.pulse}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 block font-mono">TAMPER SENSOR</span>
            <span className="text-sm font-bold text-rose-300 mt-1 block">{data.tamper}</span>
          </div>
        </div>

        {/* Intimation & Location Status */}
        <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Send className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              SMS Intimation: <strong className="text-emerald-400">{data.sms}</strong> to Farmer, Supervisor &amp; Authorities
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{data.location}</span>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <button
            onClick={onAcknowledge}
            className="px-4 py-3 bg-rose-600 hover:bg-rose-500 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ACKNOWLEDGE</span>
          </button>

          <button
            onClick={onViewIncident}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 font-semibold rounded-xl text-xs transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>VIEW INCIDENT</span>
          </button>

          <button
            onClick={onViewLocation}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 font-semibold rounded-xl text-xs transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>VIEW LOCATION</span>
          </button>

          <button
            onClick={onResetRelay}
            className="px-4 py-3 bg-emerald-600/80 hover:bg-emerald-500 font-semibold rounded-xl text-xs transition-all border border-emerald-400/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PowerOff className="w-4 h-4" />
            <span>RESET RELAY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
