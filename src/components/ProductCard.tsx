import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

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
            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />
          {product.isNewArrival && (
            <span className="absolute top-4 left-4 bg-background px-4 py-1.5 luxury-border font-label-md text-[9px]">New Arrival</span>
          )}
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="space-y-1">
            <span className="font-label-md text-[9px] text-secondary lowercase italic opacity-60 tracking-widest">{product.category}</span>
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
