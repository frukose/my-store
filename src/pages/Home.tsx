import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { cn } from '../lib/utils';

type MoodConfig = {
  name: string;
  tagline: string;
  serifTerm: string;
  desc: string;
  quote: string;
  bgClass: string;
  accentClass: string;
  borderClass: string;
};

const MOODS: Record<string, MoodConfig> = {
  minimalist: {
    name: 'Minimalist',
    tagline: 'Quiet Luxury',
    serifTerm: 'Silent Sophistication',
    desc: 'Uncluttered silhouettes with clean proportions. Stripped of loud noise, highlighting tactile raw linens and drape form.',
    quote: '"Simplicity is the ultimate complexity of shape and space."',
    bgClass: 'bg-[#F9F8F6] text-[#111111]',
    accentClass: 'text-accent',
    borderClass: 'border-on-background/10',
  },
  brutalist: {
    name: 'Brutalist',
    tagline: 'Raw Geometry',
    serifTerm: 'Monolithic Shape',
    desc: 'Rigid tailoring structuralism. Inspired by architectural concrete, sharp shoulders, thick canvases, and uncompromised symmetry.',
    quote: '"Structure dictates behavior. We carve tailoring from raw elements."',
    bgClass: 'bg-[#1E1E1E] text-white',
    accentClass: 'text-[#E5C158]',
    borderClass: 'border-white/25',
  },
  fluid: {
    name: 'Fluid',
    tagline: 'Liquid Drape',
    serifTerm: 'Organic Waves',
    desc: 'Garments flowing with biological motion. Experience drapes that respond to wind, breathing, and natural Nigerian air currents.',
    quote: '"Form should never restrict the human spirit; let it flow like rivers."',
    bgClass: 'bg-[#F1EBE4] text-[#2C2115]',
    accentClass: 'text-[#A07A4E]',
    borderClass: 'border-[#2C2115]/10',
  },
  deco: {
    name: 'Deco',
    tagline: 'Golden Symmetry',
    serifTerm: 'Rich Legacy',
    desc: 'Lavish geometric embellishments, high contrast design, and structural opulence meant to reflect traditional royal wear.',
    quote: '"Tailoring is a celebration of status, lineage, and handcrafted beauty."',
    bgClass: 'bg-[#0F141D] text-[#ECEFF4]',
    accentClass: 'text-[#DFB15B]',
    borderClass: 'border-[#DFB15B]/20',
  },
};

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMood, setActiveMood] = useState<keyof typeof MOODS>('minimalist');

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
  const mood = MOODS[activeMood];

  return (
    <div className={cn("transition-colors duration-1000 ease-in-out pb-24 min-h-[85vh] flex flex-col justify-between", mood.bgClass)}>
      
      {/* Interactive Mood Controller Banner */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto pt-4 w-full shrink-0">
        <div className={cn("flex flex-wrap items-center justify-between gap-4 py-4 border-b border-dashed", mood.borderClass)}>
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-accent" />
            <span className="font-label-md text-[9px] tracking-widest opacity-80 uppercase font-bold">
              Atelier Atmosphere:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(MOODS).map((mKey) => (
              <button
                key={mKey}
                onClick={() => setActiveMood(mKey)}
                className={cn(
                  "px-3 py-1 font-label-md text-[8px] tracking-widest uppercase transition-all duration-300 rounded-full border",
                  activeMood === mKey 
                    ? "bg-accent border-accent text-white font-extrabold shadow-sm scale-105" 
                    : cn("border-transparent hover:bg-neutral-500/5 opacity-70 hover:opacity-100", activeMood === 'brutalist' && "text-white")
                )}
              >
                {MOODS[mKey].name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Redesigned Hero Section */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto overflow-hidden py-12 md:py-16 w-full flex-grow flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          <div className="lg:col-span-6 space-y-8 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMood + '_tagline'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-px bg-accent" />
                  <span className="font-label-md text-accent text-[10px] tracking-[0.3em] uppercase">{mood.tagline} • Collection Volume 01</span>
                </motion.div>
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={activeMood + '_title'}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tighter"
                >
                  The Sculpted <br />
                  <span className="italic font-serif text-accent block mt-1">{mood.serifTerm}</span>
                </motion.h1>
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                <motion.p 
                  key={activeMood + '_desc'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-body-lg max-w-md md:text-xl opacity-90 leading-relaxed font-light"
                >
                  {mood.desc}
                </motion.p>
              </AnimatePresence>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 pt-4">
              <Link 
                to="/shop" 
                className="w-full sm:w-auto text-center bg-primary text-white hover:bg-accent px-12 py-5 font-label-md hover:scale-105 transition-all duration-500 rounded-full shadow-lg"
              >
                Discover Collection
              </Link>
              <Link 
                to="/shop?category=clothes" 
                className="font-label-md text-[10px] uppercase tracking-widest border-b pb-1.5 hover:border-accent transition-all flex items-center gap-2 group"
              >
                Atelier Manifesto
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <AnimatePresence mode="wait">
              {heroProduct && (
                <motion.div 
                  key={activeMood + '_heroimg'}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.8 }}
                  className="aspect-[4/5] relative group max-w-md mx-auto lg:max-w-none"
                >
                  <div className="absolute inset-0 bg-accent/5 rounded-3xl -rotate-2 transition-transform group-hover:rotate-0 duration-1000 scale-98" />
                  <div className="absolute inset-x-6 -bottom-6 z-30 bg-surface/90 backdrop-blur-md px-6 py-5 border border-on-background/5 rounded-2xl md:block hidden transform transition-transform group-hover:-translate-y-1 duration-700 shadow-xl text-[#111111]">
                    <span className="font-label-md text-accent text-[8px] tracking-widest block uppercase mb-1">Featured Atelier Masterpiece</span>
                    <div className="flex justify-between items-end">
                      <h3 className="font-serif text-xl italic">{heroProduct.name}</h3>
                      <span className="font-sans text-sm font-light tracking-tighter text-primary">₦{heroProduct.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <img 
                    src={heroProduct.images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'} 
                    alt="Editorial Craft Highlight" 
                    className="w-full h-full object-cover relative z-10 filter grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 rounded-2xl border border-on-background/10 shadow-md"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Simplified, elegant quote footer */}
      <footer className="px-6 md:px-12 max-w-[1700px] mx-auto w-full shrink-0 text-center select-none opacity-80 pt-8">
        <span className="font-serif italic text-xs tracking-wider opacity-65 font-light">
          {mood.quote}
        </span>
      </footer>
      
    </div>
  );
};
