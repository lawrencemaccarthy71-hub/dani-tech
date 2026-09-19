export type Category = 'all' | 'laptops' | 'iphone' | 'ipad' | 'adapters-hubs';

export type Currency = 'GHS' | 'USD' | 'EUR' | 'GBP';

export interface Product {
  id: string;
  name: string;
  category: 'laptops' | 'iphone' | 'ipad' | 'adapters-hubs';
  categoryLabel: string;
  tier: string;
  priceGhs: number;
  badge?: 'Bestseller' | 'Fast Charge' | 'Top Rated' | 'Essential' | 'New Release';
  badgeColor?: 'secondary' | 'tertiary' | 'primary' | 'outline';
  featureTag: string;
  image: string;
  description: string;
  specs: {
    material: string;
    finish: string;
    compatibility: string;
    dimensions?: string;
    weight?: string;
    warranty: string;
  };
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryZone = 'accra-same-day' | 'accra-standard' | 'greater-ghana';

export interface DeliveryOption {
  id: DeliveryZone;
  name: string;
  description: string;
  priceGhs: number;
  estimatedTime: string;
}

export type MoMoNetwork = 'MTN' | 'TELECEL' | 'AT';

export interface OrderRecord {
  id: string;
  name: string;
  phone: string;
  address: string;
  delivery: DeliveryOption;
  items: CartItem[];
  totalGhs: number;
  placedAt: string; // ISO timestamp
}
