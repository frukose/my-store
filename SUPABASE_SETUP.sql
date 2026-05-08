-- 1. Create Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    brand_name TEXT DEFAULT 'aystores',
    tagline TEXT DEFAULT 'The pinnacle of modern digital tailoring in Nigeria.',
    currency TEXT DEFAULT 'NGN',
    commission TEXT DEFAULT '15%',
    whatsapp_number TEXT DEFAULT '2347030195046',
    primary_color TEXT DEFAULT '#111111',
    accent_color TEXT DEFAULT '#C5A059',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: Ensure whatsapp_number column exists if table was created previously
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='whatsapp_number') THEN
        ALTER TABLE site_settings ADD COLUMN whatsapp_number TEXT DEFAULT '2347030195046';
    END IF;
END $$;

-- 2. Seed initial settings (If not exists)
INSERT INTO site_settings (id, brand_name, tagline, primary_color, accent_color, whatsapp_number)
VALUES (1, 'aystores', 'The pinnacle of modern digital tailoring in Nigeria.', '#111111', '#C5A059', '2347030195046')
ON CONFLICT (id) DO UPDATE SET 
    whatsapp_number = COALESCE(site_settings.whatsapp_number, EXCLUDED.whatsapp_number);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    images TEXT[],
    sizes TEXT[],
    stock_level INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: Ensure all columns exist for products if table was created previously
DO $$ 
BEGIN 
    -- Ensure columns exist in the public schema
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='stock_level') THEN
        ALTER TABLE public.products ADD COLUMN stock_level INTEGER DEFAULT 10;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='description') THEN
        ALTER TABLE public.products ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='images') THEN
        ALTER TABLE public.products ADD COLUMN images TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='sizes') THEN
        ALTER TABLE public.products ADD COLUMN sizes TEXT[];
    END IF;
END $$;

-- 4. Create Activities Table for tracking
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    action TEXT NOT NULL,
    type TEXT NOT NULL, -- 'view', 'order', 'cart', 'system'
    amount TEXT, -- e.g., '₦145,000'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 6. Create Policies
DO $$ 
BEGIN
    -- Settings Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read of site settings') THEN
        CREATE POLICY "Allow public read of site settings" ON site_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update of site settings') THEN
        CREATE POLICY "Allow update of site settings" ON site_settings FOR UPDATE USING (true);
    END IF;

    -- Activities Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read of activities') THEN
        CREATE POLICY "Allow public read of activities" ON activities FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert of activities') THEN
        CREATE POLICY "Allow insert of activities" ON activities FOR INSERT WITH CHECK (true);
    END IF;

    -- Products Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read of products') THEN
        CREATE POLICY "Allow public read of products" ON products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin write of products') THEN
        CREATE POLICY "Allow admin write of products" ON products FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 7. Force Schema Cache Reload
-- This helps if columns were recently added and aren't visible to the API yet
NOTIFY pgrst, 'reload schema';
ALTER TABLE products REPLICA IDENTITY FULL; 
