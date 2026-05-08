import React, { useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Search, Plus, Trash2, Edit3, TrendingUp, Users, Package, ShoppingBag, BarChart3, ChevronRight, ArrowUpRight, Activity, Settings, Globe, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const MOCK_SALES_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'activity' | 'settings'>('dashboard');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbActivities, setDbActivities] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  const [siteSettings, setSiteSettings] = useState({
    brandName: 'aystores',
    tagline: 'The pinnacle of modern digital tailoring in Nigeria.',
    currency: 'NGN',
    commission: '15%',
    whatsappNumber: '2347030195046',
    primaryColor: '#111111',
    accentColor: '#C5A059',
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    price: '',
    category: 'Suits',
    description: '',
    images: [''],
    sizes: ['M', 'L', 'XL'],
    stock_level: 10
  });

  useEffect(() => {
    fetchSiteSettings();
    fetchActivities();
    fetchProducts();
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return;
    }

    if (data && data.length > 0) {
      setDbProducts(data);
    } else {
      // Auto-seed only if completely empty and no error
      if (data && data.length === 0) await seedProducts();
    }
  };

  const seedProducts = async () => {
    setIsLoading(true);
    const productsToSeed = PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price.toString(),
      category: p.category,
      description: p.description,
      images: p.images,
      sizes: p.sizes,
      stock_level: p.stockCount || 10
    }));

    const { error } = await supabase.from('products').upsert(productsToSeed);
    if (!error) {
      const { data } = await supabase.from('products').select('*');
      if (data) setDbProducts(data);
      alert('Archive seeded successfully.');
    } else {
      alert('Seed error: ' + error.message);
    }
    setIsLoading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Generate a reference ID if none provided
    const productId = newProduct.id || `PIECE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const { error } = await supabase.from('products').insert([{
      ...newProduct,
      id: productId,
      price: newProduct.price.toString(),
    }]);

    if (!error) {
      alert('New archival piece added.');
      setShowAddModal(false);
      setNewProduct({
        id: '',
        name: '',
        price: '',
        category: 'Suits',
        description: '',
        images: [''],
        sizes: ['M', 'L', 'XL'],
        stock_level: 10
      });
      fetchProducts();
    } else {
      alert('Error adding piece: ' + error.message);
    }
    setIsLoading(false);
  };

  const fetchSiteSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (data) {
      setSiteSettings({
        brandName: data.brand_name,
        tagline: data.tagline,
        currency: data.currency,
        commission: data.commission,
        whatsappNumber: data.whatsapp_number || '2347030195046',
        primaryColor: data.primary_color,
        accentColor: data.accent_color,
      });
      // Apply colors to document
      document.documentElement.style.setProperty('--primary-color', data.primary_color);
      document.documentElement.style.setProperty('--accent-color', data.accent_color);
    }
  };

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) setDbActivities(data);
  };

  const syncSettings = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from('site_settings')
      .update({
        brand_name: siteSettings.brandName,
        tagline: siteSettings.tagline,
        currency: siteSettings.currency,
        commission: siteSettings.commission,
        whatsapp_number: siteSettings.whatsappNumber,
        primary_color: siteSettings.primaryColor,
        accent_color: siteSettings.accentColor,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (!error) {
      document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
      document.documentElement.style.setProperty('--accent-color', siteSettings.accentColor);
      localStorage.setItem('brandName', siteSettings.brandName);
      localStorage.setItem('primaryColor', siteSettings.primaryColor);
      localStorage.setItem('accentColor', siteSettings.accentColor);
      alert('Studio configuration synchronized with Supabase.');
    } else {
      alert('Error syncing settings: ' + error.message);
    }
    setIsLoading(false);
  };

  const applyColors = () => {
    syncSettings();
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === dbProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(dbProducts.map(p => p.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: string) => {
    if (action === 'Delete') {
      if (!confirm(`Are you sure you want to delete ${selectedItems.length} objects from the archive?`)) return;
      
      setIsLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedItems);
      
      if (!error) {
        setDbProducts(prev => prev.filter(p => !selectedItems.includes(p.id)));
        setSelectedItems([]);
        alert('Items deleted successfully.');
      } else {
        alert('Error deleting items: ' + error.message);
      }
      setIsLoading(false);
    } else {
      alert(`Bulk ${action} for ${selectedItems.length} items`);
      setSelectedItems([]);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this piece from the archive?')) return;
    
    setIsLoading(true);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setDbProducts(prev => prev.filter(p => p.id !== id));
      alert('Product deleted successfully.');
    } else {
      alert('Error deleting product: ' + error.message);
    }
    setIsLoading(false);
  };

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'studio2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-card max-w-sm w-full space-y-12 py-16"
        >
          <div className="text-center space-y-4">
            <span className="font-label-md text-accent tracking-[0.4em] lowercase italic">Restricted Access</span>
            <h2 className="font-display-md text-4xl italic">Studio Entry</h2>
            <div className="luxury-line w-12 mx-auto opacity-30" />
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <input
                type="password"
                placeholder="ENTER ACCESS KEY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "w-full bg-background/50 luxury-border px-6 py-4 text-center font-label-md text-xs tracking-widest outline-none focus:border-primary transition-all",
                  error && "border-red-400 placeholder:text-red-400"
                )}
              />
              {error && (
                <p className="text-[9px] font-label-md text-red-500 text-center lowercase italic">Invalid credentials. Archive locked.</p>
              )}
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-white py-5 font-label-md text-[10px] tracking-[0.3em] hover:bg-accent transition-all duration-500"
            >
              Verify Identity
            </button>
          </form>
          
          <div className="text-center">
            <Link to="/" className="font-label-md text-[8px] opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest">Return to Public Interface</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: '₦4,250,000', icon: TrendingUp, change: '+12.5%', color: 'text-accent' },
    { label: 'Active Sessions', value: '1,284', icon: Users, change: '+5.2%', color: 'text-primary' },
    { label: 'Total Items', value: dbProducts.length, icon: Package, change: 'Stable', color: 'text-primary' },
    { label: 'Orders (Mo)', value: '142', icon: ShoppingBag, change: '+18%', color: 'text-accent' },
  ];

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-[1700px] mx-auto pb-40">
      {/* Editorial Header */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <span className="font-label-md text-accent tracking-[0.4em] lowercase italic">Studio Management Interface</span>
            <h1 className="font-display-md text-6xl italic">The Control Archive</h1>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className=" luxury-border px-8 py-4 font-label-md text-[10px] bg-primary text-white hover:bg-accent transition-all duration-500 flex items-center gap-3"
            >
              <Plus className="w-4 h-4" />
              New Collection Object
            </button>
          </div>
        </div>
        <div className="luxury-line opacity-30" />
      </section>

      {/* Internal Navigation */}
      <nav className="flex gap-12 border-b border-on-background/5 pb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'dashboard', label: 'Index / Metrics', icon: BarChart3 },
          { id: 'inventory', label: 'Inventory / Objects', icon: Package },
          { id: 'activity', label: 'Activity / Tracking', icon: Activity },
          { id: 'settings', label: 'Settings / Config', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "font-label-md text-[10px] tracking-[0.2em] flex items-center gap-3 transition-all relative shrink-0",
              activeTab === tab.id ? "text-primary pb-6" : "text-secondary opacity-40 hover:opacity-100"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-underline" className="absolute bottom-[-1px] left-0 w-full h-px bg-primary" />
            )}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="luxury-card space-y-6 bg-white/50 backdrop-blur-sm">
                  <div className="flex justify-between items-start">
                    <stat.icon className={cn("w-5 h-5 opacity-40", stat.color)} />
                    <span className="font-label-md text-[9px] text-accent font-black tracking-widest">{stat.change}</span>
                  </div>
                  <div className="space-y-2">
                    <p className="font-label-md text-[10px] text-secondary lowercase italic">{stat.label}</p>
                    <p className="font-serif text-3xl italic">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sales Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 luxury-card min-h-[400px] flex flex-col space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-label-md">Revenue Trajectory</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="font-label-md text-[8px] opacity-40">Trajectory</span>
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_SALES_DATA}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#717171', fontWeight: 500, fontFamily: 'Inter' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#717171', fontWeight: 500, fontFamily: 'Inter' }}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '0px', border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'Inter', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#C5A059" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="luxury-card space-y-8">
                  <h3 className="font-label-md">Recent Events</h3>
                  <div className="space-y-6">
                    {dbActivities.slice(0, 3).map((act) => (
                      <div key={act.id} className="flex gap-4 group cursor-pointer border-l border-on-background/5 pl-4 hover:border-accent transition-all">
                        <div className="flex-1 space-y-1">
                          <p className="font-serif text-sm italic">{act.username} <span className="not-italic text-secondary opacity-60 font-sans text-xs">{act.action}</span></p>
                          <p className="font-label-md text-[8px] opacity-40 uppercase tracking-widest">{new Date(act.created_at).toLocaleTimeString()}</p>
                        </div>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-all self-center" />
                      </div>
                    ))}
                    {dbActivities.length === 0 && (
                      <p className="text-xs font-label-md opacity-40 italic">No real-time activities recorded.</p>
                    )}
                  </div>
                  <button onClick={() => setActiveTab('activity')} className="w-full py-4 luxury-border font-label-md text-[9px] hover:bg-primary hover:text-white transition-all">
                    Open Activity Archive
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="luxury-card p-0 overflow-hidden relative">
              {selectedItems.length > 0 && (
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-8 py-4 flex items-center gap-8 luxury-border shadow-2xl"
                >
                  <span className="font-label-md text-[10px] tracking-widest">{selectedItems.length} Objects Selected</span>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="flex gap-6">
                    <button onClick={() => handleBulkAction('Update Stock')} className="font-label-md text-[9px] hover:text-accent transition-colors">Sync Stock</button>
                    <button onClick={() => handleBulkAction('Price Adjustment')} className="font-label-md text-[9px] hover:text-accent transition-colors">Adjust Price</button>
                    <button onClick={() => handleBulkAction('Delete')} className="font-label-md text-[9px] text-red-300 hover:text-red-100 transition-colors">Delete Archive</button>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <button onClick={() => setSelectedItems([])} className="font-label-md text-[9px] opacity-60 hover:opacity-100 uppercase italic">Cancel</button>
                </motion.div>
              )}

              <div className="p-8 border-b border-on-background/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-background/30">
                <div className="space-y-1">
                  <h3 className="font-label-md">Object Archive</h3>
                  <p className="font-caption">Total recorded items available in digital collection</p>
                </div>
                <div className="relative max-w-sm w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4 opacity-40" />
                  <input 
                    className="w-full bg-white luxury-border px-12 py-4 text-[10px] font-label-md uppercase outline-none focus:border-accent transition-all" 
                    placeholder="Reference SKU..." 
                    type="text" 
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background/20 font-label-md text-[9px] text-secondary border-b border-on-background/5">
                      <th className="px-8 py-6 w-12">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.length === dbProducts.length && dbProducts.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 luxury-border accent-primary cursor-pointer"
                        />
                      </th>
                      <th className="px-8 py-6">Reference Piece</th>
                      <th className="px-8 py-6">Stock Level</th>
                      <th className="px-8 py-6">Price Points</th>
                      <th className="px-8 py-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-on-background/5 font-sans">
                    {dbProducts.map((product) => (
                      <tr key={product.id} className={cn(
                        "hover:bg-background/40 transition-colors group",
                        selectedItems.includes(product.id) && "bg-primary/5"
                      )}>
                        <td className="px-8 py-6">
                          <input 
                            type="checkbox" 
                            checked={selectedItems.includes(product.id)}
                            onChange={() => toggleSelectItem(product.id)}
                            className="w-4 h-4 luxury-border accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="px-8 py-6 flex items-center gap-6">
                          <div className="w-16 h-20 bg-background luxury-border overflow-hidden shrink-0">
                            <img src={product.images?.[0]} alt="" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="font-serif text-lg italic tracking-tight">{product.name}</span>
                            <span className="text-[9px] text-secondary font-label-md lowercase opacity-40 tracking-widest">{product.category} // {product.id}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <input 
                            type="number" 
                            defaultValue={product.stock_level ?? 0}
                            className="bg-transparent border-b border-primary/10 font-serif italic text-xl w-16 text-center outline-none focus:border-accent"
                          />
                          <span className="font-label-md text-[8px] opacity-40 ml-2">units</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <span className="font-serif text-lg italic tracking-tight">₦</span>
                             <input 
                              type="text" 
                              defaultValue={Number(product.price || 0).toLocaleString()}
                              className="bg-transparent border-b border-primary/10 font-serif italic text-xl w-28 outline-none focus:border-accent"
                            />
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex justify-center gap-4">
                             <button title="Update Entry" className="p-3 luxury-border bg-white hover:bg-primary hover:text-white transition-all"><Globe className="w-4 h-4" /></button>
                             <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              title="Delete Entry" 
                              className="p-3 luxury-border bg-white hover:bg-accent hover:text-white transition-all text-red-500 hover:text-white"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {dbProducts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center font-label-md opacity-40 italic">
                          No products found in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
             <div className="luxury-card space-y-8">
               <div className="flex justify-between items-end">
                 <h3 className="font-label-md">Studio Activity Feed</h3>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="font-label-md text-[9px] opacity-60">Streaming Live Tracking</span>
                 </div>
               </div>
               
               <div className="space-y-4">
                 {dbActivities.map((act) => (
                   <div key={act.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 luxury-border bg-white/30 gap-4">
                     <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-10 h-10 flex items-center justify-center luxury-border",
                          act.type === 'order' ? "bg-accent text-white" : "bg-primary/5"
                        )}>
                          {act.type === 'order' ? <ShoppingBag className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                        </div>
                        <div className="space-y-1">
                          <p className="font-serif text-lg italic">{act.username} <span className="not-italic opacity-60 ml-2 font-sans text-xs">{act.action}</span></p>
                          <p className="font-label-md text-[9px] opacity-40 uppercase tracking-[0.2em]">{new Date(act.created_at).toLocaleString()}</p>
                        </div>
                     </div>
                     {act.amount && <span className="font-serif text-2xl italic text-primary">{act.amount}</span>}
                   </div>
                 ))}
                 {dbActivities.length === 0 && (
                   <div className="p-20 text-center space-y-4 luxury-border bg-white/20">
                     <p className="font-label-md opacity-40">The archive is currently silent.</p>
                   </div>
                 )}
               </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="luxury-card space-y-8">
                <h3 className="font-label-md">Public Brand Identity</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-[9px] opacity-40">Store Identity</label>
                    <input 
                      type="text" 
                      value={siteSettings.brandName}
                      onChange={(e) => setSiteSettings({...siteSettings, brandName: e.target.value})}
                      className="w-full bg-background/50 luxury-border px-6 py-4 font-serif italic text-2xl outline-none focus:border-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-[9px] opacity-40">Tagline / Mission</label>
                    <textarea 
                      rows={3}
                      value={siteSettings.tagline}
                      onChange={(e) => setSiteSettings({...siteSettings, tagline: e.target.value})}
                      className="w-full bg-background/50 luxury-border px-6 py-4 font-sans text-sm resize-none outline-none focus:border-accent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="luxury-card space-y-8">
                <h3 className="font-label-md">Global Preferences</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center py-4 border-b border-on-background/5">
                     <span className="font-label-md text-xs">Primary Currency</span>
                     <span className="font-serif italic text-xl">Nigerian Naira (₦)</span>
                   </div>
                   <div className="flex justify-between items-center py-4 border-b border-on-background/5">
                     <span className="font-label-md text-xs">Studio Platform Fee</span>
                     <input 
                      type="text" 
                      value={siteSettings.commission}
                      onChange={(e) => setSiteSettings({...siteSettings, commission: e.target.value})}
                      className="bg-transparent border-b border-primary/10 font-serif italic text-xl w-16 text-center outline-none focus:border-accent"
                    />
                   </div>

                    <div className="space-y-4">
                      <h4 className="font-label-md text-[9px] opacity-40 uppercase tracking-widest">Global Contact</h4>
                      <div className="space-y-2">
                        <label className="text-[10px] font-label-md opacity-60">WhatsApp Number</label>
                        <input 
                          type="text" 
                          value={siteSettings.whatsappNumber}
                          onChange={(e) => setSiteSettings({...siteSettings, whatsappNumber: e.target.value})}
                          className="w-full bg-transparent border-b border-primary/10 py-3 outline-none focus:border-accent font-mono text-sm"
                          placeholder="e.g. 2347030195046"
                        />
                      </div>
                    </div>

                   <div className="space-y-4 pt-4">
                     <h4 className="font-label-md text-[9px] opacity-40 uppercase tracking-widest">Interface Aesthetics</h4>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[10px] font-label-md opacity-60">Primary</label>
                         <div className="flex items-center gap-3">
                           <input 
                            type="color" 
                            value={siteSettings.primaryColor}
                            onChange={(e) => setSiteSettings({...siteSettings, primaryColor: e.target.value})}
                            className="w-8 h-8 rounded-full border-0 p-0 cursor-pointer overflow-hidden"
                          />
                          <span className="font-mono text-[10px] uppercase opacity-40">{siteSettings.primaryColor}</span>
                         </div>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-label-md opacity-60">Accent</label>
                         <div className="flex items-center gap-3">
                           <input 
                            type="color" 
                            value={siteSettings.accentColor}
                            onChange={(e) => setSiteSettings({...siteSettings, accentColor: e.target.value})}
                            className="w-8 h-8 rounded-full border-0 p-0 cursor-pointer overflow-hidden"
                          />
                          <span className="font-mono text-[10px] uppercase opacity-40">{siteSettings.accentColor}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
                <button 
                  onClick={applyColors}
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-5 font-label-md text-[10px] tracking-[0.3em] hover:bg-accent transition-all duration-500 uppercase flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Synchronize Studio Config'
                  )}
                </button>
              </div>

              <div className="luxury-card space-y-8">
                <h3 className="font-label-md text-red-500 italic">Clinical Database Tools</h3>
                <p className="text-xs font-sans opacity-60">Use these only if the archive becomes out of sync or empty. Seeding will attempt to restore missing defaults.</p>
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={seedProducts}
                    disabled={isLoading}
                    className="w-full luxury-border py-4 font-label-md text-[9px] tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'RE-SEED CORE ARCHIVE'}
                  </button>
                  <button 
                    onClick={() => { fetchProducts(); fetchActivities(); fetchSiteSettings(); }}
                    className="w-full luxury-border py-4 font-label-md text-[9px] tracking-widest hover:bg-accent hover:text-white transition-all"
                  >
                    FORCE REFRESH METRICS
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="luxury-card w-full max-w-2xl relative z-10 bg-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="font-display-md text-3xl italic">New Archive Entry</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-label-md text-[9px] opacity-40">Reference SKU (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. PIECE-001"
                      value={newProduct.id}
                      onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
                      className="w-full bg-background/50 luxury-border px-6 py-4 font-mono text-xs uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-[9px] opacity-40">Display Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Structured Silk Blazer"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-background/50 luxury-border px-6 py-4 font-serif italic text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-[9px] opacity-40">Price (NGN)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="e.g. 150000"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full bg-background/50 luxury-border px-6 py-4 font-serif italic text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-[9px] opacity-40">Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-background/50 luxury-border px-6 py-4 font-label-md text-[10px] appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label-md text-[9px] opacity-40">Archival Image URL</label>
                  <input 
                    required
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.images[0]}
                    onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})}
                    className="w-full bg-background/50 luxury-border px-6 py-4 font-mono text-[10px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label-md text-[9px] opacity-40">Piece Narrative (Description)</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe the craftsmanship and intent..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full bg-background/50 luxury-border px-6 py-4 font-sans text-sm resize-none"
                  />
                </div>

                <div className="flex gap-4">
                   <button 
                    disabled={isLoading}
                    type="submit" 
                    className="flex-1 bg-primary text-white py-5 font-label-md text-[10px] tracking-[0.3em] hover:bg-accent transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'RECORD TO ARCHIVE'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-10 luxury-border py-5 font-label-md text-[10px] tracking-[0.3em] hover:bg-background transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

