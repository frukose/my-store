import React from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/CartContext';

interface HeaderProps {
  brandName?: string;
}

export const Header: React.FC<HeaderProps> = ({ brandName = 'aystores' }) => {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="px-6 md:px-12 pt-12 pb-6 shrink-0 max-w-[1700px] mx-auto w-full">
      <div className="flex justify-between items-center h-16 relative">
        <div className="flex items-center gap-16">
          <Link to="/" className="text-3xl font-serif tracking-tight lowercase italic">
            {brandName}
          </Link>
          <nav className="hidden lg:flex gap-12 text-[11px] font-medium uppercase tracking-[0.3em] text-secondary">
            <Link to="/shop" className="text-primary hover:text-accent transition-colors relative">Collection</Link>
            <Link to="/shop?category=clothes" className="hover:text-primary transition-all">Shop</Link>
            <Link to="/shop?category=shoes" className="hover:text-primary transition-all">Showroom</Link>
          </nav>
        </div>
        
        <div className="flex gap-8 items-center">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = formData.get('q') as string;
              if (q?.trim()) {
                navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
                e.currentTarget.reset();
              } else {
                navigate('/shop');
              }
            }}
            className="flex items-center gap-2 group cursor-pointer border-b border-on-background/10 focus-within:border-primary transition-all pb-1 h-8"
          >
            <button type="submit" className="focus:outline-none hover:text-primary transition-colors">
              <Search className="w-4 h-4 text-secondary group-focus-within:text-primary" />
            </button>
            <input 
              name="q"
              type="text"
              placeholder="Search Objects..."
              autoComplete="off"
              className="font-label-md text-secondary bg-transparent outline-none w-28 sm:w-40 md:w-56 focus:w-64 transition-all placeholder:text-secondary/30 text-[11px] uppercase tracking-widest"
            />
          </form>
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
