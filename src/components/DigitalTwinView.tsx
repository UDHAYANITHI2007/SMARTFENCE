import React from 'react';
import { SensorData, RiskLevel } from '../types';
import { Zap, Activity, Cpu, Radio, Cloud, ShieldAlert, ShieldCheck, PowerOff, CheckCircle2 } from 'lucide-react';

interface DigitalTwinViewProps {
  sensorData: SensorData;
  riskLevel: RiskLevel;
  riskScore: number;
  isDarkMode?: boolean;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  sensorData,
  riskLevel,
  riskScore,
  isDarkMode = true,
}) => {
  const isTripped = sensorData.relay_status === 'OFF';

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">Edge-to-Cloud Digital Twin</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Physical System Hardware Digital Twin</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-cyan-400">Node: {sensorData.device_id}</span>
          <span className="text-slate-500">·</span>
          <span className={isTripped ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
            {isTripped ? 'RELAY OPEN (ISOLATED)' : 'CIRCUIT CLOSED (ARMED)'}
          </span>
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="p-6 rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden">
        {/* Animated Background Laser Beam */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-cyan-400 to-blue-500/20 -translate-y-1/2 pointer-events-none hidden md:block" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
          {/* Node 1: Fence Wire */}
          <div className={`p-4 rounded-xl border text-center transition-all ${
            isTripped
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              : 'bg-slate-900/80 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto mb-2">
              <Zap className={`w-5 h-5 ${isTripped ? 'text-rose-400' : 'text-cyan-400 animate-pulse'}`} />
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Stage 1</span>
            <h3 className="text-xs font-bold mt-0.5">Fence Wire Loop</h3>
            <div className="text-[11px] font-mono mt-1 text-cyan-300">
              {isTripped ? '0.00 V (Dead)' : `${sensorData.voltage.toFixed(1)} kV Pulse`}
            </div>
          </div>

          {/* Node 2: Sensor Probe */}
          <div className="p-4 rounded-xl border bg-slate-900/80 border-white/10 text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-2">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Stage 2</span>
            <h3 className="text-xs font-bold mt-0.5">CT &amp; Divider Probe</h3>
            <div className="text-[11px] font-mono mt-1 text-amber-300">
              {sensorData.current.toFixed(2)} A · {sensorData.pulse_frequency.toFixed(1)} Hz
            </div>
          </div>

          {/* Node 3: ESP32 Edge MCU */}
          <div className="p-4 rounded-xl border bg-slate-900/80 border-white/10 text-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mx-auto mb-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Stage 3</span>
            <h3 className="text-xs font-bold mt-0.5">ESP32 Edge MCU</h3>
            <div className="text-[11px] font-mono mt-1 text-indigo-300">
              ISR &lt; 1.8ms · 100 kS/s
            </div>
          </div>

          {/* Node 4: Gateway Transceiver */}
          <div className="p-4 rounded-xl border bg-slate-900/80 border-white/10 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-2">
              <Radio className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Stage 4</span>
            <h3 className="text-xs font-bold mt-0.5">IoT Gateway</h3>
            <div className="text-[11px] font-mono mt-1 text-emerald-300">
              4G LTE + LoRa MESH
            </div>
          </div>

          {/* Node 5: Cloud Risk Engine */}
          <div className={`p-4 rounded-xl border text-center transition-all ${
            riskLevel === 'CRITICAL'
              ? 'bg-rose-950/30 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              : 'bg-slate-900/80 border-white/10 text-white'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mx-auto mb-2">
              <Cloud className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Stage 5</span>
            <h3 className="text-xs font-bold mt-0.5">Risk Engine &amp; DB</h3>
            <div className={`text-[11px] font-mono font-bold mt-1 ${
              riskLevel === 'CRITICAL' ? 'text-rose-400' : 'text-cyan-300'
            }`}>
              Score: {riskScore} ({riskLevel})
            </div>
          </div>
        </div>
      </div>

      {/* Subsystem Health Status Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-slate-400 block text-[10px]">WIRE CONTINUITY</span>
          <span className="text-sm font-bold text-emerald-400 block mt-0.5">
            {isTripped ? 'ISOLATED' : 'PASS (CLOSED)'}
          </span>
          <span className="text-[10px] text-slate-500 block">Ground: 42 Ω</span>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-slate-400 block text-[10px]">LATCHING SOLENOID</span>
          <span className={`text-sm font-bold block mt-0.5 ${isTripped ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isTripped ? 'OPEN (LOCKED)' : 'CLOSED (ARMED)'}
          </span>
          <span className="text-[10px] text-slate-500 block">Cutoff: 6.2 ms</span>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-slate-400 block text-[10px]">TAMPER MICROSWITCH</span>
          <span className={`text-sm font-bold block mt-0.5 ${sensorData.tamper ? 'text-rose-400' : 'text-emerald-400'}`}>
            {sensorData.tamper ? 'TAMPER OPEN' : 'ENCLOSURE SEALED'}
          </span>
          <span className="text-[10px] text-slate-500 block">IP67 Waterproof</span>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-slate-400 block text-[10px]">SOLAR UPS LEVEL</span>
          <span className="text-sm font-bold text-white block mt-0.5">
            {sensorData.battery_percent}% (LiFePO4)
          </span>
          <span className="text-[10px] text-slate-500 block">72h Autonomous Reserve</span>
        </div>
      </div>
    </div>
  );
};
