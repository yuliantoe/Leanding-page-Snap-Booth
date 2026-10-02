import React, { useState } from 'react';
import { X, Check, ShieldCheck, KeyRound, MessageCircle, Copy, Sparkles, ArrowRight } from 'lucide-react';
import { SoftwarePlan } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: SoftwarePlan | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isActivated, setIsActivated] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen || !selectedPlan) return null;

  const handleActivateTrial = (e: React.FormEvent) => {
    e.preventDefault();
    const generated = `SB-${selectedPlan.isTrial ? 'TRIAL' : 'PRO'}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}-2026`;
    setLicenseKey(generated);
    setIsActivated(true);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // WhatsApp redirect for direct Indonesian purchase
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Halo Admin Snapbooth Studio! 👋\n\nSaya tertarik untuk berlangganan software Photobooth Struk:\n- Paket: ${selectedPlan.name} (${selectedPlan.duration})\n- Harga: ${selectedPlan.price}\n- Nama Usaha/Event: ${businessName || '-'}\n- No. Kontak: ${contactPhone || '-'}\n\nMohon info panduan aktivasi dan metode pembayaran. Terima kasih!`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <span className="text-[11px] text-orange-600 font-bold tracking-wider uppercase">
              {selectedPlan.isTrial ? 'AKTIVASI TRIAL GRATIS' : 'LANGGANAN SOFTWARE'}
            </span>
            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
              {selectedPlan.name} ({selectedPlan.duration})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isActivated ? (
            <div>
              {/* Plan highlight receipt pill */}
              <div className="receipt-paper p-4 mb-5 border border-zinc-200 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-zinc-800">PAKET TERPILIH:</span>
                  <span className="text-orange-600 font-bold text-sm">{selectedPlan.price}</span>
                </div>
                <div className="text-[11px] text-zinc-500">
                  Durasi: {selectedPlan.duration} · Support Printer Bluetooth & USB 58mm/80mm
                </div>
                <div className="border-t border-dashed border-zinc-300 my-2" />
                <ul className="space-y-1 text-zinc-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Strip foto 3 & 4 cut otomatis tercetak</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dithering thermal monochrome 1-bit jernih</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kustom nama toko, logo & pesan footer struk</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fitur sinkronisasi QR digital photo download</span>
                  </li>
                </ul>
              </div>

              {selectedPlan.isTrial ? (
                /* Free Trial Form */
                <form onSubmit={handleActivateTrial} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Nama Toko / Acara Anda
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kopi Sudut Temu / Event Bazar"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      No. WhatsApp Aktif (untuk lisensi)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812xxxxxxx"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    * Trial 3 hari langsung aktif seketika tanpa perlu kartu kredit atau pembayaran awal.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold text-xs rounded-lg shadow-[0_4px_0_#b53500] active:translate-y-1 active:shadow-none transition-transform flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Aktifkan Masa Trial 3 Hari Sekarang</span>
                  </button>
                </form>
              ) : (
                /* Paid Subscription Actions */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Nama Usaha / Penyelenggara
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kafe Melati / Dimas EO"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={handleWhatsAppOrder}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none transition-transform flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order via WhatsApp CS (Aktivasi Cepat)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleActivateTrial}
                      className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Simulasi Bayar Instan (QRIS / Virtual Account)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Activation Success Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                  Aktivasi Berhasil!
                </h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Paket <b>{selectedPlan.name}</b> telah terhubung. Simpan kode lisensi Anda berikut:
                </p>
              </div>

              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                  <KeyRound className="w-4 h-4" />
                  <span className="tracking-wider">{licenseKey}</span>
                </div>
                <button
                  onClick={handleCopyKey}
                  className="px-2.5 py-1 text-xs bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded border border-zinc-200 dark:border-zinc-600 flex items-center gap-1 shadow-sm"
                >
                  {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>

              <div className="text-[11px] text-zinc-500 text-left bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg space-y-1">
                <p>✓ Status: <b>Aktif (Siap Pakai)</b></p>
                <p>✓ Kompatibel printer: Bluetooth / USB ESC/POS 58mm & 80mm</p>
                <p>✓ Dapat langsung digunakan di browser laptop, tablet, atau smartphone.</p>
              </div>

              <a
                href="https://snap-booth-sb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs rounded-lg hover:opacity-90"
              >
                Buka Web Photobooth (snap-booth-sb.vercel.app)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
