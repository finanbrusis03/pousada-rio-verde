import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Shield, Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone } from 'lucide-react'
import { useAuth } from '@/contexts/SupabaseAuthContext'
import { useToast } from '@/hooks/use-toast'
import { toast } from 'sonner'
import { Layout } from '@/components/layout/Layout'

export default function AuthPage() {
  const location = useLocation()
  const [userType, setUserType] = useState<'client' | 'admin'>(
    location.state?.admin ? 'admin' : 'client'
  )
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [document, setDocument] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (userType === 'admin') {
        // Login admin
        const result = await signIn(email, password, 'admin')
        if (result.success) {
          toast.success('Login administrativo realizado com sucesso!')
          // Redireciona diretamente sem recarregar a página
          // O listener de autenticação no SupabaseAuthContext irá lidar com o redirecionamento
          navigate('/admin', { replace: true })
        } else {
          toast.error(result.error || 'Credenciais administrativas incorretas')
        }
      } else {
        // Login cliente
        if (isLogin) {
          const result = await signIn(email, password, 'client')
          if (result.success) {
            toast.success('Login realizado com sucesso!')
            navigate('/minhas-reservas')
          } else {
            toast.error(result.error || 'Erro ao fazer login')
          }
        } else {
          const result = await signUp(email, password, name)
          if (result.success) {
            toast.success('Conta criada com sucesso! Faça login para continuar.')
            setIsLogin(true)
          } else {
            toast.error(result.error || 'Erro ao criar conta')
          }
        }
      }
    } catch (error) {
      toast.error('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <section className="relative min-h-screen flex items-center">
        {/* Background Image igual ao da página inicial */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Vista aérea do Iate Clube Rio Verde"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-900/60 via-forest-900/40 to-forest-900/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h1 className="font-display text-4xl md:text-5xl font-bold text-sand-50 mb-2">
                  Bem-vindo ao <br />
                  <span className="text-accent">Iate Clube Rio Verde</span>
                </h1>
                <p className="text-lg text-sand-200">
                  Escolha como deseja acessar o sistema
                </p>
              </motion.div>
            </div>

            {/* User Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <Card 
                  className={`cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                    userType === 'client' 
                      ? 'ring-2 ring-accent bg-sand-100/10 border-accent/50 shadow-xl' 
                      : 'bg-sand-100/5 border-sand-100/20 hover:bg-sand-100/10 hover:shadow-lg'
                  }`}
                  onClick={() => setUserType('client')}
                >
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-accent" />
                    <h3 className="font-semibold text-sm mb-1 text-sand-50">Área do Cliente</h3>
                    <p className="text-xs text-sand-200">
                      Faça login para gerenciar suas reservas
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                    userType === 'admin' 
                      ? 'ring-2 ring-accent bg-sand-100/10 border-accent/50 shadow-xl' 
                      : 'bg-sand-100/5 border-sand-100/20 hover:bg-sand-100/10 hover:shadow-lg'
                  }`}
                  onClick={() => setUserType('admin')}
                >
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
                    <h3 className="font-semibold text-sm mb-1 text-sand-50">Painel Admin</h3>
                    <p className="text-xs text-sand-200">
                      Acesso restrito para administradores
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-forest-900/20 border border-sand-100/20 shadow-2xl">
                <CardHeader className="text-center border-b border-sand-100/20">
                  <CardTitle className="font-display text-2xl flex items-center justify-center gap-2 text-sand-50">
                    {userType === 'admin' ? (
                      <>
                        <Shield className="w-6 h-6 text-accent" />
                        Login Administrativo
                      </>
                    ) : (
                      <>
                        <Users className="w-6 h-6 text-accent" />
                        {isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-sand-200">
                    {userType === 'admin' 
                      ? 'Digite suas credenciais administrativas'
                      : isLogin 
                        ? 'Faça login para acessar suas reservas'
                        : 'Cadastre-se para fazer suas primeiras reservas'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {userType === 'client' && (
                    <Tabs value={isLogin ? 'login' : 'register'} className="w-full mb-6">
                      <TabsList className="grid w-full grid-cols-2 bg-sand-100/10 border border-sand-100/20">
                        <TabsTrigger 
                          value="login" 
                          onClick={() => setIsLogin(true)}
                          className="cursor-pointer data-[state=active]:bg-accent data-[state=active]:text-forest-900 text-sand-200"
                        >
                          Login
                        </TabsTrigger>
                        <TabsTrigger 
                          value="register" 
                          onClick={() => setIsLogin(false)}
                          className="cursor-pointer data-[state=active]:bg-accent data-[state=active]:text-forest-900 text-sand-200"
                        >
                          Cadastrar
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {userType === 'client' && !isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sand-200">Nome completo</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-sand-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 h-12 bg-sand-100/10 border-sand-100/20 text-sand-50 placeholder:text-sand-400 focus:border-accent"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sand-200">
                        {userType === 'admin' ? 'E-mail Administrativo' : 'E-mail'}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-sand-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={userType === 'admin' ? 'admin@rioverde.com' : 'seu@email.com'}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 bg-sand-100/10 border-sand-100/20 text-sand-50 placeholder:text-sand-400 focus:border-accent"
                          required
                        />
                      </div>
                    </div>
                    
                    {userType === 'client' && !isLogin && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sand-200">WhatsApp</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-sand-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="(00) 00000-0000"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="pl-10 h-12 bg-sand-100/10 border-sand-100/20 text-sand-50 placeholder:text-sand-400 focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="document" className="text-sand-200">CPF (opcional)</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-sand-400" />
                            <Input
                              id="document"
                              type="text"
                              placeholder="000.000.000-00"
                              value={document}
                              onChange={(e) => setDocument(e.target.value)}
                              className="pl-10 h-12 bg-sand-100/10 border-sand-100/20 text-sand-50 placeholder:text-sand-400 focus:border-accent"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sand-200">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-sand-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder={userType === 'admin' ? '••••••••' : '••••••••'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 bg-sand-100/10 border-sand-100/20 text-sand-50 placeholder:text-sand-400 focus:border-accent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-sand-400 hover:text-sand-200"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-accent via-accent to-accent/80 hover:from-accent/90 hover:via-accent/90 hover:to-accent/70 text-forest-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-2 border-accent/50" 
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-forest-900/30 border-t-forest-900 rounded-full animate-spin"></div>
                          <span>{userType === 'admin' ? 'Entrando...' : isLogin ? 'Entrando...' : 'Criando conta...'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>{userType === 'admin' ? 'Acessar Painel' : isLogin ? 'Entrar' : 'Criar conta'}</span>
                          <div className="w-0 h-0 border-l-4 border-l-forest-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent opacity-70"></div>
                        </div>
                      )}
                    </Button>

                    {userType === 'client' && isLogin && (
                      <div className="text-center">
                        <Link 
                          to="/recuperar-senha" 
                          className="text-sm text-accent hover:text-accent/80"
                        >
                          Esqueceu sua senha?
                        </Link>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <div className="text-center mt-8">
              <Link 
                to="/" 
                className="text-sm text-sand-200 hover:text-sand-50 flex items-center gap-2 justify-center"
              >
                Voltar para o site
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
