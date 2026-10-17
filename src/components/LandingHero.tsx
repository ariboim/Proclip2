import { TokenState, AgentProfile } from '../types/property';
import {
  Sparkles,
  Play,
  CheckCircle2,
  TrendingUp,
  Award,
  Video,
  ShieldCheck,
  MessageCircle,
  Clock,
  Smartphone,
  Crown,
} from 'lucide-react';

interface LandingHeroProps {
  tokens: TokenState;
  agent?: AgentProfile;
  onStartGenerator: () => void;
  onOpenUpgrade: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  tokens,
  agent,
  onStartGenerator,
  onOpenUpgrade,
  onOpenProfile,
  onOpenAdmin,
}) => {
  const isRegistered = agent?.isRegistered;
  const waContactUrl =
    'https://wa.me/6289673686625?text=Halo%20Admin%20PropertiClip%2C%20saya%20agen%20properti%20dan%20tertarik%20konsultasi%20layanan%20video%20generator%20properti.';

  return (
    <section id="hero" className="relative pt-6 pb-16 overflow-hidden bg-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-orange-100/40 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Promotional Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-300 text-orange-950 text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
            <span>
              {isRegistered
                ? 'Akun Agen Terverifikasi: 5 Token Demo Siap Digunakan'
                : 'Wajib Daftar Akun: Dapatkan 5 Token Demo Gratis Setelah Registrasi'}
            </span>
          </div>
        </div>

        {/* Main Headings */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight text-slate-900 leading-[1.15]">
            Ubah Foto Rumah Jadi{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600">
              Video Promosi Sinematik Viral
            </span>{' '}
            Sekelas Agency Elit dalam 60 Detik
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tingkatkan respon calon pembeli hingga <strong className="text-orange-600 font-extrabold">340%</strong>. Dilengkapi narasi AI bahasa Indonesia yang luwes (tidak kaku), watermark logo agency Anda, dan subtitle bergerak siap tayang di WhatsApp Status, Reels, TikTok & Facebook.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={isRegistered ? onStartGenerator : onOpenProfile}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black text-sm sm:text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
            >
              <Video className="w-5 h-5 text-white" />
              <span>
                {isRegistered
                  ? 'Mulai Buat Video Promosi (5 Token)'
                  : 'Daftar Agen & Coba Demo Gratis (5 Token)'}
              </span>
            </button>

            <a
              href={waContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>Tanya CS WhatsApp (0896-7368-6625)</span>
            </a>
          </div>

          {/* EYE-CATCHING PROMINENT ADMIN BADGE */}
          <div className="pt-2">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-100 hover:bg-orange-200 border-2 border-orange-400 text-orange-950 transition-all text-xs font-bold cursor-pointer shadow-xs hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Menu Pengelola: Akses Dashboard Admin & Worksheet Database</span>
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/90 shadow-xs">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] block">2.400+</span>
              <span className="text-xs text-slate-600 font-medium">Agen Terdaftar</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/90 shadow-xs">
              <span className="text-xl sm:text-2xl font-black text-orange-600 font-['Outfit'] block">38.000+</span>
              <span className="text-xs text-slate-600 font-medium">Video Diproduksi</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/90 shadow-xs">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 font-['Outfit'] block">1 Token = 1 Video</span>
              <span className="text-xs text-slate-600 font-medium">Sistem Demo Transparan</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/90 shadow-xs">
              <span className="text-xl sm:text-2xl font-black text-sky-600 font-['Outfit'] block">9:16 & 1:1</span>
              <span className="text-xs text-slate-600 font-medium">WA, Reels, TikTok, FB</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div id="features" className="mt-20 pt-12 border-t border-orange-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-slate-900">
              Mengapa Agen Properti Top Beralih ke <span className="text-orange-600">PropertiClip AI</span>?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Dibuat khusus untuk alur kerja agen properti Indonesia. Tanpa perlu skill editing video dan tanpa biaya videografer jutaan rupiah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-orange-50/40 border border-orange-200/80 hover:border-orange-400 hover:bg-orange-50/80 transition-all group shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">
                Narasi AI Realistis (Tidak Kaku)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Naskah copywriting otomatis mengubah spesifikasi rumah (LT, LB, KT, KM, SHM) menjadi kalimat penjualan luwes yang memikat rasa bangga dan urgensi pembeli.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-orange-50/40 border border-orange-200/80 hover:border-orange-400 hover:bg-orange-50/80 transition-all group shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">
                Watermark Logo Agency & WA Agen
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Upload logo kantor (Brighton, ERA, Ray White, Century 21, dll). Logo otomatis menempel elegan di sudut video bersama nomor WhatsApp dan nama Anda.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-orange-50/40 border border-orange-200/80 hover:border-orange-400 hover:bg-orange-50/80 transition-all group shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">
                Pilihan Durasi & Multi-Platform
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pilih 15 detik (cepat untuk Status WA), 30 detik (viral di Reels & TikTok), atau 60 detik (full tour Facebook). Format 9:16 vertikal dan 1:1 feed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
