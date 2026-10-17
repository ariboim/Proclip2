import React, { useState, useEffect } from 'react';
import {
  AgentProfile,
  PropertyFormData,
  GeneratedVideoScript,
  TokenState,
} from './types/property';
import {
  getStoredAgentProfile,
  getStoredTokenState,
  useOneToken,
  saveTokenState,
} from './utils/storage';
import { SAMPLE_PROPERTIES, getDefaultPhotos, DEFAULT_AGENT_PROFILE } from './utils/sampleData';
import { soundEngine } from './utils/audioSynthesizer';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { PropertyForm } from './components/PropertyForm';
import { VideoStudio } from './components/VideoStudio';
import { AgentProfileModal } from './components/AgentProfileModal';
import { UpgradeModal } from './components/UpgradeModal';
import { PricingSection } from './components/PricingSection';
import { TestimonialsFAQ } from './components/TestimonialsFAQ';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminPinModal } from './components/AdminPinModal';
import { LiveProgressModal } from './components/LiveProgressModal';
import { Bell, CheckCircle2, X, Home as HomeIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.75);
  } catch (e) {
    // Ignore audio errors if blocked
  }
}

// Intelligent Fallback Script Generator tailored to property data with Natural Room Tour Walkthrough style
function generateIntelligentScript(data: PropertyFormData, agent: AgentProfile): GeneratedVideoScript {
  const dur = data.duration || 30;
  const priceDisplay = data.price || 'Harga Spesial Nego';
  const locDisplay = data.location || 'Lokasi Super Strategis';
  const titleDisplay = data.title || 'Rumah Modern Impian';
  const agentWa = agent.whatsapp || '089673686625';

  if (dur === 15) {
    return {
      catchyHeadline: `Room Tour Singkat: ${locDisplay.slice(0, 22)}!`,
      fullScript: `Halo semuanya! Yuk ikut saya intip rumah siap huni di ${locDisplay}. Ruangannya plong, adem banget, ada ${data.bedrooms || '3'} kamar tidur, dan legalitasnya udah SHM aman. Harganya cuma ${priceDisplay}! Yuk langsung hubungi saya, ${agent.name}, buat survey hari ini!`,
      closingCtaText: `Hubungi WhatsApp ${agent.name}: ${agentWa}`,
      highlightBadges: [`Harga ${priceDisplay}`, `LT ${data.landArea || '120'}m²`, `SHM Ready`, `Siap Huni`],
      scenes: [
        {
          sceneIndex: 0,
          photoTarget: 'exterior',
          startSec: 0,
          endSec: 5,
          spokenText: `Halo semuanya! Yuk ikut saya intip rumah siap huni di ${locDisplay}.`,
          screenTitle: titleDisplay,
          screenBadge: `Harga ${priceDisplay}`,
          motionStyle: 'zoom-in',
        },
        {
          sceneIndex: 1,
          photoTarget: 'interior',
          startSec: 5,
          endSec: 10,
          spokenText: `Ruangannya plong dan adem banget, ada ${data.bedrooms || '3'} kamar tidur dan legalitas SHM aman.`,
          screenTitle: 'Ruangan Lapang & Terang',
          screenBadge: `${data.bedrooms || '3'} KT • ${data.bathrooms || '2'} KM`,
          motionStyle: 'pan-right',
        },
        {
          sceneIndex: 2,
          photoTarget: 'cta',
          startSec: 10,
          endSec: 15,
          spokenText: `Harganya cuma ${priceDisplay}! Yuk langsung kontak ${agent.name} buat jadwal survey sekarang juga.`,
          screenTitle: `Hubungi ${agent.name}`,
          screenBadge: `WA: ${agentWa}`,
          motionStyle: 'dramatic-zoom',
        },
      ],
    };
  } else if (dur === 60) {
    return {
      catchyHeadline: `Full Room Tour Eksklusif: ${titleDisplay}`,
      fullScript: `Halo sahabat properti! Welcome to room tour bersama saya, ${agent.name} dari ${agent.agencyName}. Hari ini saya ajak kalian keliling hunian idaman di ${locDisplay}. Dari fasad arsitekturnya yang elegan, kita langsung melangkah ke area ruang keluarga dengan konsep open space plafon tinggi—suasananya adem dan homey banget. Nah, sekarang kita naik ke lantai atas, ada ${data.bedrooms || '4'} kamar tidur yang luas, master bedroom-nya punya pencahayaan alami maksimal dan balkon asri. Dapurnya juga sudah tertata rapi, siap pakai tanpa repot renovasi. Menariknya lagi, legalitas sudah SHM aman dan ada promo spesial ${data.specialPromo || 'Free BPHTB'}. Harganya ${priceDisplay}. Jangan tunggu keduluan, yuk jadwalkan survey sekarang juga lewat WhatsApp saya di ${agentWa}!`,
      closingCtaText: `Survey & Booking Hubungi WhatsApp ${agent.name}: ${agentWa}`,
      highlightBadges: [
        `Harga ${priceDisplay}`,
        `LT ${data.landArea || '120'}m²`,
        `LB ${data.buildingArea || '145'}m²`,
        `${data.bedrooms || '4'} KT`,
        `SHM Ready`,
      ],
      scenes: [
        {
          sceneIndex: 0,
          photoTarget: 'exterior',
          startSec: 0,
          endSec: 12,
          spokenText: `Halo sahabat properti! Welcome to room tour bersama saya, ${agent.name} dari ${agent.agencyName}. Hari ini kita keliling hunian impian di ${locDisplay}.`,
          screenTitle: titleDisplay,
          screenBadge: `Lokasi: ${locDisplay}`,
          motionStyle: 'zoom-in',
        },
        {
          sceneIndex: 1,
          photoTarget: 'living',
          startSec: 12,
          endSec: 25,
          spokenText: `Begitu masuk, kita langsung disambut ruang keluarga open space plafon tinggi. Sirkulasinya segar dan terang alami banget.`,
          screenTitle: 'Ruang Tamu & Keluarga Plafon Tinggi',
          screenBadge: `LT ${data.landArea || '120'}m² • LB ${data.buildingArea || '145'}m²`,
          motionStyle: 'pan-right',
        },
        {
          sceneIndex: 2,
          photoTarget: 'bedroom',
          startSec: 25,
          endSec: 38,
          spokenText: `Di lantai atas ada ${data.bedrooms || '4'} kamar tidur luas. Master bedroom-nya super nyaman bernuansa villa resort.`,
          screenTitle: 'Kamar Tidur Utama Mewah & Asri',
          screenBadge: `${data.bedrooms || '4'} Kamar Tidur Nyaman`,
          motionStyle: 'zoom-out',
        },
        {
          sceneIndex: 3,
          photoTarget: 'kitchen',
          startSec: 38,
          endSec: 48,
          spokenText: `Dapurnya modern siap pakai, ditambah promo istimewa ${data.specialPromo || 'Free BPHTB & Biaya KPR'}.`,
          screenTitle: 'Dapur Modern & Promo Spesial',
          screenBadge: 'Promo Khusus Bulan Ini',
          motionStyle: 'pan-right',
        },
        {
          sceneIndex: 4,
          photoTarget: 'cta',
          startSec: 48,
          endSec: 60,
          spokenText: `Penawaran terbaik ${priceDisplay}. Jangan tunggu keduluan, yuk langsung hubungi WhatsApp ${agent.name} di ${agentWa} buat survey!`,
          screenTitle: `Hubungi ${agent.name}`,
          screenBadge: `WA: ${agentWa}`,
          motionStyle: 'dramatic-zoom',
        },
      ],
    };
  }

  // Default 30s
  return {
    catchyHeadline: `Yuk Room Tour Rumah Idaman di ${locDisplay.slice(0, 24)}!`,
    fullScript: `Halo semuanya! Yuk ikut saya room tour ke rumah modern 2 lantai impian di ${locDisplay}. Begitu masuk dari area carport, kita disambut ruang keluarga berkonsep open space yang adem dan terang berkat pencahayaan alami. Sirkulasinya segar banget, ada ${data.bedrooms || '4'} kamar tidur yang super nyaman, plus dapur modern siap pakai. Legalitasnya udah aman banget, SHM ready, dan ada promo ${data.specialPromo || 'Free BPHTB'}. Harganya sangat bersahabat, ${priceDisplay}. Penasaran mau lihat langsung? Yuk langsung kontak WhatsApp saya, ${agent.name}, di ${agentWa} sekarang juga!`,
    closingCtaText: `Hubungi WhatsApp ${agent.name}: ${agentWa}`,
    highlightBadges: [
      `Harga ${priceDisplay}`,
      `LT ${data.landArea || '120'}m²`,
      `LB ${data.buildingArea || '145'}m²`,
      `${data.bedrooms || '4'} KT`,
      `SHM Ready`,
    ],
    scenes: [
      {
        sceneIndex: 0,
        photoTarget: 'exterior',
        startSec: 0,
        endSec: 8,
        spokenText: `Halo semuanya! Yuk ikut saya room tour ke rumah modern impian di ${locDisplay}.`,
        screenTitle: titleDisplay,
        screenBadge: `Harga ${priceDisplay}`,
        motionStyle: 'zoom-in',
      },
      {
        sceneIndex: 1,
        photoTarget: 'living',
        startSec: 8,
        endSec: 16,
        spokenText: `Begitu masuk, kita langsung disambut ruang keluarga open space yang adem dan terang alami.`,
        screenTitle: 'Ruangan Open Space Plafon Tinggi',
        screenBadge: `LT ${data.landArea || '120'}m² • LB ${data.buildingArea || '145'}m²`,
        motionStyle: 'pan-right',
      },
      {
        sceneIndex: 2,
        photoTarget: 'bedroom',
        startSec: 16,
        endSec: 23,
        spokenText: `Ada ${data.bedrooms || '4'} kamar tidur nyaman, legalitas SHM aman, plus promo ${data.specialPromo || 'Free BPHTB'}.`,
        screenTitle: 'Kenyamanan Hunian Keluarga',
        screenBadge: `${data.bedrooms || '4'} KT • ${data.bathrooms || '3'} KM`,
        motionStyle: 'zoom-out',
      },
      {
        sceneIndex: 3,
        photoTarget: 'cta',
        startSec: 23,
        endSec: 30,
        spokenText: `Harganya bersahabat ${priceDisplay}. Yuk langsung kontak saya, ${agent.name} di ${agentWa} buat survey!`,
        screenTitle: `Hubungi ${agent.name}`,
        screenBadge: `WA: ${agentWa}`,
        motionStyle: 'dramatic-zoom',
      },
    ],
  };
}

