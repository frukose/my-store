import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const filteredProducts = categoryFilter 
    ? PRODUCTS.filter(p => p.category === categoryFilter)
    : PRODUCTS;

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
