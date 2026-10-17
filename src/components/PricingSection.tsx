import React from 'react';
import { TokenState } from '../types/property';
import { Check, Crown, Zap, MessageCircle, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  tokens: TokenState;
  onOpenUpgrade: () => void;
  onStartGenerator: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  tokens,
  onOpenUpgrade,
  onStartGenerator,
}) => {
  const waContactUrl =
    'https://wa.me/6289673686625?text=Halo%20Admin%20PropertiClip%2C%20saya%20tertarik%20dengan%20Paket%20Unlimited%20Token%20VIP%20Rp%20199rb%20untuk%20agen%20properti.';

  return (
    <section id="pricing" className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-950 text-xs font-bold mb-3">
            <Crown className="w-3.5 h-3.5 text-orange-600" />
            Pilihan Paket Transparan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-slate-900">
            Mulai dari Demo Gratis 5 Token, Upgrade ke{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Unlimited VIP
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            1 Token = 1 Video Lengkap. Coba 5 video gratis sekarang dan rasakan kemudahan closing lewat video sosial media!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Card 1: Paket Demo Gratis */}
          <div className="p-8 rounded-3xl bg-orange-50/40 border border-orange-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Paket Percobaan
                </span>
                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200">
                  Gratis Agen Baru
                </span>
              </div>

              <h3 className="text-2xl font-bold font-['Outfit'] text-slate-900">Demo 5 Token</h3>
              <p className="text-xs text-slate-600 mt-1">
                Cocok untuk menguji kualitas video & narasi AI pada listing pertama Anda.
              </p>

              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">Rp 0</span>
                  <span className="text-xs text-slate-500">/ 5 Video Pertama</span>
                </div>
                <span className="text-xs text-emerald-600 font-bold block mt-1">
                  1 Token = 1 Video Full HD
                </span>
              </div>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-700">
                {[
                  '5 Credit Token Pembuatan Video',
                  'Watermark Logo Agency Anda Sendiri',
                  'Pilihan Durasi 15s, 30s & 60s',
                  'Format Rasio 9:16 (WA, Reels, TikTok)',
                  'AI Narasi Bahasa Indonesia Realistis',
                  'Opsi Edit Teks & Musik Sebelum Download',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onStartGenerator}
              className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-orange-50 text-orange-950 font-bold text-xs sm:text-sm border-2 border-orange-300 hover:border-orange-400 transition-all cursor-pointer shadow-xs"
            >
              Gunakan 5 Token Demo Sekarang
            </button>
          </div>

          {/* Card 2: Paket VIP Unlimited Token */}
          <div className="relative p-8 rounded-3xl bg-white border-2 border-orange-400 shadow-xl shadow-orange-500/10 flex flex-col justify-between">
            {/* Best Value Ribbon */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[11px] tracking-wider uppercase shadow-md">
              Paling Laris Untuk Top Agen
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> Akses Penuh Tanpa Batas
                </span>
                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-300">
                  Lifetime VIP
                </span>
              </div>

              <h3 className="text-2xl font-bold font-['Outfit'] text-slate-900">VIP Unlimited Token</h3>
              <p className="text-xs text-slate-600 mt-1">
                Bikin video listing setiap hari tanpa perlu khawatir kehabisan kuota video.
              </p>

              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-orange-600">Rp 199.000</span>
                  <span className="text-xs text-slate-400 line-through">Rp 499.000</span>
                </div>
                <span className="text-xs text-emerald-600 font-bold block mt-1">
                  Sekali Bayar • Buat Video Tanpa Batas (Unlimited)
                </span>
              </div>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-700">
                {[
                  'Video Generation Tanpa Batas (Unlimited Token)',
                  'Bebas Watermark PropertiClip (Hanya Logo & WA Anda)',
                  'Kualitas Render Full HD 1080p 60FPS Jernih Maksimal',
                  'Regenerate Naskah AI Hypnotic Copywriting Sepuasnya',
                  'Akses Semua Karakter Suara AI Realistis (Pria & Wanita)',
                  'Koleksi Musik Bebas Royalti & Bebas Ganti Backsound',
                  'Prioritas Server Render Video Cepat Tanpa Antri',
                  'Bantuan & Konsultasi Iklan Properti via WhatsApp VIP',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct WhatsApp CTA Button to 089673686625 */}
            <a
              href={waContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Aktivasi Unlimited via WhatsApp (0896-7368-6625)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
