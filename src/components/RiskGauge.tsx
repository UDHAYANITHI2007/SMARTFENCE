import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, ShieldAlert, AlertOctagon } from 'lucide-react';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  factors?: string[];
  isDarkMode?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, factors = [], isDarkMode = true }) => {
  // SVG Circular Gauge calculation
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Use 270 degree arc (3/4 of a circle)
  const arcFraction = 0.75;
  const totalArcLength = circumference * arcFraction;
  const strokeDashoffset = totalArcLength - (score / 100) * totalArcLength;

  const getColorConfig = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'NORMAL':
        return {
          stroke: '#10B981',
          bgRing: 'rgba(16, 185, 129, 0.15)',
          glow: 'rgba(16, 185, 129, 0.4)',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          icon: ShieldCheck,
          label: 'NORMAL',
        };
      case 'SUSPICIOUS':
        return {
          stroke: '#F59E0B',
          bgRing: 'rgba(245, 158, 11, 0.15)',
          glow: 'rgba(245, 158, 11, 0.4)',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          icon: AlertTriangle,
          label: 'SUSPICIOUS',
        };
      case 'UNAUTHORIZED':
        return {
          stroke: '#F97316',
          bgRing: 'rgba(249, 115, 22, 0.15)',
          glow: 'rgba(249, 115, 22, 0.4)',
          text: 'text-orange-400',
          badgeBg: 'bg-orange-500/15 border-orange-500/40 text-orange-300',
          icon: ShieldAlert,
          label: 'UNAUTHORIZED',
        };
      case 'CRITICAL':
        return {
          stroke: '#EF4444',
          bgRing: 'rgba(239, 68, 68, 0.2)',
          glow: 'rgba(239, 68, 68, 0.6)',
          text: 'text-rose-400',
          badgeBg: 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse',
          icon: AlertOctagon,
          label: 'CRITICAL',
        };
    }
  };

  const config = getColorConfig(level);
  const Icon = config.icon;

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-6 ${
      isDarkMode 
        ? 'bg-slate-900/40 border-white/10 text-white' 
        : 'bg-white/80 border-slate-200 text-slate-900'
    } ${level === 'CRITICAL' ? 'shadow-[0_0_35px_rgba(239,68,68,0.25)] border-rose-500/40' : ''}`}>
      {/* Circular Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
        <svg height="176" width="176" className="transform -rotate-135">
          {/* Background Track */}
          <circle
            stroke={config.bgRing}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${totalArcLength} ${circumference}`}
            style={{ strokeDashoffset: 0 }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="88"
            cy="88"
          />
          {/* Animated Value Arc */}
          <circle
            stroke={config.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${totalArcLength} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${config.glow})`,
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="88"
            cy="88"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] uppercase font-mono tracking-wider opacity-60">
            Risk Score
          </span>
          <div className="text-4xl font-mono font-extrabold tracking-tight tabular-nums flex items-baseline">
            <span className={config.text}>{score}</span>
            <span className="text-xs font-normal opacity-50 ml-1">/100</span>
          </div>
          <span className={`mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Details & Factor Breakdown */}
      <div className="space-y-3 flex-1 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Icon className={`w-5 h-5 ${config.text}`} />
            <h2 className="text-lg font-bold">
              {level === 'NORMAL' && 'Fence In Normal Range'}
              {level === 'SUSPICIOUS' && 'Suspicious Fence Fluctuation'}
              {level === 'UNAUTHORIZED' && 'Unauthorized Fence Interference'}
              {level === 'CRITICAL' && 'EMERGENCY: Safety Cut-Off Triggered'}
            </h2>
          </div>
          <p className="text-xs opacity-70 mt-1 leading-relaxed">
            {level === 'NORMAL' && 'Pulsed electrical delivery operating within certified agricultural safety parameters (IEC 60335-2-76).'}
            {level === 'SUSPICIOUS' && 'Fluctuations in pulse interval or ground resistance detected. Monitor fence line for vegetation contact.'}
            {level === 'UNAUTHORIZED' && 'High current draw or continuous waveform pattern detected. Inspect fence energizer immediately.'}
            {level === 'CRITICAL' && 'Lethal non-pulsed 230V mains or high continuous current detected. High-voltage supply has been instantly isolated to protect human and wildlife lives.'}
          </p>
        </div>

        {/* Real-time Contributing Factors */}
        {factors.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono uppercase tracking-wider opacity-60 block">
              Contributing Risk Factors:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
              {factors.map((factor, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono ${
                    level === 'CRITICAL'
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      : 'bg-white/5 border-white/10 opacity-80'
                  }`}
                >
                  ● {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
