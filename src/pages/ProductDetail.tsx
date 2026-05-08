import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PRODUCTS } from '../constants';
import { useCart } from '../lib/CartContext';
import { Heart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS.find(p => p.id === id);

  if (!product) return <Navigate to="/shop" />;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert('Please select a size');
      return;
    }
    addToCart({
      productId: product.id,
      quantity: quantity,
      selectedColor: product.colors[0],
      selectedSize: selectedSize || 'One Size'
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const phoneNumber = "2347030195046";
    const brandName = localStorage.getItem('brandName') || 'aystores';
    const message = encodeURIComponent(
      `Hello ${brandName.toUpperCase()}, I'm interested in the ${product.name}${selectedSize ? ` (${selectedSize})` : ''}. Could you provide more details?`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const relatedItems = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id);

  return (
    <div className="px-6 md:px-12 max-w-[1700px] mx-auto pb-40">
      {/* Navigation Header */}
      <div className="py-12 flex justify-between items-center">
        <Link to="/shop" className="inline-flex items-center gap-4 font-label-md text-secondary hover:text-primary transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          Back to Collection
        </Link>
        <div className="flex gap-4 font-label-md text-secondary lowercase italic opacity-50">
          <span>Studio</span>
          <span>/</span>
          <span>{product.category}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Editorial Image Gallery */}
        <div className="order-2 lg:order-1 lg:col-span-7 space-y-8 md:space-y-12">
          {product.images.map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 1 }}
              className="aspect-[4/5] overflow-hidden luxury-border bg-background"
            >
              <img src={img} alt={`${product.name} editorial view ${idx + 1}`} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-opacity duration-1000" />
            </motion.div>
          ))}
        </div>

        {/* Purchase Interface - Sticky on desktop */}
        <div className="order-1 lg:order-2 lg:col-span-5">
          <div className="lg:sticky lg:top-12 space-y-12 lg:space-y-16">
            <div className="space-y-6">
              <span className="font-label-md text-accent italic lowercase">Reference no. {product.id.slice(0, 8)}</span>
              <h1 className="text-4xl md:text-6xl font-display-md leading-tight">{product.name}</h1>
              <div className="flex justify-between items-center py-4 border-y border-on-background/10">
                <span className="font-label-md">Studio Price</span>
                <span className="font-serif text-2xl md:text-3xl italic">₦{product.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-10 lg:space-y-12">
              <p className="font-body-md md:font-body-lg">
                {product.story || product.description}
              </p>

              {/* Size Selection */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-label-md">Select Size</span>
                  <button className="font-label-md text-[10px] text-accent border-b border-accent pb-1">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-16 luxury-border font-label-md text-xs transition-all ${
                        selectedSize === size 
                          ? 'bg-primary text-white border-primary' 
                          : 'hover:border-primary opacity-60 hover:opacity-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-6">
                <span className="font-label-md">Quantity</span>
                <div className="flex items-center gap-6 luxury-border w-fit px-4 py-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-accent"><Minus className="w-4 h-4" /></button>
                  <span className="font-label-md w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-accent"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-6">
                <button 
                  onClick={handleAddToCart}
                  className="w-full h-20 bg-primary text-white font-label-md text-xs tracking-[0.3em] hover:bg-accent transition-all duration-500 disabled:opacity-50"
                  disabled={isAdded}
                >
                  {isAdded ? 'Piece Secured' : 'Secure the Piece'}
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleWhatsAppInquiry}
                    className="h-16 luxury-border font-label-md text-[9px] hover:bg-primary hover:text-white transition-all"
                  >
                    Studio Inquiry
                  </button>
                  <button className="h-16 luxury-border font-label-md text-[9px] flex items-center justify-center gap-2 group hover:bg-primary hover:text-white transition-all">
                    <Heart className="w-3 h-3 group-hover:fill-current" />
                    Archive Move
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-12 border-t border-on-background/5">
                <p className="font-caption">Complimentary nationwide shipping on all Volume 01 objects.</p>
                <p className="font-caption">Secure payments processed via encrypted studio channels.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Pairings */}
      {relatedItems.length > 0 && (
        <section className="mt-60 space-y-20">
          <div className="text-center space-y-6">
            <span className="font-label-md text-accent">Selected Pairings</span>
            <h3 className="font-display-md text-5xl italic">Complete the Silhouette</h3>
            <div className="w-12 h-px bg-primary/20 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {relatedItems.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
