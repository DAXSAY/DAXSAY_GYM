import React, { useState } from 'react';
import { 
  Store, 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  CreditCard, 
  AlertTriangle, 
  Receipt, 
  Printer, 
  Package, 
  Edit3, 
  Sparkles,
  DollarSign,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { Product, ProductCategory, CartItem, PaymentMethod, Transaction } from '../../types/gym';
import confetti from 'canvas-confetti';

interface StorePOSProps {
  onOpenQuickSale?: () => void;
}

export const StorePOS: React.FC<StorePOSProps> = () => {
  const { 
    products, 
    members, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateStock, 
    processPOSSale,
    lowStockProducts
  } = useGym();

  const [activeTab, setActiveTab] = useState<'pos' | 'inventory'>('pos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [lastReceipt, setLastReceipt] = useState<Transaction | null>(null);

  // New Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('bebidas');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCost, setProdCost] = useState(2.0);
  const [prodPrice, setProdPrice] = useState(5.0);
  const [prodStock, setProdStock] = useState(20);
  const [prodMinStock, setProdMinStock] = useState(5);
  const [prodDesc, setProdDesc] = useState('');

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'Todos', icon: '⚡' },
    { id: 'bebidas', label: 'Bebidas & Aguas', icon: '💧' },
    { id: 'suplementos', label: 'Proteínas & Suplementos', icon: '💪' },
    { id: 'snacks', label: 'Snacks & Barras', icon: '🍫' },
    { id: 'accesorios', label: 'Accesorios Gym', icon: '🎒' },
    { id: 'ropa', label: 'Indumentaria', icon: '👕' }
  ];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add to cart
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`No hay más stock disponible de ${product.name} (Stock: ${product.stock})`);
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Update quantity in cart
  const handleUpdateQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) {
            alert(`Stock máximo alcanzado (${item.product.stock})`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  // Remove from cart
  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Clear cart
  const handleClearCart = () => setCart([]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
  const total = subtotal;

  // Checkout
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const receipt = processPOSSale(
      cart,
      paymentMethod,
      selectedMemberId || undefined,
      customCustomerName || 'Cliente Mostrador'
    );

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setLastReceipt(receipt);
    setCart([]);
    setSelectedMemberId('');
    setCustomCustomerName('');
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('suplementos');
    setProdBrand('');
    setProdCost(50);
    setProdPrice(80);
    setProdStock(15);
    setProdMinStock(5);
    setProdDesc('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdBrand(prod.brand);
    setProdCost(prod.purchaseCost);
    setProdPrice(prod.salePrice);
    setProdStock(prod.stock);
    setProdMinStock(prod.minStockAlert);
    setProdDesc(prod.description);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        category: prodCategory,
        brand: prodBrand,
        purchaseCost: prodCost,
        salePrice: prodPrice,
        stock: prodStock,
        minStockAlert: prodMinStock,
        description: prodDesc
      });
    } else {
      addProduct({
        name: prodName,
        category: prodCategory,
        brand: prodBrand,
        purchaseCost: prodCost,
        salePrice: prodPrice,
        stock: prodStock,
        minStockAlert: prodMinStock,
        description: prodDesc
      });
    }

    setIsProductModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <Store className="w-3.5 h-3.5" />
            <span>Punto de Venta (POS) & Suplementos</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Tienda del Gimnasio
          </h1>
          <p className="text-xs text-gray-500">
            Ventas rápidas de aguas, bebidas isotónicas, proteínas, creatinas, shakers y accesorios deportivos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('pos')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'pos' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              🛒 Terminal POS
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              📦 Inventario & Stock ({products.length})
            </button>
          </div>

          <button
            onClick={handleOpenNewProduct}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* POS TERMINAL TAB */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Products Grid (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            
            {/* Search & Category pills */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                <input
                  type="text"
                  placeholder="Buscar agua, proteína, creatina, pre-entreno, marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1 transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:text-slate-900 border border-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map(prod => {
                const isOutOfStock = prod.stock <= 0;
                const isLowStock = prod.stock <= prod.minStockAlert;

                return (
                  <div
                    key={prod.id}
                    onClick={() => !isOutOfStock && handleAddToCart(prod)}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group shadow-xs ${
                      isOutOfStock
                        ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase truncate max-w-[90px]">
                          {prod.brand}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          isOutOfStock 
                            ? 'bg-rose-50 text-rose-700 border-rose-200' 
                            : isLowStock 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {isOutOfStock ? 'Agotado' : `Stock: ${prod.stock}`}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[32px]">
                        {prod.name}
                      </h4>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-700 font-mono">
                        S/ {prod.salePrice.toFixed(2)}
                      </span>

                      <button
                        type="button"
                        disabled={isOutOfStock}
                        className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* POS Cart Sidebar (1 Col) */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col justify-between h-fit sticky top-16 shadow-xs">
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-3">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Ticket de Venta
                  </h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-[11px] text-gray-400 hover:text-rose-600 cursor-pointer"
                  >
                    Vaciar
                  </button>
                )}
              </div>

              {/* Client Selector */}
              <div className="space-y-1.5 mb-3 text-xs">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Cliente / Alumno
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value);
                    if (e.target.value) setCustomCustomerName('');
                  }}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="">Cliente Ocasional / Mostrador</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.planName})</option>
                  ))}
                </select>

                {!selectedMemberId && (
                  <input
                    type="text"
                    placeholder="Nombre del cliente (opcional)..."
                    value={customCustomerName}
                    onChange={(e) => setCustomCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600"
                  />
                )}
              </div>

              {/* Cart items list */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 mb-3">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    <ShoppingBag className="w-7 h-7 text-gray-300 mx-auto mb-1.5" />
                    El carrito está vacío.<br />Haz clic en un producto para añadirlo.
                  </div>
                ) : (
                  cart.map(item => (
                    <div 
                      key={item.product.id}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between gap-1.5 text-xs"
                    >
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">S/ {item.product.salePrice.toFixed(2)} c/u</p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleUpdateQty(item.product.id, -1)}
                          className="w-5 h-5 rounded bg-white border border-gray-300 text-slate-700 hover:bg-gray-100 flex items-center justify-center text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-mono font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.product.id, 1)}
                          className="w-5 h-5 rounded bg-white border border-gray-300 text-slate-700 hover:bg-gray-100 flex items-center justify-center text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-blue-700 font-mono text-xs">
                          S/ {(item.product.salePrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Payment & Checkout Footer */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="space-y-3 pt-2.5 border-t border-gray-200 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Método de Pago
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="yape_plin">📱 Yape / Plin</option>
                    <option value="tarjeta">💳 Tarjeta POS</option>
                    <option value="transferencia">🏦 Transferencia</option>
                  </select>
                </div>

                <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Total a Cobrar:</span>
                  <span className="text-lg font-bold text-blue-700 font-mono">
                    S/ {total.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-xs text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Cobrar & Generar Ticket</span>
                </button>
              </form>
            )}

          </div>

        </div>
      )}

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                    <th className="p-3">Producto</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Costo Compra</th>
                    <th className="p-3">Precio Venta</th>
                    <th className="p-3">Margen Ganancia</th>
                    <th className="p-3">Stock Actual</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(prod => {
                    const purchaseCost = prod.purchaseCost ?? 0;
                    const salePrice = prod.salePrice ?? 0;
                    const margin = salePrice - purchaseCost;
                    const marginPercent = salePrice > 0 ? ((margin / salePrice) * 100).toFixed(0) : '0';
                    const isLowStock = (prod.stock ?? 0) <= (prod.minStockAlert ?? 0);

                    return (
                      <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3">
                          <div>
                            <p className="font-bold text-slate-900">{prod.name}</p>
                            <p className="text-[11px] text-gray-500">{prod.brand} • {prod.description}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="capitalize px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] border border-gray-200">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-gray-600">S/ {purchaseCost.toFixed(2)}</td>
                        <td className="p-3 font-mono font-bold text-blue-700">S/ {salePrice.toFixed(2)}</td>
                        <td className="p-3">
                          <span className="text-emerald-700 font-bold font-mono text-[11px]">
                            +S/ {margin.toFixed(2)} ({marginPercent}%)
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={prod.stock}
                              onChange={(e) => updateStock(prod.id, Number(e.target.value))}
                              className="w-14 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-center text-slate-900 font-mono font-bold"
                            />
                            {isLowStock && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                                ¡Bajo!
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1 text-gray-400 hover:text-slate-800 rounded hover:bg-gray-100 cursor-pointer"
                              title="Editar producto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar ${prod.name}?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-gray-100 cursor-pointer"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Create / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProduct ? 'Editar Producto' : 'Añadir Producto a Tienda'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 my-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Creatina Monohidratada 300g"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="bebidas">Bebidas & Aguas</option>
                    <option value="suplementos">Suplementos & Proteínas</option>
                    <option value="snacks">Snacks & Barras</option>
                    <option value="accesorios">Accesorios de Entrenamiento</option>
                    <option value="ropa">Indumentaria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Marca / Laboratorio</label>
                  <input
                    type="text"
                    placeholder="Ej. Optimum Nutrition"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Costo Compra (S/)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={prodCost}
                    onChange={(e) => setProdCost(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Precio Venta (S/) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 font-bold text-blue-700 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Alerta de Stock Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={prodMinStock}
                    onChange={(e) => setProdMinStock(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Descripción Breve</label>
                <input
                  type="text"
                  placeholder="Ej. Botella 750ml con tapa deportiva"
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-3.5 py-1.5 text-gray-500 hover:text-slate-800 cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs cursor-pointer transition-all"
                >
                  {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POS Receipt Modal */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <div className="text-center pb-3 border-b border-dashed border-gray-200">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-1.5">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">GYMCONTROL PRO</h3>
              <p className="text-[11px] text-gray-500">Comprobante de Venta Electrónico</p>
              <p className="text-xs font-mono text-blue-700 font-bold mt-0.5">{lastReceipt.receiptNumber}</p>
            </div>

            <div className="my-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Fecha: {lastReceipt.date}</span>
                <span className="uppercase font-semibold text-slate-700">{lastReceipt.paymentMethod}</span>
              </div>

              <div className="text-[11px] text-gray-600">
                <p>Cliente: <span className="font-bold text-slate-900">{lastReceipt.relatedMemberName || 'Cliente Mostrador'}</span></p>
              </div>

              {/* Items */}
              <div className="border-t border-b border-dashed border-gray-200 py-2 space-y-1">
                {lastReceipt.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-slate-700 truncate max-w-[170px]">{it.quantity}x {it.productName}</span>
                    <span className="font-mono font-semibold text-slate-900">S/ {(it.total || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm pt-1">
                <span className="font-bold text-slate-700">TOTAL PAGADO:</span>
                <span className="font-bold text-emerald-700 text-base font-mono">
                  S/ {(lastReceipt.amount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => window.print()}
                className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-md text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir
              </button>
              <button
                onClick={() => setLastReceipt(null)}
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
