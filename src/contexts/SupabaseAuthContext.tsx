import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name?: string
  role: 'client' | 'admin'
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signIn: (email: string, password: string, role: 'client' | 'admin') => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        console.log('Verificando sessão...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao obter sessão:', error)
          return
        }
        
        if (session?.user) {
          console.log('Sessão encontrada:', session.user.email)
          setSupabaseUser(session.user)
          
          // Obter a role do usuário de várias fontes possíveis
          const isAdmin = session.user.role === 'admin' || 
                         session.user.email === 'admin@rioverde.com' ||
                         session.user.user_metadata?.role === 'admin' ||
                         session.user.app_metadata?.role === 'admin';
          
          console.log('Detalhes do usuário:', {
            email: session.user.email,
            role: session.user.role,
            user_metadata: session.user.user_metadata,
            app_metadata: session.user.app_metadata,
            isAdmin
          })
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: isAdmin ? 'admin' : 'client'
          })
        } else {
          console.log('Nenhuma sessão ativa encontrada')
          setUser(null)
          setSupabaseUser(null)
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    // Verificar sessão imediatamente
    checkSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          console.log('Usuário autenticado:', session.user.email)
          setSupabaseUser(session.user)
          
          const isAdmin = session.user.role === 'admin' || 
                         session.user.email === 'admin@rioverde.com' ||
                         session.user.user_metadata?.role === 'admin' ||
                         session.user.app_metadata?.role === 'admin';
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: isAdmin ? 'admin' : 'client'
          })
          
          // Se acabou de fazer login, recarrega a página para garantir que tudo seja atualizado
          if (event === 'SIGNED_IN') {
            console.log('Login detectado, recarregando a página...')
            setTimeout(() => window.location.reload(), 100)
          }
        } else {
          console.log('Usuário não autenticado')
          setUser(null)
          setSupabaseUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      console.log('Removendo listener de autenticação')
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, role: 'client' | 'admin') => {
    try {
      // Tenta autenticar no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim()
      });

      if (error) {
        throw error;
      }

      // Verifica a role do usuário autenticado
      const user = data.user;
      const isAdmin = user.role === 'admin' || 
                     user.user_metadata?.role === 'admin' ||
                     user.app_metadata?.role === 'admin';

      // Se tentando acessar como admin, verifica se tem permissão
      if (role === 'admin' && !isAdmin) {
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: 'Acesso restrito a administradores' 
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { 
        success: false, 
        error: 'E-mail ou senha inválidos. Por favor, tente novamente.' 
      };
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'client'
          }
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro ao criar conta' }
    }
  }

  const signOut = async () => {
    try {
      // Tentar logout do Supabase primeiro
      await supabase.auth.signOut()
    } catch (error) {
      console.log('Supabase signOut failed, using local fallback:', error)
    } finally {
      // Sempre limpar estado local
      setUser(null)
      setSupabaseUser(null)
    }
  }

  // Verifica se o usuário é admin de várias formas possíveis
  const isAdmin = Boolean(
    user?.role === 'admin' ||
    user?.email === 'admin@rioverde.com' ||
    supabaseUser?.user_metadata?.role === 'admin' ||
    supabaseUser?.app_metadata?.role === 'admin'
  )

  const value: AuthContextType = {
    user,
    supabaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
