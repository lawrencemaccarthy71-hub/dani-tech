import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Settings, LogOut,
  ExternalLink, MessageSquare, TrendingUp, Users, Truck,
  CheckCircle, Clock, AlertCircle, Eye, EyeOff, Save,
  Loader2, Trash2, ChevronDown, ChevronRight, Menu, X,
  BarChart2, RefreshCw, Plus, Edit, RotateCcw, Upload, Image as ImageIcon,
} from 'lucide-react';
import { clearAdminSession } from './auth';
import { verifyPassword, updateAdminPassword } from './auth';
import { PRODUCTS } from '../data/products';
import { formatPrice, WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_FORMATTED } from '../utils/format';
import { OrderRecord, Product } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type DashboardSection = 'overview' | 'orders' | 'products' | 'settings';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem('danitech_products');
    return raw ? JSON.parse(raw) : PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

function saveProducts(products: Product[]) {
  try {
    localStorage.setItem('danitech_products', JSON.stringify(products));
    window.dispatchEvent(new Event('danitech_products_updated'));
  } catch (e) {
    console.error('Failed to save products:', e);
  }
}

function loadOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem('danitech_orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Sidebar NavItem ─────────────────────────────────────────────────────────

interface NavItemProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  section: DashboardSection;
  active: boolean;
  badge?: number;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
      active
        ? 'bg-[#0066ff] text-white shadow-md'
        : 'text-[#c2c6d8] hover:bg-[#2a2a2c] hover:text-white'
    }`}
  >
    <Icon className="w-4 h-4 shrink-0" />
    <span className="flex-1">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
        active ? 'bg-white/20 text-white' : 'bg-[#0066ff] text-white'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon: React.FC<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, color = 'text-[#e5e1e4]', icon: Icon }) => (
  <div className="p-5 rounded-2xl bg-[#1c1b1d] border border-[#424656]/25 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-mono text-[#8c90a1] uppercase tracking-wider">{label}</span>
      <div className="w-8 h-8 rounded-lg bg-[#2a2a2c] flex items-center justify-center">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
    </div>
    <div>
      <div className={`font-['Geist',sans-serif] text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-[11px] text-[#8c90a1] mt-0.5 font-mono">{sub}</div>}
    </div>
  </div>
);

// ─── Overview Section ────────────────────────────────────────────────────────

