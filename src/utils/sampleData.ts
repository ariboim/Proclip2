import { PropertyFormData, AgentProfile } from '../types/property';

// Helper to create beautiful real estate mock photos via Canvas so they work 100% offline and never fail to load
function createMockPropertyImage(title: string, subtitle: string, bgGradient: [string, string], iconType: 'facade' | 'living' | 'bedroom' | 'kitchen'): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, bgGradient[0]);
  grad.addColorStop(1, bgGradient[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  // Modern Architectural geometric lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 1080; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 300, 1080);
    ctx.stroke();
  }

  // Sunlight / Warm Glow
  const radial = ctx.createRadialGradient(850, 200, 50, 850, 200, 700);
  radial.addColorStop(0, 'rgba(255, 220, 150, 0.35)');
  radial.addColorStop(0.5, 'rgba(255, 180, 80, 0.1)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 1080, 1080);

  // Architectural Building Silhouette or Room Representation
  if (iconType === 'facade') {
    // 2-Story Modern House Shape
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(180, 420, 720, 500);

    // Warm Windows
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 25;
    ctx.fillRect(240, 480, 180, 140);
    ctx.fillRect(480, 480, 200, 140);
    ctx.fillRect(240, 680, 220, 220); // Big glass door
    ctx.shadowBlur = 0;

    // Balcony & wood accents
    ctx.fillStyle = '#b45309';
    ctx.fillRect(460, 650, 360, 30);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(460, 680, 360, 150);

    // Modern Carport & Garden line
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(120, 900, 840, 80);
  } else if (iconType === 'living') {
    // Luxury Living Room sofa & lighting
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(200, 620, 680, 240); // Sofa base
    ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
    ctx.fillRect(240, 560, 600, 120); // Cushions

    // Floor lamp
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(880, 400);
    ctx.lineTo(880, 860);
    ctx.stroke();

    // Warm lamp shade
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(880, 390, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Big Floor-to-ceiling Window
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(150, 200, 450, 380);
  } else if (iconType === 'bedroom') {
    // Bed Headboard
    ctx.fillStyle = '#334155';
    ctx.fillRect(240, 460, 600, 260);
    // Pillows
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(290, 520, 220, 100);
    ctx.fillRect(570, 520, 220, 100);
    // Blanket / Duvet
    ctx.fillStyle = '#64748b';
    ctx.fillRect(240, 640, 600, 280);
  } else {
    // Modern Kitchen Island
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(200, 600, 680, 260); // Marble Island
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(180, 570, 720, 40); // Quartz Top
    // Pendant lights
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 100); ctx.lineTo(350, 340);
    ctx.moveTo(540, 100); ctx.lineTo(540, 340);
    ctx.moveTo(730, 100); ctx.lineTo(730, 340);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(350, 350, 24, 0, Math.PI * 2);
    ctx.arc(540, 350, 24, 0, Math.PI * 2);
    ctx.arc(730, 350, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // High-End Banner Ribbon
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(60, 60, 460, 90);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, 460, 90);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title, 90, 118);

  // Bottom Subtitle Overlay
  ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
  ctx.fillRect(0, 960, 1080, 120);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(subtitle, 60, 1030);

  return canvas.toDataURL('image/jpeg', 0.88);
}

// Default Agent Profile
export const DEFAULT_AGENT_PROFILE: AgentProfile = {
  name: 'Rian Pratama',
  whatsapp: '081289007788',
  agencyName: 'Brighton Real Estate',
  agencyLogoUrl: '', // Will be initialized with preset logo
  isRegistered: false,
};

// Preset Agency Logos for instant 1-click selection
export function createPresetAgencyLogo(name: string, primaryColor: string): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(4, 4, 392, 112, 16);
  ctx.fill();
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Emblem Circle
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(60, 60, 36, 0, Math.PI * 2);
  ctx.fill();

  // Initial letter
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 38px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name.charAt(0).toUpperCase(), 60, 62);

  // Agency Name
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Outfit", sans-serif';
  ctx.fillText(name.slice(0, 14), 115, 52);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PROPERTY ADVISOR', 115, 82);

  return canvas.toDataURL('image/png');
}

