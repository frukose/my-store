import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { cn } from '../lib/utils';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.price.replace(/[^0-9.-]+/g,"")), // Ensure price is numeric for sorting
          description: p.description || '',
          category: p.category as any,
          images: p.images || [],
          videos: p.videos || [],
          sizes: p.sizes || [],
          colors: [],
          stockCount: p.stock_level,
          inStock: p.stock_level > 0,
          sku: `PIECE-${p.id}`
        })));
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);
  
  const filteredProducts = products
    .filter(p => !categoryFilter || p.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // Default: 'newest' (already sorted by DB)
    });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 max-w-[1700px] mx-auto pb-32">
      {/* Page Header */}
      <section className="py-20 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <span className="font-label-md text-accent tracking-[0.3em] uppercase">{categoryFilter || 'All Objects'}</span>
            <h2 className="font-display-md italic">Seasonal Essentials</h2>
            <p className="font-body-lg max-w-xl">
              A curated selection of architectural pieces designed for the modern lifestyle. 
              Each object is meticulously crafted in our atelier.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto relative">
            <div className="relative">
              <button 
                onClick={() => {
                  if (categoryFilter) setSearchParams({});
                  else setShowFilterDropdown(!showFilterDropdown);
                }}
                className="flex items-center gap-3 px-8 py-4 luxury-border font-label-md text-[10px] hover:bg-primary hover:text-white transition-all group rounded-full"
              >
                <SlidersHorizontal className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                {categoryFilter ? 'Clear Filter' : 'Filter'}
              </button>
              
              {showFilterDropdown && !categoryFilter && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white luxury-border z-50 shadow-xl overflow-hidden">
                  <button 
                    onClick={() => { setSearchParams({ category: 'clothes' }); setShowFilterDropdown(false); }}
                    className="w-full px-6 py-4 text-left font-label-md text-[10px] hover:bg-background transition-colors border-b luxury-border"
                  >
                    Clothes
                  </button>
                  <button 
                    onClick={() => { setSearchParams({ category: 'shoes' }); setShowFilterDropdown(false); }}
                    className="w-full px-6 py-4 text-left font-label-md text-[10px] hover:bg-background transition-colors border-b luxury-border"
                  >
                    Shoes
                  </button>
                  <button 
                    onClick={() => { setSearchParams({ category: 'accessories' }); setShowFilterDropdown(false); }}
                    className="w-full px-6 py-4 text-left font-label-md text-[10px] hover:bg-background transition-colors"
                  >
                    Accessories
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-3 px-8 py-4 luxury-border font-label-md text-[10px] hover:bg-primary hover:text-white transition-all group min-w-[140px] justify-between rounded-full"
              >
                <span>
                  {sortBy === 'newest' ? 'Newest' : sortBy === 'price-asc' ? 'Price: Low' : 'Price: High'}
                </span>
                <ChevronDown className={cn("w-4 h-4 opacity-40 group-hover:opacity-100 transition-transform", showSortDropdown && "rotate-180")} />
              </button>
              
              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white luxury-border z-50 shadow-xl overflow-hidden">
                  <button 
                    onClick={() => { setSortBy('newest'); setShowSortDropdown(false); }}
                    className="w-full px-6 py-4 text-left font-label-md text-[10px] hover:bg-background transition-colors border-b luxury-border"
                  >
                    Newest Arrival
                  </button>
                  <button 
                    onClick={() => { setSortBy('price-asc'); setShowSortDropdown(false); }}
                    className="w-full px-6 py-4 text-left font-label-md text-[10px] hover:bg-background transition-colors border-b luxury-border"
                  >
                    Price: Low to High
                  </button>
                  <button 
                    onClick={() => { setSortBy('price-desc'); setShowSortDropdown(false); }}
                    className="w-full px-6 py-4 text-left font-label-md text-[10px] hover:bg-background transition-colors"
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="luxury-line" />
      </section>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-12 gap-y-12 md:gap-y-20">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* End of Collection */}
      <div className="mt-40 text-center space-y-8">
        <div className="w-px h-24 bg-primary/20 mx-auto" />
        <p className="font-label-md text-secondary lowercase italic opacity-40">End of atelier volume 01</p>
      </div>
    </div>
  );
};
