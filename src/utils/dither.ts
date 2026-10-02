import { FilterType, ReceiptSettings } from '../types';

/**
 * Applies Floyd-Steinberg dithering or alternative receipt thermal filters to a Canvas.
 */
export function applyThermalFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filterType: FilterType,
  brightness = 0, // -100 to 100
  contrast = 1    // 0.5 to 2.0
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Convert to grayscale with contrast & brightness adjustments
  const grayBuffer = new Float32Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Standard perceptual luminance
    let luma = 0.299 * r + 0.587 * g + 0.114 * b;

    // Apply brightness
    luma += brightness;

    // Apply contrast
    luma = (luma - 128) * contrast + 128;
    luma = Math.max(0, Math.min(255, luma));

    grayBuffer[i / 4] = luma;
  }

  if (filterType === 'dither') {
    // Floyd-Steinberg 1-bit Dithering
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const oldVal = grayBuffer[idx];
        const newVal = oldVal < 128 ? 0 : 255;
        grayBuffer[idx] = newVal;

        const err = oldVal - newVal;

        if (x + 1 < width) {
          grayBuffer[idx + 1] += err * (7 / 16);
        }
        if (x - 1 >= 0 && y + 1 < height) {
          grayBuffer[(y + 1) * width + (x - 1)] += err * (3 / 16);
        }
        if (y + 1 < height) {
          grayBuffer[(y + 1) * width + x] += err * (5 / 16);
        }
        if (x + 1 < width && y + 1 < height) {
          grayBuffer[(y + 1) * width + (x + 1)] += err * (1 / 16);
        }
      }
    }

    // Write back
    for (let i = 0; i < grayBuffer.length; i++) {
      const val = Math.max(0, Math.min(255, grayBuffer[i]));
      const pIdx = i * 4;
      data[pIdx] = val;
      data[pIdx + 1] = val;
      data[pIdx + 2] = val;
      data[pIdx + 3] = 255;
    }
  } else if (filterType === 'halftone') {
    // 4x4 Bayer Matrix for Dot-Matrix Thermal Printer appearance
    const bayer4x4 = [
      [ 0,  8,  2, 10],
      [12,  4, 14,  6],
      [ 3, 11,  1,  9],
      [15,  7, 13,  5]
    ];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const threshold = (bayer4x4[y % 4][x % 4] / 16) * 255;
        const val = grayBuffer[idx] > threshold ? 255 : 20;

        const pIdx = idx * 4;
        data[pIdx] = val;
        data[pIdx + 1] = val;
        data[pIdx + 2] = val;
        data[pIdx + 3] = 255;
      }
    }
  } else if (filterType === 'high-contrast') {
    // Stark black & white threshold
    for (let i = 0; i < grayBuffer.length; i++) {
      const val = grayBuffer[i] > 120 ? 255 : 15;
      const pIdx = i * 4;
      data[pIdx] = val;
      data[pIdx + 1] = val;
      data[pIdx + 2] = val;
      data[pIdx + 3] = 255;
    }
  } else if (filterType === 'sepia') {
    // Warm thermal receipt tint
    for (let i = 0; i < grayBuffer.length; i++) {
      const val = grayBuffer[i];
      const pIdx = i * 4;
      data[pIdx] = Math.min(255, val * 1.05 + 10);
      data[pIdx + 1] = Math.min(255, val * 0.95);
      data[pIdx + 2] = Math.min(255, val * 0.8);
      data[pIdx + 3] = 255;
    }
  } else {
    // Raw grayscale
    for (let i = 0; i < grayBuffer.length; i++) {
      const val = grayBuffer[i];
      const pIdx = i * 4;
      data[pIdx] = val;
      data[pIdx + 1] = val;
      data[pIdx + 2] = val;
      data[pIdx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Creates an image element and loads a source data URL or URL.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Generates an authentic high-resolution thermal receipt image onto an offscreen canvas.
 */
export async function renderFullReceiptToCanvas(
  settings: ReceiptSettings,
  photoUrls: string[]
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 560; // 58-80mm thermal proportion (crisp 2x)
  const padX = 36;
  const contentWidth = width - padX * 2;

  // Calculate dynamic height based on photo count
  const count = Math.min(settings.stripCount, photoUrls.length || 3);
  const frameHeight = Math.round(contentWidth * (4 / 3));
  const estimatedHeight = 520 + count * (frameHeight + 16) + 380;

  canvas.width = width;
  canvas.height = estimatedHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Background Paper (Warm thermal paper color)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, estimatedHeight);

  // Jagged Zigzag Top & Bottom Cut Edge
  const toothWidth = 14;
  const toothHeight = 8;
  const teeth = Math.ceil(width / toothWidth);

  // Top edge teeth
  ctx.fillStyle = '#15151a'; // Matches outer background
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const x = i * toothWidth;
    ctx.moveTo(x, 0);
    ctx.lineTo(x + toothWidth / 2, toothHeight);
    ctx.lineTo(x + toothWidth, 0);
  }
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.fill();

  // Bottom edge teeth
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const x = i * toothWidth;
    ctx.moveTo(x, estimatedHeight);
    ctx.lineTo(x + toothWidth / 2, estimatedHeight - toothHeight);
    ctx.lineTo(x + toothWidth, estimatedHeight);
  }
  ctx.lineTo(width, estimatedHeight);
  ctx.lineTo(0, estimatedHeight);
  ctx.fill();

  // Draw Header Content
  let curY = 36;

  // Star banner
  ctx.fillStyle = '#1c1c22';
  ctx.font = '13px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('★ ★ SNAPBOOTH RECEIPT STUDIO ★ ★', width / 2, curY);

  // Store Brand Title
  curY += 28;
  ctx.font = 'bold 26px "Space Grotesk", sans-serif';
  ctx.fillText(settings.storeName, width / 2, curY);

  // Subtitle
  curY += 20;
  ctx.font = '12px "Space Mono", monospace';
  ctx.fillStyle = '#6f6f7a';
  ctx.fillText(settings.subTitle, width / 2, curY);

  // Dashed Line
  curY += 16;
  drawDashedLine(ctx, padX, curY, width - padX, curY);

  // Date and Time Row
  curY += 20;
  ctx.font = '13px "Space Mono", monospace';
  ctx.fillStyle = '#1c1c22';
  ctx.textAlign = 'left';
  ctx.fillText(`DATE: ${settings.date}`, padX, curY);
  ctx.textAlign = 'right';
  ctx.fillText(`TIME: ${settings.time}`, width - padX, curY);

  // Order Row
  curY += 18;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6f6f7a';
  ctx.font = '12px "Space Mono", monospace';
  ctx.fillText(`ORDER: ${settings.orderNo}`, padX, curY);
  ctx.textAlign = 'right';
  ctx.fillText(`FOR ITEM #01`, width - padX, curY);

  // Dashed Line
  curY += 14;
  drawDashedLine(ctx, padX, curY, width - padX, curY);

  // Strip Indicator
  curY += 18;
  ctx.font = 'bold 12px "Space Mono", monospace';
  ctx.fillStyle = '#ff4d00';
  ctx.textAlign = 'left';
  ctx.fillText('PHOTO PREVIEW STRIP', padX, curY);
  ctx.fillStyle = '#6f6f7a';
  ctx.textAlign = 'right';
  ctx.fillText(`${count}-FRAME THERMAL`, width - padX, curY);

  curY += 12;

  // Draw Photo Frames
  for (let i = 0; i < count; i++) {
    const url = photoUrls[i % photoUrls.length];
    if (url) {
      try {
        const img = await loadImage(url);

        // Frame border
        ctx.strokeStyle = '#c9c9d1';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(padX - 1, curY - 1, contentWidth + 2, frameHeight + 2);
        ctx.setLineDash([]);

        // Create temporary canvas to crop and dither image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = contentWidth;
        tempCanvas.height = frameHeight;
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
          // Object cover crop
          const sWidth = img.width;
          const sHeight = img.height;
          const aspect = sWidth / sHeight;
          const targetAspect = contentWidth / frameHeight;

          let sx = 0, sy = 0, sw = sWidth, sh = sHeight;
          if (aspect > targetAspect) {
            sw = sHeight * targetAspect;
            sx = (sWidth - sw) / 2;
          } else {
            sh = sWidth / targetAspect;
            sy = (sHeight - sh) / 2;
          }

          tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, contentWidth, frameHeight);

          // Apply Filter
          applyThermalFilter(tempCtx, contentWidth, frameHeight, settings.filter, settings.brightness, settings.contrast);

          // Draw onto receipt
          ctx.drawImage(tempCanvas, padX, curY, contentWidth, frameHeight);
        }
      } catch (err) {
        console.error('Failed to load image into receipt canvas:', err);
      }
    }
    curY += frameHeight + 14;
  }

  // Filter & Status
  ctx.font = '12px "Space Mono", monospace';
  ctx.fillStyle = '#6f6f7a';
  ctx.textAlign = 'left';
  ctx.fillText(`FILTER: ${settings.filter.toUpperCase()}`, padX, curY);
  ctx.fillStyle = '#0a8f4d';
  ctx.textAlign = 'right';
  ctx.fillText('AUTO-PRINT: READY', width - padX, curY);

  // Dashed Line
  curY += 14;
  drawDashedLine(ctx, padX, curY, width - padX, curY);

  // Receipt Items Table
  curY += 18;
  ctx.font = '11px "Space Mono", monospace';
  ctx.fillStyle = '#6f6f7a';
  ctx.textAlign = 'left';
  ctx.fillText('ITEM DESCRIPTION', padX, curY);
  ctx.textAlign = 'center';
  ctx.fillText('QTY', width / 2 + 30, curY);
  ctx.textAlign = 'right';
  ctx.fillText('STATUS', width - padX, curY);

  curY += 16;
  ctx.font = '12px "Space Mono", monospace';
  ctx.fillStyle = '#1c1c22';
  ctx.textAlign = 'left';
  ctx.fillText(`01. ${settings.item1}`, padX, curY);
  ctx.textAlign = 'center';
  ctx.fillText('1x', width / 2 + 30, curY);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#0a8f4d';
  ctx.fillText('READY', width - padX, curY);

  curY += 16;
  ctx.fillStyle = '#1c1c22';
  ctx.textAlign = 'left';
  ctx.fillText(`02. ${settings.item2}`, padX, curY);
  ctx.textAlign = 'center';
  ctx.fillText('1x', width / 2 + 30, curY);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#0a8f4d';
  ctx.fillText('SYNCED', width - padX, curY);

  curY += 16;
  ctx.fillStyle = '#1c1c22';
  ctx.textAlign = 'left';
  ctx.fillText(`03. ${settings.item3}`, padX, curY);
  ctx.textAlign = 'center';
  ctx.fillText('∞', width / 2 + 30, curY);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ff4d00';
  ctx.fillText('PRICELESS', width - padX, curY);

  // Dashed Line
  curY += 16;
  drawDashedLine(ctx, padX, curY, width - padX, curY);

  // Total
  curY += 20;
  ctx.font = 'bold 15px "Space Mono", monospace';
  ctx.fillStyle = '#1c1c22';
  ctx.textAlign = 'left';
  ctx.fillText('TOTAL MEMORIES:', padX, curY);
  ctx.fillStyle = '#ff4d00';
  ctx.textAlign = 'right';
  ctx.fillText(settings.totalPrice, width - padX, curY);

  // Payment method
  curY += 18;
  ctx.font = '12px "Space Mono", monospace';
  ctx.fillStyle = '#6f6f7a';
  ctx.textAlign = 'left';
  ctx.fillText('PAYMENT METHOD:', padX, curY);
  ctx.fillStyle = '#1c1c22';
  ctx.textAlign = 'right';
  ctx.fillText(settings.paymentNote, width - padX, curY);

  // Barcode
  curY += 24;
  drawSimulatedBarcode(ctx, padX + 20, curY, contentWidth - 40, 42);

  // Footer Message
  curY += 56;
  ctx.font = '11px "Space Mono", monospace';
  ctx.fillStyle = '#6f6f7a';
  ctx.textAlign = 'center';
  ctx.fillText(settings.footerMessage, width / 2, curY);

  return canvas;
}

function drawDashedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.save();
  ctx.strokeStyle = '#c9c9d1';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawSimulatedBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.fillStyle = '#111111';
  let curX = x;
  const pattern = [2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 2, 1, 3, 2, 1, 3, 4, 1, 2];
  let pIdx = 0;
  let isBar = true;

  while (curX < x + width) {
    const barW = (pattern[pIdx % pattern.length] * 1.5);
    if (isBar) {
      ctx.fillRect(curX, y, Math.min(barW, x + width - curX), height);
    }
    curX += barW;
    isBar = !isBar;
    pIdx++;
  }
}
