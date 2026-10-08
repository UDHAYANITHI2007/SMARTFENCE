import React from 'react';
import { UserRole, RiskLevel, Farm } from '../types';
import { Volume2, VolumeX, Bell, Sun, Moon, ShieldCheck, ShieldAlert, AlertTriangle, Zap, User, Shield } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAudioOn: boolean;
  toggleAudio: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  farms: Farm[];
  selectedFarmId: string;
  onSelectFarm: (farmId: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onSimulateState: (level: RiskLevel) => void;
  currentRiskLevel: RiskLevel;
  onOpenFarmRegistration: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  isAudioOn,
  toggleAudio,
  isDarkMode,
  toggleDarkMode,
  farms,
  selectedFarmId,
  onSelectFarm,
  unreadNotificationsCount,
  onOpenNotifications,
  onSimulateState,
  currentRiskLevel,
  onOpenFarmRegistration,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 shadow-lg text-white">
      {/* Top Bar Zone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                SMARTFENCE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold hidden sm:inline-block">
                SF-001 ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Real-Time Electric Fence Safety &amp; Emergency Monitoring
            </p>
          </div>
        </div>

        {/* Center / Farm Selector & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Farm Switcher */}
          <select
            value={selectedFarmId}
            onChange={(e) => onSelectFarm(e.target.value)}
            className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 hidden lg:block cursor-pointer"
          >
            {farms.map((f) => (
              <option key={f.farm_id} value={f.farm_id} className="bg-slate-950 text-white">
                {f.farm_name} ({f.device_id})
              </option>
            ))}
          </select>

          {/* Role Toggle Switcher */}
          <div className="flex items-center p-0.5 bg-black/40 border border-white/10 rounded-xl">
            <button
              onClick={() => setCurrentRole('FARMER')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'FARMER'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Farmer</span>
            </button>
            <button
              onClick={() => setCurrentRole('ADMIN')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'ADMIN'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            onClick={toggleAudio}
            title={isAudioOn ? 'Relay audio feedback enabled' : 'Relay audio muted'}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {isAudioOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Open Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-mono font-bold flex items-center justify-center text-white animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation & Simulation Control Bar */}
      <div className="bg-white/5 border-t border-white/5 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-2 overflow-x-auto text-xs font-semibold py-0.5">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'devices', label: 'Devices' },
              { id: 'incidents', label: 'Incident History' },
              { id: 'contacts', label: 'Emergency Contacts' },
              ...(currentRole === 'ADMIN' ? [{ id: 'admin', label: 'Fleet Ops' }] : []),
              { id: 'esp32', label: 'ESP32 & API' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white/15 text-cyan-300 font-bold border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={onOpenFarmRegistration}
              className="px-2.5 py-1 rounded-lg text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors ml-2 cursor-pointer"
            >
              + Register Farm
            </button>
          </nav>

          {/* Simulation Mode Bar (Prominent as specified in Section 19) */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-black/40 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
            <span className="text-slate-400 px-1 font-bold">DEMO:</span>
            <button
              onClick={() => onSimulateState('NORMAL')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                currentRiskLevel === 'NORMAL' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              NORMAL
            </button>
            <button
              onClick={() => onSimulateState('SUSPICIOUS')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                currentRiskLevel === 'SUSPICIOUS' ? 'bg-amber-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              SUSPICIOUS
            </button>
            <button
              onClick={() => onSimulateState('UNAUTHORIZED')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                currentRiskLevel === 'UNAUTHORIZED' ? 'bg-orange-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              UNAUTHORIZED
            </button>
            <button
              onClick={() => onSimulateState('CRITICAL')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                currentRiskLevel === 'CRITICAL' ? 'bg-rose-600 text-white font-bold shadow-[0_0_10px_rgba(244,63,94,0.6)]' : 'text-rose-400 hover:text-white'
              }`}
            >
              CRITICAL
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