// Preset Sample Properties for instant generation
export const SAMPLE_PROPERTIES: PropertyFormData[] = [
  {
    title: 'Rumah Mewah Scandinavian Modern 2 Lantai',
    propertyType: 'Rumah Tapak Cluster Eksklusif',
    location: 'Bintaro Sektor 9, Tangerang Selatan (Dekat Pintu Tol)',
    price: 'Rp 1.850.000.000',
    landArea: '120',
    buildingArea: '145',
    bedrooms: '4',
    bathrooms: '3',
    carports: '2',
    certificate: 'SHM + IMB Siap KPR',
    features: 'One Gate System, Smart Lock Door, CCTV 24 Jam, Bebas Banjir, Dekat Sekolah & Mall',
    specialPromo: 'Free Biaya BPHTB, Subsidi KPR 25 Juta & Bonus Kitchen Set Mewah',
    customDescription: 'Hunian pencahayaan alami maksimal, konsep open space plafon tinggi 4 meter, siap huni!',
    duration: 30,
    aspectRatio: '9:16',
    tone: 'luxurious',
    platform: 'reels_tiktok',
    voiceName: 'Kore',
    photos: [],
  },
  {
    title: 'Villa Tropis View Alam Asri Siap Huni',
    propertyType: 'Villa Resort Eksklusif',
    location: 'Dago Atas, Bandung (Hawanya Sejuk & Asri)',
    price: 'Rp 2.450.000.000',
    landArea: '250',
    buildingArea: '180',
    bedrooms: '3',
    bathrooms: '3',
    carports: '3',
    certificate: 'SHM Hak Milik Murni',
    features: 'Private Infinity Pool, Balkon Panorama Gunung, Halaman Luas, Gazebo Santai',
    specialPromo: 'Diskon Spesial 100 Juta untuk Pembeli Cash Keras Bulan Ini!',
    customDescription: 'Potensi passive income sewa harian Airbnb s/d 35 juta/bulan.',
    duration: 30,
    aspectRatio: '9:16',
    tone: 'modern_investor',
    platform: 'reels_tiktok',
    voiceName: 'Zephyr',
    photos: [],
  },
  {
    title: 'Rumah Minimalis Idaman Keluarga Baru',
    propertyType: 'Cluster Kompak Modern',
    location: 'Grand Wisata, Bekasi Timur (Selangkah ke Stasiun LRT)',
    price: 'Rp 880.000.000',
    landArea: '72',
    buildingArea: '65',
    bedrooms: '3',
    bathrooms: '2',
    carports: '1',
    certificate: 'SHM Lengkap Pecah Unit',
    features: 'Taman Bermain Anak, Keamanan 24 Jam, Row Jalan 8 Meter Lebar',
    specialPromo: 'DP 0%, Cukup Bayar Booking Fee 5 Juta Langsung Akad KPR!',
    customDescription: 'Cicilan ringan mulai 4 jutaan per bulan, sangat cocok untuk pasangan muda.',
    duration: 15,
    aspectRatio: '9:16',
    tone: 'warm_family',
    platform: 'wa_status',
    voiceName: 'Puck',
    photos: [],
  },
];

export function getDefaultPhotos(): { id: string; type: any; label: string; dataUrl: string }[] {
  return [
    {
      id: 'photo_1',
      type: 'exterior',
      label: 'Foto Luar (Tampak Depan Facade)',
      dataUrl: createMockPropertyImage('TAMPAK DEPAN FASAD', 'Desain Modern Scandinavian 2 Lantai', ['#0f172a', '#1e293b'], 'facade'),
    },
    {
      id: 'photo_2',
      type: 'living',
      label: 'Foto Dalam (Ruang Tamu & Keluarga)',
      dataUrl: createMockPropertyImage('RUANG TAMU LUAS', 'Konsep Open Space Plafon Tinggi 4m', ['#1e1b4b', '#312e81'], 'living'),
    },
    {
      id: 'photo_3',
      type: 'bedroom',
      label: 'Foto Dalam (Master Bedroom)',
      dataUrl: createMockPropertyImage('MASTER BEDROOM', 'Kamar Utama Nyaman dengan Kamar Mandi Dalam', ['#1c1917', '#292524'], 'bedroom'),
    },
    {
      id: 'photo_4',
      type: 'kitchen',
      label: 'Foto Dalam (Dapur Modern & Kitchen Set)',
      dataUrl: createMockPropertyImage('DAPUR MINIMALIS', 'Kitchen Set Modern dengan Marmer Mewah', ['#14532d', '#064e3b'], 'kitchen'),
    },
  ];
}
