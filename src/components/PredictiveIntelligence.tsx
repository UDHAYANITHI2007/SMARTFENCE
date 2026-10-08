import React from 'react';
import { PredictiveModelInsight } from '../types';
import { TrendingUp, AlertTriangle, Sparkles, Brain, Clock, ShieldCheck } from 'lucide-react';

interface PredictiveIntelligenceProps {
  insight: PredictiveModelInsight;
  onRefreshPrediction: () => void;
  isCalculating: boolean;
  isDarkMode?: boolean;
}

export const PredictiveIntelligence: React.FC<PredictiveIntelligenceProps> = ({
  insight,
  onRefreshPrediction,
  isCalculating,
  isDarkMode = true,
}) => {
  const isHigh = insight.predicted_risk_level === 'HIGH';

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
              Machine Learning Predictive Layer
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              XGBoost / Spark MLlib Model
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Probabilistic Incident Forecast (Next 2–4 Hours)
          </h2>
        </div>

        <button
          onClick={onRefreshPrediction}
          disabled={isCalculating}
          className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
          <span>{isCalculating ? 'Computing Features...' : 'Re-run Inference'}</span>
        </button>
      </div>

      {/* Main Forecast Gauge Card */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
        isHigh
          ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
          : 'bg-white/5 border-white/10'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
            isHigh ? 'bg-rose-500/20 border-rose-500/60 text-rose-400' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          }`}>
            <Brain className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">
              FORECASTED THREAT CLASSIFICATION
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-2xl font-black font-mono ${isHigh ? 'text-rose-400' : 'text-emerald-400'}`}>
                {insight.predicted_risk_level} PROBABILITY
              </span>
              <span className="text-sm font-mono font-bold text-white tabular-nums">
                ({insight.probability_pct}% Confidence)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Anticipated Window: <strong className="text-white">{insight.expected_risk_window}</strong></span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs max-w-sm">
          <span className="text-cyan-400 font-bold block mb-1 font-mono text-[11px]">
            RECOMMENDED PREVENTATIVE ACTION:
          </span>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {insight.recommended_preventative_action}
          </p>
        </div>
      </div>

      {/* Feature Importance Indicators */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono block">
          Key Predictive Telemetry Drivers:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insight.key_indicators.map((ind, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">{ind.feature}</span>
                <span className="text-cyan-400 font-bold">{ind.weight}</span>
              </div>
              <div className="text-[11px] font-mono text-amber-400">
                Direction: {ind.direction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Statistical Disclaimer (Section 22) */}
      <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[11px] font-mono text-slate-400 text-center">
        ℹ️ PREDICTIVE DISCLAIMER: Predictions represent probabilistic statistical model inferences based on historical Spark training batches, not guaranteed physical outcomes.
      </div>
    </div>
  );
};
