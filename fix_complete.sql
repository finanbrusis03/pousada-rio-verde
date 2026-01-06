-- Complete fix for RLS policies and image URLs
-- Execute this in your Supabase SQL Editor

-- 1. Fix RLS policies for rooms table
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Users can view rooms" ON rooms;
DROP POLICY IF EXISTS "Admin full access to rooms" ON rooms;

-- Re-enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create simple permissive policies
CREATE POLICY "Public read access for rooms" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Full access for authenticated users" ON rooms
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 2. Fix invalid image URLs in existing data
UPDATE rooms 
SET images = ARRAY['https://picsum.photos/seed/suite-vista-mar/400/300.jpg']
WHERE name = 'Suíte Vista Mar' AND images = ARRAY['https://exemplo.com/suite.jpg'];

UPDATE rooms 
SET images = ARRAY['https://picsum.photos/seed/chalet-jardim-tropical/400/300.jpg']
WHERE name = 'Chalé Jardim Tropical' AND images = ARRAY['https://exemplo.com/chalet.jpg'];

UPDATE rooms 
SET images = ARRAY['https://picsum.photos/seed/standard-conforto/400/300.jpg']
WHERE name = 'Quarto Standard Conforto' AND images = ARRAY['https://exemplo.com/standard.jpg'];

-- 3. Verify the changes
SELECT 
  id,
  name,
  images,
  status
FROM rooms;

-- 4. Verify policies are in place
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'rooms';

-- 5. Test access
SELECT 'Room count test: ' || COUNT(*) as result FROM rooms;
