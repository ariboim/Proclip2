import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AdminUserRecord, AdminStats } from './src/types/property.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const USERS_FILE = path.resolve(DATA_DIR, 'users.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed default users if users.json does not exist
const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'usr_1',
    name: 'Rian Pratama',
    whatsapp: '081289007788',
    agencyName: 'Brighton Real Estate',
    agencyLogoUrl: '',
    registeredAt: '2026-10-10 09:30',
    remainingTokens: 9999,
    totalUsed: 28,
    isUnlimitedVip: true,
    isBlocked: false,
    notes: 'Top Agent Surabaya Barat. Pembayaran VIP Unlimited via transfer BCA.',
    lastActive: '2026-10-16 11:20',
  },
  {
    id: 'usr_2',
    name: 'Dewi Kartika',
    whatsapp: '081398765432',
    agencyName: 'ERA Star Bintaro',
    agencyLogoUrl: '',
    registeredAt: '2026-10-12 14:15',
    remainingTokens: 9999,
    totalUsed: 19,
    isUnlimitedVip: true,
    isBlocked: false,
    notes: 'Aktivasi VIP promo launch. Aktif posting di Reels & TikTok.',
    lastActive: '2026-10-15 16:45',
  },
  {
    id: 'usr_3',
    name: 'Anton Wijaya',
    whatsapp: '081234567890',
    agencyName: 'Century 21 Prima',
    agencyLogoUrl: '',
    registeredAt: '2026-10-14 10:00',
    remainingTokens: 3,
    totalUsed: 2,
    isUnlimitedVip: false,
    isBlocked: false,
    notes: 'Pengguna Demo 5 Token. Tertarik upgrade setelah 2 video.',
    lastActive: '2026-10-15 08:30',
  },
  {
    id: 'usr_4',
    name: 'Siti Rahmawati',
    whatsapp: '085612349876',
    agencyName: 'Ray White Priority',
    agencyLogoUrl: '',
    registeredAt: '2026-10-15 17:20',
    remainingTokens: 5,
    totalUsed: 0,
    isUnlimitedVip: false,
    isBlocked: false,
    notes: 'Baru registrasi akun demo. Belum generate video pertama.',
    lastActive: '2026-10-15 17:25',
  },
  {
    id: 'usr_5',
    name: 'Budi Santoso',
    whatsapp: '081876543210',
    agencyName: 'Harcourts Alam Sutera',
    agencyLogoUrl: '',
    registeredAt: '2026-10-11 11:45',
    remainingTokens: 0,
    totalUsed: 7,
    isUnlimitedVip: false,
    isBlocked: true,
    blockedReason: 'Penyalahgunaan konten iklan / klaim palsu',
    notes: 'Diblokir sementara oleh admin.',
    lastActive: '2026-10-13 13:10',
  },
  {
    id: 'usr_6',
    name: 'Fauzan Hakim',
    whatsapp: '089673686625',
    agencyName: 'Independent Property Specialist',
    agencyLogoUrl: '',
    registeredAt: '2026-10-16 08:00',
    remainingTokens: 9999,
    totalUsed: 42,
    isUnlimitedVip: true,
    isBlocked: false,
    notes: 'Super Admin & Lead Partner PropertiClip AI.',
    lastActive: '2026-10-16 14:00',
  },
];

function readUsers(): AdminUserRecord[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_USERS, null, 2), 'utf-8');
      return INITIAL_USERS;
    }
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users file:', err);
    return INITIAL_USERS;
  }
}

function writeUsers(users: AdminUserRecord[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing users file:', err);
  }
}

export const db = {
  getAllUsers(): AdminUserRecord[] {
    return readUsers();
  },

  getUserByWa(whatsapp: string): AdminUserRecord | undefined {
    const clean = whatsapp.replace(/[^0-9]/g, '');
    const users = readUsers();
    return users.find((u) => u.whatsapp.replace(/[^0-9]/g, '') === clean);
  },

  registerOrUpdateUser(data: {
    name: string;
    whatsapp: string;
    agencyName: string;
    agencyLogoUrl?: string;
    remainingTokens?: number;
    isUnlimitedVip?: boolean;
    totalUsed?: number;
  }): AdminUserRecord {
    const users = readUsers();
    const cleanWa = data.whatsapp.replace(/[^0-9]/g, '');
    const existingIndex = users.findIndex((u) => u.whatsapp.replace(/[^0-9]/g, '') === cleanWa);

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    if (existingIndex >= 0) {
      const existing = users[existingIndex];
      const updated: AdminUserRecord = {
        ...existing,
        name: data.name || existing.name,
        agencyName: data.agencyName || existing.agencyName,
        agencyLogoUrl: data.agencyLogoUrl || existing.agencyLogoUrl,
        lastActive: now,
        remainingTokens:
          data.remainingTokens !== undefined ? data.remainingTokens : existing.remainingTokens,
        totalUsed: data.totalUsed !== undefined ? data.totalUsed : existing.totalUsed,
        isUnlimitedVip:
          data.isUnlimitedVip !== undefined ? data.isUnlimitedVip : existing.isUnlimitedVip,
      };
      users[existingIndex] = updated;
      writeUsers(users);
      return updated;
    } else {
      const newUser: AdminUserRecord = {
        id: `usr_${Date.now()}`,
        name: data.name,
        whatsapp: data.whatsapp,
        agencyName: data.agencyName || 'Independent',
        agencyLogoUrl: data.agencyLogoUrl || '',
        registeredAt: now,
        remainingTokens: data.remainingTokens !== undefined ? data.remainingTokens : 5,
        totalUsed: data.totalUsed || 0,
        isUnlimitedVip: data.isUnlimitedVip || false,
        isBlocked: false,
        lastActive: now,
      };
      users.unshift(newUser);
      writeUsers(users);
      return newUser;
    }
  },

  toggleVip(id: string, isVip: boolean): AdminUserRecord | null {
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    users[idx].isUnlimitedVip = isVip;
    if (isVip) {
      users[idx].remainingTokens = 9999;
    } else {
      users[idx].remainingTokens = 5;
    }
    writeUsers(users);
    return users[idx];
  },

  toggleBlock(id: string, isBlocked: boolean, reason?: string): AdminUserRecord | null {
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    users[idx].isBlocked = isBlocked;
    if (isBlocked && reason) {
      users[idx].blockedReason = reason;
    } else if (!isBlocked) {
      delete users[idx].blockedReason;
    }
    writeUsers(users);
    return users[idx];
  },

  updateTokens(id: string, remainingTokens: number): AdminUserRecord | null {
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    users[idx].remainingTokens = remainingTokens;
    writeUsers(users);
    return users[idx];
  },

  addUser(userData: Omit<AdminUserRecord, 'id'>): AdminUserRecord {
    const users = readUsers();
    const newUser: AdminUserRecord = {
      ...userData,
      id: `usr_${Date.now()}`,
    };
    users.unshift(newUser);
    writeUsers(users);
    return newUser;
  },

  deleteUser(id: string): boolean {
    const users = readUsers();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length !== users.length) {
      writeUsers(filtered);
      return true;
    }
    return false;
  },

  getStats(): AdminStats {
    const users = readUsers();
    return {
      totalUsers: users.length,
      totalVip: users.filter((u) => u.isUnlimitedVip).length,
      totalDemo: users.filter((u) => !u.isUnlimitedVip && !u.isBlocked).length,
      totalBlocked: users.filter((u) => u.isBlocked).length,
      totalVideosGenerated: users.reduce((acc, u) => acc + (u.totalUsed || 0), 0),
    };
  },
};
