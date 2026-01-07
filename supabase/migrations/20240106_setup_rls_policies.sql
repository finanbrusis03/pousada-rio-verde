-- 1. Remover políticas existentes
DROP POLICY IF EXISTS "Permitir leitura para todos" ON public.rooms;
DROP POLICY IF EXISTS "Permitir gerenciamento para autenticados" ON public.rooms;

-- 2. Permitir leitura para todos (público)
CREATE POLICY "Permitir leitura para todos" 
ON public.rooms
FOR SELECT
USING (true);

-- 3. Verificar se o usuário atual é admin
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND (
      email IN ('criszimn@rioverde.com', 'admin@rioverde.com')
      OR raw_user_meta_data->>'role' = 'admin'
      OR (raw_app_meta_data->'provider'->>'role') = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Permitir todas as operações para administradores
CREATE POLICY "Permitir gerenciamento para administradores" 
ON public.rooms
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Garantir permissões explícitas
GRANT ALL PRIVILEGES ON TABLE public.rooms TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
