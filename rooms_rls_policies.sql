-- Remover políticas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON rooms;
DROP POLICY IF EXISTS "Enable insert for all users" ON rooms;
DROP POLICY IF EXISTS "Enable update for all users" ON rooms;
DROP POLICY IF EXISTS "Enable delete for all users" ON rooms;
DROP POLICY IF EXISTS "Anyone can view rooms" ON rooms;
DROP POLICY IF EXISTS "Admin can insert rooms" ON rooms;
DROP POLICY IF EXISTS "Admin can update rooms" ON rooms;
DROP POLICY IF EXISTS "Admin can delete rooms" ON rooms;

-- Políticas seguras baseadas em autenticação real
-- Permitir que qualquer pessoa (autenticada ou anônima) possa ver quartos
CREATE POLICY "Rooms are publicly viewable" ON rooms
  FOR SELECT USING (true);

-- Permitir que apenas admin possa inserir quartos
CREATE POLICY "Only admin can insert rooms" ON rooms
  FOR INSERT WITH CHECK (
    auth.email() = 'admin@rioverde.com'
  );

-- Permitir que apenas admin possa atualizar quartos
CREATE POLICY "Only admin can update rooms" ON rooms
  FOR UPDATE USING (
    auth.email() = 'admin@rioverde.com'
  );

-- Permitir que apenas admin possa excluir quartos
CREATE POLICY "Only admin can delete rooms" ON rooms
  FOR DELETE USING (
    auth.email() = 'admin@rioverde.com'
  );

-- Garantir que RLS está habilitado
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
