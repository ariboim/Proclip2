import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Setup JSON body parsing
app.use(express.json({ limit: '25mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

import { db } from './server-db.js';

// Endpoint: AI Script Generator specifically for Indonesian Property Agents
app.post('/api/generate-script', async (req, res) => {
  try {
    const {
      agentName,
      agencyName,
      agentWa,
      propertyType,
      title,
      location,
      price,
      landArea,
      buildingArea,
      bedrooms,
      bathrooms,
      carports,
      certificate,
      features,
      specialPromo,
      duration = 30, // 15, 30, or 60
      tone = 'luxurious', // luxurious, urgency_promo, warm_family, modern_investor
      platform = 'reels_tiktok', // wa_status, reels_tiktok, facebook_feed
      customPrompt = '',
      photoCount = 2,
    } = req.body;

    const wordTarget = duration === 15 ? '35-45 kata' : duration === 30 ? '70-90 kata' : '140-180 kata';

    const systemPrompt = `Anda adalah host room tour properti profesional dan copywriter video real estate terbaik di Indonesia (seperti YouTuber/TikToker tur rumah mewah ternama).
TUGAS UTAMA:
Buatkan naskah voiceover video "NATURAL ROOM TOUR" yang SANGAT ALAMI, luwes, santai, hangat, dan mengalir seperti manusia sungguhan yang sedang berjalan mengajak calon pembeli berkeliling ruangan (bukan suara AI robot atau pembacaan brosur kaku).

PANDUAN GAYA BICARA NATURAL ROOM TOUR:
1. Gaya Bicara Santai & Mengajak Keliling (Walkthrough):
   - Gunakan sapaan akrab: "Halo semuanya!", "Yuk ikut saya room tour...", "Welcome to...", "Nah, sekarang kita masuk ke...".
   - Alur tur mengalir dari luar ke dalam: Fasad depan/carport -> Ruang tamu/keluarga open space -> Kamar tidur & balkon -> Dapur & fasilitas -> Call-to-action kontak.
   - Gunakan kata transisi lisan natural: "Begitu melangkah ke dalam...", "Lihat deh pencahayaannya...", "Suasananya adem dan homey banget ya...", "Keren kan layoutnya...", "Kamar utamanya super lega...", "Cocok banget buat kumpul keluarga tercinta...".
2. BUKAN BACA BROSUR:
   - DILARANG KERAS membaca spesifikasi teknis mentah seperti "Spesifikasi: 3 kamar tidur, 2 kamar mandi, luas tanah 120".
   - Wajib diubah menjadi narasi pengalaman ruang: "Di sini ada 3 kamar tidur yang nyaman banget, plus carport luas gak pake ribet parkir!".
3. Target durasi video: ${duration} detik (sekitar ${wordTarget} dengan jeda intonasi santai dan ekspresif).
4. Format platform: ${platform} (${platform === 'wa_status' ? 'Status WhatsApp - hangat, to the point, visual' : platform === 'reels_tiktok' ? 'Instagram Reels & TikTok - hook 3 detik pertama memikat hati' : 'Facebook & Feed - berbobot, meyakinkan, prospektif'}).
5. Tone gaya: ${tone === 'luxurious' ? 'Room tour mewah, elegan, prestisius, arsitektur modern berkelas' : tone === 'urgency_promo' ? 'Room tour promo terbatas, diskon heboh, kesempatan langka' : tone === 'warm_family' ? 'Room tour hangat ramah anak, nyaman, lingkungan tenang impian keluarga' : 'Room tour potensi investasi, lokasi prima, capital gain tinggi'}.
6. Closing CTA: Ajak penonton dengan ramah segera hubungi WhatsApp ${agentName} (${agencyName}) di nomor ${agentWa || '089673686625'} untuk jadwal survey lokasi bersama agen.`;

    const userPrompt = `Detail Properti:
- Judul Properti: ${title || propertyType || 'Rumah Modern'}
- Tipe/Jenis: ${propertyType || 'Rumah Tinggal'}
- Lokasi: ${location || 'Lokasi Strategis'}
- Harga: ${price || 'Hubungi Kami'}
- Luas Tanah: ${landArea ? landArea + ' m²' : '-'}
- Luas Bangunan: ${buildingArea ? buildingArea + ' m²' : '-'}
- Kamar Tidur: ${bedrooms ? bedrooms + ' KT' : '-'}
- Kamar Mandi: ${bathrooms ? bathrooms + ' KM' : '-'}
- Carport: ${carports ? carports + ' Mobil' : '-'}
- Legalitas: ${certificate || 'SHM Ready'}
- Fasilitas Unggulan: ${features || 'One gate system, bebas banjir, akses strategis'}
- Promo Khusus: ${specialPromo || 'Free konsultasi KPR dan survey lokasi'}
- Catatan Khusus Agen: ${customPrompt || 'Tampilkan keindahan dan kenyamanan properti ini'}
- Jumlah Foto Properti: ${photoCount} foto (eksterior dan interior)
- Agen: ${agentName || 'Agen Properti'}, Agency: ${agencyName || 'Agency Properti'}

Kembalikan output dalam format JSON terstruktur yang membagi video menjadi ${photoCount >= 4 ? photoCount : Math.min(Math.max(3, photoCount), 5)} adegan (scenes) dengan teks narasi, timing awal-akhir (total pas ${duration} detik), teks overlay/badge visual layar, dan caption karaoke per kalimat.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            catchyHeadline: {
              type: Type.STRING,
              description: 'Hook judul headline singkat pemikat (maks 8 kata)',
            },
            fullScript: {
              type: Type.STRING,
              description: 'Naskah lengkap yang diucapkan narator dari awal sampai akhir tanpa potongan teks teknis',
            },
            closingCtaText: {
              type: Type.STRING,
              description: 'Kalimat ajakan penutup hubungi WhatsApp',
            },
            highlightBadges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Daftar 4-6 badge spesifikasi singkat untuk ditampilkan di video (misal: "LT 120m²", "Harga 1,2 M", "SHM Ready")',
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneIndex: { type: Type.INTEGER },
                  photoTarget: {
                    type: Type.STRING,
                    description: 'Rekomendasi jenis foto: exterior, interior, bedrooms, kitchen, atau cta',
                  },
                  startSec: { type: Type.NUMBER },
                  endSec: { type: Type.NUMBER },
                  spokenText: { type: Type.STRING },
                  screenTitle: { type: Type.STRING },
                  screenBadge: { type: Type.STRING },
                  motionStyle: {
                    type: Type.STRING,
                    description: 'Efek kamera: pan-right, zoom-in, zoom-out, tilt-up, dramatic-zoom',
                  },
                },
                required: ['sceneIndex', 'photoTarget', 'startSec', 'endSec', 'spokenText', 'screenTitle', 'screenBadge', 'motionStyle'],
              },
            },
          },
          required: ['catchyHeadline', 'fullScript', 'closingCtaText', 'highlightBadges', 'scenes'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating script:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal membuat naskah video dengan AI',
    });
  }
});

// Endpoint: AI Realistic Text-to-Speech (Gemini 3.8 Flash Lite TTS)
app.post('/api/generate-tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore', stylePrompt = 'Natural, engaging Indonesian real estate consultant' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Text tidak boleh kosong' });
    }

    // Call Gemini 3.8 Flash Lite TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 1000), // safe limit
              speechMetadata: {
                style: stylePrompt,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName, // 'Kore', 'Puck', 'Fenrir', 'Zephyr', 'Charon'
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ success: false, error: 'Tidak ada audio yang dihasilkan oleh model TTS' });
    }

    return res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS generation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal memproses suara AI TTS',
    });
  }
});

// Endpoint: Register or update agent profile
app.post('/api/register-agent', (req, res) => {
  try {
    const { name, whatsapp, agencyName, agencyLogoUrl, remainingTokens, isUnlimitedVip, totalUsed } = req.body;
    if (!name || !whatsapp) {
      return res.status(400).json({ success: false, error: 'Nama dan nomor WhatsApp wajib diisi' });
    }
    const user = db.registerOrUpdateUser({
      name,
      whatsapp,
      agencyName,
      agencyLogoUrl,
      remainingTokens,
      isUnlimitedVip,
      totalUsed,
    });
    return res.json({ success: true, user });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Check agent live status (VIP or Blocked status check)
app.post('/api/user-status', (req, res) => {
  try {
    const { whatsapp } = req.body;
    if (!whatsapp) {
      return res.status(400).json({ success: false, error: 'WhatsApp required' });
    }
    const user = db.getUserByWa(whatsapp);
    if (!user) {
      return res.json({ success: true, exists: false });
    }
    return res.json({
      success: true,
      exists: true,
      isUnlimitedVip: user.isUnlimitedVip,
      isBlocked: user.isBlocked,
      blockedReason: user.blockedReason,
      remainingTokens: user.remainingTokens,
      totalUsed: user.totalUsed,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Get all users and stats for Admin Dashboard Worksheet
app.get('/api/admin/users', (req, res) => {
  try {
    const users = db.getAllUsers();
    const stats = db.getStats();
    return res.json({ success: true, users, stats });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Toggle VIP Unlimited Token
app.post('/api/admin/users/:id/toggle-vip', (req, res) => {
  try {
    const { id } = req.params;
    const { isVip } = req.body;
    const updated = db.toggleVip(id, isVip);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
    }
    return res.json({ success: true, user: updated, stats: db.getStats() });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Toggle Block / Unblock User
app.post('/api/admin/users/:id/toggle-block', (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked, reason } = req.body;
    const updated = db.toggleBlock(id, isBlocked, reason);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
    }
    return res.json({ success: true, user: updated, stats: db.getStats() });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Update Token Balance manually
app.post('/api/admin/users/:id/update-tokens', (req, res) => {
  try {
    const { id } = req.params;
    const { remainingTokens } = req.body;
    const updated = db.updateTokens(id, parseInt(remainingTokens, 10));
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
    }
    return res.json({ success: true, user: updated, stats: db.getStats() });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Add user manually from admin worksheet
app.post('/api/admin/users', (req, res) => {
  try {
    const { name, whatsapp, agencyName, remainingTokens = 5, isUnlimitedVip = false, notes } = req.body;
    if (!name || !whatsapp) {
      return res.status(400).json({ success: false, error: 'Nama dan nomor WhatsApp wajib diisi' });
    }
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const user = db.addUser({
      name,
      whatsapp,
      agencyName: agencyName || 'Independent',
      registeredAt: now,
      remainingTokens: isUnlimitedVip ? 9999 : remainingTokens,
      totalUsed: 0,
      isUnlimitedVip: !!isUnlimitedVip,
      isBlocked: false,
      notes: notes || 'Ditambahkan manual oleh admin',
      lastActive: now,
    });
    return res.json({ success: true, user, stats: db.getStats() });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Delete user
app.delete('/api/admin/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
    }
    return res.json({ success: true, stats: db.getStats() });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Production / Dev Vite handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
