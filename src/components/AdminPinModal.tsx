import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, AlertCircle, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Strict validation as requested: user : admin, pass : 8888
    if (cleanUser === 'admin' && cleanPass === '8888') {
      setErrorMessage(null);
      setUsername('');
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setErrorMessage('Akses Ditolak! Username atau Password Admin salah. Pastikan menggunakan kredensial admin yang sah.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with High-Visibility Lock Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/30 mb-3 animate-pulse">
            <Lock className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            🔐 Area Khusus Pengelola & Admin
          </div>
          <h3 className="text-2xl font-black font-['Outfit'] text-white">
            Login Akses Admin
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Silakan masukkan Username & Password Administrator untuk membuka kontrol worksheet database agen & aktivasi token.
          </p>
        </div>

        {/* Error Alert if Rejected */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-bounce">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">
              {errorMessage}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Username Admin <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-amber-400" />
              </div>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Masukkan username admin"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password Admin <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4 text-amber-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Masukkan password admin"
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verifikasi & Masuk Dashboard Admin</span>
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-500" />
            <span>Kerahasiaan terproteksi • Khusus pengelola sistem resmi</span>
          </p>
        </div>
      </div>
    </div>
  );
};
