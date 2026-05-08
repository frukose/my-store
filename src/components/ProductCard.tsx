import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ArrowUpRight, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full bg-surface"
    >
      <Link to={`/product/${product.id}`} className="flex flex-col h-full space-y-6">
        <div className="aspect-[3/4] overflow-hidden bg-background relative luxury-border">
          <img
            src={product.images[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105",
              product.images.length > 1 && "group-hover:opacity-0"
            )}
          />
          {product.images.length > 1 && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 opacity-0 group-hover:opacity-100"
            />
          )}
          {product.videos && product.videos.length > 0 && (
            <div className="absolute top-4 right-4 bg-background/80 px-2 py-1 luxury-border font-label-md text-[8px] flex items-center gap-1">
              <Activity className="w-3 h-3" />
            </div>
          )}
          {product.isNewArrival && (
            <span className="absolute top-4 left-4 bg-background px-4 py-1.5 luxury-border font-label-md text-[9px]">New Arrival</span>
          )}
        </div>
        
            <div className="flex flex-col space-y-4">
          <div className="space-y-1">
            <span className="font-label-md text-[9px] text-secondary lowercase italic opacity-60 tracking-widest">
              {typeof product.category === 'object' ? (product.category as any)?.name || 'Shop Object' : product.category}
            </span>
            <h3 className="font-serif text-2xl italic tracking-tight text-primary group-hover:text-accent transition-colors">{product.name}</h3>
          </div>
          
          <div className="flex justify-between items-end">
            <span className="font-sans text-lg font-light tracking-tight">₦{product.price.toLocaleString()}</span>
            <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all overflow-hidden relative">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
