import React from 'react';
import { FenceEvent } from '../types';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Zap, Activity } from 'lucide-react';

interface AnalyticsDashboardProps {
  events: FenceEvent[];
  isDarkMode?: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ events, isDarkMode = true }) => {
  const total = events.length;
  const normalCount = events.filter((e) => e.risk_level === 'NORMAL').length;
  const suspCount = events.filter((e) => e.risk_level === 'SUSPICIOUS').length;
  const unauthCount = events.filter((e) => e.risk_level === 'UNAUTHORIZED').length;
  const critCount = events.filter((e) => e.risk_level === 'CRITICAL').length;
  const avgRisk = total > 0 ? Math.round(events.reduce((a, b) => a + b.risk_score, 0) / total) : 0;
  const maxRisk = total > 0 ? Math.max(...events.map((e) => e.risk_score)) : 0;

  // Mock days data for weekly bar chart
  const weeklyData = [
    { day: 'Mon', count: 2, crit: 0 },
    { day: 'Tue', count: 4, crit: 1 },
    { day: 'Wed', count: 1, crit: 0 },
    { day: 'Thu', count: 5, crit: 2 },
    { day: 'Fri', count: 3, crit: 0 },
    { day: 'Sat', count: 6, crit: 1 },
    { day: 'Sun', count: 2, crit: 0 },
  ];

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="pb-3 border-b border-white/10">
        <span className="text-xs uppercase font-mono tracking-wider opacity-60">Fleet Intelligence &amp; Metrics</span>
        <h2 className="text-lg font-bold text-white mt-0.5">Fence Safety Analytics &amp; Trends</h2>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Monitored Events</span>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">{total}</div>
          <span className="text-[11px] text-emerald-400">Continuous Logging Active</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Critical Interventions</span>
          <div className="text-2xl font-mono font-bold text-rose-400 tabular-nums">{critCount}</div>
          <span className="text-[11px] text-slate-400">Sub-8ms Cutoffs Triggered</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Average Risk Score</span>
          <div className="text-2xl font-mono font-bold text-cyan-300 tabular-nums">{avgRisk} <span className="text-xs font-normal opacity-60">/100</span></div>
          <span className="text-[11px] text-slate-400">Normal Range: &lt;30</span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Highest Risk Peak</span>
          <div className="text-2xl font-mono font-bold text-amber-400 tabular-nums">{maxRisk} <span className="text-xs font-normal opacity-60">/100</span></div>
          <span className="text-[11px] text-slate-400">230V Mains Tap Spike</span>
        </div>
      </div>

      {/* Visual Risk Distribution & Weekly Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Risk Level Distribution Bar */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Classification Breakdown
          </span>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <div className="flex justify-between pb-1">
                <span className="text-emerald-400">NORMAL (0-30)</span>
                <span className="text-white">{normalCount} events</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${total > 0 ? (normalCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between pb-1">
                <span className="text-amber-400">SUSPICIOUS (31-60)</span>
                <span className="text-white">{suspCount} events</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${total > 0 ? (suspCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between pb-1">
                <span className="text-orange-400">UNAUTHORIZED (61-80)</span>
                <span className="text-white">{unauthCount} events</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${total > 0 ? (unauthCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between pb-1">
                <span className="text-rose-400 font-bold">CRITICAL (81-100)</span>
                <span className="text-white font-bold">{critCount} events</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${total > 0 ? (critCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Incidents Bar Chart (SVG) */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Weekly Activity Volume
            </span>
            <span className="text-[10px] font-mono text-cyan-400">7-Day Aggregation</span>
          </div>

          <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2">
            {weeklyData.map((d, i) => {
              const heightPct = (d.count / 8) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full bg-white/5 rounded-t-lg relative flex items-end overflow-hidden h-32">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        d.crit > 0 ? 'bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-cyan-500/70'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
