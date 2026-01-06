-- Verificar a estrutura da tabela rooms
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    character_maximum_length
FROM 
    information_schema.columns 
WHERE 
    table_name = 'rooms' AND 
    table_schema = 'public'
ORDER BY 
    ordinal_position;

-- Verificar se o ID é do tipo UUID
SELECT 
    id, 
    pg_typeof(id) as id_type,
    name
FROM 
    public.rooms
LIMIT 1;
