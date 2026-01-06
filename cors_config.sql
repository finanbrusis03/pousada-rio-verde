-- Configuração CORS para desenvolvimento
-- Execute este SQL no Supabase para permitir requisições do localhost

-- Habilitar CORS para desenvolvimento
INSERT INTO auth.config (
  name,
  value
) VALUES 
  ('cors_allowed_origins', '["http://localhost:8080", "http://localhost:3000", "http://localhost:5173"]')
ON CONFLICT (name) DO UPDATE SET 
  value = '["http://localhost:8080", "http://localhost:3000", "http://localhost:5173"]';

-- Permitir requisições de autenticação
INSERT INTO auth.config (
  name,
  value
) VALUES 
  ('cors_allow_credentials', 'true')
ON CONFLICT (name) DO UPDATE SET 
  value = 'true';
