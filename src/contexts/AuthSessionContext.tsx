import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name?: string
  role: 'client' | 'admin'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: 'client' | 'admin') => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthSession = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthSession must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Verificar se há sessão ativa ao carregar
    const storedUser = localStorage.getItem('userSession')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Verificar se a sessão ainda é válida (24 horas)
        const sessionTime = localStorage.getItem('sessionTime')
        if (sessionTime) {
          const timeDiff = Date.now() - parseInt(sessionTime)
          const hoursDiff = timeDiff / (1000 * 60 * 60)
          
          if (hoursDiff < 24) {
            setUser(parsedUser)
          } else {
            // Sessão expirada
            localStorage.removeItem('userSession')
            localStorage.removeItem('sessionTime')
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error)
        localStorage.removeItem('userSession')
        localStorage.removeItem('sessionTime')
      }
    }
  }, [])

  const login = async (email: string, password: string, role: 'client' | 'admin'): Promise<boolean> => {
    try {
      // Simulação de autenticação
      if (role === 'admin') {
        if (email === 'admin@rioverde.com' && password === 'admin123') {
          const adminUser: User = {
            id: 'admin-1',
            email,
            name: 'Administrador',
            role: 'admin'
          }
          setUser(adminUser)
          localStorage.setItem('userSession', JSON.stringify(adminUser))
          localStorage.setItem('sessionTime', Date.now().toString())
          localStorage.setItem('adminAuth', 'true')
          return true
        }
        return false
      } else {
        // Aqui seria a integração com Supabase para clientes
        // Por enquanto, simulação
        if (email && password) {
          const clientUser: User = {
            id: 'client-1',
            email,
            name: email.split('@')[0],
            role: 'client'
          }
          setUser(clientUser)
          localStorage.setItem('userSession', JSON.stringify(clientUser))
          localStorage.setItem('sessionTime', Date.now().toString())
          return true
        }
        return false
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userSession')
    localStorage.removeItem('sessionTime')
    localStorage.removeItem('adminAuth')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
