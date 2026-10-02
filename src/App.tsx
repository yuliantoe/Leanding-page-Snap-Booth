/**
 * Snapbooth Receipt Studio – Photobooth Struk
 * Website Landing Page Photobooth Struk Thermal
 */

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

import photoFriends from './assets/images/receipt_shot_friends_1790675838718.jpg';
import photoCoffee from './assets/images/receipt_shot_coffee_1790675850965.jpg';
import photoCouple from './assets/images/receipt_shot_couple_1790675861796.jpg';
import kioskBox from './assets/images/snapbooth_kiosk_box_1790730376082.jpg';

import { ReceiptSettings, SoftwarePlan, RentalPackage } from './types';
import { ReceiptPreview } from './components/ReceiptPreview';
import { SubscriptionModal } from './components/SubscriptionModal';
import { RentalModal } from './components/RentalModal';

const initialPhotos = [photoFriends, photoCoffee, photoCouple];

const initialSettings: ReceiptSettings = {
  storeName: 'KR RECEIPT PHOTOBOOTH',
  subTitle: 'SPECIAL MEMORIES RECEIPT',
  date: '2026.09.29',
  time: '10:32',
  orderNo: '#SB-202609',
  filter: 'dither',
  stripCount: 3,
  item1: '4-CUT THERMAL STRIP',
  item2: 'HD DIGITAL QR SYNC',
  item3: 'UNLIMITED GOOD MEMORIES',
  totalPrice: 'Rp 0 (GRATIS)',
  paymentNote: 'SMILE & GOOD VIBES',
  footerMessage: 'THANK YOU FOR VISITING & MAKING MEMORIES!',
  showQr: true,
  contrast: 1.2,
  brightness: 0,
};

const softwarePlans: SoftwarePlan[] = [
  {
    id: 'trial',
    name: 'Masa Trial',
    duration: '3 Hari',
    price: 'GRATIS',
    isTrial: true,
    features: ['Coba seluruh fitur photobooth', 'Koneksi ke printer Bluetooth/USB', 'Tanpa kartu kredit'],
  },
  {
    id: 'mingguan',
    name: 'Mingguan',
    duration: '7 Hari',
    price: 'Rp 25.000',
    features: ['Cocok untuk event bazar & pop-up', 'Custom header & footer struk', 'Export HD photo strip'],
  },
  {
    id: 'bulanan',
    name: 'Bulanan',
    duration: '30 Hari',
    price: 'Rp 49.000',
    badge: 'POPULER',
    badgeType: 'pop',
    features: ['Paling diminati pemilik kafe', 'Unlimited cetak struk sebulan', 'QR digital sync download', 'Priority WhatsApp support'],
  },
  {
    id: '3bulan',
    name: '3 Bulan',
    duration: '90 Hari',
    price: 'Rp 135.000',
    badge: 'HEMAT 8%',
    badgeType: 'ok',
    features: ['Hemat untuk musim liburan/event', 'Semua fitur Pro aktif', 'Multi-device support'],
  },
  {
    id: '6bulan',
    name: '6 Bulan',
    duration: '180 Hari',
    price: 'Rp 270.000',
    features: ['Jaminan update template baru', 'Backup data cloud', 'Layanan bantuan teknis'],
  },
  {
    id: 'tahunan',
    name: 'Tahunan',
    duration: '365 Hari',
    price: 'Rp 480.000',
    badge: 'HEMAT 18%',
    badgeType: 'ok',
    features: ['Harga terbaik untuk usaha permanen', 'Gratis konsultasi setup hardware', 'Lisensi 1 tahun penuh'],
  },
];

