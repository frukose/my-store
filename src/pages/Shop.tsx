import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Loader2, 
  Search, 
  LayoutGrid, 
  Grid2X2, 
  Eye, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Info, 
  Compass, 
  Feather, 
  Scissors, 
  HelpCircle,
  X,
  Plus
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { useCart } from '../lib/CartContext';
import { motion, AnimatePresence } from 'motion/react';

type SpaceTheme = 'noir' | 'alabaster' | 'industrial';

interface ThemeConfig {
  bgClass: string;
  textClass: string;
  cardBgClass: string;
  borderColor: string;
  accentColor: string;
  badgeClass: string;
}

const THEMES: Record<SpaceTheme, ThemeConfig> = {
  noir: {
    bgClass: 'bg-[#0A0A0A]',
    textClass: 'text-[#F5F2EB]',
    cardBgClass: 'bg-[#121212]',
    borderColor: 'border-[#FFFFFF]/10',
    accentColor: 'text-[#C5A059]',
    badgeClass: 'bg-[#C5A059]/10 text-[#C5A059]',
  },
  alabaster: {
    bgClass: 'bg-[#FAF8F5]',
    textClass: 'text-[#1F1E1B]',
    cardBgClass: 'bg-white',
    borderColor: 'border-[#1F1E1B]/15',
    accentColor: 'text-[#7D663A]',
    badgeClass: 'bg-[#7D663A]/10 text-[#7D663A]',
  },
  industrial: {
    bgClass: 'bg-[#151719]',
    textClass: 'text-[#FFFFFF]',
    cardBgClass: 'bg-[#1D2124]',
    borderColor: 'border-[#FFFFFF]/15',
    accentColor: 'text-[#E85B49]',
    badgeClass: 'bg-[#E85B49]/15 text-[#E85B49]',
  }
};

