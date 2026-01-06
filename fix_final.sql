-- Final fix for RLS policies - handles existing policies
-- Execute this in your Supabase SQL Editor

-- 1. First, completely disable RLS to clear everything
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;

-- 2. Remove ALL policies on rooms table (using a more aggressive approach)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'rooms'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON rooms', policy_record.policyname);
    END LOOP;
END $$;

-- 3. Re-enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- 4. Create new simple policies
CREATE POLICY "Public read access for rooms" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Full access for all users" ON rooms
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Fix invalid image URLs in existing data
UPDATE rooms 
SET images = ARRAY['https://picsum.photos/seed/suite-vista-mar/400/300.jpg']
WHERE name = 'Suíte Vista Mar' AND images = ARRAY['https://exemplo.com/suite.jpg'];

UPDATE rooms 
SET images = ARRAY['https://picsum.photos/seed/chalet-jardim-tropical/400/300.jpg']
WHERE name = 'Chalé Jardim Tropical' AND images = ARRAY['https://exemplo.com/chalet.jpg'];

UPDATE rooms 
SET images = ARRAY['https://picsum.photos/seed/standard-conforto/400/300.jpg']
WHERE name = 'Quarto Standard Conforto' AND images = ARRAY['https://exemplo.com/standard.jpg'];

-- 6. Verify the final result
SELECT '=== ROOMS DATA ===' as info;
SELECT 
  id,
  name,
  images,
  status
FROM rooms;

SELECT '=== RLS POLICIES ===' as info;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'rooms';
