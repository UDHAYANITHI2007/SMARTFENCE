import React from 'react';
import { NotificationItem } from '../types';
import { Bell, X, CheckCheck, AlertOctagon, AlertTriangle, ShieldCheck, Send } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  isDarkMode?: boolean;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  isDarkMode = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-950 border-l border-white/10 p-6 shadow-2xl flex flex-col justify-between text-white space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold">Emergency &amp; Safety Notifications</h3>
                <span className="text-[11px] font-mono opacity-60">Multi-Channel SMS &amp; In-App Feed</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                title="Mark all as read"
              >
                Mark Read
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs opacity-50 font-mono">
                No notifications logged yet.
              </div>
            ) : (
              notifications.map((item) => {
                const isCrit = item.type === 'CRITICAL';
                const isWarn = item.type === 'WARNING' || item.type === 'UNAUTHORIZED';

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                      isCrit
                        ? 'bg-rose-950/30 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : isWarn
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          isCrit
                            ? 'bg-rose-500/20 text-rose-300'
                            : isWarn
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[10px] font-mono opacity-50">{item.timestamp}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-1">{item.title}</h4>
                    <p className="text-[11px] opacity-80 leading-relaxed">{item.message}</p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-400 flex items-center gap-1">
                        <Send className="w-3 h-3" /> SMS + Push
                      </span>
                      <span
                        className={`font-bold ${
                          item.status === 'DELIVERED'
                            ? 'text-emerald-400'
                            : item.status === 'FAILED'
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        ● {item.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 text-[11px] font-mono opacity-60 text-center">
            Encrypted GSM Cellular Gateway · Active
          </div>
        </div>
      </div>
    </div>
  );
};
