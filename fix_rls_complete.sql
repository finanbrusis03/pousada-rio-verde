-- Complete RLS fix for rooms table
-- Execute this in your Supabase SQL Editor

-- 1. First, disable RLS temporarily to ensure we can make changes
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies on rooms table
DROP POLICY IF EXISTS "Enable read access for all users" ON rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Users can view rooms" ON rooms;
DROP POLICY IF EXISTS "Admin full access to rooms" ON rooms;
DROP POLICY IF EXISTS "Users can view own data" ON rooms;
DROP POLICY IF EXISTS "Users can insert own reservations" ON rooms;
DROP POLICY IF EXISTS "Users can update own reservations" ON rooms;
DROP POLICY IF EXISTS "Admin full access to reservations" ON rooms;

-- 3. Re-enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- 4. Create simple permissive policies for rooms
-- Allow public read access (needed for the website to show rooms)
CREATE POLICY "Public read access for rooms" ON rooms
  FOR SELECT USING (true);

-- Allow authenticated users to perform all operations
CREATE POLICY "Full access for authenticated users" ON rooms
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 5. Verify policies are in place
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'rooms';

-- 6. Test that the table is accessible
SELECT COUNT(*) as room_count FROM rooms;