const OverviewSection: React.FC<{
  products: Product[];
  orders: OrderRecord[];
  onGoToOrders: () => void;
}> = ({ products, orders, onGoToOrders }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalGhs, 0);
  const categories = [...new Set(products.map((p) => p.category))].length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={String(products.length)} sub={`${categories} categories`} icon={Package} color="text-[#b3c5ff]" />
        <StatCard label="Orders Received" value={String(orders.length)} sub="via checkout" icon={ShoppingBag} color="text-[#ffb77d]" />
        <StatCard
          label="Est. Revenue"
          value={formatPrice(totalRevenue, 'GHS')}
          sub={orders.length > 0 ? `avg ${formatPrice(Math.round(totalRevenue / orders.length), 'GHS')}` : 'No orders yet'}
          icon={TrendingUp}
          color="text-[#00dce6]"
        />
        <StatCard label="Categories Active" value={String(categories)} sub="product tiers" icon={BarChart2} color="text-[#e5e1e4]" />
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-[#1c1b1d] border border-[#424656]/25 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#424656]/20">
          <h3 className="font-['Geist',sans-serif] text-sm font-semibold text-[#e5e1e4]">Recent Orders</h3>
          {orders.length > 5 && (
            <button onClick={onGoToOrders} className="text-xs text-[#0066ff] hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-[#8c90a1] text-xs font-mono">
            No orders yet — they will appear here once customers check out.
          </div>
        ) : (
          <div className="divide-y divide-[#424656]/20">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#201f21] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#00dce6]">{order.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#007e85]/20 text-[#00dce6] font-mono">Placed</span>
                  </div>
                  <p className="text-xs text-[#c2c6d8] mt-0.5 truncate">{order.name} · {order.phone}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-[#ffb77d]">{formatPrice(order.totalGhs, 'GHS')}</div>
                  <div className="text-[10px] text-[#8c90a1] mt-0.5">{formatDate(order.placedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Quick Access */}
      <div className="rounded-2xl bg-[#1c1b1d] border border-[#424656]/25 p-5">
        <h3 className="font-['Geist',sans-serif] text-sm font-semibold text-[#e5e1e4] mb-3">WhatsApp Quick Access</h3>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20team`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#007e85]/20 hover:bg-[#007e85]/40 text-[#00dce6] text-xs font-medium border border-[#007e85]/30 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Open Support Chat
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Dispatch%20update`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#353437] hover:bg-[#424656]/50 text-[#c2c6d8] text-xs font-medium border border-[#424656]/30 transition-colors"
          >
            <Truck className="w-3.5 h-3.5" /> Dispatch Update
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Orders Section ───────────────────────────────────────────────────────────

const OrdersSection: React.FC<{ orders: OrderRecord[]; onRefresh: () => void }> = ({ orders, onRefresh }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sorted = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Geist',sans-serif] text-xl font-bold text-[#e5e1e4]">Orders</h2>
          <p className="text-xs text-[#8c90a1] mt-0.5 font-mono">{orders.length} total orders received</p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201f21] hover:bg-[#2a2a2c] text-[#c2c6d8] text-xs font-medium border border-[#424656]/30 transition-colors cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl bg-[#1c1b1d] border border-[#424656]/25 py-16 text-center">
          <ShoppingBag className="w-10 h-10 text-[#353437] mx-auto mb-3" />
          <p className="text-[#8c90a1] text-sm">No orders yet.</p>
          <p className="text-[#424656] text-xs mt-1 font-mono">Orders placed via the checkout flow will appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#1c1b1d] border border-[#424656]/25 overflow-hidden">
          {sorted.map((order, idx) => (
            <div key={order.id} className={idx > 0 ? 'border-t border-[#424656]/20' : ''}>
              {/* Row */}
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#201f21] transition-colors text-left cursor-pointer"
              >
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 items-center">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#00dce6]">{order.id}</span>
                    <p className="text-[11px] text-[#8c90a1] mt-0.5">{formatDate(order.placedAt)}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium text-[#e5e1e4]">{order.name}</p>
                    <p className="text-[11px] text-[#8c90a1]">{order.phone}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-[#c2c6d8]">{order.delivery.name.split('(')[0].trim()}</p>
                    <p className="text-[11px] text-[#8c90a1]">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-mono font-bold text-[#ffb77d]">{formatPrice(order.totalGhs, 'GHS')}</span>
                  {expandedId === order.id
                    ? <ChevronDown className="w-4 h-4 text-[#8c90a1]" />
                    : <ChevronRight className="w-4 h-4 text-[#8c90a1]" />}
                </div>
              </button>

              {/* Expanded details */}
              {expandedId === order.id && (
                <div className="px-5 pb-5 bg-[#131315]/50 border-t border-[#424656]/20 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><span className="text-[#8c90a1]">Recipient</span><span className="text-[#e5e1e4] font-medium">{order.name}</span></div>
                      <div className="flex justify-between"><span className="text-[#8c90a1]">Phone</span><span className="text-[#e5e1e4]">{order.phone}</span></div>
                      <div className="flex justify-between"><span className="text-[#8c90a1]">Address</span><span className="text-[#c2c6d8] text-right max-w-[160px]">{order.address}</span></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><span className="text-[#8c90a1]">Delivery</span><span className="text-[#c2c6d8] text-right max-w-[160px]">{order.delivery.name.split('(')[0]}</span></div>
                      <div className="flex justify-between"><span className="text-[#8c90a1]">Est. Time</span><span className="text-[#00dce6]">{order.delivery.estimatedTime}</span></div>
                      <div className="flex justify-between"><span className="text-[#8c90a1]">Total Paid</span><span className="text-[#ffb77d] font-mono font-bold">{formatPrice(order.totalGhs, 'GHS')}</span></div>
                    </div>
                  </div>
                  {/* Items */}
                  <div className="pt-2 border-t border-[#424656]/20">
                    <p className="text-[10px] font-mono text-[#8c90a1] uppercase tracking-wider mb-2">Items Ordered</p>
                    <div className="space-y-1.5">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1c1b1d] border border-[#424656]/20">
                          <img src={item.product.image} alt={item.product.name} className="w-8 h-8 object-contain rounded" />
                          <span className="flex-1 text-xs text-[#c2c6d8] truncate">{item.product.name}</span>
                          <span className="text-[11px] text-[#8c90a1]">×{item.quantity}</span>
                          <span className="text-xs font-mono text-[#ffb77d]">{formatPrice(item.product.priceGhs * item.quantity, 'GHS')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* WhatsApp follow-up */}
                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=Hello%20Dani%20Tech,%20checking%20on%20order%20${order.id}%20for%20${encodeURIComponent(order.name)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#00dce6] hover:underline mt-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Follow up on WhatsApp
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Products Section ─────────────────────────────────────────────────────────

interface ProductModalState {
  isOpen: boolean;
  isEditing: boolean;
  product: Partial<Product>;
}

const emptyProduct: Partial<Product> = {
  name: '',
  category: 'laptops',
  categoryLabel: 'Laptop Gear',
  tier: '01 / Workspace Heavy',
  priceGhs: 100,
  featureTag: 'Accra Express',
  image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
  description: '',
  inStock: true,
  specs: {
    material: 'Anodized Aluminum',
    finish: 'Space Grey Matte',
    compatibility: 'Universal',
    warranty: '1-Year Dani Tech Guarantee',
  },
};

const ProductsSection: React.FC<{
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
}> = ({ products, onUpdateProducts }) => {
  const [modal, setModal] = useState<ProductModalState>({
    isOpen: false,
    isEditing: false,
    product: emptyProduct,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleToggleStock = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, inStock: !p.inStock } : p
    );
    onUpdateProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    onUpdateProducts(updated);
    setDeleteConfirmId(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset catalogue to factory default products?')) {
      onUpdateProducts(PRODUCTS);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image file under 2MB for optimal performance.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setModal((prev) => ({
          ...prev,
          product: { ...prev.product, image: reader.result as string },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const p = modal.product;
    if (!p.name || !p.priceGhs) return;

    if (modal.isEditing && p.id) {
      const updated = products.map((item) =>
        item.id === p.id ? ({ ...item, ...p } as Product) : item
      );
      onUpdateProducts(updated);
    } else {
      const newProduct: Product = {
        id: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`,
        name: p.name || 'New Hardware Item',
        category: p.category || 'laptops',
        categoryLabel: p.categoryLabel || 'Hardware',
        tier: p.tier || '01 / Workspace Heavy',
        priceGhs: Number(p.priceGhs) || 0,
        badge: p.badge,
        badgeColor: p.badgeColor || 'secondary',
        featureTag: p.featureTag || 'In Stock',
        image: p.image || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
        description: p.description || '',
        inStock: p.inStock ?? true,
        specs: {
          material: p.specs?.material || 'High-grade Alloy',
          finish: p.specs?.finish || 'Matte',
          compatibility: p.specs?.compatibility || 'Universal',
          warranty: p.specs?.warranty || '1-Year Dani Tech Guarantee',
        },
      };
      onUpdateProducts([newProduct, ...products]);
    }
    setModal({ isOpen: false, isEditing: false, product: emptyProduct });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-['Geist',sans-serif] text-xl font-bold text-[#e5e1e4]">
            Product Management
          </h2>
          <p className="text-xs text-[#8c90a1] mt-0.5 font-mono">
            {products.length} hardware items active in catalogue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] text-[#c2c6d8] hover:text-white text-xs font-medium border border-[#424656]/30 transition-colors cursor-pointer"
            title="Reset to default catalogue"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
          <button
            onClick={() =>
              setModal({
                isOpen: true,
                isEditing: false,
                product: { ...emptyProduct, id: `dt-${Date.now()}` },
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="rounded-2xl bg-[#1c1b1d] border border-[#424656]/25 overflow-hidden divide-y divide-[#424656]/20">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 px-5 py-4 hover:bg-[#201f21] transition-colors"
          >
            <div className="w-14 h-14 rounded-xl bg-[#131315] p-2 shrink-0 flex items-center justify-center border border-[#424656]/20">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-[#e5e1e4] truncate">
                {product.name}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-[#8c90a1] uppercase">
                  {product.categoryLabel}
                </span>
                <span className="text-[10px] font-mono text-[#ffb77d] px-1.5 py-0.5 rounded bg-[#353437]">
                  {product.featureTag}
                </span>
                {product.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#353437] text-[#00dce6] font-mono">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-mono font-bold text-[#e5e1e4]">
                {formatPrice(product.priceGhs, 'GHS')}
              </div>
              <button
                onClick={() => handleToggleStock(product.id)}
                className={`text-[10px] font-mono mt-1 flex items-center gap-1 ml-auto px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  product.inStock
                    ? 'bg-[#007e85]/20 text-[#00dce6] hover:bg-[#007e85]/40'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
                title="Click to toggle availability"
              >
                {product.inStock ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                onClick={() =>
                  setModal({
                    isOpen: true,
                    isEditing: true,
                    product: { ...product },
                  })
                }
                className="p-2 rounded-lg text-[#8c90a1] hover:text-[#e5e1e4] hover:bg-[#2a2a2c] transition-colors cursor-pointer"
                title="Edit Product"
              >
                <Edit className="w-4 h-4" />
              </button>
              {deleteConfirmId === product.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-md transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-2 py-1 bg-[#2a2a2c] text-[#8c90a1] text-[10px] rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(product.id)}
                  className="p-2 rounded-lg text-[#8c90a1] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#1c1b1d] border border-[#424656]/40 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-[#201f21] border-b border-[#424656]/30 flex items-center justify-between">
              <h3 className="font-['Geist',sans-serif] text-base font-semibold text-[#e5e1e4]">
                {modal.isEditing ? 'Edit Hardware Product' : 'Add New Hardware Product'}
              </h3>
              <button
                onClick={() => setModal({ isOpen: false, isEditing: false, product: emptyProduct })}
                className="w-7 h-7 rounded-full bg-[#2a2a2c] hover:bg-[#353437] text-[#c2c6d8] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] font-mono text-[#c2c6d8] uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={modal.product.name || ''}
                  onChange={(e) =>
                    setModal({ ...modal, product: { ...modal.product, name: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] focus:outline-none focus:border-[#0066ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#c2c6d8] uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={modal.product.category || 'laptops'}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        product: { ...modal.product, category: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] focus:outline-none focus:border-[#0066ff]"
                  >
                    <option value="laptops">Laptops</option>
                    <option value="iphone">iPhone</option>
                    <option value="ipad">iPad</option>
                    <option value="adapters-hubs">Adapters & Hubs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#c2c6d8] uppercase mb-1">
                    Price (GH₵) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={modal.product.priceGhs || ''}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        product: { ...modal.product, priceGhs: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] font-mono focus:outline-none focus:border-[#0066ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#c2c6d8] uppercase mb-1">
                    Category Label
                  </label>
                  <input
                    type="text"
                    value={modal.product.categoryLabel || ''}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        product: { ...modal.product, categoryLabel: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] focus:outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#c2c6d8] uppercase mb-1">
                    Feature Tag (e.g. Accra Express)
                  </label>
                  <input
                    type="text"
                    value={modal.product.featureTag || ''}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        product: { ...modal.product, featureTag: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] focus:outline-none focus:border-[#0066ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#c2c6d8] uppercase mb-1">
                  Product Image (Web Link or Device Upload)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Paste image URL (e.g. https://... or /assets/...)"
                    value={modal.product.image || ''}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        product: { ...modal.product, image: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] font-mono text-[11px] focus:outline-none focus:border-[#0066ff]"
                  />

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] text-[11px] font-medium border border-[#424656]/40 transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#00dce6]" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-[#8c90a1] font-mono">PNG, JPG, WebP up to 2MB</span>
                  </div>

                  {/* Live Image Preview */}
                  {modal.product.image && (
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-[#131315] border border-[#424656]/30">
                      <div className="w-12 h-12 rounded-lg bg-[#1c1b1d] p-1 border border-[#424656]/20 flex items-center justify-center shrink-0">
                        <img
                          src={modal.product.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-[11px]">
                        <p className="text-[#e5e1e4] font-medium truncate">Image Selected</p>
                        <p className="text-[10px] text-[#00dce6] font-mono">Preview Ready</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setModal((prev) => ({
                            ...prev,
                            product: { ...prev.product, image: '' },
                          }))
                        }
                        className="text-[11px] text-[#8c90a1] hover:text-red-400 px-2 py-1 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#c2c6d8] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={modal.product.description || ''}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      product: { ...modal.product, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] focus:outline-none focus:border-[#0066ff]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={modal.product.inStock ?? true}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      product: { ...modal.product, inStock: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-[#0066ff] bg-[#131315] border-[#424656]"
                />
                <label htmlFor="inStockCheck" className="text-xs text-[#e5e1e4] cursor-pointer">
                  In Stock & Ready for Dispatch
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#424656]/30">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  {modal.isEditing ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setModal({ isOpen: false, isEditing: false, product: emptyProduct })}
                  className="px-4 py-2.5 rounded-xl bg-[#2a2a2c] hover:bg-[#353437] text-[#c2c6d8] text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Settings Section ─────────────────────────────────────────────────────────

const SettingsSection: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const [clearLoading, setClearLoading] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clearDone, setClearDone] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (newPw !== confirmPw) { setPwError('New passwords do not match.'); return; }
    if (newPw.length < 8) { setPwError('New password must be at least 8 characters.'); return; }

    setPwLoading(true);
    const valid = await verifyPassword(currentPw);
    if (!valid) {
      setPwLoading(false);
      setPwError('Current password is incorrect.');
      return;
    }
    await updateAdminPassword(newPw);
    setPwLoading(false);
    setPwSuccess(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSuccess(false), 4000);
  };

  const handleClearOrders = () => {
    if (!clearConfirm) { setClearConfirm(true); return; }
    setClearLoading(true);
    setTimeout(() => {
      localStorage.removeItem('danitech_orders');
      setClearLoading(false);
      setClearConfirm(false);
      setClearDone(true);
      setTimeout(() => setClearDone(false), 3000);
    }, 600);
  };

  const inputClass = "w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] text-sm focus:outline-none focus:border-[#0066ff] transition-colors font-mono";
  const labelClass = "block text-xs font-mono text-[#c2c6d8] uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="font-['Geist',sans-serif] text-xl font-bold text-[#e5e1e4]">Settings</h2>
        <p className="text-xs text-[#8c90a1] mt-0.5 font-mono">Admin panel configuration</p>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl bg-[#1c1b1d] border border-[#424656]/25 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#424656]/20">
          <h3 className="text-sm font-semibold text-[#e5e1e4]">Change Admin Password</h3>
        </div>
        <form onSubmit={handleChangePassword} className="p-5 space-y-4">
          {pwError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" /> {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#007e85]/10 border border-[#00dce6]/30 text-[#00dce6] text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" /> Password updated successfully.
            </div>
          )}

          {[
            { label: 'Current Password', value: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
            { label: 'New Password', value: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(v => !v) },
            { label: 'Confirm New Password', value: confirmPw, set: setConfirmPw, show: showNew, toggle: () => setShowNew(v => !v) },
          ].map(({ label, value, set, show, toggle }) => (
            <div key={label}>
              <label className={labelClass}>{label}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={value}
                  onChange={(e) => { set(e.target.value); setPwError(''); }}
                  className={inputClass}
                />
                <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c90a1] hover:text-[#c2c6d8]">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={pwLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer shadow-md"
          >
            {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Store Info */}
      <div className="rounded-2xl bg-[#1c1b1d] border border-[#424656]/25 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#424656]/20">
          <h3 className="text-sm font-semibold text-[#e5e1e4]">Store Information</h3>
        </div>
        <div className="p-5 space-y-2 text-xs">
          {[
            ['WhatsApp Number', WHATSAPP_PHONE_FORMATTED],
            ['Location', 'East Legon, Accra, Ghana'],
            ['Currency', 'GHS (Primary) / USD (1 USD = 15.5 GHS)'],
            ['Same-Day Cutoff', 'Orders before 4:00 PM'],
            ['Delivery Partners', 'Bolt, Yango (Accra)'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-[#424656]/15 last:border-0">
              <span className="text-[#8c90a1]">{k}</span>
              <span className="text-[#e5e1e4] font-medium text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl bg-[#1c1b1d] border border-red-500/20 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-500/10">
          <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
        </div>
        <div className="p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#e5e1e4]">Clear All Orders</p>
            <p className="text-[11px] text-[#8c90a1] mt-0.5">Permanently deletes all orders from localStorage. Cannot be undone.</p>
          </div>
          <button
            onClick={handleClearOrders}
            disabled={clearLoading}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              clearDone
                ? 'bg-[#007e85]/20 text-[#00dce6] border border-[#00dce6]/30'
                : clearConfirm
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-[#353437] hover:bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {clearLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : clearDone ? <CheckCircle className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
            {clearDone ? 'Cleared' : clearConfirm ? 'Confirm Delete' : 'Clear Orders'}
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#353437] hover:bg-[#424656]/60 text-[#c2c6d8] text-xs font-medium border border-[#424656]/30 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" /> Sign Out of Admin Panel
      </button>
    </div>
  );
};

// ─── Main AdminDashboard ──────────────────────────────────────────────────────

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<DashboardSection>('overview');
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [orders, setOrders] = useState<OrderRecord[]>(loadOrders);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshOrders = () => setOrders(loadOrders());

  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveProducts(newProducts);
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login', { replace: true });
  };

  const navItems: { section: DashboardSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { section: 'overview', label: 'Overview', icon: LayoutDashboard },
    { section: 'orders', label: 'Orders', icon: ShoppingBag },
    { section: 'products', label: 'Products', icon: Package },
    { section: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (s: DashboardSection) => {
    setSection(s);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#131315] border-r border-[#424656]/30 flex flex-col z-30
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Brand */}
        <div className="p-5 border-b border-[#424656]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066ff] to-[#00dce6] p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#131315] rounded-[7px] flex items-center justify-center">
                <span className="font-mono font-black text-xs text-[#00dce6]">DT</span>
              </div>
            </div>
            <div>
              <p className="font-['Geist',sans-serif] text-sm font-bold text-[#e5e1e4]">Dani Tech</p>
              <p className="text-[9px] font-mono text-[#8c90a1] uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.section}
              icon={item.icon}
              label={item.label}
              section={item.section}
              active={section === item.section}
              badge={item.section === 'orders' ? orders.length : undefined}
              onClick={() => handleNav(item.section)}
            />
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-[#424656]/30 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm text-[#c2c6d8] hover:bg-[#2a2a2c] hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>View Live Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm text-[#c2c6d8] hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-[#131315]/90 backdrop-blur-md border-b border-[#424656]/30 px-5 py-3 flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#c2c6d8] hover:bg-[#2a2a2c] transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1">
            <h1 className="font-['Geist',sans-serif] text-base font-semibold text-[#e5e1e4] capitalize">
              {section === 'overview' ? 'Dashboard Overview' : section}
            </h1>
            <p className="text-[10px] font-mono text-[#8c90a1]">Dani Tech Hub · East Legon, Accra</p>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1c1b1d] border border-[#424656]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00dce6] animate-pulse" />
            <span className="text-[10px] font-mono text-[#c2c6d8]">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 overflow-y-auto">
          {section === 'overview' && (
            <OverviewSection
              products={products}
              orders={orders}
              onGoToOrders={() => setSection('orders')}
            />
          )}
          {section === 'orders' && (
            <OrdersSection orders={orders} onRefresh={refreshOrders} />
          )}
          {section === 'products' && (
            <ProductsSection
              products={products}
              onUpdateProducts={handleUpdateProducts}
            />
          )}
          {section === 'settings' && <SettingsSection onLogout={handleLogout} />}
        </main>
      </div>
    </div>
  );
};
