import React from 'react';
import { Home, Store, Search, ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export const BottomNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Store, label: 'Shop', path: '/shop' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: ShoppingBag, label: 'Bag', path: '/cart' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center bg-surface border-t border-on-background/5 pb-safe z-50 h-20 md:hidden px-6">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center text-secondary transition-all duration-300",
              isActive && "text-primary"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className="w-5 h-5 mb-1" />
              <span className="font-serif text-[10px] lowercase italic">{item.label}</span>
              {/* Active Dot */}
              <div className={cn("w-1 h-1 rounded-full bg-accent mt-1 transition-opacity", isActive ? "opacity-100" : "opacity-0")} />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
