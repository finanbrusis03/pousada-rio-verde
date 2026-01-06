-- Remover políticas existentes
DROP POLICY IF EXISTS "Permitir leitura para todos" ON public.rooms;
DROP POLICY IF EXISTS "Permitir inserção para usuários autenticados" ON public.rooms;
DROP POLICY IF EXISTS "Permitir atualização para usuários autenticados" ON public.rooms;
DROP POLICY IF EXISTS "Permitir exclusão para usuários autenticados" ON public.rooms;

-- Criar políticas
CREATE POLICY "Permitir leitura para todos" 
ON public.rooms
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção para usuários autenticados" 
ON public.rooms
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" 
ON public.rooms
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" 
ON public.rooms
FOR DELETE
USING (auth.role() = 'authenticated');
