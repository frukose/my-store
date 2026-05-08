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

-- 3. Create Products Table (Enhanced for Archival Data)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    stock_level INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Ensure columns exist if table was already present
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_level INTEGER DEFAULT 10;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 4. Storage Bucket for Archival Assets
-- Note: Create 'products' bucket in Supabase dashboard for this to work
-- Or use these SQL statements if your project supports extensions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Allow public read, authenticated upload)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');

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
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

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
    CREATE POLICY "Allow public read of products" ON public.products FOR SELECT USING (true);
    CREATE POLICY "Allow admin write of products" ON public.products FOR ALL USING (true) WITH CHECK (true);
END $$;

-- 7. Force Schema Cache Reload & Metadata
COMMENT ON TABLE public.products IS 'Archival pieces collection';
NOTIFY pgrst, 'reload schema';
ALTER TABLE public.products REPLICA IDENTITY FULL;
GRANT ALL ON public.products TO anon, authenticated, service_role;