const POPULAR_SEARCH_HIGHLIGHTS = [
  { label: 'All Items', category: null },
  { label: 'Clothes Only', category: 'clothes' },
  { label: 'Designer Shoes', category: 'shoes' },
  { label: 'Fine Accessories', category: 'accessories' }
];

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [spaceTheme, setSpaceTheme] = useState<SpaceTheme>('noir');
  const [gridMode, setGridMode] = useState<'bento' | 'split'>('split');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  
  // Quick spec drawer or flip state
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  const [cartAddingId, setCartAddingId] = useState<string | null>(null);
  const [successAnimationId, setSuccessAnimationId] = useState<string | null>(null);
  
  const { addToCart } = useCart();

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setProducts(data.map(p => {
          // Safeguard numeric price to prevent .replace schema crashes
          let rawPrice = 0;
          if (typeof p.price === 'number') {
            rawPrice = p.price;
          } else if (p.price) {
            rawPrice = Number(String(p.price).replace(/[^0-9.-]+/g, ""));
          }

          return {
            id: p.id,
            name: p.name,
            price: rawPrice,
            description: p.description || '',
            category: p.category as any,
            images: p.images || [],
            videos: p.videos || [],
            sizes: p.sizes || ['S', 'M', 'L'],
            colors: p.colors || [],
            stockCount: p.stock_level || 5,
            inStock: (p.stock_level || 5) > 0,
            sku: `PIECE-${p.id}`,
            story: p.description || 'A masterpiece of classic high-fashion Nigerian couture styling'
          };
        }));
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const handleInstantQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setCartAddingId(p.id);
    
    setTimeout(() => {
      addToCart({
        productId: p.id,
        quantity: 1,
        selectedColor: p.colors[0] || 'Default Tone',
        selectedSize: p.sizes[0] || 'M'
      });
      setCartAddingId(null);
      setSuccessAnimationId(p.id);
      
      setTimeout(() => {
        setSuccessAnimationId(null);
      }, 2000);
    }, 800);
  };

  const filteredProducts = products
    .filter(p => {
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // DB order
    });

  const activeTheme = THEMES[spaceTheme];

  if (isLoading) {
    return (
      <div className="min-h-[85vh] bg-[#0A0A0A] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#C5A059]" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#C5A059]/80 uppercase">
          Initializing Exhibition Canvas...
        </span>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen transition-colors duration-1000 ease-in-out pb-32", activeTheme.bgClass, activeTheme.textClass)}>
      
      {/* Top Banner Controls - Ambient Controller Header */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto pt-6">
        <div className={cn("flex flex-wrap items-center justify-between gap-6 py-6 border-b border-dashed", activeTheme.borderColor)}>
          
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <Sparkles className={cn("w-4 h-4 animate-pulse", activeTheme.accentColor)} />
              <span className="font-label-md text-[9px] tracking-widest opacity-80 uppercase uppercase-label">
                Exhibition Atmosphere:
              </span>
            </div>
            
            <div className="flex bg-black/10 p-1 rounded-full border border-white/5">
              {(['noir', 'alabaster', 'industrial'] as SpaceTheme[]).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => setSpaceTheme(themeKey)}
                  className={cn(
                    "px-4 py-1.5 font-label-md text-[9px] tracking-wider rounded-full transition-all duration-300 capitalize",
                    spaceTheme === themeKey
                      ? "bg-primary text-white scale-105 font-bold shadow-md"
                      : "opacity-60 hover:opacity-100 text-[#717171]"
                  )}
                >
                  {themeKey}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-3.5 h-3.5 opacity-60" />
              <span className="font-label-md text-[9px]  tracking-widest opacity-80 uppercase">
                Grid System:
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setGridMode('split')}
                className={cn(
                  "p-2 rounded-lg border transition-all",
                  gridMode === 'split' 
                    ? "bg-primary/15 border-primary/40 text-primary" 
                    : "border-transparent opacity-50 hover:opacity-100"
                )}
                title="Symmetrical Rows"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridMode('bento')}
                className={cn(
                  "p-2 rounded-lg border transition-all",
                  gridMode === 'bento' 
                    ? "bg-primary/15 border-primary/40 text-primary" 
                    : "border-transparent opacity-50 hover:opacity-100"
                )}
                title="Staggered Lookbook"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Container */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto pt-16">
        
        {/* Curated Interactive Showcase Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-end">
          <div className="lg:col-span-6 space-y-6">
            <span className={cn("font-label-md text-[10px] tracking-[0.4em] uppercase font-bold", activeTheme.accentColor)}>
              Atelier Vault / {categoryFilter || 'All Objects'}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight leading-[1] text-accent">
              The Showroom
            </h1>
            <p className="font-serif text-lg md:text-xl font-light italic leading-relaxed opacity-80 max-w-xl">
              An interactive spatial layout of bespoke coordinates. Touch, browse materials, and summon premium tailored drapes right to your Lagos residence.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-6">
            {/* Live Search Terminal */}
            <div className="relative group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                placeholder="Query atelier materials, categories, colors..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchParams(prev => {
                    if (e.target.value) prev.set('q', e.target.value);
                    else prev.delete('q');
                    return prev;
                  }, { replace: true });
                }}
                className={cn(
                  "w-full pl-14 pr-12 py-5 bg-black/5 outline-none focus:ring-1 focus:ring-[#C5A059] border font-label-md text-[11px] tracking-wider rounded-full transition-all duration-300",
                  activeTheme.borderColor
                )}
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSearchParams(prev => { prev.delete('q'); return prev; });
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Capsule Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {POPULAR_SEARCH_HIGHLIGHTS.map((pill) => {
                const isSelected = (!pill.category && !categoryFilter) || (categoryFilter === pill.category);
                return (
                  <button
                    key={pill.label}
                    onClick={() => {
                      setSearchParams(prev => {
                        if (pill.category) prev.set('category', pill.category);
                        else prev.delete('category');
                        return prev;
                      });
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-full font-label-md text-[9px] tracking-widest border transition-all duration-300",
                      isSelected
                        ? "bg-accent border-accent text-white"
                        : cn("bg-transparent border-on-background/10 hover:border-accent opacity-80 hover:opacity-100")
                    )}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Filter Info and Sorting Metrics Deck */}
        <div className={cn("flex flex-wrap justify-between items-center gap-4 py-4 mb-12 border-b border-dashed", activeTheme.borderColor)}>
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wider opacity-60">
            <span>Showing {filteredProducts.length} unique shapes</span>
            {categoryFilter && (
              <>
                <span>/</span>
                <span className="text-accent italic lowercase">Filter active: {categoryFilter}</span>
              </>
            )}
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-secondary lowercase">Search: "{searchQuery}"</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-label-md text-[9px] tracking-widest opacity-60">Sort order:</span>
            <div className="flex p-0.5 rounded-lg border border-on-background/10">
              {(['newest', 'price-asc', 'price-desc'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortBy(mode)}
                  className={cn(
                    "px-4 py-2 rounded-md font-label-md text-[8px] tracking-wider transition-all",
                    sortBy === mode
                      ? "bg-primary text-white font-bold"
                      : "opacity-40 hover:opacity-100"
                  )}
                >
                  {mode === 'newest' ? 'New Arrivals' : mode === 'price-asc' ? '₦ Low' : '₦ High'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty Exhibition State */}
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6 text-accent animate-spin-slow" />
            </div>
            <h3 className="font-serif text-3xl italic">Aesthetic Silence</h3>
            <p className="font-sans text-xs opacity-75 leading-relaxed">
              No physical objects match your specific filter queries inside are. Try adjusting your search query, selecting another category, or cleansing the filters to reveal pieces.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className="px-8 py-3.5 bg-primary text-white font-label-md text-[9px] tracking-widest rounded-full hover:bg-accent transition-all duration-300"
            >
              Reset Showroom Catalog
            </button>
          </div>
        )}

        {/* Dynamic Responsive Interactive Showroom Grid */}
        <div className={cn(
          "grid transition-all duration-700 ease-in-out gap-3 sm:gap-6",
          gridMode === 'split'
            ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 sm:gap-y-16"
            : "grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-y-10 sm:gap-y-24"
        )}>
          {filteredProducts.map((p, idx) => {
            const isBentoTall = gridMode === 'bento' && (idx % 3 === 0);
            
            return (
              <motion.div
                key={p.id}
                layoutId={`card-container-${p.id}`}
                className={cn(
                  "group flex flex-col h-full rounded-[var(--radius-luxury)] overflow-hidden transition-all duration-500",
                  activeTheme.cardBgClass,
                  activeTheme.borderColor,
                  "border p-2 sm:p-4 hover:shadow-2xl hover:translate-y-[-4px]",
                  isBentoTall && "md:col-span-1 md:row-span-2 aspect-[3/5]"
                )}
              >
                {/* Media frame */}
                <div className="aspect-[3/4] relative w-full overflow-hidden bg-background luxury-border rounded-xl sm:rounded-2xl group">
                  <Link to={`/product/${p.id}`} className="block w-full h-full">
                    <img 
                      src={p.images[0] || 'https://via.placeholder.com/400x500?text=Atelier+Piece'} 
                      alt={p.name}
                      className="w-full h-full object-cover filter grayscale-[0.25] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />
                    
                    {p.images[1] && (
                      <img 
                        src={p.images[1]} 
                        alt={`${p.name} side angle`}
                        className="absolute inset-0 w-full h-full object-cover filter grayscale-[0.25] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 opacity-0 group-hover:opacity-100"
                      />
                    )}
                  </Link>

                  {/* Badges Overlay */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-2 pointer-events-none z-10">
                    <span className="bg-background/90 backdrop-blur-md text-primary font-label-md text-[7px] sm:text-[8px] px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-on-background/5">
                      {p.category}
                    </span>
                  </div>

                  {/* Hover Quick actions overlay */}
                  <div className="absolute inset-x-2 sm:inset-x-4 bottom-2 sm:bottom-4 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setInspectedProduct(p)}
                      className="bg-black/95 hover:bg-accent text-white backdrop-blur-md p-2.5 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
                      title="View Blueprint Specs"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => handleInstantQuickAdd(p, e)}
                      disabled={cartAddingId === p.id}
                      className={cn(
                        "bg-white text-black hover:bg-black hover:text-white px-3 sm:px-5 py-2 sm:py-3 rounded-full text-[8px] sm:text-[9px] font-label-md shadow-lg transition-all transform hover:scale-105 flex items-center gap-1.5",
                        successAnimationId === p.id && "bg-[#52B788] text-white border-[#52B788]"
                      )}
                    >
                      {cartAddingId === p.id ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : successAnimationId === p.id ? (
                        <>
                          <Check className="w-2.5 h-2.5" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Quick Bag
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Info block */}
                <div className="flex flex-col flex-1 pt-3 sm:pt-6 px-1 sm:px-2 justify-between">
                  <div>
                    <span className="font-caption lowercase text-[8px] sm:text-[9px] mb-1 sm:mb-2 block opacity-50">
                      {p.sku}
                    </span>
                    
                    <Link to={`/product/${p.id}`}>
                      <h3 className="font-serif italic text-sm sm:text-2xl tracking-tight leading-snug group-hover:text-accent transition-colors line-clamp-1 sm:line-clamp-none">
                        {p.name}
                      </h3>
                    </Link>

                    <p className="font-sans text-[10px] sm:text-xs tracking-wide opacity-70 mt-1 sm:mt-2 line-clamp-2 leading-relaxed hidden sm:block">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-3 sm:pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-dashed border-on-background/5 mt-3 sm:mt-4 gap-2 sm:gap-0">
                    <div className="space-y-0.5">
                      <span className="font-label-md text-[7px] sm:text-[8px] opacity-40 block uppercase">Est. Investment:</span>
                      <span className="font-sans text-xs sm:text-lg font-light tracking-tight block">
                        ₦{p.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => setInspectedProduct(p)}
                      className="font-label-md text-[7px] sm:text-[8px] tracking-widest text-[#C5A059] border-b border-accent/20 pb-0.5 hover:border-accent hover:text-primary transition-all flex items-center gap-1"
                    >
                      <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> View Specs
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </section>

      {/* Blueprint Spec Overlay Dialog (Detailed specifications list entirely on click without page reloading) */}
      <AnimatePresence>
        {inspectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-2xl bg-[#121212] text-[#F5F2EB] border border-white/10 p-8 rounded-[2rem] shadow-2xl z-10 overflow-hidden"
            >
              {/* Abstract decorative layout */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-mono text-[9px] text-[#C5A059] tracking-widest uppercase block mb-1">
                    Atelier Technical File // {inspectedProduct.sku}
                  </span>
                  <h3 className="font-serif italic text-4xl text-white">{inspectedProduct.name}</h3>
                </div>
                <button 
                  onClick={() => setInspectedProduct(null)}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                <div className="aspect-[4/5] bg-neutral-900 rounded-xl overflow-hidden border border-white/5 shadow-inner">
                  <img 
                    src={inspectedProduct.images[0]} 
                    alt={inspectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="font-label-md text-[8px] opacity-40 uppercase block mb-1">Artisan Story:</span>
                    <p className="font-sans text-xs leading-relaxed opacity-80 text-justify">
                      {inspectedProduct.story}
                    </p>
                  </div>

                  <div className="space-y-3.5 bg-white/5 p-5 rounded-2xl border border-white/5 font-mono text-[10px] text-white/90">
                    <div className="flex justify-between items-center">
                      <span className="opacity-50 uppercase flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-accent" /> Drape Ratio:
                      </span>
                      <span className="font-bold underline text-accent">Adaptive High Flex</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-50 uppercase flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-accent" /> Stitch hours:
                      </span>
                      <span>~48-72 Registered Craft Hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-50 uppercase flex items-center gap-1.5">
                        <Feather className="w-3.5 h-3.5 text-accent" /> Fiber Source:
                      </span>
                      <span>Certified Woven BioCotton</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-50 uppercase">Inventory status:</span>
                      <span className="text-[#52B788]">
                        {inspectedProduct.stockCount} units available
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 items-center justify-between border-t border-white/5">
                    <div className="space-y-0.5">
                      <span className="font-label-md text-[8px] opacity-40 uppercase block">Atelier Value:</span>
                      <span className="font-sans text-2xl font-light text-white">
                        ₦{inspectedProduct.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/product/${inspectedProduct.id}`}
                        className="px-6 py-4 bg-white/5 text-white hover:bg-white/10 rounded-full font-label-md text-[9px] tracking-widest transition-all"
                      >
                        Detailed Narrative
                      </Link>
                      <button
                        onClick={(e) => {
                          handleInstantQuickAdd(inspectedProduct, e);
                          setInspectedProduct(null);
                        }}
                        className="px-8 py-4 bg-accent hover:bg-accent/80 text-white rounded-full font-label-md text-[9px] tracking-widest transition-all hover:scale-105"
                      >
                        Secure Piece
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* End of Collection */}
      <div className="mt-40 text-center space-y-8">
        <div className="w-px h-24 bg-primary/20 mx-auto" />
        <p className="font-label-md text-secondary lowercase italic opacity-40">Atelier volume 01 exhibition closed</p>
      </div>

    </div>
  );
};
