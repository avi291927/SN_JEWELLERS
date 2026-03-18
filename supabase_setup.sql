-- ============================================================
-- SN Jewellers — Complete Supabase Database Setup
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ==================== 1. USER PROFILES TABLE ====================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow insert on signup" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON user_profiles;

-- Policies for user_profiles
CREATE POLICY "Anyone can read profiles" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow insert on signup" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ==================== 2. PRODUCTS TABLE ====================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    category TEXT NOT NULL CHECK (category IN ('gold', 'silver')),
    subcategory TEXT,
    weight TEXT,
    purity TEXT,
    images TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Everyone can view products (public catalog)
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

-- Only admins can insert products
CREATE POLICY "Admins can insert products" ON products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Only admins can update products
CREATE POLICY "Admins can update products" ON products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Only admins can delete products
CREATE POLICY "Admins can delete products" ON products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- ==================== 3. ENQUIRIES TABLE ====================
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit enquiry" ON enquiries;
DROP POLICY IF EXISTS "Admins can view enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admins can update enquiries" ON enquiries;
DROP POLICY IF EXISTS "Admins can delete enquiries" ON enquiries;

-- Anyone can submit an enquiry (no auth required for contact form)
CREATE POLICY "Anyone can submit enquiry" ON enquiries
    FOR INSERT WITH CHECK (true);

-- Only admins can view enquiries
CREATE POLICY "Admins can view enquiries" ON enquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Only admins can update enquiry status
CREATE POLICY "Admins can update enquiries" ON enquiries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Only admins can delete enquiries
CREATE POLICY "Admins can delete enquiries" ON enquiries
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- ==================== 4. FEEDBACK TABLE ====================
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can view feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can delete feedback" ON feedback;

-- Anyone can submit feedback
CREATE POLICY "Anyone can submit feedback" ON feedback
    FOR INSERT WITH CHECK (true);

-- Only admins can view feedback
CREATE POLICY "Admins can view feedback" ON feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Only admins can delete feedback
CREATE POLICY "Admins can delete feedback" ON feedback
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- ==================== 5. AUTO-CREATE PROFILE ON SIGNUP ====================
-- This function automatically creates a user_profiles row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, name, email, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== 6. STORAGE BUCKET FOR PRODUCT IMAGES ====================
-- Note: Run these separately if they fail (bucket might already exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

-- Anyone can view product images
CREATE POLICY "Anyone can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

-- Admins can upload product images
CREATE POLICY "Admins can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images'
        AND EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Admins can update product images
CREATE POLICY "Admins can update product images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images'
        AND EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Admins can delete product images
CREATE POLICY "Admins can delete product images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images'
        AND EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- ==================== 7. UPDATED_AT TRIGGER ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_enquiries_updated_at ON enquiries;
CREATE TRIGGER update_enquiries_updated_at
    BEFORE UPDATE ON enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== DONE ====================
-- After running this, make sure to:
-- 1. Create an admin user via Supabase Auth
-- 2. Update the user_profiles row for that user: 
--    UPDATE user_profiles SET role = 'admin' WHERE email = 'your_admin_email@example.com';
