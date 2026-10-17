import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, MessageCircle, Quote } from 'lucide-react';

export const TestimonialsFAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      name: 'Rian Pratama',
      role: 'Principal Agent, Brighton Real Estate',
      city: 'Surabaya Barat',
      quote:
        'Dulu butuh waktu 3 jam plus sewa orang untuk edit video 1 rumah. Sekarang tinggal upload foto depan dan dalam, 1 menit video jadi lengkap narasi audio luwes dan logo kantor. Status WA saya jadi ramai buyer tanya survey!',
      rating: 5,
      avatar: 'RP',
    },
    {
      name: 'Dewi Kartika',
      role: 'Marketing Associate, ERA Star',
      city: 'Bintaro, Tangerang Selatan',
      quote:
        'Narasinya beneran nggak kaku! Kata-katanya persuasif banget, kayak copywriter profesional yang ngomong. Pas saya posting di TikTok langsung tembus 18.000 views dan dapat 3 buyer prospek.',
      rating: 5,
      avatar: 'DK',
    },
    {
      name: 'Anton Wijaya',
      role: 'Senior Broker, Century 21',
      city: 'Jakarta Barat',
      quote:
        'Fitur edit videonya juara! Sebelum download kita bisa sesuaikan harga, naskah kalimat, dan volume lagu. Token demonya sangat membantu buat tes awal, langsung upgrade ke VIP Unlimited.',
      rating: 5,
      avatar: 'AW',
    },
  ];

  const faqs = [
    {
      q: 'Bagaimana cara kerja sistem demo 5 token?',
      a: 'Setiap agen yang membuka aplikasi otomatis mendapatkan 5 token demo gratis. 1 token digunakan untuk menghasilkan 1 video promosi lengkap dengan narasi AI dan logo agency. Setelah 5 token habis, Anda dapat melakukan upgrade ke Unlimited Token VIP.',
    },
    {
      q: 'Bagaimana cara upgrade ke Unlimited Token VIP?',
      a: 'Sangat mudah! Cukup klik tombol Hubungi WhatsApp di nomor 089673686625. Tim support kami akan langsung mengaktifkan akun VIP Unlimited Anda dalam hitungan menit.',
    },
    {
      q: 'Apakah suara narasinya terdengar kaku seperti robot?',
      a: 'Sama sekali tidak! PropertiClip AI menggunakan model AI bahasa Indonesia terbaru yang dirancang khusus dengan formula copywriting hipnotik properti. Intonasi bicaranya ramah, antusias, dan menjual selayaknya agen properti profesional.',
    },
    {
      q: 'Apakah video ini cocok untuk Status WA, Reels, TikTok dan Facebook?',
      a: 'Ya, tepat sekali! Kami menyediakan opsi rasio 9:16 vertikal (standar emas Status WhatsApp, Instagram Reels, TikTok, YouTube Shorts) dan 1:1 square (Facebook feed & IG post). Durasi bisa Anda pilih: 15 detik, 30 detik, atau 60 detik.',
    },
    {
      q: 'Bisakah saya mengedit video sebelum mengunduhnya?',
      a: 'Tentu bisa! Di Studio Editor, Anda dapat mengedit teks naskah narasi, mengganti pilihan musik latar, mengatur volume suara vs lagu, mengubah posisi dan ukuran logo agency, hingga mengganti warna tema subtitle karaoke.',
    },
  ];

  return (
    <section id="faq" className="py-20 border-t border-orange-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-2">
            Kisah Sukses Agen
          </span>
          <h2 className="text-3xl font-extrabold font-['Outfit'] text-slate-900">
            Dipercaya Oleh Ribuan Agen Properti Seluruh Indonesia
          </h2>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-orange-50/40 border border-orange-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-orange-200/70">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {t.role} • {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-2">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-slate-900">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-orange-50/50 border border-orange-200 overflow-hidden transition-colors shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-orange-600 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-orange-200/60 leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
