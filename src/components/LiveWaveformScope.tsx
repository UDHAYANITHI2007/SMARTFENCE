import React, { useEffect, useRef, useState } from 'react';
import { SensorData, RiskLevel } from '../types';

interface LiveWaveformScopeProps {
  sensorData: SensorData;
  riskLevel: RiskLevel;
  isDarkMode?: boolean;
}

export const LiveWaveformScope: React.FC<LiveWaveformScopeProps> = ({
  sensorData,
  riskLevel,
  isDarkMode = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeDivMs, setTimeDivMs] = useState<number>(20);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    let animId: number;

    const render = () => {
      if (!running) return;
      const width = canvas.width;
      const height = canvas.height;
      const now = performance.now();

      // CRT phosphor dark background
      ctx.fillStyle = '#05070D';
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      const numH = 10;
      const numV = 8;
      const dx = width / numH;
      const dy = height / numV;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      for (let i = 0; i <= numH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * dx, 0);
        ctx.lineTo(i * dx, height);
        ctx.stroke();
      }
      for (let j = 0; j <= numV; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * dy);
        ctx.lineTo(width, j * dy);
        ctx.stroke();
      }

      // Center crosshair
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      const isTripped = sensorData.relay_status === 'OFF';
      const isContinuous = sensorData.continuous_wave || sensorData.pulse_frequency >= 45;
      const windowTimeMs = timeDivMs * numH;
      const centerY = height / 2;

      // CH1 Voltage Trace (Cyan)
      ctx.beginPath();
      ctx.strokeStyle = isTripped ? 'rgba(100, 116, 139, 0.4)' : '#06B6D4';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = isTripped ? 'transparent' : 'rgba(6, 182, 212, 0.7)';
      ctx.shadowBlur = isTripped ? 0 : 8;

      for (let px = 0; px < width; px++) {
        const tRelative = (px / width) * windowTimeMs;
        const tGlobal = (now % (windowTimeMs * 4)) + tRelative;

        let vValue = 0;

        if (isTripped) {
          vValue = (Math.random() - 0.5) * 0.01;
        } else if (isContinuous) {
          // 50Hz continuous sine wave
          const angle = (2 * Math.PI * 50 * tGlobal) / 1000;
          vValue = Math.sin(angle) * 0.78 + Math.sin(angle * 3) * 0.08;
        } else {
          // Periodic high-voltage impulse (approx every 1.1s)
          const pulsePeriodMs = 1120;
          const phase = (now + tRelative) % pulsePeriodMs;
          if (phase < 2.5) {
            const pulseT = phase / 2.5;
            vValue = 0.88 * Math.sin(pulseT * Math.PI) * Math.exp(-pulseT * 2.8);
          } else {
            vValue = (Math.random() - 0.5) * 0.008;
          }
        }

        const y = centerY - vValue * (height * 0.42);
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();

      // CH2 Current Trace (Amber)
      ctx.beginPath();
      ctx.strokeStyle = isTripped ? 'rgba(71, 85, 105, 0.4)' : '#F59E0B';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = isTripped ? 'transparent' : 'rgba(245, 158, 11, 0.6)';
      ctx.shadowBlur = isTripped ? 0 : 6;

      for (let px = 0; px < width; px++) {
        const tRelative = (px / width) * windowTimeMs;
        const tGlobal = (now % (windowTimeMs * 4)) + tRelative;

        let iValue = 0;

        if (isTripped) {
          iValue = (Math.random() - 0.5) * 0.005;
        } else if (isContinuous) {
          const angle = (2 * Math.PI * 50 * tGlobal) / 1000 - 0.35;
          iValue = Math.sin(angle) * 0.82;
        } else {
          const pulsePeriodMs = 1120;
          const phase = (now + tRelative) % pulsePeriodMs;
          if (phase < 2.5) {
            const pulseT = phase / 2.5;
            iValue = 0.25 * Math.sin(pulseT * Math.PI);
          }
        }

        const y = centerY - iValue * (height * 0.35);
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Overlay text
      ctx.font = '10px monospace';
      ctx.fillStyle = '#64748B';
      ctx.fillText(`CH1: 2 kV/div · CH2: 250 mA/div · ${timeDivMs} ms/div`, 14, 20);

      ctx.textAlign = 'right';
      if (isTripped) {
        ctx.fillStyle = '#F43F5E';
        ctx.fillText(`RELAY ISOLATED · 0.00 V WIRE`, width - 14, 20);
      } else if (isContinuous) {
        ctx.fillStyle = '#F43F5E';
        ctx.fillText(`NON-PULSED 50Hz DETECTED`, width - 14, 20);
      } else {
        ctx.fillStyle = '#10B981';
        ctx.fillText(`NORMAL PULSED · 100 kS/s`, width - 14, 20);
      }
      ctx.textAlign = 'left';

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
    };
  }, [sensorData, riskLevel, timeDivMs]);

  return (
    <div className={`p-4 md:p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-3 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">ESP32 Waveform Telemetry</span>
          <h3 className="text-sm font-bold text-white mt-0.5">High-Speed Electrical Pulse Discriminator</h3>
        </div>

        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
          {[5, 20, 50, 100].map((t) => (
            <button
              key={t}
              onClick={() => setTimeDivMs(t)}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                timeDivMs === t ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}ms
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full aspect-16/9 bg-[#05070D] rounded-xl overflow-hidden border border-white/10">
        <canvas ref={canvasRef} width={700} height={390} className="w-full h-full block" />
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono opacity-60 pt-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> CH1 Fence Voltage
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> CH2 Line Current
          </span>
        </div>
        <span>Sub-10ms Hardware Interrupt (ISR) Active</span>
      </div>
    </div>
  );
};