export default function App() {
  // Agent profile state
  const [agent, setAgent] = useState<AgentProfile>(DEFAULT_AGENT_PROFILE);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Admin Dashboard Mode state
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  // Token credit state
  const [tokens, setTokens] = useState<TokenState>({
    remainingTokens: 5,
    totalUsed: 0,
    isUnlimitedVip: false,
    isBlocked: false,
  });
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Form & Script state
  const [formData, setFormData] = useState<PropertyFormData>(() => {
    const sample = SAMPLE_PROPERTIES[0];
    const defaultPhotos = getDefaultPhotos();
    return {
      ...sample,
      photos: defaultPhotos,
    };
  });

  const [generatedScript, setGeneratedScript] = useState<GeneratedVideoScript>(() =>
    generateIntelligentScript(SAMPLE_PROPERTIES[0], DEFAULT_AGENT_PROFILE)
  );

  // Studio Mode vs Form Mode
  const [activeView, setActiveView] = useState<'form' | 'studio'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // Page Navigation state ('home' | 'form' | 'studio' | 'pricing')
  const [currentPage, setCurrentPage] = useState<'home' | 'form' | 'studio' | 'pricing'>('home');

  const handleGoHome = () => {
    setCurrentPage('home');
    const el = document.getElementById('hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoPrev = () => {
    if (currentPage === 'pricing') {
      setCurrentPage('studio');
      setActiveView('studio');
      const el = document.getElementById('generator-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (currentPage === 'studio') {
      setCurrentPage('form');
      setActiveView('form');
      const el = document.getElementById('generator-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (currentPage === 'form') {
      handleGoHome();
    }
  };

  const handleGoNext = () => {
    if (currentPage === 'home') {
      setCurrentPage('form');
      setActiveView('form');
      const el = document.getElementById('generator-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (currentPage === 'form') {
      setCurrentPage('studio');
      setActiveView('studio');
      const el = document.getElementById('generator-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (currentPage === 'studio') {
      setCurrentPage('pricing');
      const el = document.getElementById('pricing');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Live Video Progress & Push Notification state
  const [isLiveProgressOpen, setIsLiveProgressOpen] = useState(false);
  const [liveProgressPercent, setLiveProgressPercent] = useState(0);
  const [liveProgressStepIndex, setLiveProgressStepIndex] = useState(0);
  const [liveProgressStatusText, setLiveProgressStatusText] = useState('');
  const [pushNotificationToast, setPushNotificationToast] = useState<string | null>(null);
  const [registrationToast, setRegistrationToast] = useState<string | null>(null);

  // Check live status from server database (VIP activation, Block status, Token updates)
  const checkLiveAgentStatus = async (wa: string) => {
    if (!wa) return;
    try {
      const res = await fetch('/api/user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: wa }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.exists) {
          setTokens((prev) => {
            const updated = {
              ...prev,
              isUnlimitedVip: data.isUnlimitedVip,
              isBlocked: !!data.isBlocked,
              remainingTokens:
                data.isUnlimitedVip ? 9999 : (data.remainingTokens !== undefined ? data.remainingTokens : prev.remainingTokens),
              totalUsed: data.totalUsed !== undefined ? data.totalUsed : prev.totalUsed,
            };
            saveTokenState(updated);
            return updated;
          });
          if (data.isBlocked) {
            setBlockedReason(data.blockedReason || 'Akun ditangguhkan oleh admin');
          } else {
            setBlockedReason(null);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to check live status', e);
    }
  };

  // Initialize from LocalStorage & check server DB
  useEffect(() => {
    const storedProfile = getStoredAgentProfile();
    setAgent(storedProfile);

    const storedTokens = getStoredTokenState();
    setTokens(storedTokens);

    if (storedProfile.whatsapp) {
      checkLiveAgentStatus(storedProfile.whatsapp);
    }
  }, []);

  // Update script whenever agent info changes
  useEffect(() => {
    setGeneratedScript((prev) => ({
      ...prev,
      closingCtaText: `Hubungi WhatsApp ${agent.name}: ${agent.whatsapp || '089673686625'}`,
    }));
    if (agent.whatsapp) {
      checkLiveAgentStatus(agent.whatsapp);
    }
  }, [agent]);

  // Scroll to anchor sections smoothly
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'generator') {
      const el = document.getElementById('generator-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate Video with Gemini AI
  const handleGenerateVideo = async () => {
    // 1. Check if agent is registered - mandatory registration requirement!
    if (!agent.isRegistered) {
      setIsProfileModalOpen(true);
      return;
    }

    // 2. Check if blocked by admin
    if (tokens.isBlocked) {
      alert('Akun Anda saat ini ditangguhkan / diblokir oleh Admin. Silakan hubungi CS di WhatsApp: 0896-7368-6625 untuk aktivasi kembali.');
      return;
    }

    // 3. Check tokens
    const { success, state: updatedTokens } = useOneToken();
    if (!success) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setTokens(updatedTokens);

    // 4. Start Live Progress modal
    setIsLoading(true);
    setIsLiveProgressOpen(true);
    setLiveProgressPercent(14);
    setLiveProgressStepIndex(0);
    setLiveProgressStatusText('Menganalisis foto properti & sudut visual ruangan...');

    try {
      await new Promise((r) => setTimeout(r, 450));
      setLiveProgressPercent(32);
      setLiveProgressStepIndex(1);
      setLiveProgressStatusText('AI Scriptwriting narasi sinematik & hook emosional...');

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: agent.name,
          agencyName: agent.agencyName,
          agentWa: agent.whatsapp,
          propertyType: formData.propertyType,
          title: formData.title,
          location: formData.location,
          price: formData.price,
          landArea: formData.landArea,
          buildingArea: formData.buildingArea,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          carports: formData.carports,
          certificate: formData.certificate,
          features: formData.features,
          specialPromo: formData.specialPromo,
          duration: formData.duration,
          tone: formData.tone,
          platform: formData.platform,
          customPrompt: formData.customDescription,
          photoCount: formData.photos.length,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setGeneratedScript(json.data);
          soundEngine.fetchNaturalVoice(json.data.fullScript, formData.voiceName || 'Kore').catch(() => {});
        } else {
          const fallback = generateIntelligentScript(formData, agent);
          setGeneratedScript(fallback);
          soundEngine.fetchNaturalVoice(fallback.fullScript, formData.voiceName || 'Kore').catch(() => {});
        }
      } else {
        const fallback = generateIntelligentScript(formData, agent);
        setGeneratedScript(fallback);
        soundEngine.fetchNaturalVoice(fallback.fullScript, formData.voiceName || 'Kore').catch(() => {});
      }

      setLiveProgressPercent(58);
      setLiveProgressStepIndex(2);
      setLiveProgressStatusText('Sinkronisasi karakter suara narator AI & audio ducking...');
      await new Promise((r) => setTimeout(r, 450));

      setLiveProgressPercent(78);
      setLiveProgressStepIndex(3);
      setLiveProgressStatusText('Penyusunan efek transisi sinematik & motion camera...');
      await new Promise((r) => setTimeout(r, 450));

      setLiveProgressPercent(92);
      setLiveProgressStepIndex(4);
      setLiveProgressStatusText('Rendering auto-subtitle karaoke & watermark agency...');
      await new Promise((r) => setTimeout(r, 450));

      setLiveProgressPercent(100);
      setLiveProgressStepIndex(5);
      setLiveProgressStatusText('Finalisasi video studio selesai! Membuka pratinjau otomatis...');
      await new Promise((r) => setTimeout(r, 500));

      // Sync updated video count & tokens to server database
      fetch('/api/register-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: agent.name,
          whatsapp: agent.whatsapp,
          agencyName: agent.agencyName,
          agencyLogoUrl: agent.agencyLogoUrl,
          remainingTokens: updatedTokens.remainingTokens,
          isUnlimitedVip: updatedTokens.isUnlimitedVip,
          totalUsed: updatedTokens.totalUsed,
        }),
      }).catch((e) => console.warn('Failed to sync token usage', e));

      // Close live progress modal
      setIsLiveProgressOpen(false);
      setIsLoading(false);

      // Trigger Push Notification & Audio Chime
      playNotificationChime();
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('Video Promosi Selesai! 🎬🎉', {
            body: `Video promosi ${formData.title} telah selesai dibuat! Pratinjau otomatis siap diputar sekarang.`,
            icon: agent.agencyLogoUrl || '/favicon.ico',
          });
        } catch (e) {
          console.warn('Native notification failed', e);
        }
      }

      setPushNotificationToast(`🔔 Video promosi "${formData.title}" telah selesai dibuat! Menampilkan pratinjau otomatis sekarang.`);
      setTimeout(() => setPushNotificationToast(null), 8000);

      // Switch to studio view: video automatically appears in preview before download or share
      setActiveView('studio');
      setCurrentPage('studio');

      window.scrollTo({ top: 320, behavior: 'smooth' });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.warn('Script generation network error, using intelligent fallback', err);
      const fallback = generateIntelligentScript(formData, agent);
      setGeneratedScript(fallback);
      soundEngine.fetchNaturalVoice(fallback.fullScript, formData.voiceName || 'Kore').catch(() => {});
      setIsLiveProgressOpen(false);
      setIsLoading(false);
      setActiveView('studio');
      setCurrentPage('studio');
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  // Regenerate script directly inside Studio Editor
  const handleRegenerateScriptInStudio = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: agent.name,
          agencyName: agent.agencyName,
          agentWa: agent.whatsapp,
          propertyType: formData.propertyType,
          title: formData.title,
          location: formData.location,
          price: formData.price,
          landArea: formData.landArea,
          buildingArea: formData.buildingArea,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          carports: formData.carports,
          certificate: formData.certificate,
          features: formData.features,
          specialPromo: formData.specialPromo,
          duration: formData.duration,
          tone: formData.tone,
          platform: formData.platform,
          customPrompt: formData.customDescription,
          photoCount: formData.photos.length,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setGeneratedScript(json.data);
          soundEngine.fetchNaturalVoice(json.data.fullScript, formData.voiceName || 'Kore').catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Regeneration error', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If Admin Dashboard is active, render the full admin portal
  if (isAdminView) {
    return (
      <AdminDashboard
        onBackToApp={() => setIsAdminView(false)}
        onRefreshCurrentAgentStatus={() => checkLiveAgentStatus(agent.whatsapp)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-orange-500 selection:text-white">
      {/* Top Sticky Navbar with Light Orange (Orange Muda) Navtab and Prev/Home/Next buttons */}
      <Navbar
        agent={agent}
        tokens={tokens}
        currentPage={currentPage}
        onGoHome={handleGoHome}
        onGoPrev={handleGoPrev}
        onGoNext={handleGoNext}
        canGoPrev={currentPage !== 'home'}
        canGoNext={currentPage !== 'pricing'}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        onScrollToSection={(sectionId) => {
          if (sectionId === 'hero') setCurrentPage('home');
          if (sectionId === 'generator') setCurrentPage(activeView === 'studio' ? 'studio' : 'form');
          if (sectionId === 'pricing' || sectionId === 'faq') setCurrentPage('pricing');
          handleScrollToSection(sectionId);
        }}
        onOpenAdmin={() => setIsAdminPinModalOpen(true)}
      />

      {/* Global Blocked Notice Banner if account is blocked by Admin */}
      {tokens.isBlocked && (
        <div className="bg-rose-900/90 border-b border-rose-700/80 text-rose-100 px-4 py-3 text-xs sm:text-sm font-semibold flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <span>
              ⚠️ <strong>PEMBERITAHUAN ADMIN:</strong> Akun agen Anda ({agent.whatsapp}) saat ini berstatus <strong>DIBLOKIR</strong> {blockedReason ? `(${blockedReason})` : ''}. Pembuatan video dinonaktifkan sementara.
            </span>
          </div>
          <a
            href="https://wa.me/6289673686625?text=Halo%20Admin%2C%20akun%20saya%20terblokir%20di%20PropertiClip%20AI%2C%20mohon%20bantuannya."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-white text-rose-900 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors whitespace-nowrap"
          >
            Hubungi Admin (0896-7368-6625)
          </a>
        </div>
      )}

      {/* Global In-App Toast: Registration Success 'registrasi sukses ,silakan buat video sekarang' */}
      {registrationToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4 animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-2xl border-2 border-emerald-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white text-emerald-700 flex items-center justify-center flex-shrink-0 font-black">
                ✓
              </div>
              <div>
                <p className="text-sm font-black capitalize tracking-wide">
                  {registrationToast}
                </p>
                <p className="text-xs text-emerald-100">
                  5 token demo telah aktif. Silakan pilih foto ruangan dan buat video promosi Anda!
                </p>
              </div>
            </div>
            <button
              onClick={() => setRegistrationToast(null)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global In-App Floating Push Notification: Video Finished */}
      {pushNotificationToast && (
        <div className="fixed top-24 right-4 z-50 max-w-md w-full px-4 animate-in slide-in-from-right-4 duration-300 pointer-events-auto">
          <div className="p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white shadow-2xl border-2 border-amber-500/70 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/40">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  PUSH NOTIFIKASI
                </span>
                <p className="text-xs font-bold text-white mt-1">
                  {pushNotificationToast}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPushNotificationToast(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Landing Hero Section */}
        <LandingHero
          tokens={tokens}
          agent={agent}
          onStartGenerator={() => {
            setCurrentPage('form');
            setActiveView('form');
            handleScrollToSection('generator');
          }}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenAdmin={() => setIsAdminPinModalOpen(true)}
        />

        {/* Studio Generator Area */}
        <section id="generator-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {activeView === 'form' ? (
            <PropertyForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleGenerateVideo}
              isLoading={isLoading}
              loadingStep={loadingStep}
              agent={agent}
              tokens={tokens}
              onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />
          ) : (
            <VideoStudio
              script={generatedScript}
              onUpdateScript={setGeneratedScript}
              propertyData={formData}
              onUpdatePropertyData={setFormData}
              agent={agent}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onRegenerateScript={handleRegenerateScriptInStudio}
              isRegenerating={isLoading}
              onBackToForm={() => {
                setActiveView('form');
                setCurrentPage('form');
                const el = document.getElementById('generator-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}
        </section>

        {/* Pricing Plan Section */}
        <PricingSection
          tokens={tokens}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          onStartGenerator={() => {
            setActiveView('form');
            setCurrentPage('form');
            handleScrollToSection('generator');
          }}
        />

        {/* Social Proof Testimonials & FAQ */}
        <TestimonialsFAQ />
      </main>

      {/* Floating Bottom Quick Page Navigation Bar (Orange Muda theme) */}
      <aside aria-label="Navigasi Halaman" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[94%] sm:w-auto px-4 py-2 rounded-2xl bg-orange-100/95 border-2 border-orange-300 shadow-xl backdrop-blur-md flex items-center justify-between sm:justify-center gap-2 sm:gap-3 transition-transform hover:scale-[1.01]">
        {/* Button: Home */}
        <button
          type="button"
          onClick={handleGoHome}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
            currentPage === 'home'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-white hover:bg-orange-50 text-orange-950 border border-orange-200 hover:border-orange-300'
          }`}
          title="Kembali ke Beranda (Home)"
        >
          <HomeIcon className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Button: Previous Page */}
        <button
          type="button"
          onClick={handleGoPrev}
          disabled={currentPage === 'home'}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1 transition-all ${
            currentPage !== 'home'
              ? 'bg-white hover:bg-orange-50 text-orange-950 border border-orange-200 hover:border-orange-300 cursor-pointer shadow-xs'
              : 'bg-orange-100/60 text-orange-400 border border-transparent cursor-not-allowed opacity-50'
          }`}
          title="Halaman Sebelumnya (Previous Page)"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Page</span>
        </button>

        {/* Step Indicator */}
        <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-orange-950 px-2.5 py-1 bg-orange-200/70 rounded-xl border border-orange-300/50">
          <span>
            {currentPage === 'home'
              ? 'Hal 1/4: Beranda'
              : currentPage === 'form'
              ? 'Hal 2/4: Form & Upload'
              : currentPage === 'studio'
              ? 'Hal 3/4: Studio Video'
              : 'Hal 4/4: Paket & FAQ'}
          </span>
        </div>

        {/* Button: Next Page */}
        <button
          type="button"
          onClick={handleGoNext}
          disabled={currentPage === 'pricing'}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1 transition-all ${
            currentPage !== 'pricing'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xs cursor-pointer'
              : 'bg-orange-100/60 text-orange-400 border border-transparent cursor-not-allowed opacity-50'
          }`}
          title="Halaman Berikutnya (Next Page)"
        >
          <span>Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </aside>

      {/* Footer & Floating WhatsApp CTA */}
      <Footer
        onScrollToSection={(id) => {
          if (id === 'hero') setCurrentPage('home');
          if (id === 'generator') setCurrentPage(activeView === 'studio' ? 'studio' : 'form');
          if (id === 'pricing' || id === 'faq') setCurrentPage('pricing');
          handleScrollToSection(id);
        }}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAdmin={() => setIsAdminPinModalOpen(true)}
      />

      {/* Agent Registration & Branding Modal */}
      <AgentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={agent}
        onSaveProfile={(updated) => {
          setAgent(updated);
          checkLiveAgentStatus(updated.whatsapp);
        }}
        onRegistrationSuccess={() => {
          setRegistrationToast('registrasi sukses ,silakan buat video sekarang');
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.5 },
            });
          } catch (e) {}
          setTimeout(() => {
            handleScrollToSection('generator');
          }, 350);
          setTimeout(() => setRegistrationToast(null), 8000);
        }}
      />

      {/* Live Video Generation Progress Modal */}
      <LiveProgressModal
        isOpen={isLiveProgressOpen}
        progressPercent={liveProgressPercent}
        currentStepIndex={liveProgressStepIndex}
        statusText={liveProgressStatusText}
        agentName={agent.name}
        propertyTitle={formData.title}
      />

      {/* VIP Unlimited Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        tokens={tokens}
        onTokensUpdated={(newTokens) => setTokens(newTokens)}
      />

      {/* Admin PIN Authentication Modal */}
      <AdminPinModal
        isOpen={isAdminPinModalOpen}
        onClose={() => setIsAdminPinModalOpen(false)}
        onSuccess={() => setIsAdminView(true)}
      />
    </div>
  );
}
