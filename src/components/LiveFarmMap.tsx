import React from 'react';
import { Farm } from '../types';
import { MapPin, Navigation, Trees, ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon } from 'lucide-react';

interface LiveFarmMapProps {
  farms: Farm[];
  selectedFarmId: string;
  onSelectFarm: (farmId: string) => void;
  isDarkMode?: boolean;
}

export const LiveFarmMap: React.FC<LiveFarmMapProps> = ({
  farms,
  selectedFarmId,
  onSelectFarm,
  isDarkMode = true,
}) => {
  const selectedFarm = farms.find((f) => f.farm_id === selectedFarmId) || farms[0];

  const getMarkerColor = (f: Farm) => {
    if (f.status === 'OFFLINE') return { fill: '#475569', label: 'OFFLINE' };
    if (f.risk_level === 'CRITICAL') return { fill: '#EF4444', label: 'CRITICAL' };
    if (f.risk_level === 'UNAUTHORIZED') return { fill: '#F97316', label: 'UNAUTHORIZED' };
    if (f.risk_level === 'SUSPICIOUS') return { fill: '#F59E0B', label: 'WARNING' };
    return { fill: '#10B981', label: 'SAFE' };
  };

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider opacity-60">GIS Geospatial Telemetry</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Live Agricultural &amp; Wildlife Boundary Map</h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 🟢 Safe
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 🟡 Warning
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> 🔴 Critical
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span> ⚫ Offline
          </span>
        </div>
      </div>

      {/* SVG Interactive GIS Map Stage */}
      <div className="relative w-full aspect-16/9 bg-[#050811] rounded-2xl border border-white/10 overflow-hidden shadow-inner p-4">
        <svg viewBox="0 0 800 450" className="w-full h-full">
          {/* Top Reserve Forest Zone */}
          <rect x="0" y="0" width="800" height="190" fill="#041612" opacity="0.95" />
          <text x="30" y="36" fill="#10B981" fontSize="12" fontFamily="monospace" fontWeight="bold">
            RESERVE FOREST CORRIDOR (WILD ELEPHANT MIGRATION PATHS)
          </text>

          {/* Elephant Herd Path Curves */}
          <path d="M 40 100 Q 220 140 450 90 T 760 110" stroke="#064E3B" strokeWidth="2" strokeDasharray="6 4" fill="none" />
          <text x="470" y="80" fill="#34D399" fontSize="10" fontFamily="monospace">🐘 Corridor Route #3</text>

          {/* Bottom Agricultural Land Zone */}
          <rect x="0" y="190" width="800" height="260" fill="#080E1C" opacity="0.95" />
          <text x="30" y="420" fill="#38BDF8" fontSize="12" fontFamily="monospace">
            PROTECTED AGRICULTURAL CROPLANDS (FARMS FLEET)
          </text>

          {/* 11kV Rural Grid Line Feeder DT-04 */}
          <line x1="20" y1="360" x2="780" y2="360" stroke="#334155" strokeWidth="2" strokeDasharray="5 5" />
          <text x="600" y="352" fill="#64748B" fontSize="10" fontFamily="monospace">11kV Feeder Line (DT-04)</text>

          {/* Boundary Divider */}
          <line x1="0" y1="190" x2="800" y2="190" stroke="#1E293B" strokeWidth="2" />

          {/* Farm Pins */}
          {[
            { farm_id: 'FARM-001', name: 'Udhaya Organic Farm', x: 280, y: 220, risk: 'CRITICAL', device: 'SF-001' },
            { farm_id: 'FARM-002', name: 'Western Ghats Agro', x: 540, y: 235, risk: 'NORMAL', device: 'SF-002' },
            { farm_id: 'FARM-003', name: 'Nilgiri Foothills', x: 140, y: 250, risk: 'NORMAL', device: 'SF-003' },
          ].map((node) => {
            const isSelected = selectedFarmId === node.farm_id;
            const f = farms.find((item) => item.farm_id === node.farm_id) || farms[0];
            const cfg = getMarkerColor(f);

            return (
              <g
                key={node.farm_id}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectFarm(node.farm_id)}
              >
                {/* Glow Ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? '22' : '15'}
                  fill={cfg.fill}
                  opacity="0.2"
                  className={f.risk_level === 'CRITICAL' ? 'animate-ping' : ''}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? '14' : '10'}
                  fill="#0B0F19"
                  stroke={cfg.fill}
                  strokeWidth="3"
                />
                <circle cx={node.x} cy={node.y} r="4" fill={cfg.fill} />

                {/* Label Box */}
                <rect
                  x={node.x - 70}
                  y={node.y - 36}
                  width="140"
                  height="22"
                  rx="4"
                  fill="#0B0F19"
                  stroke={isSelected ? '#38BDF8' : '#334155'}
                  strokeWidth="1.5"
                />
                <text
                  x={node.x}
                  y={node.y - 21}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Farm Quick Inspector */}
      <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold block">{selectedFarm.farm_id}</span>
          <h3 className="text-base font-bold text-white mt-0.5">{selectedFarm.farm_name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{selectedFarm.location}</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">DEVICE LINK</span>
            <span className="text-white font-bold">{selectedFarm.device_id}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">COORDINATES</span>
            <span className="text-slate-200">{selectedFarm.lat}° N, {selectedFarm.lng}° E</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">OPERATING STATUS</span>
            <span className={`font-bold ${selectedFarm.risk_level === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'}`}>
              ● {selectedFarm.risk_level || 'NORMAL'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
