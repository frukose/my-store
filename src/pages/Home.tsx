import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Activity } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { cn } from '../lib/utils';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      setIsLoading(true);
      const { data } = await supabase.from('products').select('*').limit(4);
      if (data) {
        setProducts(data.map(p => ({
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
    fetchHomeProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const heroProduct = products[3] || products[0]; 
  const features = products.slice(0, 3);

  return (
    <div className="space-y-section-gap pb-32">
      {/* Immersive Hero Section */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto overflow-hidden pt-8 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-10 md:space-y-16">
            <div className="space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-px bg-accent" />
                <span className="font-label-md text-accent">Volume 01: The Emergence</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl md:font-display-lg leading-tight md:leading-[1] tracking-tighter">
                Architecture <br />
                <span className="italic font-serif text-accent">of the Body</span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="font-body-lg max-w-lg md:text-2xl"
              >
                Refined silhouettes designed for the discerning individual. 
                Experience the intersection of form and artisanal craftsmanship.
              </motion.p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 md:gap-12 pt-8">
              <Link 
                to="/shop" 
                className="w-full sm:w-auto text-center bg-primary text-white px-16 py-6 font-label-md hover:bg-accent transition-all duration-500 rounded-full"
              >
                Discover Collection
              </Link>
              <Link 
                to="/shop?category=clothes" 
                className="font-label-md text-primary border-b border-primary/20 pb-2 hover:border-primary transition-all flex items-center gap-3 group"
              >
                Our Manifesto
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            {heroProduct ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[4/5] relative group"
              >
                <div className="absolute inset-0 bg-accent/10 rounded-[var(--radius-luxury)] -rotate-3 transition-transform group-hover:rotate-0 duration-1000 scale-95" />
                <div className="absolute inset-x-8 -bottom-12 z-30 bg-surface/80 backdrop-blur-xl px-10 py-8 luxury-border rounded-[2rem] md:block hidden transform transition-transform group-hover:-translate-y-2 duration-700 shadow-2xl">
                  <span className="font-label-md text-accent block mb-2 opacity-60">Iconic Piece</span>
                  <div className="flex justify-between items-end">
                    <h3 className="font-serif text-3xl italic">{heroProduct.name}</h3>
                    <span className="font-sans text-xl font-light tracking-tighter text-primary">₦{heroProduct.price.toLocaleString()}</span>
                  </div>
                </div>
                <img 
                  src={heroProduct.images[0] || 'https://via.placeholder.com/600x800?text=Atelier+Piece'} 
                  alt="Editorial Highlight" 
                  className="w-full h-full object-cover relative z-10 filter grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 rounded-[var(--radius-luxury)] luxury-border"
                />
              </motion.div>
            ) : (
              <div className="aspect-[4/5] bg-primary/5 luxury-border rounded-[var(--radius-luxury)] flex items-center justify-center italic font-serif text-secondary text-xl">
                The showroom is currently calm.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Pieces Grid */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto pt-24 md:pt-40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-px bg-on-background/20" />
               <span className="font-label-md text-secondary lowercase">Selected Objects</span>
            </div>
            <h2 className="font-display-md text-5xl md:text-7xl">Seasonal Edits</h2>
          </div>
          <Link to="/shop" className="font-label-md text-accent flex items-center gap-3 group">
            View full showroom
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {features.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className={cn(idx === 1 && "md:translate-y-20")}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Block */}
      <section className="relative overflow-hidden pt-40 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] aspect-square bg-on-background rounded-[100%] transition-transform duration-[2000ms]" />
        <div className="relative px-6 md:px-12 max-w-5xl mx-auto text-center space-y-16 py-32 text-surface">
          <div className="space-y-6">
            <span className="font-label-md text-accent tracking-[0.5em]">Our DNA</span>
            <h2 className="text-4xl md:text-7xl font-serif italic leading-[1.1] tracking-tight">
              Crafting a New Legacy <br /> in Nigerian Luxury.
            </h2>
          </div>
          <div className="w-16 h-px bg-accent/40 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left items-center">
            <p className="font-body-lg text-surface/70 leading-relaxed text-xl md:text-2xl">
              Every garment that leaves our shop is a testament to the luxury fashion movement in Nigeria. 
              We prioritize quality over quantity, and longevity over trends.
            </p>
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="font-label-md text-accent">01. Materiality</h4>
                <p className="font-sans text-sm text-surface/50 leading-relaxed">Sourcing the finest natural fibers from across the continent and beyond.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-label-md text-accent">02. Precision</h4>
                <p className="font-sans text-sm text-surface/50 leading-relaxed">Mastering the architectural drape through rigorous pattern drafting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Secret Access Point Removed from here as requested in footer */}
    </div>
  );
};
