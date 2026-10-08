import React, { useState } from 'react';
import { Farm } from '../types';
import { Plus, X, MapPin, CheckCircle2 } from 'lucide-react';

interface FarmRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterFarm: (farm: Omit<Farm, 'status'>) => void;
}

export const FarmRegistrationModal: React.FC<FarmRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterFarm,
}) => {
  const [formData, setFormData] = useState({
    farm_id: `FARM-00${Math.floor(4 + Math.random() * 5)}`,
    farm_name: '',
    farmer_name: '',
    mobile_number: '',
    device_id: `SF-00${Math.floor(4 + Math.random() * 5)}`,
    location: '',
    lat: 11.512,
    lng: 76.894,
    emergency_contact: '',
    supervisor_contact: '',
    risk_level: 'NORMAL' as const,
    risk_score: 10,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farm_name || !formData.farmer_name) return;
    onRegisterFarm(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-950 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl text-white space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold block">
              Fleet Onboarding
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">Register New Farm &amp; SmartFence Device</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Farm Name *</label>
              <input
                type="text"
                required
                value={formData.farm_name}
                onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                placeholder="e.g. Silver Cascade Agro"
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Farmer / Owner Name *</label>
              <input
                type="text"
                required
                value={formData.farmer_name}
                onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Mobile Number *</label>
              <input
                type="text"
                required
                value={formData.mobile_number}
                onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                placeholder="+91 98400 12345"
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">SmartFence Device ID *</label>
              <input
                type="text"
                required
                value={formData.device_id}
                onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                placeholder="e.g. SF-004"
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1">Farm Location / Sector *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Sathyamangalam Reserve Forest Boundary, Block B"
              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">GPS Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">GPS Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Emergency Contact (SMS)</label>
              <input
                type="text"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                placeholder="+91 94450 00000"
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Supervisor / Forest Officer Contact</label>
              <input
                type="text"
                value={formData.supervisor_contact}
                onChange={(e) => setFormData({ ...formData, supervisor_contact: e.target.value })}
                placeholder="+91 94420 11111"
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all shadow-lg cursor-pointer"
            >
              Register &amp; Link Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
