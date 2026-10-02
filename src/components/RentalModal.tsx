import React, { useState } from 'react';
import { X, Check, Calculator, Calendar, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { RentalPackage } from '../types';

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRental: RentalPackage | null;
}

export const RentalModal: React.FC<RentalModalProps> = ({
  isOpen,
  onClose,
  selectedRental,
}) => {
  const [eventType, setEventType] = useState('Event / Ulang Tahun');
  const [city, setCity] = useState('Jabodetabek');
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [needOperator, setNeedOperator] = useState(true);
  const [paperRolls, setPaperRolls] = useState(5);

  if (!isOpen || !selectedRental) return null;

  // Estimate price calculation for Indonesian market
  const calculateEstimate = () => {
    let base = 1200000; // default 1 day
    if (selectedRental.id === 'mingguan') base = 3500000;
    if (selectedRental.id === 'bulanan') base = 6500000;

    let addon = 0;
    if (needOperator && selectedRental.id === 'harian') addon += 300000;
    if (paperRolls > 5) addon += (paperRolls - 5) * 25000;

    return (base + addon).toLocaleString('id-ID');
  };

  const handleWhatsAppBooking = () => {
    const text = encodeURIComponent(
      `Halo Tim Rental Snapbooth Studio! 👋\n\nSaya ingin menanyakan ketersediaan sewa alat Photobooth Receipt:\n` +
      `- Paket Sewa: ${selectedRental.name} (${selectedRental.duration})\n` +
      `- Jenis Acara: ${eventType}\n` +
      `- Tanggal Acara: ${eventDate}\n` +
      `- Lokasi Kota: ${city}\n` +
      `- Butuh Operator Standby: ${needOperator ? 'Ya' : 'Tidak (Mandiri)'}\n` +
      `- Estimasi Kertas: ${paperRolls} Roll Thermal\n\n` +
      `Apakah jadwal tersebut masih tersedia? Mohon info penawaran resmi. Terima kasih!`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <span className="text-[11px] text-orange-600 font-bold tracking-wider uppercase">
              SEWA ALAT PHOTOBOOTH STRUK
            </span>
            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
              {selectedRental.name} ({selectedRental.duration})
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
        <div className="p-6 space-y-4 text-xs">
          {/* Hardware bundle list */}
          <div className="receipt-paper p-4 border border-zinc-200 text-xs">
            <span className="font-bold text-zinc-800 block mb-1">
              PAKET SUDAH TERMASUK HARDWARE LENGKAP:
            </span>
            <ul className="space-y-1 text-zinc-600 text-[11px]">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1x Kiosk Photobooth Stand Minimalis + Ring Light</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1x Layar Touchscreen + Full License Snapbooth Software</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1x High-Speed Thermal Receipt Printer 80mm (Auto-cutter)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Free Thermal Paper Roll (Cetak tanpa tinta, anti ribet)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Custom Header Logo, Nama Pengantin / Brand Anda</span>
              </li>
            </ul>
          </div>

          {/* Calculator Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span>Tanggal Acara</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Kota Lokasi</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs text-zinc-900 dark:text-white"
              >
                <option value="Jabodetabek">Jabodetabek</option>
                <option value="Bandung">Bandung & Sekitarnya</option>
                <option value="Surabaya">Surabaya & Malang</option>
                <option value="Yogyakarta">Yogyakarta & Solo</option>
                <option value="Semarang">Semarang</option>
                <option value="Bali">Bali (Denpasar/Badung)</option>
                <option value="Kota Lain">Kota Lainnya di Indonesia</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Jenis Acara
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs text-zinc-900 dark:text-white"
              >
                <option value="Wedding / Pernikahan">Wedding / Pernikahan</option>
                <option value="Ulang Tahun / Party">Ulang Tahun / Party</option>
                <option value="Aktivasi Kafe & Resto">Aktivasi Kafe & Resto</option>
                <option value="Pop-Up Store / Bazar">Pop-Up Store / Bazar</option>
                <option value="Corporate / Kantor">Corporate Gathering</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Jumlah Roll Kertas
              </label>
              <select
                value={paperRolls}
                onChange={(e) => setPaperRolls(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs text-zinc-900 dark:text-white"
              >
                <option value={3}>3 Roll (~450 struk)</option>
                <option value={5}>5 Roll (~750 struk) - Rekomendasi</option>
                <option value={10}>10 Roll (~1.500 struk)</option>
                <option value={15}>15 Roll (~2.250 struk)</option>
              </select>
            </div>
          </div>

          {/* Operator Standby checkbox */}
          <div className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            <input
              type="checkbox"
              id="opCheck"
              checked={needOperator}
              onChange={(e) => setNeedOperator(e.target.checked)}
              className="accent-orange-500 w-4 h-4"
            />
            <label htmlFor="opCheck" className="text-[11px] text-zinc-700 dark:text-zinc-300">
              Termasuk 1 Orang Operator Teknisi Standby di Lokasi (+ bantuan setup & refill kertas)
            </label>
          </div>

          {/* Estimated Quote Card */}
          <div className="p-3.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-orange-600 font-bold block uppercase">
                Estimasi Biaya Sewa:
              </span>
              <span className="font-display font-bold text-lg text-zinc-900 dark:text-orange-200">
                Mulai Rp {calculateEstimate()}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 text-right">
              Free Ongkir Jabodetabek*
            </span>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleWhatsAppBooking}
            className="w-full py-3 bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold text-xs rounded-lg shadow-[0_4px_0_#b53500] active:translate-y-1 active:shadow-none transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp untuk Jadwal & Penawaran Resmi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
