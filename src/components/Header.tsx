import React from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';

export const Header: React.FC = () => {
  const { cartCount } = useCart();

  return (
    <header className="px-6 md:px-12 pt-12 pb-6 shrink-0 max-w-[1700px] mx-auto w-full">
      <div className="flex justify-between items-center h-16 relative">
        <div className="flex items-center gap-16">
          <Link to="/" className="text-3xl font-serif tracking-tight lowercase italic">
            aystores
          </Link>
          <nav className="hidden lg:flex gap-12 text-[11px] font-medium uppercase tracking-[0.3em] text-secondary">
            <Link to="/shop" className="text-primary hover:text-accent transition-colors relative">Collection</Link>
            <Link to="/shop?category=clothes" className="hover:text-primary transition-all">Studio</Link>
            <Link to="/shop?category=shoes" className="hover:text-primary transition-all">Archive</Link>
          </nav>
        </div>
        
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Search className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
            <span className="font-label-md text-secondary group-hover:text-primary transition-colors">Search</span>
          </div>
          <Link 
            to="/cart" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-label-md text-primary group-hover:text-accent transition-colors">Bag</span>
          </Link>
        </div>
      </div>
      <div className="luxury-line mt-6 opacity-30" />
    </header>
  );
};

export default Header;
