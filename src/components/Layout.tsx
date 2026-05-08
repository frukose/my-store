import React, { useEffect } from 'react';
import Header from './Header';
import { BottomNav } from './BottomNav';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    const savedPrimary = localStorage.getItem('primaryColor');
    const savedAccent = localStorage.getItem('accentColor');
    if (savedPrimary) document.documentElement.style.setProperty('--primary-color', savedPrimary);
    if (savedAccent) document.documentElement.style.setProperty('--accent-color', savedAccent);
  }, []);

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary-container">
      <Header />
      <main className="min-h-[calc(100vh-144px)]">
        {children}
      </main>
      <BottomNav />
      {/* Footer (Desktop Only) */}
      <footer className="hidden md:block py-32 px-12 mt-20 border-t border-on-background/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 max-w-[1700px] mx-auto">
          <div className="col-span-2 space-y-6">
            <h2 className="font-serif text-3xl italic tracking-tight lowercase">aystores</h2>
            <p className="font-body-lg max-w-sm">The pinnacle of modern digital tailoring in Nigeria. Curation, intentionality, and a premium shopping experience.</p>
          </div>
          <div className="space-y-8">
            <h3 className="font-label-md">Collections</h3>
            <ul className="space-y-4 font-label-md text-[10px] text-secondary lowercase italic">
              <li><Link to="/shop?category=clothes" className="hover:text-primary transition-colors">Studio Goods</Link></li>
              <li><Link to="/shop?category=shoes" className="hover:text-primary transition-colors">Footwear Archive</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-primary transition-colors">Daily Objects</Link></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h3 className="font-label-md">Company</h3>
            <ul className="space-y-4 font-label-md text-[10px] text-secondary lowercase italic">
              <li><a href="#" className="hover:text-primary transition-colors">Our Philosophy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-on-background/5 flex flex-col md:flex-row justify-between items-center gap-8 text-secondary font-caption max-w-[1700px] mx-auto">
          <p>© 2024 AYSTORES ATELIER. PRESERVING FORM.</p>
          <div className="flex gap-8 md:gap-12 font-label-md text-[9px] lowercase italic">
            <span className="cursor-pointer hover:text-primary">Instagram</span>
            <span className="cursor-pointer hover:text-primary">LinkedIn</span>
            <Link to="/admin" className="opacity-10 hover:opacity-100 transition-opacity">_archive_</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
