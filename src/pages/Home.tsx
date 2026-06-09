import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Feather, Compass, Scissors, Award, Palette, Sparkles } from 'lucide-react';
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

const PROCESS_STEPS = [
  {
    id: '01',
    title: 'The Anatomy Blueprint',
    concept: 'Draping the Form',
    icon: Compass,
    description: 'We don\'t start with standard paper. Every garment begins as an organic wrap on muslin draping forms, carving shapes that trace the direct breathing movement of the wearer.',
    detail: 'Over 48 hours of computational and artisan modeling goes into the balance ratios.'
  },
  {
    id: '02',
    title: 'Tactile Curation',
    concept: 'Sourcing the Skin',
    icon: Feather,
    description: 'Sourcing deadstock Nigerian woven cottons, dense Italian wool crepes, and biodegradable silk blends. Every thread is selected to guarantee lightweight heat-expulsion and luxurious density.',
    detail: '100% traceably sourced certified artisanal production.'
  },
  {
    id: '03',
    title: 'The Atelier Stitch',
    concept: 'Precision Craft',
    icon: Scissors,
    description: 'Our Lagos atelier employs tailors with multiple decades of fine garment heritage. Pockets are hand-mitered, lapels are hand-rolled, and key buttonholes are hand-stitched with double silk cord.',
    detail: 'A single suit jacket takes up to 75 dedicated human-craft hours.'
  }
];

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMood, setActiveMood] = useState<keyof typeof MOODS>('minimalist');
  const [activeStep, setActiveStep] = useState(0);

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
    <div className={cn("transition-colors duration-1000 ease-in-out pb-32", mood.bgClass)}>
      
      {/* Interactive Mood Controller Banner */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto pt-6">
        <div className={cn("flex flex-wrap items-center justify-between gap-6 py-6 border-b border-dashed", mood.borderClass)}>
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4 animate-spin-slow text-accent" />
            <span className="font-label-md text-[10px] tracking-widest opacity-80 uppercase font-bold">
              Adjust Atelier Atmosphere:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(MOODS).map((mKey) => (
              <button
                key={mKey}
                onClick={() => setActiveMood(mKey)}
                className={cn(
                  "px-4 py-2 font-label-md text-[9px] tracking-widest uppercase transition-all duration-300 rounded-full border",
                  activeMood === mKey 
                    ? "bg-accent border-accent text-white font-extrabold shadow-sm scale-105" 
                    : cn("border-transparent hover:bg-neutral-500/10 opacity-70 hover:opacity-100", activeMood === 'brutalist' && "text-white")
                )}
              >
                {MOODS[mKey].name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Redesigned Hero Section */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto overflow-hidden pt-8 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-10 md:space-y-16">
            <div className="space-y-6 md:space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMood + '_tagline'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-px bg-accent" />
                  <span className="font-label-md text-accent tracking-[0.3em]">{mood.tagline} • Collection Volume 01</span>
                </motion.div>
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={activeMood + '_title'}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl md:text-8xl md:font-display-lg leading-tight md:leading-[0.95] tracking-tighter"
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
                  className="font-body-lg max-w-lg md:text-2xl opacity-90"
                >
                  {mood.desc}
                </motion.p>
              </AnimatePresence>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 md:gap-12 pt-8">
              <Link 
                to="/shop" 
                className="w-full sm:w-auto text-center bg-primary text-white hover:bg-accent px-16 py-6 font-label-md hover:scale-105 transition-all duration-500 rounded-full bg-gradient-to-r shadow-xl hover:shadow-accent/20"
              >
                Discover Collection
              </Link>
              <Link 
                to="/shop?category=clothes" 
                className="font-label-md border-b pb-2 hover:border-accent transition-all flex items-center gap-3 group"
              >
                Atelier Manifesto
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <AnimatePresence mode="wait">
              {heroProduct && (
                <motion.div 
                  key={activeMood + '_heroimg'}
                  initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.8 }}
                  className="aspect-[4/5] relative group"
                >
                  <div className="absolute inset-0 bg-accent/10 rounded-[var(--radius-luxury)] -rotate-3 transition-transform group-hover:rotate-0 duration-1000 scale-95" />
                  <div className="absolute inset-x-8 -bottom-12 z-30 bg-surface/85 backdrop-blur-xl px-10 py-8 border border-on-background/5 rounded-[2rem] md:block hidden transform transition-transform group-hover:-translate-y-2 duration-700 shadow-2xl text-[#111111]">
                    <span className="font-label-md text-accent block mb-2 opacity-80">Featured Atelier Piece</span>
                    <div className="flex justify-between items-end">
                      <h3 className="font-serif text-3xl italic">{heroProduct.name}</h3>
                      <span className="font-sans text-xl font-light tracking-tighter text-primary">₦{heroProduct.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <img 
                    src={heroProduct.images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'} 
                    alt="Editorial Craft Highlight" 
                    className="w-full h-full object-cover relative z-10 filter grayscale-[0.25] group-hover:grayscale-0 transition-all duration-1000 rounded-[var(--radius-luxury)] border border-on-background/10 shadow-lg"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Luxury Brand Stats Ribbon */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto pt-24">
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-dashed", mood.borderClass)}>
          <div className="space-y-1">
            <span className="font-serif text-3xl md:text-5xl italic block text-accent">100%</span>
            <span className="font-label-md text-[9px] opacity-60">Handcrafted in Lagos</span>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-3xl md:text-5xl italic block text-accent">75+ hr</span>
            <span className="font-label-md text-[9px] opacity-60">Production Per Silhouette</span>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-3xl md:text-5xl italic block text-accent">Traceable</span>
            <span className="font-label-md text-[9px] opacity-60">Ethically Woven Cottons</span>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-3xl md:text-5xl italic block text-accent">Bespoke</span>
            <span className="font-label-md text-[9px] opacity-60">Sleeve Canvas Adjustments</span>
          </div>
        </div>
      </section>

      {/* Upgraded Premium Lookbook Aesthetic Concept Gallery (No active Products show on Home page) */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto pt-28">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-accent/40" />
              <span className="font-label-md text-accent tracking-[0.2em]">Exhibition Lookbook</span>
            </div>
            <h2 className="font-display-md text-5xl md:text-7xl">Style Blueprint</h2>
          </div>
          <Link to="/shop" className="font-label-md text-accent flex items-center gap-3 group border-b border-accent/20 pb-2 hover:border-accent transition-colors">
            Explore Showroom Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Style 1 Card */}
          <div className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-luxury)] border border-on-background/10 bg-black/10">
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600" 
              alt="Atelier drape layout" 
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 flex flex-col justify-end p-8 text-white">
              <span className="font-label-md text-accent text-[9px] mb-2 block">Chapter I</span>
              <h4 className="font-serif text-3xl italic tracking-tight mb-4">The Draping Drape</h4>
              <p className="font-sans text-[11px] text-white/70 leading-relaxed max-w-xs uppercase tracking-wider block">
                Investigating fluid weight, heavy hems, and motion of natural cotton across Lagos shores.
              </p>
            </div>
          </div>

          {/* Style 2 Card */}
          <div className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-luxury)] border border-on-background/10 bg-black/10">
            <img 
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600" 
              alt="Atelier drape layout" 
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 flex flex-col justify-end p-8 text-white">
              <span className="font-label-md text-accent text-[9px] mb-2 block">Chapter II</span>
              <h4 className="font-serif text-3xl italic tracking-tight mb-4">Monolithic Tone</h4>
              <p className="font-sans text-[11px] text-white/70 leading-relaxed max-w-xs uppercase tracking-wider block">
                Pure, block color expressions defining clear physical spatial layout in premium fabrics.
              </p>
            </div>
          </div>

          {/* Style 3 Card */}
          <div className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-luxury)] border border-on-background/10 bg-black/10">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600" 
              alt="Atelier drape layout" 
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 flex flex-col justify-end p-8 text-white">
              <span className="font-label-md text-accent text-[9px] mb-2 block">Chapter III</span>
              <h4 className="font-serif text-3xl italic tracking-tight mb-4">Contrast Line</h4>
              <p className="font-sans text-[11px] text-white/70 leading-relaxed max-w-xs uppercase tracking-wider block">
                Where asymmetry meets bespoke structure. Tailored with architectural precision.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Fully Interactive Craft Blueprint & Walkthrough Segment */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto pt-32">
        <div className={cn("luxury-card grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 md:p-16 items-center", mood.bgClass === 'bg-[#1E1E1E] text-white' ? 'bg-[#2A2A2A] text-white' : 'bg-surface')}>
          
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="font-label-md text-accent block tracking-[0.25em]">Atelier Standards</span>
              <h3 className="font-serif text-4xl italic leading-tight">The Creation Blueprint</h3>
            </div>
            
            <p className="font-sans text-xs opacity-75 leading-relaxed">
              We separate design from industry hustle. To change the legacy of garments, we document every custom sleeve stitch and fabric density level under direct natural coordinates.
            </p>

            <div className="space-y-4">
              {PROCESS_STEPS.map((step, index) => {
                const IconComp = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={cn(
                      "w-full text-left p-5 rounded-[var(--radius-luxury)] transition-all flex items-center gap-5 border",
                      activeStep === index 
                        ? "bg-accent/10 border-accent/40 scale-102"
                        : "border-transparent hover:bg-neutral-500/5 opacity-60 hover:opacity-90"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/25 flex items-center justify-center shrink-0">
                      <IconComp className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="font-serif italic text-lg leading-none mb-1">{step.title}</div>
                      <span className="font-label-md text-[8px] opacity-60">{step.concept}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 bg-background/20 rounded-[var(--radius-luxury)] border border-on-background/10 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-4 right-6 font-mono text-[9px] opacity-25 uppercase tracking-widest">
              Sec_Spec // Ratio_01
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="font-mono text-6xl text-accent/20 font-bold leading-none">{PROCESS_STEPS[activeStep].id}</div>
                <h4 className="font-serif text-3xl italic text-accent">{PROCESS_STEPS[activeStep].title}</h4>
                <p className="font-sans text-sm opacity-80 leading-relaxed text-secondary-dark font-light">
                  {PROCESS_STEPS[activeStep].description}
                </p>
                <div className="pt-6 border-t border-dashed border-on-background/10">
                  <span className="font-label-md text-[9px] opacity-50 block mb-2">Micro Detail Quality:</span>
                  <p className="font-sans text-[11px] text-accent italic leading-tight">
                    {PROCESS_STEPS[activeStep].detail}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Dynamic Animated Philosophy Block with User-Selected Mood Inspiration Quote */}
      <section className="relative overflow-hidden pt-40 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] aspect-square bg-on-background rounded-[100%] transition-transform duration-[2000ms]" />
        
        <div className="relative px-6 md:px-12 max-w-5xl mx-auto text-center space-y-16 py-32 text-surface">
          <div className="space-y-6">
            <span className="font-label-md text-accent tracking-[0.5em] uppercase">Philosophical Drift</span>
            <AnimatePresence mode="wait">
              <motion.h2 
                key={activeMood + '_quote'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-7xl font-serif italic leading-[1.2] tracking-tight text-accent"
              >
                {mood.quote}
              </motion.h2>
            </AnimatePresence>
          </div>
          
          <div className="w-16 h-px bg-accent/40 mx-auto" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left items-center">
            <p className="font-body-lg text-surface/70 leading-relaxed text-xl md:text-2xl italic">
              "Every garment that leaves our shop is a testament to the luxury fashion movement in Nigeria. 
              We prioritize quality over quantity, and longevity over trends."
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
      
    </div>
  );
};
