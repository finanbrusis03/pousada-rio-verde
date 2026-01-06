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
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setSupabaseUser(session.user)
          
          // Verificar se é admin
          const isAdminUser = session.user.email === 'admin@rioverde.com'
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: isAdminUser ? 'admin' : 'client'
          })
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user)
          
          const isAdminUser = session.user.email === 'admin@rioverde.com'
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: isAdminUser ? 'admin' : 'client'
          })
        } else {
          setUser(null)
          setSupabaseUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
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

      // Verifica se é admin (se necessário)
      if (role === 'admin' && email.toLowerCase() !== 'admin@rioverde.com') {
        await supabase.auth.signOut();
        return { success: false, error: 'Acesso restrito a administradores' };
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

  const isAdmin = user?.role === 'admin'

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
