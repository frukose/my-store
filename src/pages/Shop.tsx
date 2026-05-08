import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

    fetchProducts();
  }, []);
  
  const filteredProducts = categoryFilter 
    ? products.filter(p => p.category === categoryFilter)
    : products;

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
            <span className="font-label-md text-accent tracking-[0.3em]">{categoryFilter || 'All Objects'}</span>
            <h2 className="font-display-md italic">Seasonal Essentials</h2>
            <p className="font-body-lg max-w-xl">
              A curated selection of architectural pieces designed for the modern lifestyle. 
              Each object is meticulously crafted in our atelier.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex items-center gap-3 px-8 py-4 luxury-border font-label-md text-[10px] hover:bg-primary hover:text-white transition-all group">
              <SlidersHorizontal className="w-4 h-4 opacity-40 group-hover:opacity-100" />
              Filter
            </button>
            <button className="flex items-center gap-3 px-8 py-4 luxury-border font-label-md text-[10px] hover:bg-primary hover:text-white transition-all group">
              Sort
              <ChevronDown className="w-4 h-4 opacity-40 group-hover:opacity-100" />
            </button>
          </div>
        </div>
        <div className="luxury-line" />
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20">
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
