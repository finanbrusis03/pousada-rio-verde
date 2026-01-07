-- Verificar usuário atual e permissões
SELECT 
    u.id,
    u.email,
    u.role as user_role,
    u.raw_user_meta_data->>'role' as custom_role,
    u.raw_app_meta_data->'provider'->>'role' as provider_role,
    u.raw_app_meta_data,
    u.raw_user_meta_data
FROM 
    auth.users u
WHERE 
    u.email = 'criszimn@rioverde.com';

-- Verificar se o usuário atual é admin
SELECT 
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid() AND (
            raw_user_meta_data->>'role' = 'admin' OR
            raw_app_meta_data->'provider'->>'role' = 'admin' OR
            email = 'criszimn@rioverde.com'
        )
    ) AS is_admin;

-- Testar acesso à tabela rooms
SELECT 
    has_table_privilege('authenticated', 'rooms', 'SELECT') as can_select,
    has_table_privilege('authenticated', 'rooms', 'INSERT') as can_insert,
    has_table_privilege('authenticated', 'rooms', 'UPDATE') as can_update,
    has_table_privilege('authenticated', 'rooms', 'DELETE') as can_delete;