const rentalPackages: RentalPackage[] = [
  {
    id: 'harian',
    name: 'Harian',
    duration: '1 Hari',
    price: 'Hubungi kami',
    badge: 'EVENT',
    description: 'Pilihan favorit untuk pesta pernikahan, ulang tahun, dan prom night.',
    includedItems: ['1x Kiosk stand & Ring light', '1x Touchscreen display', '1x Printer Thermal 80mm', 'Free 3 roll thermal paper'],
  },
  {
    id: 'mingguan',
    name: 'Mingguan',
    duration: '7 Hari',
    price: 'Hubungi kami',
    description: 'Cocok untuk pameran seni, booth bazar expo, festival musik, atau pop-up market.',
    includedItems: ['1x Kiosk hardware set', 'Free 10 roll thermal paper', 'Custom branding visual logo', 'Support teknisi online'],
  },
  {
    id: 'bulanan',
    name: 'Bulanan',
    duration: '30 Hari',
    price: 'Hubungi kami',
    badge: 'USAHA',
    description: 'Solusi tanpa investasi modal untuk kafe, resto, distro, dan destinasi wisata.',
    includedItems: ['Full set hardware premium', 'Supply kertas thermal rutin', 'Garansi tukar unit cepat', 'Free update fitur software'],
  },
];

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [photos] = useState<string[]>(initialPhotos);
  const [settings, setSettings] = useState<ReceiptSettings>(initialSettings);

  // Modals state
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SoftwarePlan | null>(softwarePlans[0]);
  const [isRentalOpen, setIsRentalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<RentalPackage | null>(rentalPackages[0]);

  // Sync dark theme class on document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  // Open trial modal
  const openTrialModal = () => {
    setSelectedPlan(softwarePlans[0]); // Trial
    setIsSubscriptionOpen(true);
  };

  // Open paid plan modal
  const openPlanModal = (plan: SoftwarePlan) => {
    setSelectedPlan(plan);
    setIsSubscriptionOpen(true);
  };

  // Open rental modal
  const openRentalModal = (rental: RentalPackage) => {
    setSelectedRental(rental);
    setIsRentalOpen(true);
  };

  return (
    <div className="min-h-screen font-receipt text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="max-w-[1040px] mx-auto px-4 py-7 sm:py-9">
        {/* Navigation Bar - Top Bar Contract */}
        <nav className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          {/* Zone 1: Single element wordmark */}
          <a
            href="/"
            className="font-display font-bold text-lg md:text-xl text-zinc-900 dark:text-white tracking-tight flex items-center gap-1.5"
          >
            <span>📷 SNAPBOOTH</span>
          </a>

          {/* Zone 2: Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-zinc-600 dark:text-zinc-300">
            <a href="#cara" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Cara kerja
            </a>
            <a href="#harga" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Harga
            </a>
            <a href="#sewa" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Sewa alat
            </a>
            <a href="#review" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Ulasan
            </a>
          </div>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              aria-label="Ganti Tema"
              title="Ganti Mode Gelap / Terang"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <a
              href="https://snap-booth-sb.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-[0_3px_0_#b53500] active:translate-y-0.5 active:shadow-[0_1px_0_#b53500] transition-transform cursor-pointer whitespace-nowrap"
            >
              Coba gratis
            </a>
          </div>
        </nav>

        {/* HERO SECTION */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2 pb-12">
          {/* Hero Left Copy */}
          <div className="lg:col-span-6 space-y-5">
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-zinc-950 dark:text-white leading-[1.05] tracking-tight">
              Foto seru,<br />langsung jadi struk.
            </h1>

            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Photobooth gaya struk thermal untuk kafe, event, dan toko Anda. Pengunjung foto, strip 4 frame tercetak otomatis, dan QR foto digital ikut tersimpan.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://snap-booth-sb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold text-sm px-6 py-3.5 rounded-lg shadow-[0_4px_0_#b53500] active:translate-y-1 active:shadow-[0_1px_0_#b53500] transition-transform cursor-pointer"
              >
                <span>Coba gratis 3 hari</span>
              </a>

              <a
                href="#harga"
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-lg border-2 border-zinc-800 dark:border-zinc-200 text-zinc-900 dark:text-white font-bold text-sm hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <span>Lihat harga</span>
              </a>
            </div>

            {/* Quick stats / trust notes */}
            <div className="pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Tanpa Tinta / Ribbon</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Kertas Struk Murah (~Rp 40/foto)</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Support Bluetooth &amp; USB 58/80mm</span>
              </span>
            </div>
          </div>

          {/* Hero Right: Live Interactive Thermal Receipt */}
          <div className="lg:col-span-6 flex justify-center">
            <ReceiptPreview
              settings={settings}
              photoUrls={photos}
              onUpdateFilter={(f) => setSettings({ ...settings, filter: f })}
              className="tilt"
            />
          </div>
        </header>

        {/* SECTION: CARA KERJANYA */}
        <section id="cara" className="mt-20 scroll-mt-20">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight">
              Cara kerjanya
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Dua langkah, tanpa antre lama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1 */}
            <div className="receipt-paper p-6 text-zinc-900 shadow-md">
              <span className="text-xs font-bold text-orange-600 block mb-1 tracking-wide">
                LANGKAH 1
              </span>
              <b className="font-display text-xl block mb-2 text-zinc-900">
                Tekan tombol
              </b>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Kamera menyala dan menghitung mundur. Pengunjung tinggal bergaya di depan layar monitor atau iPad Anda.
              </p>
              <div className="p-3 bg-zinc-100 rounded border border-dashed border-zinc-300 text-[11px] text-zinc-600 flex items-center justify-between">
                <span>⏱ Auto countdown 3 detik tiap pose</span>
                <span className="text-orange-600 font-bold text-[10px]">OTOMATIS</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="receipt-paper p-6 text-zinc-900 shadow-md">
              <span className="text-xs font-bold text-orange-600 block mb-1 tracking-wide">
                LANGKAH 2
              </span>
              <b className="font-display text-xl block mb-2 text-zinc-900">
                Foto otomatis dicetak
              </b>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Strip thermal 4 frame keluar dalam hitungan detik, siap dibawa pulang sebagai kenang-kenangan estetik.
              </p>
              <div className="p-3 bg-zinc-100 rounded border border-dashed border-zinc-300 text-[11px] text-zinc-600 flex items-center justify-between">
                <span>🖨 Kecepatan cetak &lt; 3 detik via Thermal ESC/POS</span>
                <span className="text-emerald-700 font-bold text-[10px]">AUTO CUTTER</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: HARGA SOFTWARE */}
        <section id="harga" className="mt-24 scroll-mt-20">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight">
              Pilih paket langganan software
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Mulai dari uji coba gratis, lalu berlangganan sesuai kebutuhan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Card 1: Masa Trial */}
            <div className="receipt-paper p-6 pb-8 text-zinc-900 shadow-lg">
              <div className="text-center text-[11px] text-zinc-500 tracking-wider">
                — STRUK PAKET —
              </div>
              <h3 className="font-display font-bold text-xl my-1 flex items-center justify-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f5d90a] inline-block shadow-xs" />
                <span>Masa Trial</span>
              </h3>
              <div className="text-center text-[11px] text-zinc-500 mb-2">
                Uji coba dulu, tanpa risiko
              </div>

              <div className="border-t-[1.5px] border-dashed border-zinc-300 my-3" />

              <div className="flex justify-between items-center py-2 text-xs font-bold">
                <span>Trial 3 Hari</span>
                <span className="text-emerald-600 text-sm">GRATIS</span>
              </div>

              <div className="text-[11px] text-zinc-500 py-1 space-y-1 mb-2">
                <p>✓ Akses lengkap ke semua fitur booth</p>
                <p>✓ Uji cetak langsung ke printer thermal Anda</p>
                <p>✓ Tidak perlu input kartu kredit</p>
              </div>

              <div className="border-t-[1.5px] border-dashed border-zinc-300 my-3" />
 
              <a
                href="https://snap-booth-sb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center py-3 bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold text-xs rounded-lg shadow-[0_4px_0_#b53500] active:translate-y-1 active:shadow-none transition-transform cursor-pointer mb-4"
              >
                Mulai trial
              </a>

              <div className="receipt-barcode mb-2" aria-hidden="true" />
              <div className="text-center text-[10px] text-zinc-400">
                SNAPBOOTH OFFICIAL LICENSE 2026
              </div>
            </div>

            {/* Card 2: Langganan Reguler */}
            <div className="receipt-paper p-6 pb-8 text-zinc-900 shadow-lg">
              <div className="text-center text-[11px] text-zinc-500 tracking-wider">
                — STRUK PAKET —
              </div>
              <h3 className="font-display font-bold text-xl my-1 flex items-center justify-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1fb84f] inline-block shadow-xs" />
                <span>Langganan Reguler</span>
              </h3>
              <div className="text-center text-[11px] text-zinc-500 mb-2">
                Pilih durasi, makin lama makin hemat
              </div>

              <div className="border-t-[1.5px] border-dashed border-zinc-300 my-3" />

              {/* Items List */}
              <div className="space-y-1 text-xs">
                {softwarePlans.slice(1).map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => openPlanModal(plan)}
                    className={`flex justify-between items-center py-2 px-2 rounded cursor-pointer transition-colors border-b border-dotted border-zinc-200 ${
                      plan.id === 'bulanan'
                        ? 'bg-[#fff0e8] hover:bg-[#ffe5d6] font-bold -mx-2'
                        : 'hover:bg-zinc-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{plan.name} ({plan.duration})</span>
                      {plan.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold text-white ${
                            plan.badgeType === 'pop' ? 'bg-[#ff4d00]' : 'bg-emerald-600'
                          }`}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </span>
                    <span className="text-zinc-900 font-bold whitespace-nowrap">
                      {plan.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-[1.5px] border-dashed border-zinc-300 my-3" />

              <button
                onClick={() => openPlanModal(softwarePlans[2])} // Open Bulanan by default
                className="w-full py-3 bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold text-xs rounded-lg shadow-[0_4px_0_#b53500] active:translate-y-1 active:shadow-none transition-transform cursor-pointer mb-4"
              >
                Berlangganan
              </button>

              <div className="receipt-barcode mb-2" aria-hidden="true" />
              <div className="text-center text-[10px] text-zinc-400">
                AKTIVASI INSTAN VIA WHATSAPP &amp; DASHBOARD
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SEWA ALAT */}
        <section id="sewa" className="mt-24 scroll-mt-20">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight">
              Pilih paket sewa alat Photobooth Receipt
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Belum mau beli alat? Sewa lengkap dengan perangkat dan printer struk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="receipt-paper p-6 pb-8 text-zinc-900 shadow-lg">
              <div className="text-center text-[11px] text-zinc-500 tracking-wider">
                — STRUK SEWA —
              </div>
              <h3 className="font-display font-bold text-xl text-center my-1">
                Sewa Alat
              </h3>
              <div className="text-center text-[11px] text-zinc-500 mb-2">
                Pilih durasi sesuai acara atau usaha Anda
              </div>

              <div className="border-t-[1.5px] border-dashed border-zinc-300 my-3" />

              <div className="space-y-1 text-xs">
                {rentalPackages.map((rental) => (
                  <div
                    key={rental.id}
                    onClick={() => openRentalModal(rental)}
                    className={`flex justify-between items-center py-2.5 px-2 rounded cursor-pointer transition-colors border-b border-dotted border-zinc-200 ${
                      rental.id === 'bulanan'
                        ? 'bg-[#fff0e8] hover:bg-[#ffe5d6] -mx-2 font-bold'
                        : 'hover:bg-zinc-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{rental.name} ({rental.duration})</span>
                      {rental.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white bg-[#ff4d00]">
                          {rental.badge}
                        </span>
                      )}
                    </span>
                    <span className="text-orange-600 font-bold whitespace-nowrap">
                      {rental.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-[1.5px] border-dashed border-zinc-300 my-3" />

              <button
                onClick={() => openRentalModal(rentalPackages[0])}
                className="w-full py-3 bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold text-xs rounded-lg shadow-[0_4px_0_#b53500] active:translate-y-1 active:shadow-none transition-transform cursor-pointer mb-4"
              >
                Tanya sewa alat
              </button>

              <div className="receipt-barcode mb-2" aria-hidden="true" />
              <div className="text-center text-[10px] text-zinc-400">
                TERSEDIA UNTUK JABODETABEK, BANDUNG, SURABAYA &amp; KOTA LAIN
              </div>
            </div>

            {/* Hardware Showcase Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md aspect-16/9 bg-zinc-900">
              <img
                src={kioskBox}
                alt="Perangkat Kiosk Photobooth SnapBoth Minimalis"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-end text-white">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                  INSTALASI MINIMALIS
                </span>
                <h4 className="font-display font-bold text-lg leading-tight">
                  Cocok Untuk Sudut Kafe, Toko &amp; Acara Pernikahan
                </h4>
                <p className="text-xs text-zinc-300 mt-1 max-w-md">
                  Perangkat ringkas, colok ke stopkontak, langsung bisa foto dan cetak struk tanpa operator rumit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: ULASAN / KATA PENGGUNA */}
        <section id="review" className="mt-24 scroll-mt-20">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight">
              Kata pengguna
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Struk ulasan dari pemilik usaha dan pengunjung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="receipt-paper p-5 pb-7 text-zinc-900 shadow-md">
              <div className="text-orange-500 text-base tracking-widest mb-1.5 font-sans">
                ★★★★★
              </div>
              <p className="text-xs leading-relaxed text-zinc-700 mb-4 italic">
                &ldquo;Antrean di kafe kami jadi ramai lagi. Orang datang cuma untuk foto struk, lalu pesan minum.&rdquo;
              </p>
              <div className="border-t border-dashed border-zinc-300 my-2" />
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span className="font-bold text-zinc-800">Rina, pemilik kafe</span>
                <span>#R-001</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="receipt-paper p-5 pb-7 text-zinc-900 shadow-md">
              <div className="text-orange-500 text-base tracking-widest mb-1.5 font-sans">
                ★★★★★
              </div>
              <p className="text-xs leading-relaxed text-zinc-700 mb-4 italic">
                &ldquo;Dipakai di acara ulang tahun. Semua tamu bawa pulang strip masing-masing dan senang sekali.&rdquo;
              </p>
              <div className="border-t border-dashed border-zinc-300 my-2" />
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span className="font-bold text-zinc-800">Dimas, event organizer</span>
                <span>#R-002</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="receipt-paper p-5 pb-7 text-zinc-900 shadow-md">
              <div className="text-orange-500 text-base tracking-widest mb-1.5 font-sans">
                ★★★★☆
              </div>
              <p className="text-xs leading-relaxed text-zinc-700 mb-4 italic">
                &ldquo;Setup mudah, hasil cetak cepat. Paket bulanan sudah cukup untuk toko kecil kami.&rdquo;
              </p>
              <div className="border-t border-dashed border-zinc-300 my-2" />
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span className="font-bold text-zinc-800">Sari, pemilik toko</span>
                <span>#R-003</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CTA BANNER */}
        <section className="mt-20">
          <div className="text-center bg-[#ff4d00] text-white p-8 sm:p-12 rounded-2xl shadow-xl">
            <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-3">
              Siap cetak kenangan pertama?
            </h2>
            <p className="text-orange-100 text-sm max-w-md mx-auto mb-6">
              Coba gratis 3 hari. Tidak perlu kartu kredit.
            </p>
            <div className="flex justify-center">
              <a
                href="https://snap-booth-sb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-orange-50 text-[#ff4d00] font-bold text-sm px-8 py-3.5 rounded-lg shadow-[0_4px_0_#ffc4ad] active:translate-y-1 active:shadow-none transition-transform cursor-pointer inline-block"
              >
                Coba gratis sekarang
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 space-y-3">
          <div className="flex flex-wrap justify-center gap-6 font-bold text-zinc-600 dark:text-zinc-400">
            <a href="#cara" className="hover:text-orange-600">Cara Kerja</a>
            <a href="#harga" className="hover:text-orange-600">Harga Paket</a>
            <a href="#sewa" className="hover:text-orange-600">Sewa Alat</a>
            <a href="#review" className="hover:text-orange-600">Ulasan</a>
            <a
              href="https://wa.me/6285159746119?text=Halo%20Snapbooth%20Studio"
              target="_blank"
              rel="noreferrer"
              className="hover:text-orange-600 flex items-center gap-1"
            >
              <span>Hubungi CS WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p>© 2026 Snapbooth Receipt Studio · Thank you for visiting &amp; making memories!</p>
        </footer>
      </div>

      {/* MODALS */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        selectedPlan={selectedPlan}
      />

      <RentalModal
        isOpen={isRentalOpen}
        onClose={() => setIsRentalOpen(false)}
        selectedRental={selectedRental}
      />
    </div>
  );
}
