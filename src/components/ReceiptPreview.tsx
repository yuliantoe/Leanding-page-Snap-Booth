import React, { useState } from 'react';
import { Download, Printer, Sliders, Check, Copy, RefreshCw } from 'lucide-react';
import { ReceiptSettings, FilterType } from '../types';
import { playThermalPrinterSound } from '../utils/sound';
import { renderFullReceiptToCanvas } from '../utils/dither';

interface ReceiptPreviewProps {
  settings: ReceiptSettings;
  photoUrls: string[];
  onUpdateFilter: (filter: FilterType) => void;
  className?: string;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  settings,
  photoUrls,
  onUpdateFilter,
  className = '',
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [localSettings, setLocalSettings] = useState<ReceiptSettings>(settings);

  // Sync settings when props change
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Handle thermal print simulation and actual system print
  const handlePrint = () => {
    playThermalPrinterSound(1600);
    setIsPrinting(true);

    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 400);
  };

  // Download high-resolution PNG of the receipt
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      playThermalPrinterSound(700);
      const canvas = await renderFullReceiptToCanvas(localSettings, photoUrls);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `snapbooth-receipt-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy receipt image to clipboard
  const handleCopy = async () => {
    try {
      setCopied(true);
      const canvas = await renderFullReceiptToCanvas(localSettings, photoUrls);
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        }
      });
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Copy error:', err);
      setCopied(false);
    }
  };

  const activePhotoCount = Math.min(localSettings.stripCount, photoUrls.length || 3);
  const displayPhotos = photoUrls.slice(0, activePhotoCount);

  // Filter CSS class
  const getFilterStyle = (f: FilterType) => {
    switch (f) {
      case 'dither':
        return 'contrast-150 grayscale brightness-95';
      case 'high-contrast':
        return 'contrast-200 grayscale brightness-105';
      case 'halftone':
        return 'contrast-125 grayscale';
      case 'sepia':
        return 'sepia contrast-125 brightness-95';
      case 'raw':
      default:
        return 'grayscale contrast-110';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Control bar on top of the receipt */}
      <div className="flex items-center justify-end mb-3 px-1 text-xs text-slate-500">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 hover:border-orange-400 transition-colors shadow-sm cursor-pointer"
          title="Edit teks struk"
        >
          <Sliders className="w-3 h-3 text-orange-500" />
          <span>Kustom</span>
        </button>
      </div>

      {/* Optional inline config panel */}
      {showConfig && (
        <div className="mb-4 p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-md text-xs space-y-2">
          <div className="flex items-center justify-between font-bold border-b border-zinc-100 dark:border-zinc-700 pb-1">
            <span>Kustomisasi Struk</span>
            <button
              onClick={() => setShowConfig(false)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              Tutup
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-zinc-500 block mb-0.5">Judul Toko / Acara</label>
              <input
                type="text"
                value={localSettings.storeName}
                onChange={(e) => setLocalSettings({ ...localSettings, storeName: e.target.value })}
                className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-0.5">Sub Judul</label>
              <input
                type="text"
                value={localSettings.subTitle}
                onChange={(e) => setLocalSettings({ ...localSettings, subTitle: e.target.value })}
                className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-0.5">Jumlah Frame</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, stripCount: 3 })}
                  className={`flex-1 py-1 rounded text-center border ${
                    localSettings.stripCount === 3
                      ? 'bg-orange-500 text-white border-orange-500 font-bold'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  3 Frame
                </button>
                <button
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, stripCount: 4 })}
                  className={`flex-1 py-1 rounded text-center border ${
                    localSettings.stripCount === 4
                      ? 'bg-orange-500 text-white border-orange-500 font-bold'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  4 Frame
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-0.5">Filter Thermal</label>
              <select
                value={localSettings.filter}
                onChange={(e) => {
                  const val = e.target.value as FilterType;
                  setLocalSettings({ ...localSettings, filter: val });
                  onUpdateFilter(val);
                }}
                className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs"
              >
                <option value="dither">Floyd-Steinberg Dither</option>
                <option value="high-contrast">High Contrast B&W</option>
                <option value="halftone">Dot Matrix Halftone</option>
                <option value="sepia">Vintage Sepia</option>
                <option value="raw">Raw Grayscale</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* THE THERMAL RECEIPT CONTAINER */}
      <div
        id="printable-receipt-area"
        className={`receipt-paper mx-auto w-full max-w-[360px] p-6 pb-9 font-receipt text-zinc-900 transition-all ${
          isPrinting ? 'animate-receipt-feed' : ''
        }`}
        style={{
          boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header Stars */}
        <div className="text-center text-[11px] text-zinc-500 tracking-wider">
          ★ ★ SNAPBOOTH RECEIPT STUDIO ★ ★
        </div>

        {/* Store Name */}
        <h3 className="font-display font-bold text-[24px] text-center my-1.5 leading-tight tracking-tight uppercase">
          {localSettings.storeName}
        </h3>

        {/* Subtitle */}
        <div className="text-center text-[11px] text-zinc-500 uppercase tracking-wide">
          {localSettings.subTitle}
        </div>

        {/* Dashed Divider */}
        <div className="my-3 border-t-[1.5px] border-dashed border-zinc-300 dark:border-zinc-400" />

        {/* Date and Time Row */}
        <div className="flex justify-between text-[12px] font-medium">
          <span>DATE: {localSettings.date}</span>
          <span>TIME: {localSettings.time}</span>
        </div>

        <div className="flex justify-between text-[11px] text-zinc-500 mt-0.5">
          <span>ORDER: {localSettings.orderNo}</span>
          <span>FOR ITEM #01</span>
        </div>

        {/* Dashed Divider */}
        <div className="my-3 border-t-[1.5px] border-dashed border-zinc-300 dark:border-zinc-400" />

        {/* Strip Header */}
        <div className="flex justify-between items-center text-[12px]">
          <span className="font-bold text-orange-600">PHOTO PREVIEW STRIP</span>
          <span className="text-[11px] text-zinc-500">{activePhotoCount}-FRAME THERMAL</span>
        </div>

        {/* The Photos Strip */}
        <div
          className={`grid gap-1.5 p-1.5 my-2.5 border-[1.5px] border-dashed border-zinc-300 dark:border-zinc-400 bg-zinc-50/70`}
          style={{
            gridTemplateColumns: `repeat(${activePhotoCount}, 1fr)`,
          }}
        >
          {displayPhotos.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-3/4 overflow-hidden bg-zinc-200 border border-zinc-200"
            >
              <img
                src={url}
                alt={`Photo frame ${idx + 1}`}
                className={`w-full h-full object-cover select-none ${getFilterStyle(localSettings.filter)}`}
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 text-[8px] bg-black/60 text-white px-1 font-mono rounded">
                0{idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Filter label and status */}
        <div className="flex justify-between text-[11px] mb-3">
          <span className="text-zinc-500">
            FILTER: {localSettings.filter.toUpperCase()} THERMAL
          </span>
          <span className="font-bold text-emerald-600">AUTO-PRINT: READY</span>
        </div>

        {/* Big Print Button on the Receipt */}
        <div className="my-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold text-sm rounded shadow-[0_4px_0_#b53500] active:translate-y-1 active:shadow-[0_1px_0_#b53500] transition-transform cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT PHOTO</span>
          </button>
        </div>

        {/* Dashed Divider */}
        <div className="my-3 border-t-[1.5px] border-dashed border-zinc-300 dark:border-zinc-400" />

        {/* Itemized Table */}
        <div className="text-[11px] text-zinc-500 flex justify-between mb-1">
          <span>ITEM DESCRIPTION</span>
          <span>QTY</span>
          <span>STATUS</span>
        </div>

        <div className="text-[12px] space-y-1">
          <div className="flex justify-between items-center">
            <span>01. {localSettings.item1}</span>
            <span>1x</span>
            <span className="font-bold text-emerald-600">READY</span>
          </div>
          <div className="flex justify-between items-center">
            <span>02. {localSettings.item2}</span>
            <span>1x</span>
            <span className="font-bold text-emerald-600">SYNCED</span>
          </div>
          <div className="flex justify-between items-center">
            <span>03. {localSettings.item3}</span>
            <span>∞</span>
            <span className="font-bold text-orange-600">PRICELESS</span>
          </div>
        </div>

        {/* Dashed Divider */}
        <div className="my-3 border-t-[1.5px] border-dashed border-zinc-300 dark:border-zinc-400" />

        {/* Total Price */}
        <div className="flex justify-between items-center text-sm font-bold">
          <span>TOTAL MEMORIES:</span>
          <span className="text-orange-600 text-[15px]">{localSettings.totalPrice}</span>
        </div>

        <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
          <span>PAYMENT METHOD:</span>
          <span className="text-zinc-800 font-medium">{localSettings.paymentNote}</span>
        </div>

        {/* Barcode Graphic */}
        <div className="receipt-barcode my-3.5" aria-hidden="true" />

        {/* Footer Thank You */}
        <div className="text-center text-[10.5px] text-zinc-500 mt-1">
          {localSettings.footerMessage}
        </div>
      </div>

      {/* Action Buttons Below Receipt */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-100 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm transition-colors cursor-pointer"
        >
          {isDownloading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5 text-zinc-500" />
          )}
          <span>Unduh PNG</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-100 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-500" />
              <span>Salin Gambar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
