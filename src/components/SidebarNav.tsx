import React from 'react';
import {
  LayoutDashboard,
  Activity,
  AlertOctagon,
  ClipboardList,
  Cpu,
  Trees,
  MapPin,
  Brain,
  Database,
  TrendingUp,
  Bell,
  FileText,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  unreadCount: number;
  openIncidentsCount: number;
  currentRole: UserRole;
  isDarkMode?: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  unreadCount,
  openIncidentsCount,
  currentRole,
  isDarkMode = true,
}) => {
  const navItems = [
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Monitoring & Twin', icon: Activity },
    {
      id: 'alerts',
      label: 'Emergency Alerts',
      icon: AlertOctagon,
      badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'incidents', label: 'Incident Management', icon: ClipboardList },
    { id: 'devices', label: 'Devices & Telemetry', icon: Cpu },
    { id: 'farms', label: 'Farms & Registration', icon: Trees },
    { id: 'map', label: 'Live Boundary Map', icon: MapPin },
    { id: 'risk', label: 'Risk Intelligence', icon: Brain },
    {
      id: 'spark',
      label: 'Spark & Scala Analytics',
      icon: Database,
      badge: 'SPARK',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    },
    { id: 'predictive', label: 'Predictive ML Model', icon: TrendingUp },
    {
      id: 'notifications',
      label: 'Notification Center',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
      badgeColor: 'bg-amber-500 text-black',
    },
    { id: 'reports', label: 'Dossier & Reports', icon: FileText },
    { id: 'audit', label: 'Security Audit Logs', icon: Shield },
    { id: 'settings', label: 'System Health & Engine', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between shrink-0 transition-all duration-300 z-30 border-r ${
        collapsed ? 'w-20' : 'w-64'
      } ${
        isDarkMode
          ? 'bg-slate-950/80 backdrop-blur-2xl border-white/10 text-slate-300'
          : 'bg-white/90 backdrop-blur-2xl border-slate-200 text-slate-700'
      }`}
    >
      {/* Top Branding Section */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.6)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <span className="text-base font-black tracking-tight text-white block">
                  SMARTFENCE <span className="text-cyan-400">X</span>
                </span>
                <span className="text-[10px] font-mono opacity-60 uppercase block">
                  Industrial Safety Platform
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer hidden md:block"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                    : 'hover:bg-white/5 hover:text-white text-slate-400'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold shrink-0 ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Role Indicator */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono">
          <div className="flex items-center justify-between opacity-70">
            <span>ACTIVE ROLE</span>
            <span className="text-cyan-400 font-bold">{currentRole}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Cluster: 4 Nodes · Spark 3.5.1
          </div>
        </div>
      )}
    </aside>
  );
};
