import React, { useState } from 'react';
import { RiskRule, RiskAnalysis } from '../types';
import { Brain, Sliders, CheckCircle2, Shield, AlertTriangle, Cpu, Save } from 'lucide-react';

interface RiskIntelligenceConfigProps {
  rules: RiskRule[];
  onToggleRule: (ruleId: string) => void;
  onUpdateWeight: (ruleId: string, newWeight: number) => void;
  currentRiskAnalysis: RiskAnalysis;
  isDarkMode?: boolean;
}

export const RiskIntelligenceConfig: React.FC<RiskIntelligenceConfigProps> = ({
  rules,
  onToggleRule,
  onUpdateWeight,
  currentRiskAnalysis,
  isDarkMode = true,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">Rule Engine &amp; Explainability</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Multi-Parameter Risk Intelligence Engine</h2>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          {saveSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'Rule Engine Synced!' : 'Save Rule Weights'}</span>
        </button>
      </div>

      {/* Real-Time Risk Explainability Card (Section 4) */}
      <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
            Live Risk Explainability Breakdown
          </span>
          <span className="text-xs font-mono font-bold text-rose-400">
            Score: {currentRiskAnalysis.score} / 100 ({currentRiskAnalysis.level})
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The engine computes transparent, auditable factors rather than opaque black-box thresholds. Every generated alert displays exact contributing triggers:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {currentRiskAnalysis.factors.map((factor, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-cyan-300"
            >
              • {factor}
            </span>
          ))}
        </div>
      </div>

      {/* Configurable Risk Rules List */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono block">
          Configurable Detection Rules:
        </span>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                rule.enabled ? 'bg-white/5 border-white/10' : 'bg-black/30 border-white/5 opacity-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono text-cyan-400 font-bold">{rule.id}</span>
                  <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    Param: {rule.parameter}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{rule.description}</p>
              </div>

              {/* Slider for Weight and Toggle */}
              <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">WEIGHT:</span>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={rule.weight}
                    onChange={(e) => onUpdateWeight(rule.id, Number(e.target.value))}
                    className="w-24 accent-cyan-400 cursor-pointer"
                  />
                  <span className="w-8 text-right font-bold text-cyan-300">+{rule.weight}</span>
                </div>

                <button
                  onClick={() => onToggleRule(rule.id)}
                  className={`px-3 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                    rule.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-slate-500 border-white/10'
                  }`}
                >
                  {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
