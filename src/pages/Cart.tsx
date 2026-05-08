import React, { useEffect, useState } from 'react';
import { useCart } from '../lib/CartContext';
import { Trash2, ArrowLeft, Plus, Minus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('2347030195046');

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      
      // Fetch WhatsApp and Products in parallel
      const [settingsRes, productsRes] = await Promise.all([
        supabase.from('site_settings').select('whatsapp_number').eq('id', 1).single(),
        supabase.from('products').select('*')
      ]);

      if (settingsRes.data?.whatsapp_number) setWhatsappNumber(settingsRes.data.whatsapp_number);
      
      if (productsRes.data) {
        setProducts(productsRes.data.map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          description: p.description || '',
          category: p.category as any,
          images: p.images || [],
          sizes: p.sizes || [],
          colors: [],
          stockCount: p.stock_level,
          inStock: p.stock_level > 0,
          sku: `PIECE-${p.id}`
        })));
      }
      setIsLoading(false);
    };

    fetchCartData();
  }, []);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  });

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleWhatsAppCheckout = () => {
    const phoneNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const brandName = localStorage.getItem('brandName') || 'aystores';
    const itemsList = cartItems.map(item => 
      `- ${item.product?.name} (${item.selectedSize}) x${item.quantity}: ₦${((item.product?.price || 0) * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const message = encodeURIComponent(
      `Hello ${brandName.toUpperCase()}, I'd like to place an order from the Shop:\n\n${itemsList}\n\n*Total: ₦${subtotal.toLocaleString()}*`
    );
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="px-6 md:px-12 min-h-[70vh] flex flex-col items-center justify-center max-w-[1700px] mx-auto text-center space-y-12">
        <div className="space-y-4">
          <span className="font-label-md text-accent tracking-[0.4em]">The Bag</span>
          <h2 className="font-display-md text-5xl">Your bag is currently empty</h2>
          <p className="font-body-lg text-secondary italic">A curated selection of atelier objects awaits your exploration.</p>
        </div>
        <Link to="/shop" className="bg-primary text-white px-16 py-5 font-label-md hover:bg-accent transition-all duration-500 rounded-full">
          Discover Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 max-w-[1700px] mx-auto pb-40 pt-12">
      <div className="flex justify-between items-end mb-20">
        <div className="space-y-4">
          <span className="font-label-md text-accent tracking-[0.4em]">Review Order</span>
          <h1 className="font-display-md text-6xl">Shopping Bag</h1>
        </div>
        <span className="font-label-md text-secondary lowercase italic">({cartCount} pieces selected)</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-12">
          <div className="luxury-line" />
          {cartItems.map((item, idx) => (
            <div key={`${item.productId}-${item.selectedSize}-${idx}`} className="group flex flex-col md:flex-row gap-12 relative">
              <div className="w-full md:w-48 aspect-[3/4] bg-background luxury-border overflow-hidden flex-shrink-0">
                <img src={item.product?.images[0]} alt={item.product?.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-label-md text-[10px] text-accent italic">
                        {typeof item.product?.category === 'object' ? (item.product.category as any)?.name || 'Shop Piece' : item.product?.category}
                      </span>
                      <h3 className="font-serif text-3xl italic tracking-tight">{item.product?.name}</h3>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-secondary hover:text-primary transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex gap-6">
                    <div className="space-y-2">
                      <span className="font-label-md text-[9px] opacity-40">Size</span>
                      <div className="font-label-md text-xs">{item.selectedSize}</div>
                    </div>
                    <div className="space-y-2">
                      <span className="font-label-md text-[9px] opacity-40">Shop Color</span>
                      <div className="font-label-md text-xs">{item.selectedColor}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-8">
                  <div className="flex items-center luxury-border px-4 py-2 gap-6 rounded-full">
                    <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="hover:text-accent"><Minus className="w-4 h-4" /></button>
                    <span className="font-label-md w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="hover:text-accent"><Plus className="w-4 h-4" /></button>
                  </div>
                  <p className="font-serif text-2xl italic tracking-tight text-primary">₦ {( (item.product?.price || 0) * item.quantity ).toLocaleString()}</p>
                </div>
              </div>
              <div className="luxury-line absolute bottom-[-24px] opacity-30" />
            </div>
          ))}

          <Link to="/shop" className="inline-flex items-center gap-4 font-label-md text-secondary hover:text-primary transition-all group pt-12">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            Return to Collection
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-12 space-y-12">
            <div className="space-y-8">
              <h2 className="font-label-md text-accent tracking-[0.4em]">Order Summary</h2>
              <div className="space-y-6">
                <div className="flex justify-between font-label-md text-xs text-secondary italic">
                  <span>Subtotal</span>
                  <span>₦ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-label-md text-xs text-secondary italic">
                  <span>Shop Delivery</span>
                  <span className="text-accent uppercase not-italic">Complimentary</span>
                </div>
                <div className="luxury-line" />
                <div className="flex justify-between items-end">
                  <span className="font-label-md">Total</span>
                  <span className="font-serif text-4xl italic">₦ {subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <button 
                onClick={handleWhatsAppCheckout}
                className="w-full bg-primary text-white py-6 font-label-md text-xs tracking-[0.3em] hover:bg-accent transition-all duration-500 rounded-full"
              >
                Checkout on WhatsApp
              </button>
              <div className="text-center space-y-4">
                <p className="font-caption text-[9px] leading-relaxed opacity-60">
                  By proceeding to checkout, you agree to our Shop Terms of Service and Privacy Policy. 
                  All objects are subject to availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
