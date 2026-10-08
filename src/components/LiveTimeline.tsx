import React from 'react';
import { TimelineEntry } from '../types';
import { Clock, ShieldAlert, Cpu, Bell, Send, Database, CheckCircle2 } from 'lucide-react';

interface LiveTimelineProps {
  entries: TimelineEntry[];
  isDarkMode?: boolean;
}

export const LiveTimeline: React.FC<LiveTimelineProps> = ({ entries, isDarkMode = true }) => {
  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-4 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">System Execution Flow</span>
          <h3 className="text-sm font-bold text-white mt-0.5">Real-Time Event Sequence</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Synchronized</span>
        </div>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {entries.map((item, idx) => {
          const isCritical = item.type === 'CRITICAL';
          const isCommand = item.type === 'COMMAND';
          const isWarning = item.type === 'WARNING';

          return (
            <div key={item.id || idx} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 transition-all ${
                  isCritical
                    ? 'bg-rose-500 border-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse'
                    : isCommand
                    ? 'bg-cyan-500 border-cyan-300'
                    : isWarning
                    ? 'bg-amber-500 border-amber-300'
                    : 'bg-emerald-500 border-emerald-300'
                }`}
              />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </span>
                <span className="text-[11px] font-mono opacity-50 shrink-0">
                  {item.time}
                </span>
              </div>

              {item.details && (
                <p className="text-xs opacity-70 mt-0.5 leading-relaxed font-mono text-[11px]">
                  {item.details}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
