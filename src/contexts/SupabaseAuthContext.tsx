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
          
          // Não recarregamos mais a página aqui para evitar loops
          // O redirecionamento é tratado no componente de login
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

  const signIn = async (email: string, password: string, role: 'client' | 'admin' = 'client') => {
    try {
      setLoading(true)
      console.log('Iniciando login para:', email, 'como', role)
      
      // Fazer login no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Erro no login:', error)
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'Usuário não encontrado' }
      }

      // Obter o perfil completo do usuário
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      console.log('Dados do perfil:', userData)

      // Verificar se o usuário tem permissão para acessar a área solicitada
      const isAdminUser = data.user.email === 'criszimn@rioverde.com' || 
                         data.user.email === 'admin@rioverde.com' ||
                         data.user.user_metadata?.role === 'admin' ||
                         data.user.app_metadata?.role === 'admin' ||
                         userData?.role === 'admin';

      console.log('É admin?', isAdminUser, {
        email: data.user.email,
        user_metadata: data.user.user_metadata,
        app_metadata: data.user.app_metadata,
        profile_role: userData?.role
      })

      if (role === 'admin' && !isAdminUser) {
        console.log('Acesso negado: usuário não é administrador')
        await supabase.auth.signOut()
        return { success: false, error: 'Acesso restrito a administradores' }
      }

      // Atualizar o estado do usuário com o tipo correto para a role
      const userRole: 'admin' | 'client' = isAdminUser ? 'admin' : 'client';
      const userInfo: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || userData?.name || data.user.email?.split('@')[0] || 'Usuário',
        role: userRole
      }
      
      console.log('Usuário autenticado:', userInfo)
      setUser(userInfo)

      // Forçar atualização do token JWT com as claims corretas
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro ao fazer login' }
    } finally {
      setLoading(false)
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
