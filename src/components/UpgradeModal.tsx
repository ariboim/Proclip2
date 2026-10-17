import React from 'react';
import { TokenState } from '../types/property';
import { activateUnlimitedVip, addDemoTokens } from '../utils/storage';
import { X, Crown, Check, MessageCircle, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: TokenState;
  onTokensUpdated: (newTokens: TokenState) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onTokensUpdated,
}) => {
  if (!isOpen) return null;

  const waUpgradeUrl =
    'https://wa.me/6289673686625?text=Halo%20Admin%20PropertiClip%2C%20saya%20mau%20aktivasi%20Paket%20Unlimited%20Token%20VIP%20untuk%20agen%20properti%20saya.';

  const handleSimulateVip = () => {
    const updated = activateUnlimitedVip();
    onTokensUpdated(updated);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleAddTokens = () => {
    const updated = addDemoTokens(5);
    onTokensUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-xl shadow-amber-500/25 mb-4 animate-bounce">
            <Crown className="w-8 h-8 text-slate-950 font-bold" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            Paket Khusus Agen Properti Berprestasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
            Upgrade ke <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Unlimited Token VIP</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Jangan biarkan calon buyer kabur ke agen lain. Buat video listing tanpa batas setiap kali ada listing rumah baru!
          </p>
        </div>

        {/* Token Balance Status */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between mb-6">
          <div>
            <span className="text-xs text-slate-400 block">Status Akun Saat Ini:</span>
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              {tokens.isUnlimitedVip ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <Crown className="w-4 h-4" /> VIP Unlimited Aktif
                </span>
              ) : (
                <span>Akun Demo ({tokens.remainingTokens} Token Tersisa)</span>
              )}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Video Dibuat:</span>
            <span className="text-sm font-bold text-emerald-400">{tokens.totalUsed} Video</span>
          </div>
        </div>

        {/* Value Proposition List */}
        <div className="space-y-3 mb-6">
          {[
            'Bikin Video Properti Tanpa Batas (Unlimited Token Selamanya)',
            'Bebas Watermark PropertiClip (Hanya Logo Agency & Kontak Anda)',
            'Kualitas Video Full HD 1080p Tajam untuk Reels, TikTok & WA Status',
            'AI Narasi Realistis Bahasa Indonesia Tidak Kaku Berdasarkan Deskripsi Listing',
            'Akses Semua Koleksi Suara AI Pria & Wanita Berwibawa & Menjual',
            'Bebas Edit Naskah & Teks Spesifikasi Sebelum Download',
            'Dukungan VIP & Konsultasi Langsung via WhatsApp',
          ].map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm text-slate-200">{feature}</span>
            </div>
          ))}
        </div>

        {/* Pricing Offer Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block">
                Promo Eksklusif Agen Properti
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold text-white">Rp 199.000</span>
                <span className="text-xs text-slate-400 line-through">Rp 499.000</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 font-semibold">
                  Hemat 60%
                </span>
              </div>
              <span className="text-xs text-slate-400">Sekali bayar untuk akses Unlimited VIP</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                Akses Instan
              </span>
            </div>
          </div>
        </div>

        {/* Direct WhatsApp CTA Button to 089673686625 */}
        <div className="space-y-3">
          <a
            href={waUpgradeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Hubungi WhatsApp Sekarang (0896-7368-6625)</span>
          </a>

          {/* Quick Demo Simulator for Testing */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSimulateVip}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Aktifkan VIP Demo (Instant)
            </button>
            <button
              onClick={handleAddTokens}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Reset +5 Token Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
