import React from 'react';
import { SensorData, RiskLevel } from '../types';
import { Zap, Activity, Waves, Gauge, ShieldAlert, ShieldCheck, PowerOff, Bell, Wifi, Radio } from 'lucide-react';

interface SensorCardsProps {
  sensorData: SensorData;
  riskLevel: RiskLevel;
  isDarkMode?: boolean;
}

export const SensorCards: React.FC<SensorCardsProps> = ({ sensorData, riskLevel, isDarkMode = true }) => {
  const cardBg = isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900';

  const cards = [
    {
      title: 'FENCE VOLTAGE',
      value: `${sensorData.voltage.toFixed(1)} kV`,
      sub: sensorData.voltage > 10 ? 'High Voltage Spike' : sensorData.voltage < 1.0 ? 'Low Line Potential' : 'Optimal Pulse Window',
      icon: Zap,
      status: sensorData.voltage > 10 ? 'warning' : sensorData.voltage < 1.0 && sensorData.relay_status === 'ON' ? 'warning' : 'normal',
      accent: 'text-cyan-400',
    },
    {
      title: 'LINE CURRENT',
      value: `${sensorData.current.toFixed(2)} A`,
      sub: sensorData.current > 0.8 ? 'Lethal Continuous Draw' : sensorData.current > 0.5 ? 'Abnormal High Draw' : 'Negligible RMS Draw',
      icon: Activity,
      status: sensorData.current > 0.8 ? 'critical' : sensorData.current > 0.5 ? 'warning' : 'normal',
      accent: sensorData.current > 0.8 ? 'text-rose-400' : 'text-amber-400',
    },
    {
      title: 'PULSE FREQUENCY',
      value: `${sensorData.pulse_frequency.toFixed(1)} Hz`,
      sub: sensorData.pulse_frequency >= 45 ? '50 Hz AC Mains Sinusoid' : sensorData.pulse_frequency > 1.5 ? 'Rapid Overclocked' : '~1.1s Impulse Gap',
      icon: Waves,
      status: sensorData.pulse_frequency >= 45 ? 'critical' : sensorData.pulse_frequency > 1.5 ? 'warning' : 'normal',
      accent: sensorData.pulse_frequency >= 45 ? 'text-rose-400' : 'text-cyan-400',
    },
    {
      title: 'PULSE WIDTH',
      value: sensorData.pulse_width > 50 ? `${sensorData.pulse_width.toFixed(0)} ms` : `${sensorData.pulse_width.toFixed(2)} ms`,
      sub: sensorData.pulse_width > 50 ? 'Continuous Waveform' : 'Certified < 1ms Pulse',
      icon: Gauge,
      status: sensorData.pulse_width > 50 ? 'critical' : 'normal',
      accent: 'text-indigo-400',
    },
    {
      title: 'TAMPER STATUS',
      value: sensorData.tamper ? 'TAMPERED' : 'SECURE',
      sub: sensorData.tamper ? 'Enclosure Switch Open' : 'Box Sealed & Locked',
      icon: sensorData.tamper ? ShieldAlert : ShieldCheck,
      status: sensorData.tamper ? 'critical' : 'normal',
      accent: sensorData.tamper ? 'text-rose-400' : 'text-emerald-400',
    },
    {
      title: 'RELAY CUTOFF',
      value: sensorData.relay_status === 'ON' ? 'ON (ARMED)' : 'OFF (ISOLATED)',
      sub: sensorData.relay_status === 'OFF' ? 'Power Supply Cut Off' : 'Interlock Armed <8ms',
      icon: PowerOff,
      status: sensorData.relay_status === 'OFF' ? 'critical' : 'normal',
      accent: sensorData.relay_status === 'OFF' ? 'text-rose-400' : 'text-emerald-400',
    },
    {
      title: 'SIREN / ALARM',
      value: sensorData.alarm_status === 'ACTIVE' ? 'ACTIVE' : 'OFF',
      sub: sensorData.alarm_status === 'ACTIVE' ? 'Audio Strobe Sounding' : 'Silent Standby',
      icon: Bell,
      status: sensorData.alarm_status === 'ACTIVE' ? 'critical' : 'normal',
      accent: sensorData.alarm_status === 'ACTIVE' ? 'text-rose-400 animate-pulse' : 'text-slate-400',
    },
    {
      title: 'DEVICE LINK',
      value: sensorData.device_connectivity === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
      sub: `${sensorData.device_id} · Bat: ${sensorData.battery_percent}%`,
      icon: Wifi,
      status: sensorData.device_connectivity === 'ONLINE' ? 'normal' : 'critical',
      accent: sensorData.device_connectivity === 'ONLINE' ? 'text-emerald-400' : 'text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isCritical = card.status === 'critical';
        const isWarning = card.status === 'warning';

        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border backdrop-blur-xl transition-all shadow-lg ${cardBg} ${
              isCritical
                ? 'border-rose-500/50 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                : isWarning
                ? 'border-amber-500/40 bg-amber-950/20'
                : 'hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-wider opacity-60">
                {card.title}
              </span>
              <Icon className={`w-4 h-4 ${card.accent}`} />
            </div>

            <div className={`text-xl md:text-2xl font-mono font-bold tracking-tight mt-1.5 tabular-nums ${
              isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-white'
            }`}>
              {card.value}
            </div>

            <div className="text-[11px] opacity-70 mt-1 truncate">
              {card.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
};
