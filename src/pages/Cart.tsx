import React from 'react';
import { useCart } from '../lib/CartContext';
import { PRODUCTS } from '../constants';
import { Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartCount } = useCart();

  const cartItems = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return { ...item, product };
  });

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "2347030195046";
    const itemsList = cartItems.map(item => 
      `- ${item.product?.name} (${item.selectedSize}) x${item.quantity}: ₦${((item.product?.price || 0) * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const message = encodeURIComponent(
      `Hello AYSTORES, I'd like to place an order from the Studio:\n\n${itemsList}\n\n*Total: ₦${subtotal.toLocaleString()}*`
    );
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="px-6 md:px-12 min-h-[70vh] flex flex-col items-center justify-center max-w-[1700px] mx-auto text-center space-y-12">
        <div className="space-y-4">
          <span className="font-label-md text-accent tracking-[0.4em]">The Bag</span>
          <h2 className="font-display-md text-5xl">Your bag is currently empty</h2>
          <p className="font-body-lg text-secondary italic">A curated selection of atelier objects awaits your exploration.</p>
        </div>
        <Link to="/shop" className="bg-primary text-white px-16 py-5 font-label-md hover:bg-accent transition-all duration-500">
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
                      <span className="font-label-md text-[10px] text-accent italic">{item.product?.category}</span>
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
                      <span className="font-label-md text-[9px] opacity-40">Studio Color</span>
                      <div className="font-label-md text-xs">{item.selectedColor}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-8">
                  <div className="flex items-center luxury-border px-4 py-2 gap-6">
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
                  <span>Studio Delivery</span>
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
                className="w-full bg-primary text-white py-6 font-label-md text-xs tracking-[0.3em] hover:bg-accent transition-all duration-500"
              >
                Checkout on WhatsApp
              </button>
              <div className="text-center space-y-4">
                <p className="font-caption text-[9px] leading-relaxed opacity-60">
                  By proceeding to checkout, you agree to our Studio Terms of Service and Privacy Policy. 
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
