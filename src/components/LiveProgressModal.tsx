import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Film,
  Camera,
  Layers,
  Mic,
  Type,
  Bell,
  Play,
  Zap,
} from 'lucide-react';

export interface ProgressStep {
  id: string;
  label: string;
  detail: string;
  icon: React.ElementType;
}

interface LiveProgressModalProps {
  isOpen: boolean;
  progressPercent: number;
  currentStepIndex: number;
  statusText: string;
  agentName?: string;
  propertyTitle?: string;
}

export const LIVE_PROGRESS_STEPS: ProgressStep[] = [
  {
    id: 'analyze_photos',
    label: 'Analisis Visual Ruangan & Fasad',
    detail: 'Mengekstrak pencahayaan, sudut arsitektur, dan komposisi tiap ruangan.',
    icon: Camera,
  },
  {
    id: 'ai_script',
    label: 'AI Scriptwriting Narasi Sinematik',
    detail: 'Meracik hook 3 detik awal, benefit emosional, dan call-to-action persuasif.',
    icon: Sparkles,
  },
  {
    id: 'audio_ducking',
    label: 'Sinkronisasi Voiceover & Musik Latar',
    detail: 'Mengatur intonasi narator Indonesia dan efek audio ducking dinamis.',
    icon: Mic,
  },
  {
    id: 'cinematic_fx',
    label: 'Penyusunan Efek Transisi & Motion Kamera',
    detail: 'Menerapkan dynamic zoom, pan halus, filter warm luxury, & lens flare.',
    icon: Film,
  },
  {
    id: 'subtitles_branding',
    label: 'Rendering Auto-Subtitle & Watermark Agen',
    detail: 'Menempelkan caption karaoke viral Reels/TikTok dan kontak WhatsApp resmi.',
    icon: Type,
  },
  {
    id: 'final_preview',
    label: 'Finalisasi Pratinjau Video Otomatis',
    detail: 'Video siap dipratinjau otomatis sebelum diunduh atau dibagikan.',
    icon: Zap,
  },
];

export const LiveProgressModal: React.FC<LiveProgressModalProps> = ({
  isOpen,
  progressPercent,
  currentStepIndex,
  statusText,
  agentName,
  propertyTitle,
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/20 blur-[80px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 right-0 w-60 h-60 bg-rose-500/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="relative z-10 text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>LIVE RENDERING STUDIO</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white tracking-tight">
            Membuat Video Promosi Sinematik{dots}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto line-clamp-1">
            {propertyTitle ? `Listing: ${propertyTitle}` : 'Menghasilkan video promosi properti profesional...'}
          </p>
        </div>

        {/* Live Progress Bar & Percentage */}
        <div className="relative z-10 mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              {statusText || 'Sedang memproses naskah dan frame visual...'}
            </span>
            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 font-['Outfit']">
              {Math.min(100, Math.max(0, Math.round(progressPercent)))}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700/60 relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full transition-all duration-300 ease-out shadow-lg shadow-amber-500/50"
              style={{ width: `${Math.min(100, Math.max(3, progressPercent))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>Agen: {agentName || 'Agen Properti'}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Bell className="w-3 h-3 text-amber-400" /> Push notifikasi aktif
            </span>
          </div>
        </div>

        {/* Step-by-Step Live Pipeline List */}
        <div className="relative z-10 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
          {LIVE_PROGRESS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex || progressPercent >= 100;
            const isCurrent = idx === currentStepIndex && progressPercent < 100;
            const isUpcoming = idx > currentStepIndex && progressPercent < 100;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-100 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isCurrent
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <StepIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold truncate ${
                        isCurrent ? 'text-amber-300' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 animate-pulse">
                        Memproses...
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-semibold text-emerald-400">
                        Selesai ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Video akan otomatis langsung muncul di preview saat selesai</span>
          </div>
          <span className="text-amber-400/90 font-medium hidden sm:inline">
            Tanpa Perlu Refresh
          </span>
        </div>
      </div>
    </div>
  );
};
