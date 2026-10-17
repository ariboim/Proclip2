import React, { useState } from 'react';
import { AdminUserRecord } from '../types/property';
import { X, MessageCircle, Send, Sparkles, Copy, Check } from 'lucide-react';

interface WhatsAppSenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserRecord | null;
}

export const WhatsAppSenderModal: React.FC<WhatsAppSenderModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen || !user) return null;

  const [selectedTemplate, setSelectedTemplate] = useState<'vip_activated' | 'followup_demo' | 'block_notice' | 'custom'>('vip_activated');
  const [customText, setCustomText] = useState('');
  const [copied, setCopied] = useState(false);

  // Clean WhatsApp number
  let rawWa = user.whatsapp.replace(/[^0-9]/g, '');
  if (rawWa.startsWith('0')) {
    rawWa = '62' + rawWa.slice(1);
  } else if (!rawWa.startsWith('62')) {
    rawWa = '62' + rawWa;
  }

  const templates = {
    vip_activated: `Halo Bpk/Ibu ${user.name} (${user.agencyName}),\n\nSelamat! Akun agen properti Anda di *PropertiClip AI* telah resmi diaktifkan menjadi *VIP UNLIMITED TOKEN* 👑.\n\nSekarang Anda bisa membuat video promosi properti sinematik tanpa batas selamanya dengan logo agency & kontak WhatsApp Anda sendiri.\n\nSilakan langsung login dan buat video listing Anda: ${window.location.origin}\n\nSalam sukses closing,\nAdmin PropertiClip AI (WA: 0896-7368-6625)`,
    followup_demo: `Halo Bpk/Ibu ${user.name} dari ${user.agencyName},\n\nBagaimana hasil video promosi properti yang dibuat menggunakan demo PropertiClip AI? Apakah calon buyer di WhatsApp/TikTok sudah mulai respon?\n\nJika butuh bantuan teknis atau ingin upgrade ke *Paket VIP Unlimited Token* tanpa watermark, kami siap membantu.\n\nSalam hangat,\nAdmin PropertiClip AI (WA: 0896-7368-6625)`,
    block_notice: `Halo Bpk/Ibu ${user.name},\n\nPemberitahuan dari Tim Admin PropertiClip AI terkait status akun agen Anda (${user.agencyName}). Saat ini akun Anda ditangguhkan sementara untuk verifikasi data.\n\nSilakan hubungi kami untuk informasi pembukaan blokir akun di 0896-7368-6625. Terima kasih.`,
  };

  const currentMessage = selectedTemplate === 'custom' ? customText : templates[selectedTemplate];

  const handleSendWA = () => {
    const encoded = encodeURIComponent(currentMessage);
    const url = `https://wa.me/${rawWa}?text=${encoded}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <MessageCircle className="w-3.5 h-3.5" />
            Kirim WhatsApp ke Agen
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white">
            Kirim Pesan ke {user.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Nomor WA: <span className="text-emerald-400 font-semibold">{user.whatsapp}</span> ({user.agencyName})
          </p>
        </div>

        {/* Template Selector */}
        <div className="space-y-3 mb-5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Pilih Template Pesan:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'vip_activated', label: '👑 Aktivasi VIP Sukses' },
              { id: 'followup_demo', label: '💬 Follow-up Demo' },
              { id: 'block_notice', label: '⚠️ Notifikasi Blokir' },
              { id: 'custom', label: '✏️ Tulis Bebas' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSelectedTemplate(t.id as any);
                  if (t.id === 'custom' && !customText) {
                    setCustomText(`Halo Bpk/Ibu ${user.name}, `);
                  }
                }}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                  selectedTemplate === t.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview / Editor */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Isi Pesan WhatsApp:
            </label>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
          </div>

          <textarea
            rows={7}
            value={currentMessage}
            onChange={(e) => {
              if (selectedTemplate !== 'custom') setSelectedTemplate('custom');
              setCustomText(e.target.value);
            }}
            className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSendWA}
            className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Buka & Kirim di WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
