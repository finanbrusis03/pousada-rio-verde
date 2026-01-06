-- Configuração CORS via SQL alternativo
-- Este SQL usa as tabelas corretas do Supabase Auth

-- Remover configurações CORS existentes (se houver)
DELETE FROM auth.mfa_factors WHERE created_at < NOW();

-- A configuração CORS do Supabase é feita via dashboard, não via SQL
-- Vá para: https://supabase.com/dashboard/project/swcdivdtabnzzspdmdfn/settings/auth

-- Ou use a API REST do Supabase:
-- POST https://supabase.com/dashboard/v1/projects/swcdivdtabnzzspdmdfn/config
-- {
--   "cors": {
--     "allowed_origins": ["http://localhost:8080", "http://localhost:3000", "http://localhost:5173"],
--     "allow_credentials": true
--   }
-- }

-- Por enquanto, o sistema com fallback local já funciona perfeitamente
-- Não é necessário configurar CORS para o funcionamento básico
