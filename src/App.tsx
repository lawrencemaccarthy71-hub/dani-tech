import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Category, Currency, CartItem, Product, DeliveryOption, OrderRecord } from './types';
import { PRODUCTS, DELIVERY_OPTIONS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryTiers } from './components/CategoryTiers';
import { Catalogue } from './components/Catalogue';
import { TrustPillars } from './components/TrustPillars';
import { CommunitySection } from './components/CommunitySection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { subscribeToProducts, getStoredProducts } from './lib/productsDb';

// Code-split modals and admin suite with automatic network drop retry
const CheckoutModal = lazyWithRetry(() =>
  import('./components/CheckoutModal').then((m) => ({ default: m.CheckoutModal }))
);
const SearchModal = lazyWithRetry(() =>
  import('./components/SearchModal').then((m) => ({ default: m.SearchModal }))
);
const ProductDetailModal = lazyWithRetry(() =>
  import('./components/ProductDetailModal').then((m) => ({ default: m.ProductDetailModal }))
);
const AboutModal = lazyWithRetry(() =>
  import('./components/AboutModal').then((m) => ({ default: m.AboutModal }))
);
const ProfileModal = lazyWithRetry(() =>
  import('./components/ProfileModal').then((m) => ({ default: m.ProfileModal }))
);

const AdminLoginPage = lazyWithRetry(() =>
  import('./admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboard = lazyWithRetry(() =>
  import('./admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminProtectedRoute = lazyWithRetry(() =>
  import('./admin/AdminProtectedRoute').then((m) => ({ default: m.AdminProtectedRoute }))
);

const AdminLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#131315] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-[#ffb77d]">
      <div className="w-8 h-8 border-2 border-[#ffb77d] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono tracking-wider text-[#c2c6d8]">Loading Dani Tech Admin...</span>
    </div>
  </div>
);


export function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [currency, setCurrency] = useState<Currency>('GHS');

  // Dual-layer state: Loads immediately from local storage cache, synced live with Firestore
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [productsLoading, setProductsLoading] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('danitech_cart') || localStorage.getItem('krom_accra_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(
    DELIVERY_OPTIONS[0]
  );

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentOrderId, setRecentOrderId] = useState<string | undefined>(undefined);

  const location = useLocation();
  const navigate = useNavigate();

  // ── Firestore real-time product subscription with local cache fallback ─────
  useEffect(() => {
    const handleLocalUpdate = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener('danitech_products_updated', handleLocalUpdate);

    const unsubscribe = subscribeToProducts(
      (freshProducts) => {
        setProducts(freshProducts);
        setProductsLoading(false);
      },
      (_err) => {
        // Keep existing user products from cache on connection hiccup
        setProducts(getStoredProducts());
        setProductsLoading(false);
      }
    );

    return () => {
      unsubscribe();
      window.removeEventListener('danitech_products_updated', handleLocalUpdate);
    };
  }, []);


  // Sync /about route with isAboutOpen state
  useEffect(() => {
    if (location.pathname === '/about') {
      setIsAboutOpen(true);
    }
  }, [location.pathname]);

  const handleOpenAbout = () => {
    setIsAboutOpen(true);
    if (location.pathname !== '/about') {
      navigate('/about');
    }
  };

  const handleCloseAbout = () => {
    setIsAboutOpen(false);
    if (location.pathname === '/about') {
      navigate('/', { replace: true });
    }
  };

  // Sync cart to localStorage (cart is per-device — that's intentional)
  useEffect(() => {
    try {
      localStorage.setItem('danitech_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cartItems]);

  // Keyboard shortcut for search

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsSearchOpen(false);
        setIsCheckoutOpen(false);
        setIsAboutOpen(false);
        setIsProfileOpen(false);
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderSuccess = (
    orderId: string,
    orderDetails?: {
      name: string;
      phone: string;
      address: string;
      totalGhs: number;
      items: CartItem[];
      delivery: DeliveryOption;
    }
  ) => {
    setRecentOrderId(orderId);

    if (orderDetails) {
      const newOrder: OrderRecord = {
        id: orderId,
        name: orderDetails.name,
        phone: orderDetails.phone,
        address: orderDetails.address,
        delivery: orderDetails.delivery,
        items: orderDetails.items,
        totalGhs: orderDetails.totalGhs,
        placedAt: new Date().toISOString(),
      };

      try {
        const existingRaw = localStorage.getItem('danitech_orders');
        const existing: OrderRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
        const updated = [newOrder, ...existing];
        localStorage.setItem('danitech_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('danitech_orders_updated'));
      } catch (e) {
        console.error('Failed to save order to localStorage:', e);
      }
    }

    setCartItems([]);
  };

  const scrollToCatalogue = () => {
    const catalogue = document.getElementById('catalogue');
    if (catalogue) {
      catalogue.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const storefront = (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] font-sans antialiased selection:bg-[#ffb77d] selection:text-[#131315]">
      {/* Fixed Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        currency={currency}
        onSelectCurrency={setCurrency}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAbout={handleOpenAbout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="pt-28">
        {/* Hero Section with Live Badges and Metrics */}
        <Hero onShopClick={scrollToCatalogue} />

        {/* Bento Category Taxonomy Tiers */}
        <CategoryTiers
          onSelectTier={(tier) => {
            setActiveCategory(tier);
          }}
        />

        {/* Featured Hardware Catalogue Grid */}
        <Catalogue
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          currency={currency}
          onToggleCurrency={() => setCurrency(currency === 'GHS' ? 'USD' : 'GHS')}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        {/* Brand & Trust Pillars */}
        <TrustPillars />

        {/* Studio Channel & Live Atelier Telemetry */}
        <CommunitySection />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenAbout={handleOpenAbout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Slide-out Bag Summary */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        selectedDelivery={selectedDelivery}
        onSelectDelivery={setSelectedDelivery}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* MoMo & Card Checkout Modal */}
      {isCheckoutOpen && (
        <Suspense fallback={null}>
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={cartItems}
            currency={currency}
            deliveryOption={selectedDelivery}
            onOrderSuccess={handleOrderSuccess}
          />
        </Suspense>
      )}

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            products={products}
            currency={currency}
            onSelectProduct={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
          />
        </Suspense>
      )}

      {/* Product Technical Specs Modal */}
      {quickViewProduct && (
        <Suspense fallback={null}>
          <ProductDetailModal
            product={quickViewProduct}
            currency={currency}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
          />
        </Suspense>
      )}

      {/* About Dani Tech Modal */}
      {isAboutOpen && (
        <Suspense fallback={null}>
          <AboutModal
            isOpen={isAboutOpen}
            onClose={handleCloseAbout}
            onExploreCatalog={scrollToCatalogue}
            onSelectCategory={setActiveCategory}
          />
        </Suspense>
      )}

      {/* Client Profile / Order Tracking Modal */}
      {isProfileOpen && (
        <Suspense fallback={null}>
          <ProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            recentOrderId={recentOrderId}
          />
        </Suspense>
      )}

      {/* Persistent Floating WhatsApp Concierge */}
      <FloatingWhatsApp />
    </div>
  );

  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route path="/" element={storefront} />
      <Route path="/about" element={storefront} />

      {/* Admin Login Route */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />

      {/* Admin Dashboard Protected Route */}
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          </Suspense>
        }
      />

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
