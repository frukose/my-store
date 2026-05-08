import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

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
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto overflow-hidden pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-10 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <span className="font-label-md text-accent">Nº 01 Collection</span>
              <h1 className="text-5xl md:font-display-lg leading-tight md:leading-[1.1]">
                The Art of <br />
                <span className="italic font-serif">Fine Tailoring</span>
              </h1>
              <p className="font-body-md md:font-body-lg max-w-md">
                Refined silhouettes designed for the discerning individual. 
                Experience the intersection of architectural form and artisanal craftsmanship.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 md:gap-12 pt-4">
              <Link 
                to="/shop" 
                className="w-full sm:w-auto text-center bg-primary text-white px-12 py-5 font-label-md hover:bg-accent transition-all duration-500"
              >
                Enter Shop
              </Link>
              <Link 
                to="/shop?category=clothes" 
                className="font-label-md text-primary border-b border-primary/20 pb-2 hover:border-primary transition-all"
              >
                The Story
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            {heroProduct ? (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[4/5] relative group"
              >
                <div className="absolute inset-0 bg-accent/5 -translate-x-6 translate-y-6 transition-transform group-hover:-translate-x-4 group-hover:translate-y-4 duration-700" />
                <img 
                  src={heroProduct.images[0] || 'https://via.placeholder.com/600x800?text=Atelier+Piece'} 
                  alt="Editorial Highlight" 
                  className="w-full h-full object-cover relative z-10 filter grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute bottom-12 -right-12 z-20 bg-surface px-8 py-6 luxury-border md:block hidden">
                  <span className="font-label-md text-accent block mb-2">Highlight Piece</span>
                  <h3 className="font-serif text-2xl italic">{heroProduct.name}</h3>
                  <div className="luxury-line my-4" />
                  <span className="font-label-md tracking-tighter text-primary">₦{heroProduct.price.toLocaleString()}</span>
                </div>
              </motion.div>
            ) : (
              <div className="aspect-[4/5] bg-primary/5 luxury-border flex items-center justify-center italic font-serif text-secondary text-xl">
                Archival silence.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Pieces Grid */}
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto pt-12">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <h2 className="font-display-md">Selected Pieces</h2>
            <p className="font-label-md text-secondary lowercase">Autumn / Winter Edition '24</p>
          </div>
          <Link to="/shop" className="font-label-md text-accent border-b border-accent pb-2">View all Objects</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Block */}
      <section className="bg-on-background text-surface py-24 md:py-32 mt-24">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center space-y-10 md:space-y-12">
          <span className="font-label-md text-accent">The Philosophy</span>
          <h2 className="text-3xl md:text-6xl font-serif italic leading-tight">
            "Clothing should not just be worn, it should be experienced."
          </h2>
          <div className="w-12 h-px bg-accent mx-auto" />
          <p className="font-body-md md:font-body-lg text-surface/60 max-w-2xl mx-auto italic">
            Every garment that leaves our shop is a testament to the luxury fashion movement in Nigeria. 
            We prioritize quality over quantity, and longevity over trends.
          </p>
        </div>
      </section>
      
      {/* Secret Access Point Removed from here as requested in footer */}
    </div>
  );
};
