-- 1. Create Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    brand_name TEXT DEFAULT 'aystores',
    tagline TEXT DEFAULT 'The pinnacle of modern digital tailoring in Nigeria.',
    currency TEXT DEFAULT 'NGN',
    commission TEXT DEFAULT '15%',
    primary_color TEXT DEFAULT '#111111',
    accent_color TEXT DEFAULT '#C5A059',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed initial settings (If not exists)
INSERT INTO site_settings (id, brand_name, tagline, primary_color, accent_color)
VALUES (1, 'aystores', 'The pinnacle of modern digital tailoring in Nigeria.', '#111111', '#C5A059')
ON CONFLICT (id) DO NOTHING;

-- 3. Create Activities Table for tracking
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    action TEXT NOT NULL,
    type TEXT NOT NULL, -- 'view', 'order', 'cart', 'system'
    amount TEXT, -- e.g., '₦145,000'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Simple public read for settings, Admin write would be restricted in production)
-- For this setup, we allow anyone with the anon key to read, and update if they have the keys.
-- Ideally, you'd restrict 'UPDATE' to authenticated admins only.

CREATE POLICY "Allow public read of site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow update of site settings" ON site_settings FOR UPDATE USING (true);

CREATE POLICY "Allow public read of activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Allow insert of activities" ON activities FOR INSERT WITH CHECK (true);
