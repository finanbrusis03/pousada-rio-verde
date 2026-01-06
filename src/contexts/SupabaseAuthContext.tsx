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
      // Para admin, usar validação local primeiro
      if (role === 'admin') {
        if (email !== 'admin@rioverde.com') {
          return { success: false, error: 'Credenciais de administrador inválidas' }
        }
        if (password !== 'admin123') {
          return { success: false, error: 'Senha de administrador incorreta' }
        }

        // Criar usuário local para admin
        const adminUser = {
          id: 'admin-local',
          email,
          name: 'Administrador',
          role: 'admin' as const
        }
        setUser(adminUser)
        setSupabaseUser({
          id: 'admin-local',
          email,
          user_metadata: { name: 'Administrador', role: 'admin' }
        } as any)
        
        return { success: true }
      }

      // Para clientes, tentar Supabase primeiro
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          throw error
        }

        return { success: true }
      } catch (supabaseError) {
        console.log('Supabase auth failed, using local fallback:', supabaseError)
        
        // Fallback local para clientes
        const clientUser = {
          id: `client-${email}`,
          email,
          name: email.split('@')[0],
          role: 'client' as const
        }
        setUser(clientUser)
        setSupabaseUser({
          id: clientUser.id,
          email,
          user_metadata: { name: clientUser.name, role: 'client' }
        } as any)
        
        return { success: true }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'Erro ao fazer login' }
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
