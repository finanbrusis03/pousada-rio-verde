import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useClients } from '@/hooks/useSupabase'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ClientArea() {
  const { user, signOut } = useAuth()
  const { getClientReservations } = useClients()
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchClientReservations()
    }
  }, [user])

  const fetchClientReservations = async () => {
    if (!user) return
    
    try {
      const clientReservations = await getClientReservations(user.id)
      setReservations(clientReservations)
    } catch (error) {
      console.error('Error fetching client reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700'
      case 'paid':
        return 'bg-green-100 text-green-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada'
      case 'paid':
        return 'Paga'
      case 'cancelled':
        return 'Cancelada'
      case 'pending':
        return 'Pendente'
      case 'no_show':
        return 'Não compareceu'
      default:
        return status
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Área Restrita</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para acessar esta área.
            </p>
            <Button asChild>
              <Link to="/login">Fazer Login</Link>
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">
                  Olá, {user.user_metadata?.name || user.email}!
                </h1>
                <p className="text-muted-foreground">
                  Bem-vindo à sua área de reservas
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sair
              </Button>
            </div>
          </motion.div>

          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Meus Dados</CardTitle>
                <CardDescription>Informações do seu perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nome</p>
                        <p className="font-medium">{user.user_metadata?.name || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">E-mail</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">WhatsApp</p>
                        <p className="font-medium">{user.user_metadata?.phone || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">CPF</p>
                        <p className="font-medium">{user.user_metadata?.document || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reservations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Minhas Reservas</CardTitle>
                <CardDescription>Histórico completo de suas reservas</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Carregando suas reservas...</p>
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      Você ainda não possui reservas.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link to="/reservar">Fazer sua primeira reserva</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div key={reservation.id} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{reservation.room?.name}</h3>
                              <Badge className={getStatusColor(reservation.status)}>
                                {getStatusText(reservation.status)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(reservation.checkin_date), 'dd/MM/yyyy', { locale: ptBR })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" />
                                <span>
                                  {format(new Date(reservation.checkout_date), 'dd/MM/yyyy', { locale: ptBR })}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Hóspedes: {reservation.adults} adultos{reservation.children > 0 ? ` + ${reservation.children} crianças` : ''}</p>
                              <p>Total: R$ {reservation.total_amount?.toLocaleString('pt-BR')}</p>
                            </div>
                          </div>
                        </div>
                        
                        {reservation.status === 'confirmed' && (
                          <div className="flex gap-4 pt-4 border-t">
                            <Button className="flex-1" asChild>
                              <Link to={`/pagamento/${reservation.id}`}>
                                Pagar Agora
                              </Link>
                            </Button>
                            <Button variant="outline" className="flex-1" asChild>
                              <a
                                href={`https://wa.me/5513999999999?text=Olá! Gostaria de informações sobre minha reserva ${reservation.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                WhatsApp
                              </a>
                            </Button>
                          </div>
                        )}
                        
                        {reservation.status === 'paid' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-green-700 font-medium">
                                Reserva confirmada! Prepare-se para sua estadia.
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {reservation.status === 'cancelled' && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-5 h-5 text-red-600" />
                              <span className="text-red-700 font-medium">
                                Reserva cancelada em {format(new Date(reservation.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
