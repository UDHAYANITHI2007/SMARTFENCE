import React from 'react';
import { SystemHealthStatus } from '../types';
import { Activity, CheckCircle2, Server, Database, Radio, Bell, Cpu, Layers } from 'lucide-react';

interface SystemHealthViewProps {
  health: SystemHealthStatus;
  isDarkMode?: boolean;
}

export const SystemHealthView: React.FC<SystemHealthViewProps> = ({ health, isDarkMode = true }) => {
  const services = [
    { name: 'FastAPI Telemetry Ingestion Gateway', status: health.backend_api, icon: Server, latency: '4.2 ms' },
    { name: 'Encrypted Event Database (Firestore / PostgreSQL)', status: health.database, icon: Database, latency: '12 ms' },
    { name: 'Real-Time Edge WebSocket Stream', status: health.event_stream, icon: Activity, latency: '1.8 ms' },
    { name: 'Apache Spark Distributed Compute Cluster', status: health.spark_engine, icon: Cpu, latency: '4 Nodes Active' },
    { name: 'Multi-Agency SMS / Webhook Dispatcher', status: health.notification_service, icon: Bell, latency: '1.4s SLA' },
    { name: 'IoT Edge Transceiver Gateway (4G / LoRa)', status: health.iot_gateway, icon: Radio, latency: '-84 dBm RSSI' },
  ];

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="pb-3 border-b border-white/10">
        <span className="text-xs uppercase font-mono tracking-wider opacity-60">Infrastructure Diagnostics</span>
        <h2 className="text-lg font-bold text-white mt-0.5">High-Availability System Health &amp; Topology</h2>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <svc.icon className="w-4 h-4" />
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                ● {svc.status}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">{svc.name}</h4>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Telemetry Metric: <span className="text-cyan-300">{svc.latency}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cluster Stats */}
      <div className="p-4 rounded-xl border border-white/10 bg-black/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[10px]">THROUGHPUT</span>
          <span className="text-base font-bold text-white mt-0.5 block tabular-nums">
            {health.events_per_sec} events/sec
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px]">SPARK WORKERS</span>
          <span className="text-base font-bold text-cyan-300 mt-0.5 block tabular-nums">
            {health.cluster_nodes_active} Node Executors
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px]">FAILOVER REDUNDANCY</span>
          <span className="text-base font-bold text-emerald-400 mt-0.5 block">
            N+1 Active Standby
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px]">EDGE BUFFER TIMEOUT</span>
          <span className="text-base font-bold text-white mt-0.5 block">
            72h Battery Reserve
          </span>
        </div>
      </div>
    </div>
  );
};
