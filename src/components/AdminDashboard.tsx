import React, { useState, useEffect } from 'react';
import { AdminUserRecord, AdminStats } from '../types/property';
import { WhatsAppSenderModal } from './WhatsAppSenderModal';
import {
  Users,
  Crown,
  Zap,
  ShieldAlert,
  ShieldCheck,
  Video,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  MessageCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Building2,
  ArrowLeft,
  FileSpreadsheet,
  AlertCircle,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  onBackToApp: () => void;
  onRefreshCurrentAgentStatus?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToApp,
  onRefreshCurrentAgentStatus,
}) => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVip: 0,
    totalDemo: 0,
    totalBlocked: 0,
    totalVideosGenerated: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'vip' | 'demo' | 'blocked'>('all');

  // Modals
  const [selectedUserForWa, setSelectedUserForWa] = useState<AdminUserRecord | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<AdminUserRecord | null>(null);
  const [blockReason, setBlockReason] = useState('Penyalahgunaan akun / pelanggaran ketentuan');

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserWa, setNewUserWa] = useState('');
  const [newUserAgency, setNewUserAgency] = useState('Brighton Real Estate');
  const [newUserIsVip, setNewUserIsVip] = useState(false);
  const [newUserTokens, setNewUserTokens] = useState(5);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUsers(json.users || []);
          if (json.stats) setStats(json.stats);
        }
      }
    } catch (e) {
      console.error('Failed to load admin users', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Toggle VIP Unlimited
  const handleToggleVip = async (user: AdminUserRecord) => {
    const targetVip = !user.isUnlimitedVip;
    try {
      const res = await fetch(`/api/admin/users/${user.id}/toggle-vip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVip: targetVip }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? json.user : u))
          );
          if (json.stats) setStats(json.stats);
          showNotification(
            targetVip
              ? `Berhasil mengaktifkan VIP Unlimited untuk ${user.name}!`
              : `Status VIP dinonaktifkan untuk ${user.name}`
          );
          if (targetVip) {
            try {
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            } catch (e) {}
          }
          if (onRefreshCurrentAgentStatus) onRefreshCurrentAgentStatus();
        }
      }
    } catch (e) {
      console.error('Failed to toggle VIP', e);
    }
  };

  // Handle Block / Unblock
  const handleOpenBlockModal = (user: AdminUserRecord) => {
    if (user.isBlocked) {
      // Unblock directly
      handleConfirmUnblock(user);
    } else {
      setUserToBlock(user);
      setIsBlockModalOpen(true);
    }
  };

  const handleConfirmBlock = async () => {
    if (!userToBlock) return;
    try {
      const res = await fetch(`/api/admin/users/${userToBlock.id}/toggle-block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: true, reason: blockReason }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userToBlock.id ? json.user : u))
          );
          if (json.stats) setStats(json.stats);
          showNotification(`Akun ${userToBlock.name} telah diblokir.`);
          setIsBlockModalOpen(false);
          setUserToBlock(null);
          if (onRefreshCurrentAgentStatus) onRefreshCurrentAgentStatus();
        }
      }
    } catch (e) {
      console.error('Failed to block user', e);
    }
  };

  const handleConfirmUnblock = async (user: AdminUserRecord) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/toggle-block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: false }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? json.user : u))
          );
          if (json.stats) setStats(json.stats);
          showNotification(`Blokir akun ${user.name} telah dibuka kembali.`);
          if (onRefreshCurrentAgentStatus) onRefreshCurrentAgentStatus();
        }
      }
    } catch (e) {
      console.error('Failed to unblock user', e);
    }
  };

  // Quick Token Adjust (+1 or -1 or custom)
  const handleAdjustToken = async (user: AdminUserRecord, delta: number) => {
    if (user.isUnlimitedVip) return;
    const newTokens = Math.max(0, user.remainingTokens + delta);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/update-tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remainingTokens: newTokens }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? json.user : u))
          );
          showNotification(`Token ${user.name} diperbarui menjadi ${newTokens}.`);
        }
      }
    } catch (e) {
      console.error('Failed to update tokens', e);
    }
  };

  // Delete User
  const handleDeleteUser = async (user: AdminUserRecord) => {
    if (!confirm(`Yakin ingin menghapus data agen ${user.name} (${user.whatsapp}) dari database?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        fetchUsers();
        showNotification(`Agen ${user.name} berhasil dihapus.`);
      }
    } catch (e) {
      console.error('Failed to delete user', e);
    }
  };

  // Add User Manually
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserWa.trim()) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          whatsapp: newUserWa.trim(),
          agencyName: newUserAgency.trim(),
          isUnlimitedVip: newUserIsVip,
          remainingTokens: newUserIsVip ? 9999 : newUserTokens,
          notes: 'Ditambahkan via Admin Worksheet',
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUsers((prev) => [json.user, ...prev]);
          if (json.stats) setStats(json.stats);
          showNotification(`Agen ${newUserName} berhasil ditambahkan!`);
          setIsAddUserModalOpen(false);
          setNewUserName('');
          setNewUserWa('');
        }
      }
    } catch (e) {
      console.error('Failed to add user', e);
    }
  };

  // Export to CSV / Excel Worksheet
  const handleExportCsv = () => {
    const headers = [
      'ID User',
      'Nama Agen',
      'Nomor WhatsApp',
      'Agency',
      'Tanggal Registrasi',
      'Sisa Token',
      'Total Video',
      'Status VIP Unlimited',
      'Status Blokir',
      'Catatan Admin',
    ];

    const rows = users.map((u) => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.whatsapp}"`,
      `"${u.agencyName.replace(/"/g, '""')}"`,
      u.registeredAt,
      u.isUnlimitedVip ? 'UNLIMITED' : u.remainingTokens,
      u.totalUsed,
      u.isUnlimitedVip ? 'YA (VIP)' : 'DEMO',
      u.isBlocked ? `DIBLOKIR (${u.blockedReason || '-'})` : 'AKTIF',
      `"${(u.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Worksheet_Agen_PropertiClip_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification('Worksheet CSV berhasil diunduh! Siap dibuka di Google Sheets / Excel.');
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.whatsapp.includes(searchTerm) ||
      u.agencyName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'vip') return u.isUnlimitedVip;
    if (statusFilter === 'demo') return !u.isUnlimitedVip && !u.isBlocked;
    if (statusFilter === 'blocked') return u.isBlocked;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToApp}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Kembali ke App Generator"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] text-white">
                  Dashboard Admin & Worksheet Database
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  MASTER CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kontrol penuh database agen, aktivasi token unlimited, blokir/buka blokir, dan kirim WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-semibold transition-all cursor-pointer"
              title="Unduh Tabel Worksheet untuk Google Sheets / Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Worksheet .CSV</span>
            </button>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agen Manual</span>
            </button>

            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* STATS METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Agen</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-2xl font-black text-white font-['Outfit']">{stats.totalUsers}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Database Terdaftar</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
            <div className="flex items-center justify-between text-amber-300 mb-2">
              <span className="text-xs font-bold">VIP Unlimited</span>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-black text-amber-400 font-['Outfit']">{stats.totalVip}</span>
            <span className="text-[10px] text-amber-300/80 block mt-0.5">Akses Tanpa Batas</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Akun Demo</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-black text-slate-200 font-['Outfit']">{stats.totalDemo}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">5 Token Percobaan</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-transparent">
            <div className="flex items-center justify-between text-rose-300 mb-2">
              <span className="text-xs font-bold">Diblokir</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-2xl font-black text-rose-400 font-['Outfit']">{stats.totalBlocked}</span>
            <span className="text-[10px] text-rose-300/80 block mt-0.5">Akses Ditangguhkan</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Video</span>
              <Video className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-emerald-400 font-['Outfit']">{stats.totalVideosGenerated}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Telah Di-generate</span>
          </div>
        </div>

        {/* WORKSHEET TABLE VIEW */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          {/* Controls: Search, Filter, Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama agen, nomor WA, atau nama agency..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {(['all', 'vip', 'demo', 'blocked'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    statusFilter === f
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {f === 'all'
                    ? 'Semua'
                    : f === 'vip'
                    ? 'VIP Unlimited'
                    : f === 'demo'
                    ? 'Demo'
                    : 'Diblokir'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Worksheet Grid */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4"># ID</th>
                  <th className="py-3 px-4">Profil Agen</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4">Agency</th>
                  <th className="py-3 px-4">Tgl Daftar</th>
                  <th className="py-3 px-4 text-center">Sisa Token</th>
                  <th className="py-3 px-4 text-center">Paket</th>
                  <th className="py-3 px-4 text-center">Status Akun</th>
                  <th className="py-3 px-4 text-center">Total Video</th>
                  <th className="py-3 px-4 text-center font-sans font-bold text-amber-400">
                    ⚡ KONTROL PENUH ADMIN
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      Tidak ada data agen yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => {
                    const isVip = u.isUnlimitedVip;
                    const isBlocked = u.isBlocked;

                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isBlocked
                            ? 'bg-rose-950/20 text-rose-200'
                            : isVip
                            ? 'bg-amber-950/10'
                            : ''
                        }`}
                      >
                        {/* ID */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {u.id.replace('usr_', '')}
                        </td>

                        {/* Nama Agen */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{u.name}</span>
                              <span className="text-[10px] text-slate-400">
                                {u.lastActive ? `Aktif: ${u.lastActive.slice(5)}` : '-'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* WhatsApp */}
                        <td className="py-3 px-4">
                          <a
                            href={`https://wa.me/${u.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline font-mono text-xs flex items-center gap-1 font-semibold"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            {u.whatsapp}
                          </a>
                        </td>

                        {/* Agency */}
                        <td className="py-3 px-4">
                          <span className="text-slate-300 font-medium">{u.agencyName}</span>
                        </td>

                        {/* Tgl Daftar */}
                        <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                          {u.registeredAt || '-'}
                        </td>

                        {/* Sisa Token (In-line +/- controls) */}
                        <td className="py-3 px-4 text-center">
                          {isVip ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] border border-amber-500/30">
                              ∞ UNLIMITED
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5">
                              <button
                                onClick={() => handleAdjustToken(u, -1)}
                                className="text-slate-400 hover:text-white px-1 font-bold cursor-pointer"
                                title="Kurangi 1 Token"
                              >
                                -
                              </button>
                              <span className="font-bold text-white px-1">{u.remainingTokens}</span>
                              <button
                                onClick={() => handleAdjustToken(u, 1)}
                                className="text-slate-400 hover:text-white px-1 font-bold cursor-pointer"
                                title="Tambah 1 Token"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Status Paket */}
                        <td className="py-3 px-4 text-center">
                          {isVip ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold tracking-wide">
                              <Crown className="w-3 h-3 text-amber-400" /> VIP UNLIMITED
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                              DEMO (5 TOKEN)
                            </span>
                          )}
                        </td>

                        {/* Status Akun */}
                        <td className="py-3 px-4 text-center">
                          {isBlocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                              <Lock className="w-3 h-3" /> DIBLOKIR
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" /> AKTIF
                            </span>
                          )}
                        </td>

                        {/* Total Video */}
                        <td className="py-3 px-4 text-center font-bold text-slate-200">
                          {u.totalUsed} Video
                        </td>

                        {/* KONTROL PENUH ADMIN (Aksi) */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Tombol Aktivasi VIP Unlimited */}
                            <button
                              onClick={() => handleToggleVip(u)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                isVip
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md font-extrabold'
                              }`}
                              title={isVip ? 'Cabut Akses VIP' : 'Aktivasi Akses VIP Unlimited'}
                            >
                              <Crown className="w-3.5 h-3.5" />
                              <span>{isVip ? 'Batal VIP' : 'Aktivasi VIP'}</span>
                            </button>

                            {/* Tombol Blokir / Buka Blokir */}
                            <button
                              onClick={() => handleOpenBlockModal(u)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                isBlocked
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30'
                              }`}
                              title={isBlocked ? 'Buka Blokir Akun' : 'Blokir Akun Agen'}
                            >
                              {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                              <span>{isBlocked ? 'Buka Blokir' : 'Blokir'}</span>
                            </button>

                            {/* Tombol Kirim WhatsApp */}
                            <button
                              onClick={() => setSelectedUserForWa(u)}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 transition-colors cursor-pointer"
                              title="Kirim Pesan WhatsApp (Aktivasi / Follow-up)"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            {/* Tombol Hapus */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Hapus Agen dari Database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: TAMBAH AGEN MANUAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-xl font-bold font-['Outfit'] text-white mb-1">
              Tambah Agen ke Database
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Data agen akan langsung muncul di worksheet dan dapat diatur status tokennya.
            </p>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap Agen *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Contoh: Surya Pratama, S.E."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={newUserWa}
                  onChange={(e) => setNewUserWa(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kantor Agency
                </label>
                <input
                  type="text"
                  value={newUserAgency}
                  onChange={(e) => setNewUserAgency(e.target.value)}
                  placeholder="Brighton / ERA / Ray White / Century 21"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div>
                  <span className="text-xs font-bold text-amber-400 block">Langsung Aktifkan VIP Unlimited?</span>
                  <span className="text-[10px] text-slate-400">Token otomatis tanpa batas</span>
                </div>
                <input
                  type="checkbox"
                  checked={newUserIsVip}
                  onChange={(e) => setNewUserIsVip(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs"
                >
                  Simpan Agen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI BLOKIR */}
      {isBlockModalOpen && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Outfit'] text-white">
              Blokir Akun {userToBlock.name}?
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Pengguna ini tidak akan bisa membuat video promosi sampai admin membuka blokir.
            </p>

            <div className="space-y-2 mb-5">
              <label className="block text-xs font-semibold text-slate-300">
                Alasan Pemblokiran (Akan terlihat oleh agen):
              </label>
              <textarea
                rows={3}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsBlockModalOpen(false);
                  setUserToBlock(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                Blokir Akun Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KIRIM PESAN WHATSAPP */}
      <WhatsAppSenderModal
        isOpen={!!selectedUserForWa}
        onClose={() => setSelectedUserForWa(null)}
        user={selectedUserForWa}
      />
    </div>
  );
};
