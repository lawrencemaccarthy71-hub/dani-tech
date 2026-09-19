import { Product, DeliveryOption } from '../types';

export const USD_EXCHANGE_RATE = 15.5; // 1 USD = 15.5 GHS

export const PRODUCTS: Product[] = [
  {
    id: 'apex-magnetic-ipad-stand',
    name: 'Apex Magnetic iPad Pro Stand',
    category: 'ipad',
    categoryLabel: 'iPad Studio Mount',
    tier: '03 / Studio & Field',
    priceGhs: 850,
    badge: 'Bestseller',
    badgeColor: 'secondary',
    featureTag: 'Accra Express',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNlcOSz8WQ2J2XeFx6EwkELToo98CEHonsbQc_2WNc_gEuaRjpYA51GUuYG_Nd9P-OxRztlqu3JKrZwEyRbUDA7TQChCTaeLI05rvHFrbCqJUplqlmYlMYvf_EEWdu4gSyyFTZEfQTbS6yOzEUFSa3CCVld_X_Yz1bndJASnCc0dsDF9wa8re2wgqRNJXuFw9DXWXjRdpQCbpXTSjyLSHV4TpyWYQP1QI_fEIWfAyIEtbziGjV9bhG',
    description: 'Precision milled aerospace aluminum stand featuring strong neodymium magnetic alignment, dual fluid-damped 360° rotational hinges, and cable pass-through channel.',
    specs: {
      material: '6000-series Anodized Aluminum & Silicone Pads',
      finish: 'Space Grey Matte Anodized',
      compatibility: 'iPad Pro 11", 12.9", 13" (M1/M2/M4), iPad Air 10.9" & 11"',
      dimensions: '240mm x 140mm x 120mm',
      weight: '840g (Weighted base for rock-solid stability)',
      warranty: '1-Year Dani Tech Replacement Guarantee'
    },
    inStock: true
  },
  {
    id: 'titanium-duo-magsafe-dock',
    name: 'Titanium Duo MagSafe Dock',
    category: 'iphone',
    categoryLabel: 'MagSafe Power',
    tier: '02 / Mobile Armour',
    priceGhs: 680,
    badge: 'Fast Charge',
    badgeColor: 'tertiary',
    featureTag: '15W Certified',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv2_-Lzj8EVZcphIpvPqKXg7pjIAyI2va_6XDOKaCit4NTpR-bhF5Tnit2pdeWwIt3OB9CSEkwpJx5odNrWS1mIESzbuyFKxLt_QDxceLVN0hOMlh9SYdQ80FjhgrCH5wF9jLzNsh34yb7h4qfyMrzPuHCpBYuNg6DH_wlaabPuTX3y99X_4tMG5GiYukT-NN0TKcSlKQKcs-20VHnCqlzjuss7D9ul-rf3De1RWtqb7H5mCC2wse5',
    description: 'Dual fast wireless charging station crafted with machined titanium and weighted slate pedestal. Charges iPhone at full 15W MagSafe speed alongside AirPods Pro.',
    specs: {
      material: 'Aircraft-grade Titanium & Slate Stone Base',
      finish: 'Matte Dark Slate & Titanium Edge',
      compatibility: 'iPhone 12 through 16 Pro Max, AirPods Pro 1/2, AirPods 3/4',
      dimensions: '160mm x 90mm x 115mm',
      weight: '520g (One-hand lift-off anti-slip design)',
      warranty: '1-Year Dani Tech Replacement Guarantee'
    },
    inStock: true
  },
  {
    id: 'hyperdrive-8-in-1-dock',
    name: 'HyperDrive 8-in-1 Precision Dock',
    category: 'adapters-hubs',
    categoryLabel: 'Port Expansion',
    tier: '01 / Workspace Heavy',
    priceGhs: 790,
    badge: 'Top Rated',
    badgeColor: 'secondary',
    featureTag: '4K 60Hz',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy49tY7PZL4c382gkezQnPxyJpLadpMpdSZzfwaQTbX-6_jaYFysCmQb1fVpXBTM-vdmnVdkeornryFTvNB_sKa1Yw5CCMYgvCxwM1X9TVl2p30yNHI5a_b0OYQ7i7FGbGiz4aBXAAUsEdC9bcyrUm5Rx8PwONBBqZDuE_3ZV51dxsgnCIaDixMmtD1jQ1x7-hq0gSyHkFbmEDrvdn67aWIM7gZdiEeQYSInx6SoiZGGLDxVogndet',
    description: 'High-bandwidth multiport hub engineered for MacBook Pro and iPad workstation setups. Features 4K60Hz HDMI, 100W Power Delivery pass-through, UHS-II SD/MicroSD, and dual USB 3.2 Gen 2 ports.',
    specs: {
      material: 'Unibody Extruded Aluminum with Thermal Fins',
      finish: 'Space Grey Ceramic Blast',
      compatibility: 'MacBook Pro/Air (M1/M2/M3/M4), iPad Pro/Air USB-C, Windows Thunderbolt/USB-C',
      dimensions: '132mm x 48mm x 16mm',
      weight: '145g',
      warranty: '1-Year Dani Tech Replacement Guarantee'
    },
    inStock: true
  },
  {
    id: 'stealth-100w-braided-cable',
    name: 'Stealth 100W Braided Cable (2m)',
    category: 'adapters-hubs',
    categoryLabel: 'Tough Armored Wire',
    tier: '01 / Workspace Heavy',
    priceGhs: 180,
    badge: 'Essential',
    badgeColor: 'outline',
    featureTag: 'E-Marker Chip',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR8MngI9KDptjbTDFGiE7qZ2q18c_XVLxp2VO3B5XbtJLmC3aRi_5Sw9GZa_Tf7B3KYCXGf3bXoUF5aycx462I5yNcZRNdWE8IAinSfokIVRHyLXSf_2Zb0943KbXJjbsDlmAKuNQKwipJg_xhVbBd5z5GixJGZVLtmG4f5QI7X80Z6R_QoRn4gVCKOTkDiIHYyqeY2lOmQf3U7qtFTSWB1P51-buMSutO9lNjRvxxnbt385QQsD60',
    description: 'Ballistic Kevlar-reinforced double braided USB-C to USB-C cable. Built with high-spec E-Marker smart chipset supporting up to 100W Power Delivery and high-speed data.',
    specs: {
      material: 'Double-braided Ballistic Nylon & Laser-Milled Zinc Shell',
      finish: 'Stealth Obsidian Black',
      compatibility: 'All USB-C MacBooks, iPads, iPhones (15/16 series), and GaN Chargers',
      dimensions: 'Length: 2.0 meters (6.6 ft)',
      weight: '68g',
      warranty: '1-Year Dani Tech Replacement Guarantee'
    },
    inStock: true
  },
  {
    id: 'dani-cnc-laptop-riser',
    name: 'Dani Tech CNC Milled Laptop Riser',
    category: 'laptops',
    categoryLabel: 'Workspace Heavy',
    tier: '01 / Workspace Heavy',
    priceGhs: 540,
    badge: 'New Release',
    badgeColor: 'primary',
    featureTag: 'Ergonomic 18°',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRK0w1HdEi7ZfRIqlK3_pxi9fQ6ifA7lIFjkBtYgMDx7-kopAUeuc4PdXE1LK8H9M7qHAiA1qTzST0x4VQGjnLClRcih0O5LMHBcQR_YWmv5ROPd3Cfbvtv5u8Aagpft2X7NjytV4AqYAOY2w_LAK9rN2r0k3nvuLzAQlRpfqNtWqbs3TDs1dS6GjJvhRgBJHPkiPZ0N3ySDt-jEkma6hAgyXuMdbgaib5fxI0ZDGDHc15MFgGZs-V',
    description: 'Sculpted single-piece CNC milled aluminum riser designed to align your MacBook display to eye level, improve posture, and maximize underside airflow by 42%.',
    specs: {
      material: 'Solid 4mm CNC Cut Aerospace Aluminum Alloy',
      finish: 'Space Grey Bead-Blasted Anodized',
      compatibility: 'Laptops 11" to 17" (MacBook Pro 14/16, MacBook Air 13/15, Dell XPS, ThinkPad)',
      dimensions: '260mm x 225mm x 145mm',
      weight: '980g',
      warranty: '1-Year Dani Tech Replacement Guarantee'
    },
    inStock: true
  },
  {
    id: 'dani-armor-titanium-case',
    name: 'Vanguard Titanium Armor Bumper Case',
    category: 'iphone',
    categoryLabel: 'Mobile Armour',
    tier: '02 / Mobile Armour',
    priceGhs: 360,
    badge: 'Bestseller',
    badgeColor: 'secondary',
    featureTag: 'Grade 5 Ti',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv2_-Lzj8EVZcphIpvPqKXg7pjIAyI2va_6XDOKaCit4NTpR-bhF5Tnit2pdeWwIt3OB9CSEkwpJx5odNrWS1mIESzbuyFKxLt_QDxceLVN0hOMlh9SYdQ80FjhgrCH5wF9jLzNsh34yb7h4qfyMrzPuHCpBYuNg6DH_wlaabPuTX3y99X_4tMG5GiYukT-NN0TKcSlKQKcs-20VHnCqlzjuss7D9ul-rf3De1RWtqb7H5mCC2wse5',
    description: 'Precision-formed grade 5 titanium perimeter frame with shock-absorbing internal elastomer dampers and flush Action Button tactile cover.',
    specs: {
      material: 'Grade 5 Polished Titanium & Polycarbonate Backplate',
      finish: 'Natural Titanium & Matte Smoke',
      compatibility: 'iPhone 16 Pro / 16 Pro Max, iPhone 15 Pro / 15 Pro Max',
      dimensions: 'Ultra-thin 1.2mm bezel profile',
      weight: '44g',
      warranty: '1-Year Dani Tech Replacement Guarantee'
    },
    inStock: true
  }
];

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'accra-same-day',
    name: 'Accra Same-Day Express (Bolt / Yango)',
    description: 'Dedicated studio dispatch within 2-4 hours across Greater Accra',
    priceGhs: 45,
    estimatedTime: '2 - 4 Hours'
  },
  {
    id: 'accra-standard',
    name: 'Accra Standard Next-Day Courier',
    description: 'Scheduled delivery directly to your home or office address',
    priceGhs: 25,
    estimatedTime: 'Tomorrow'
  },
  {
    id: 'greater-ghana',
    name: 'Nationwide Regional (Kumasi, Takoradi, Tamale)',
    description: 'Insured VIP express bus cargo with tracking',
    priceGhs: 60,
    estimatedTime: '24 - 48 Hours'
  }
];
