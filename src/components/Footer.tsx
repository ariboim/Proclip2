import React from 'react';
import { Video, MessageCircle, Heart, Phone, ShieldCheck, Mail } from 'lucide-react';
import { IndoDigitalLogo } from './IndoDigitalLogo';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onOpenUpgrade: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToSection,
  onOpenUpgrade,
  onOpenProfile,
  onOpenAdmin,
}) => {
  const waContactUrl =
    'https://wa.me/6289673686625?text=Halo%20Admin%20PropertiClip%2C%20saya%20agen%20properti%20dan%20ingin%20konsultasi%20layanan%20video%20generator.';

  return (
    <>
      <footer className="bg-orange-50/80 border-t border-orange-200 pt-16 pb-24 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1: Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-xs">
                  <Video className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl text-slate-900 font-['Outfit']">
                  Properti<span className="text-orange-600">Clip</span> PRO AI
                </span>
              </div>
              <p className="text-slate-600 max-w-sm leading-relaxed text-xs">
                Platform video generator pro bertenaga kecerdasan buatan khusus untuk agen properti Indonesia. Ubah foto rumah menjadi video vertikal viral dengan narasi AI realistis, watermark agency, dan subtitle karaoke.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Resmi & Terpercaya
                </span>
                <span>•</span>
                <span className="text-orange-700 font-bold text-[11px]">
                  Gratis 5 Token Demo
                </span>
              </div>
            </div>

            {/* Col 2: Navigasi */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onScrollToSection('generator')}
                    className="hover:text-orange-600 transition-colors cursor-pointer text-slate-700"
                  >
                    Studio Generator Video
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenProfile}
                    className="hover:text-orange-600 transition-colors cursor-pointer text-slate-700"
                  >
                    Registrasi Profil Agen & Logo
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenUpgrade}
                    className="hover:text-orange-600 transition-colors cursor-pointer text-slate-700"
                  >
                    Paket Unlimited VIP Token
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollToSection('features')}
                    className="hover:text-orange-600 transition-colors cursor-pointer text-slate-700"
                  >
                    Fitur & Keunggulan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollToSection('pricing')}
                    className="hover:text-orange-600 transition-colors cursor-pointer text-slate-700"
                  >
                    Harga & Simulasi Token
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Kontak WhatsApp */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit']">
                Kontak & CS Support
              </h4>
              <p className="text-slate-600 text-xs">
                Ada pertanyaan teknis, kendala upload, atau aktivasi paket Unlimited VIP? Hubungi kami langsung:
              </p>
              <a
                href={waContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: 0896-7368-6625</span>
              </a>
            </div>
          </div>

          {/* INDO DIGITAL POWERED-BY BRANDING SECTION */}
          <div className="pt-10 pb-8 border-t border-orange-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {/* Indo Digital Logo Card */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:scale-105 inline-block">
                <IndoDigitalLogo height={44} theme="card" />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">
                  Official Technology & AI Infrastructure
                </span>
                <p className="text-sm font-extrabold text-slate-900 font-['Outfit'] tracking-wide">
                  powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 font-black">Indo Digital</span>
                </p>
                <span className="text-[11px] text-orange-700 font-semibold font-mono">
                  powered by Indo Digitalcopyright @2026
                </span>
              </div>
            </div>

            {/* Caption Pill & Eye-Catching Discreet Admin Trigger */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-xs font-mono text-slate-700 shadow-xs">
                  <span className="font-bold text-sky-700">powered by Indo Digitalcopyright @2026</span>
                </div>

                {/* Eye-catching glowing highlight indicator for admin access */}
                <button
                  onClick={onOpenAdmin}
                  title="Akses Terproteksi"
                  aria-label="Akses Terproteksi"
                  className="relative p-2 rounded-xl bg-orange-100 hover:bg-orange-200 border border-orange-400 shadow-xs text-orange-700 hover:text-orange-900 transition-all hover:scale-110 cursor-pointer animate-pulse"
                >
                  <span className="animate-ping absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange-500"></span>
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                </button>
              </div>

              <span className="text-[10px] text-slate-500">
                Solusi transformasi digital properti & multimedia kecerdasan buatan
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-orange-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 PropertiClip AI. powered by Indo Digitalcopyright @2026. Hak Cipta Dilindungi.</p>
            <p className="flex items-center gap-1">
              Dirancang khusus untuk memajukan industri agen properti di Indonesia
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp CTA Button on Bottom-Right */}
      <a
        href={waContactUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat CS WhatsApp: 0896-7368-6625"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-2xl shadow-emerald-900/70 border border-emerald-400/40 transition-all hover:scale-105 group"
      >
        <div className="w-3 h-3 rounded-full bg-white animate-ping absolute -top-0.5 -right-0.5" />
        <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Hubungi CS: 0896-7368-6625</span>
        <span className="sm:hidden font-bold">WA CS</span>
      </a>
    </>
  );
};
