import React, { useState } from 'react';
import { SmartDevice } from '../types';
import { Wifi, WifiOff, Battery, Sun, Cpu, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

interface DeviceMonitoringProps {
  devices: SmartDevice[];
  onToggleDeviceOffline: (deviceId: string) => void;
  isDarkMode?: boolean;
}

export const DeviceMonitoring: React.FC<DeviceMonitoringProps> = ({
  devices,
  onToggleDeviceOffline,
  isDarkMode = true,
}) => {
  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-5 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">Edge Hardware Telemetry</span>
          <h2 className="text-lg font-bold text-white mt-0.5">ESP32 Fleet Health &amp; Connectivity</h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-emerald-400">● {devices.filter(d => d.status === 'ONLINE').length} ONLINE</span>
          <span className="text-slate-500">·</span>
          <span className="text-rose-400">● {devices.filter(d => d.status === 'OFFLINE').length} OFFLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((device) => {
          const isOnline = device.status === 'ONLINE';

          return (
            <div
              key={device.device_id}
              className={`p-4 rounded-xl border transition-all ${
                isOnline
                  ? 'bg-white/5 border-white/10 hover:border-white/20'
                  : 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)]'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 block">{device.device_id}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{device.farm_name}</h3>
                </div>

                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isOnline
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                  }`}
                >
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              {/* Status details */}
              <div className="space-y-2.5 my-3 text-xs font-mono text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery:
                  </span>
                  <span className="font-bold tabular-nums text-white">{device.battery_level}% (LiFePO4)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Input:
                  </span>
                  <span className="tabular-nums text-white">{device.solar_input_w} W</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Sensors:
                  </span>
                  <span className="text-emerald-400">{device.sensor_health}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-indigo-400" /> Network:
                  </span>
                  <span className="text-slate-300 text-[11px] truncate">{device.network_status}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-white/5">
                  <span>Firmware: {device.firmware_version}</span>
                  <span>Seen: Just now</span>
                </div>
              </div>

              {/* Offline Toggle Simulation */}
              <button
                onClick={() => onToggleDeviceOffline(device.device_id)}
                className={`w-full py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                  isOnline
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {isOnline ? 'Simulate Device Offline' : 'Restore Device Online'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
