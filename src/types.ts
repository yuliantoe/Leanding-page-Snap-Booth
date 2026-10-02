export type FilterType = 'dither' | 'high-contrast' | 'halftone' | 'sepia' | 'raw';

export interface ReceiptSettings {
  storeName: string;
  subTitle: string;
  date: string;
  time: string;
  orderNo: string;
  filter: FilterType;
  stripCount: 3 | 4;
  item1: string;
  item2: string;
  item3: string;
  totalPrice: string;
  paymentNote: string;
  footerMessage: string;
  showQr: boolean;
  contrast: number; // 0 to 2
  brightness: number; // -100 to 100
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export interface SoftwarePlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  badge?: string;
  badgeType?: 'pop' | 'ok';
  isTrial?: boolean;
  features: string[];
}

export interface RentalPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  badge?: string;
  description: string;
  includedItems: string[];
}
