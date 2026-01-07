import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Verificação das variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Função para criar um cliente Supabase com configuração personalizada
const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: true,
      storage: {
        getItem: (key) => {
          try {
            if (typeof window !== 'undefined') {
              const item = localStorage.getItem(key);
              console.log('Getting item:', key, item);
              return item;
            }
            return null;
          } catch (error) {
            console.error('Error getting item from localStorage:', error);
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            if (typeof window !== 'undefined') {
              console.log('Setting item:', key, value);
              localStorage.setItem(key, value);
            }
          } catch (error) {
            console.error('Error setting item in localStorage:', error);
          }
        },
        removeItem: (key) => {
          try {
            if (typeof window !== 'undefined') {
              console.log('Removing item:', key);
              localStorage.removeItem(key);
            }
          } catch (error) {
            console.error('Error removing item from localStorage:', error);
          }
        },
      },
      storageKey: 'sb-auth-token'
    },
    global: {
      headers: {
        'X-Client-Info': 'pousada-rio-verde/1.0.0'
      },
    }
  });
};

// Criação do cliente Supabase
export const supabase = createSupabaseClient();

// Adiciona um listener para mudanças de autenticação
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
  
  // Atualiza o localStorage manualmente para garantir consistência
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    if (session) {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: session,
        expiresAt: session.expires_at
      }));
    }
  } else if (event === 'SIGNED_OUT') {
    localStorage.removeItem('supabase.auth.token');
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string  // Alterado para string para suportar UUID
          name: string
          description: string
          capacity: number
          price: number
          size: string
          beds: string
          amenities: string[]
          features: string[]
          images: string[]
          status: 'available' | 'occupied' | 'maintenance'
          min_nights: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string  // Alterado para string para suportar UUID
          name: string
          description: string
          capacity: number
          price: number
          size: string
          beds: string
          amenities: string[]
          features: string[]
          images: string[]
          status?: 'available' | 'occupied' | 'maintenance'
          min_nights?: number
        }
        Update: {
          id: number
          name?: string
          description?: string
          capacity?: number
          price?: number
          size?: string
          beds?: string
          amenities?: string[]
          features?: string[]
          images?: string[]
          status?: 'available' | 'occupied' | 'maintenance'
          min_nights?: number
        }
      }
      reservations: {
        Row: {
          id: number
          room_id: number
          client_id: number
          checkin_date: string
          checkout_date: string
          adults: number
          children: number
          total_amount: number
          status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'expired' | 'no_show'
          payment_method?: 'pix' | 'credit_card' | 'debit_card'
          payment_id?: string
          cancellation_reason?: string
          cancellation_fee?: number
          refund_amount?: number
          special_requests?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          room_id: number
          client_id: number
          checkin_date: string
          checkout_date: string
          adults: number
          children: number
          total_amount: number
          status?: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'expired' | 'no_show'
          payment_method?: 'pix' | 'credit_card' | 'debit_card'
          payment_id?: string
          cancellation_reason?: string
          cancellation_fee?: number
          refund_amount?: number
          special_requests?: string
        }
        Update: {
          id: number
          room_id?: number
          client_id?: number
          checkin_date?: string
          checkout_date?: string
          adults?: number
          children?: number
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'expired' | 'no_show'
          payment_method?: 'pix' | 'credit_card' | 'debit_card'
          payment_id?: string
          cancellation_reason?: string
          cancellation_fee?: number
          refund_amount?: number
          special_requests?: string
        }
      }
      clients: {
        Row: {
          id: number
          name: string
          email: string
          phone: string
          document?: string
          birth_date?: string
          preferences?: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone: string
          document?: string
          birth_date?: string
          preferences?: Record<string, any>
        }
        Update: {
          id: number
          name?: string
          email?: string
          phone?: string
          document?: string
          birth_date?: string
          preferences?: Record<string, any>
        }
      }
      payments: {
        Row: {
          id: number
          reservation_id: number
          amount: number
          method: 'pix' | 'credit_card' | 'debit_card'
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          gateway_response: Record<string, any>
          pix_qr_code?: string
          pix_expiration_date?: string
          stripe_payment_intent_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          reservation_id: number
          amount: number
          method: 'pix' | 'credit_card' | 'debit_card'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          gateway_response: Record<string, any>
          pix_qr_code?: string
          pix_expiration_date?: string
          stripe_payment_intent_id?: string
        }
        Update: {
          id: number
          reservation_id?: number
          amount?: number
          method?: 'pix' | 'credit_card' | 'debit_card'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          gateway_response?: Record<string, any>
          pix_qr_code?: string
          pix_expiration_date?: string
          stripe_payment_intent_id?: string
        }
      }
      blocked_dates: {
        Row: {
          id: number
          room_id: number
          start_date: string
          end_date: string
          reason: string
          created_at: string
        }
        Insert: {
          id?: number
          room_id: number
          start_date: string
          end_date: string
          reason: string
        }
      }
    }
  }
}

export type Room = Database['public']['Tables']['rooms']['Row']
export type Reservation = Database['public']['Tables']['reservations']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
