# 🚀 Configuração do Supabase para o Sistema Rio Verde

## 📋 Pré-requisitos

1. **Conta Supabase**
   - Crie uma conta em [supabase.com](https://supabase.com)
   - Crie um novo projeto

2. **Dependências Instaladas**
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-react
   ```

## 🔧 Configuração do Projeto

### 1. **Variáveis de Ambiente**
   Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

   Configure as variáveis:
   ```env
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_supabase
   VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_stripe
   ```

### 2. **Executar Schema SQL**
   Execute o schema SQL no Supabase:
   - Abra o painel do Supabase
   - Vá para "SQL Editor"
   - Copie e cole o conteúdo do arquivo `supabase_schema.sql`
   - Execute o script

### 3. **Configuração do Auth**
   O sistema já está configurado para usar:
   - Email + senha para login/cadastro
   - JWT tokens para sessão
   - Row Level Security (RLS) para proteção de dados

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas:
- **rooms**: Quartos e acomodações
- **clients**: Dados dos hóspedes
- **reservations**: Sistema de reservas
- **payments**: Histórico de pagamentos
- **blocked_dates**: Bloqueio manual de datas

### Segurança:
- RLS (Row Level Security) implementado
- Políticas de acesso por usuário
- Admin tem acesso completo
- Clientes só acessam seus próprios dados

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Login/cadastro de clientes
- Contexto global de autenticação
- Proteção de rotas

### ✅ Área do Cliente
- Perfil completo do hóspede
- Histórico de reservas com status
- Interface responsiva

### ✅ Sistema de Reservas
- Seleção de quartos com dados reais
- Verificação de disponibilidade em tempo real
- Cálculo automático de valores
- Fluxo em 3 passos

### ✅ Sistema de Pagamentos
- Página de pagamento completa
- Suporte para Pix (QR Code)
- Suporte para cartão de crédito
- Integração simulada com Stripe

## 🔄 Próximos Passos

### 1. **Integração Real com Supabase**
   Substituir dados mockados por chamadas reais à API
   Implementar webhooks para confirmações automáticas

### 2. **Melhorias no Painel Admin**
   Conectar com dados reais do Supabase
   Dashboard com estatísticas verdadeiras
   Gestão completa de reservas
   Sistema de pagamentos real

### 3. **WhatsApp Business API**
   Implementar chatbot com fluxos configuráveis
   Atendimento 24/7 automatizado
   Integração com sistema de reservas

## 🛠️ Solução de Problemas Comuns

### Erros de Conexão:
   Verifique se as variáveis de ambiente estão corretas
   Confirme a URL e chave do Supabase

### Debug:
   Use `console.log()` para verificar dados
   Verifique a aba "Network" no navegador

### Performance:
   Os índices foram criados para otimizar consultas
   Use `EXPLAIN` em queries complexas

## 📱 Contato Suporte

Se precisar de ajuda com a configuração:
1. Verifique a documentação do Supabase
2. Analise os logs do navegador
3. Verifique as variáveis de ambiente
4. Teste as conexões individualmente

---
**Status**: Configuração básica concluída ✅
