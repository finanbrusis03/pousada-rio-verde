-- Fix RLS policies for rooms table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view rooms" ON rooms;
DROP POLICY IF EXISTS "Admin full access to rooms" ON rooms;

-- Create new policies for rooms
-- Everyone can view rooms (public read access)
CREATE POLICY "Enable read access for all users" ON rooms
  FOR SELECT USING (true);

-- Only authenticated users can insert rooms
CREATE POLICY "Enable insert for authenticated users" ON rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update rooms
CREATE POLICY "Enable update for authenticated users" ON rooms
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete rooms
CREATE POLICY "Enable delete for authenticated users" ON rooms
  FOR DELETE USING (auth.role() = 'authenticated');

-- Or alternatively, restrict to admin only:
-- Uncomment below for admin-only access

/*
-- Only admin can do everything with rooms
CREATE POLICY "Admin full access to rooms" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.email = 'admin@rioverde.com'
      AND auth.users.id = auth.uid()
    )
  );
*/
