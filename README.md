# Dani Tech — Workspace & Mobile Hardware Store

A high-performance, responsive e-commerce web application for **Dani Tech** (Accra, Ghana), engineered for laptops, iPad setups, and iPhone hardware accessories.

Built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS v4**, **Lucide Icons**, and **Motion**.

---

## ⚡ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler / Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animations**: Motion (`motion/react`)
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` (`danitech_cart`)

---

## ✨ Features

- **Curated Hardware Catalogue**: Categorized into *Workspace Heavy* (Laptops), *Mobile Armour* (iPhone), *Studio & Field* (iPad), and *Adapters & Hubs*.
- **Currency Engine**: Real-time switching between Ghanaian Cedi (`GHS GH₵`), US Dollar (`USD $`), Euro (`EUR €`), and British Pound (`GBP £`).
- **Interactive Cart & Drawer**: Full cart management (increase/decrease quantities, item removals, persistent storage across reloads).
- **Ghana Checkout Rails**:
  - Payment simulation for **MTN Mobile Money** (`*170#`), **Telecel Cash** (`*110#`), Visa/Mastercard, and Pay on Delivery.
  - Delivery tiers: Accra Express (3-6h), Same-Day Accra Courier, Ghana Post EMS (Kumasi/Takoradi), and East Legon Workshop Pickup.
  - Generates unique order reference codes (`DANI-XXXXXX`).
- **Direct WhatsApp Order Automation**: One-click WhatsApp link generation pre-filled with cart summaries, order codes, delivery addresses, and payment references.
- **Client Support & Order Tracking Desk**: Modal for tracking simulated dispatches, courier status, and courier ETA.
- **Search & Quick Specs**: Instant keyboard-accessible modal (`Cmd/Ctrl + K` or search icon) with tag filters and quick product previews.
- **Responsive Architecture**: Designed mobile-first, desktop-optimized dark theme with accessible contrast and touch-friendly hit areas.

---

## 📁 Project Structure

```text
├── index.html                  # HTML entry point with Dani Tech metadata
├── package.json                # Project scripts and dependencies
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundler & Tailwind configuration
├── metadata.json               # Application metadata and capabilities
├── .env.example                # Environment variable reference
├── public/                     # Static public assets
└── src/
    ├── main.tsx                # Application bootstrap
    ├── App.tsx                 # Root component & global state orchestration
    ├── index.css               # Global Tailwind CSS imports and base styles
    ├── types.ts                # Shared TypeScript models and interfaces
    ├── data/
    │   └── products.ts         # Curated hardware catalogue, pricing & specifications
    ├── utils/
    │   └── format.ts           # Currency conversion & WhatsApp link generators
    └── components/
        ├── Header.tsx          # Navigation bar, currency picker, cart & search triggers
        ├── Hero.tsx            # Hero showcase with primary actions
        ├── CategoryTiers.tsx   # Modular 3-column hardware category taxonomy
        ├── Catalogue.tsx       # Filterable product grid with category pills
        ├── ProductCard.tsx     # Individual product card with quick-view and add-to-bag
        ├── ProductDetailModal.tsx # Full-screen quick specs, variant selector & WhatsApp order
        ├── CartDrawer.tsx      # Slide-out drawer with order subtotal and checkout link
        ├── CheckoutModal.tsx   # Ghana payment rail selection and address inputs
        ├── SearchModal.tsx     # Fast search modal with tag filters
        ├── ProfileModal.tsx    # Order tracking and Ghana telecom USSD guide
        ├── AboutModal.tsx      # East Legon hardware desk information and hours
        ├── TrustPillars.tsx    # 4 engineering and quality benchmarks
        ├── CommunitySection.tsx# Hardware community, workshop location & newsletter
        ├── Footer.tsx          # Brand footer, payment badges, directory links & copyright
        └── FloatingWhatsApp.tsx# Persistent bottom-right WhatsApp concierge button
```

---

## 🚀 Getting Started Locally

### Prerequisites

Ensure you have **Node.js** (v18.0.0 or higher, recommended v20+) installed on your machine.

You can verify using:
```bash
node -v
npm -v
```

### 1. Installation

Clone or extract the repository, navigate to the folder, and install all dependencies:

```bash
npm install
```

*(You can also use `pnpm install`, `yarn install`, or `bun install`)*

### 2. Configure Environment Variables (Optional)

Copy `.env.example` to create your `.env` file:

```bash
cp .env.example .env
```

The application runs entirely client-side without requiring mandatory external API keys.

### 3. Start the Development Server

Launch the Vite local development server:

```bash
npm run dev
```

Open your browser at:
```
http://localhost:3000
```

### 4. Build for Production

To create an optimized production build:

```bash
npm run build
```

The output will be placed in the `dist/` directory, ready to be hosted on any static hosting provider (Vercel, Netlify, Cloudflare Pages, Firebase Hosting, AWS S3/CloudFront, or Cloud Run).

### 5. Preview Production Build

Preview the generated static output locally:

```bash
npm run preview
```

### 6. Type Check & Lint

Validate TypeScript types across the entire codebase:

```bash
npm run lint
```

---

## 🛠️ Customization Notes

- **Store Location & Support Phone**: Update the phone number (`233240000000`) in `src/utils/format.ts` and `src/components/AboutModal.tsx` with your real Ghana WhatsApp Business number.
- **Product Inventory**: Add, modify, or remove products in `src/data/products.ts`.
- **Exchange Rates**: Modify the currency conversion multipliers in `src/utils/format.ts`.

---

## 📄 License

MIT License. Designed and engineered for **Dani Tech** (Accra, Ghana).
