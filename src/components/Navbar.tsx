import React from 'react';
import { AgentProfile, TokenState } from '../types/property';
import {
  Video,
  Sparkles,
  Crown,
  MessageCircle,
  UserCheck,
  ShieldCheck,
  Home as HomeIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type AppPage = 'home' | 'form' | 'studio' | 'pricing';

interface NavbarProps {
  agent: AgentProfile;
  tokens: TokenState;
  currentPage?: AppPage;
  onGoHome?: () => void;
  onGoPrev?: () => void;
  onGoNext?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  onOpenProfile: () => void;
  onOpenUpgrade: () => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  agent,
  tokens,
  currentPage = 'home',
  onGoHome,
  onGoPrev,
  onGoNext,
  canGoPrev = true,
  canGoNext = true,
  onOpenProfile,
  onOpenUpgrade,
  onScrollToSection,
  onOpenAdmin,
}) => {
  const waContactUrl =
    'https://wa.me/6289673686625?text=Halo%20Admin%2C%20saya%20tertarik%20dengan%20PropertiClip%20AI%20Video%20Generator%20untuk%20agen%20properti.';

  // Page titles for indicator
  const pageLabelMap: Record<AppPage, { num: number; title: string }> = {
    home: { num: 1, title: 'Beranda' },
    form: { num: 2, title: 'Upload & Spesifikasi' },
    studio: { num: 3, title: 'Studio Video' },
    pricing: { num: 4, title: 'Paket & FAQ' },
  };

  const currentInfo = pageLabelMap[currentPage] || { num: 1, title: 'Beranda' };

  return (
    <>
      {/* Light Orange Navtab Header (Orange Muda) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-orange-100/95 border-b border-orange-200/90 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand / Logo */}
            <div
              onClick={() => {
                if (onGoHome) onGoHome();
                else onScrollToSection('hero');
              }}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
              title="Kembali ke Beranda"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-['Outfit']">
                    Properti<span className="text-orange-600">Clip</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-200 text-orange-900 border border-orange-300">
                    PRO AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 hidden sm:block">Video Generator Agen Properti</p>
              </div>
            </div>

            {/* PREVIOUS PAGE, HOME, NEXT PAGE BUTTONS (Requested by user) */}
            <div className="flex items-center gap-1 sm:gap-2 bg-orange-200/70 p-1 sm:p-1.5 rounded-2xl border border-orange-300/80 shadow-xs">
              {/* Button: Home */}
              <button
                type="button"
                onClick={onGoHome}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentPage === 'home'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-white hover:bg-orange-50 text-orange-950 border border-orange-200 hover:border-orange-300'
                }`}
                title="Halaman Beranda (Home)"
              >
                <HomeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit" />
                <span className="hidden md:inline font-bold">Home</span>
              </button>

              {/* Button: Previous Page */}
              <button
                type="button"
                onClick={onGoPrev}
                disabled={!canGoPrev}
                className={`px-2 sm:px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1 transition-all ${
                  canGoPrev
                    ? 'bg-white hover:bg-orange-50 text-orange-950 border border-orange-200 hover:border-orange-300 shadow-xs cursor-pointer'
                    : 'bg-orange-100/60 text-orange-400 border border-transparent cursor-not-allowed opacity-50'
                }`}
                title="Ke Halaman Sebelumnya (Previous Page)"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Prev Page</span>
              </button>

              {/* Page Number & Indicator Badge */}
              <div className="hidden lg:flex items-center px-2 py-1 text-[11px] font-bold text-orange-900">
                <span className="bg-orange-300/60 px-2 py-0.5 rounded-md">
                  Hal. {currentInfo.num}/4: {currentInfo.title}
                </span>
              </div>

              {/* Button: Next Page */}
              <button
                type="button"
                onClick={onGoNext}
                disabled={!canGoNext}
                className={`px-2 sm:px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1 transition-all ${
                  canGoNext
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xs cursor-pointer'
                    : 'bg-orange-100/60 text-orange-400 border border-transparent cursor-not-allowed opacity-50'
                }`}
                title="Ke Halaman Berikutnya (Next Page)"
              >
                <span className="hidden sm:inline">Next Page</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Navigation Tabs (Light Orange theme) */}
            <nav className="hidden xl:flex items-center gap-2 text-xs font-bold text-orange-950">
              <button
                onClick={() => onScrollToSection('generator')}
                className="px-3 py-1.5 rounded-xl bg-orange-200/50 hover:bg-orange-200 text-orange-950 transition-colors flex items-center gap-1 cursor-pointer border border-orange-300/40"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Studio Generator
              </button>
              <button
                onClick={() => onScrollToSection('features')}
                className="px-3 py-1.5 rounded-xl hover:bg-orange-200 text-orange-950 transition-colors cursor-pointer"
              >
                Keunggulan
              </button>
              <button
                onClick={() => onScrollToSection('pricing')}
                className="px-3 py-1.5 rounded-xl hover:bg-orange-200 text-orange-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-orange-600" />
                Paket VIP
              </button>
              <button
                onClick={() => onScrollToSection('faq')}
                className="px-3 py-1.5 rounded-xl hover:bg-orange-200 text-orange-950 transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </nav>

            {/* Right Action Badges: Eye-Catching Admin Button + Token Counter + Agent Profile + WA CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* EYE-CATCHING HIGHLIGHT / TANDA AKSES ADMIN */}
              <button
                onClick={onOpenAdmin}
                className="relative p-2 sm:p-2.5 rounded-xl bg-orange-200/80 border-2 border-orange-400 hover:border-orange-500 text-orange-700 hover:text-orange-900 shadow-sm transition-all hover:scale-110 cursor-pointer group flex items-center justify-center animate-pulse"
                title="Akses Terproteksi Admin"
                aria-label="Akses Terproteksi Admin"
              >
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border border-white"></span>
                </span>
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 group-hover:rotate-12 transition-transform drop-shadow" />
              </button>

              {/* Token Credit Badge */}
              <button
                onClick={onOpenUpgrade}
                title="Klik untuk upgrade ke Unlimited Token"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-orange-300 hover:border-orange-500 transition-all cursor-pointer group shadow-xs"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                    {tokens.isUnlimitedVip ? (
                      <span className="flex items-center gap-1 text-orange-600 font-extrabold">
                        <Crown className="w-3.5 h-3.5" /> VIP
                      </span>
                    ) : (
                      <>
                        <span className="hidden sm:inline text-slate-600">Token:</span>
                        <span className="text-orange-600 font-extrabold">{tokens.remainingTokens}</span>
                      </>
                    )}
                  </div>
                </div>
                {!tokens.isUnlimitedVip && (
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-300 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    Top Up
                  </span>
                )}
              </button>

              {/* Agent Profile Button */}
              <button
                onClick={onOpenProfile}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  agent.isRegistered
                    ? 'bg-white border-orange-300 text-slate-800 hover:border-orange-500'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-500 text-white hover:from-orange-600 hover:to-amber-600 font-bold'
                }`}
              >
                {agent.agencyLogoUrl ? (
                  <img
                    src={agent.agencyLogoUrl}
                    alt="Logo Agency"
                    className="w-5 h-5 object-contain rounded"
                  />
                ) : (
                  <UserCheck className="w-4 h-4 text-current" />
                )}
                <span className="text-xs font-bold hidden sm:inline">
                  {agent.isRegistered ? agent.name.split(' ')[0] : 'Registrasi Agen'}
                </span>
              </button>

              {/* WhatsApp CTA */}
              <a
                href={waContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.02]"
                title="Hubungi CS WhatsApp: 0896-7368-6625"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden md:inline">WA: 0896-7368-6625</span>
                <span className="md:hidden">WA</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
