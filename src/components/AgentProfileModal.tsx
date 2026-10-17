import React, { useState } from 'react';
import { AgentProfile } from '../types/property';
import { saveAgentProfile } from '../utils/storage';
import { createPresetAgencyLogo } from '../utils/sampleData';
import { X, Upload, CheckCircle2, Building2, User, Phone, Sparkles, Shield } from 'lucide-react';

interface AgentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: AgentProfile;
  onSaveProfile: (updated: AgentProfile) => void;
  onRegistrationSuccess?: () => void;
  mustRegisterFirst?: boolean;
}

const PRESET_AGENCIES = [
  { name: 'Brighton Real Estate', color: '#f59e0b' },
  { name: 'ERA Indonesia', color: '#dc2626' },
  { name: 'Ray White Priority', color: '#eab308' },
  { name: 'Century 21 Prima', color: '#ca8a04' },
  { name: 'Harcourts Property', color: '#0284c7' },
  { name: 'LJ Hooker Premier', color: '#ea580c' },
];

export const AgentProfileModal: React.FC<AgentProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onRegistrationSuccess,
  mustRegisterFirst = false,
}) => {
  const [name, setName] = useState(currentProfile.name || '');
  const [whatsapp, setWhatsapp] = useState(currentProfile.whatsapp || '');
  const [agencyName, setAgencyName] = useState(currentProfile.agencyName || '');
  const [agencyLogoUrl, setAgencyLogoUrl] = useState(currentProfile.agencyLogoUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAgencyLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (agency: { name: string; color: string }) => {
    setAgencyName(agency.name);
    const generated = createPresetAgencyLogo(agency.name, agency.color);
    setAgencyLogoUrl(generated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Request browser notification permission proactively for video completion notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    let finalLogo = agencyLogoUrl;
    if (!finalLogo) {
      finalLogo = createPresetAgencyLogo(agencyName || 'Independent', '#f59e0b');
    }

    const updated: AgentProfile = {
      name: name.trim(),
      whatsapp: whatsapp.trim() || '089673686625',
      agencyName: agencyName.trim() || 'Independent Property Agent',
      agencyLogoUrl: finalLogo,
      isRegistered: true,
    };

    saveAgentProfile(updated);
    onSaveProfile(updated);

    // Sync to backend worksheet database
    fetch('/api/register-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updated.name,
        whatsapp: updated.whatsapp,
        agencyName: updated.agencyName,
        agencyLogoUrl: updated.agencyLogoUrl,
      }),
    }).catch((err) => console.warn('Failed to sync agent to server db', err));

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    }, 1500);
  };

  const isAlreadyRegistered = currentProfile.isRegistered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button - allow closing if already registered or user wants to browse */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            {isAlreadyRegistered ? 'Pengaturan Profil Agen' : 'Wajib Registrasi: Akses Demo & Generator'}
          </div>
          <h2 className="text-2xl font-bold font-['Outfit'] text-white">
            {isAlreadyRegistered ? 'Update Profil & Logo Agency' : 'Daftar Akun Agen Properti'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAlreadyRegistered
              ? 'Data ini akan otomatis muncul sebagai watermark logo, lower-third, dan nomor WhatsApp resmi di video promosi Anda.'
              : 'Wajib mendaftar terlebih dahulu untuk mengaktifkan demo gratis 5 token dan mulai membuat video promosi properti sinematik.'}
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/50 text-emerald-200 flex items-center gap-3.5 shadow-lg shadow-emerald-950/40 animate-in zoom-in-95 duration-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0 font-black">
              ✓
            </div>
            <div>
              <p className="text-sm font-black text-white capitalize">
                registrasi sukses ,silakan buat video sekarang
              </p>
              <p className="text-xs text-emerald-300 mt-0.5">
                Bonus 5 token demo aktif. Mengarahkan Anda ke form video...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Nama Agen */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Nama Lengkap Agen <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Hendro Wijaya, S.E."
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Nomor WhatsApp Agen <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 08123456789 atau 089673686625"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Nomor ini akan tertera di tombol CTA outro video promosi.
            </p>
          </div>

          {/* Nama Agency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Nama Kantor Agency / Broker <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Contoh: ERA Star Bintaro / Brighton / Independent"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Upload Logo Agency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Upload Logo Agency (Watermark Video)
            </label>

            {/* Quick Presets */}
            <div className="mb-3">
              <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Pilihan cepat logo agency populer:
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_AGENCIES.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => handleSelectPreset(preset)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/40 text-slate-300 transition-colors cursor-pointer"
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area / Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-dashed border-slate-700 hover:border-amber-500/50 transition-colors">
              {agencyLogoUrl ? (
                <div className="relative w-24 h-16 bg-slate-950 rounded-xl border border-slate-700 p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={agencyLogoUrl}
                    alt="Logo Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                  <Upload className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  {agencyLogoUrl ? 'Ganti File Logo' : 'Pilih File Logo (PNG/JPG)'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  Format PNG transparan direkomendasikan agar tampak mewah.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] cursor-pointer"
            >
              Simpan Profil Agen & Lanjutkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
