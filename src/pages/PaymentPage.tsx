import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useReservations } from '@/hooks/useSupabase'
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { updateReservationStatus } = useReservations()
  
  const [reservation, setReservation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix')
  const [processing, setProcessing] = useState(false)
  const [pixQrCode, setPixQrCode] = useState('')
  const [pixExpiration, setPixExpiration] = useState('')

  useEffect(() => {
    fetchReservation()
  }, [id])

  const fetchReservation = async () => {
    try {
      // Simulação - na implementação real, buscaria do Supabase
      const mockReservation = {
        id: parseInt(id || '1'),
        room: {
          name: 'Suíte Vista Mar',
          price: 350
        },
        checkin_date: '2026-01-15',
        checkout_date: '2026-01-17',
        adults: 2,
        children: 0,
        total_amount: 700,
        status: 'confirmed'
      }
      setReservation(mockReservation)
    } catch (error) {
      console.error('Error fetching reservation:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePixQrCode = () => {
    // Simulação de geração de QR Code
    const qrCode = `pix_qrcode_${Date.now()}_${id}`
    setPixQrCode(qrCode)
    setPixExpiration(format(addDays(new Date(), 1), "dd/MM/yyyy HH:mm", { locale: ptBR }))
    
    // Simulação de atualização no Supabase
    setTimeout(() => {
      updateReservationStatus(parseInt(id || '1'), 'pending', qrCode)
    }, 1000)
  }

  const processCreditCard = async () => {
    setProcessing(true)
    try {
      // Simulação de processamento de cartão
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Atualizar status para pago
      await updateReservationStatus(parseInt(id || '1'), 'paid', 'stripe_pi_' + Date.now())
      
      alert('Pagamento com cartão processado com sucesso!')
      navigate('/minhas-reservas')
    } catch (error) {
      console.error('Error processing credit card:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setProcessing(false)
    }
  }

  const processPix = async () => {
    if (!pixQrCode) {
      generatePixQrCode()
      return
    }

    setProcessing(true)
    try {
      // Simulação de verificação de pagamento Pix
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Atualizar status para pago
      await updateReservationStatus(parseInt(id || '1'), 'paid', pixQrCode)
      
      alert('Pagamento Pix confirmado com sucesso!')
      navigate('/minhas-reservas')
    } catch (error) {
      console.error('Error processing pix:', error)
      alert('Erro ao processar pagamento Pix. Tente novamente.')
    } finally {
      setProcessing(false)
    }
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
              <a href="/login">Fazer Login</a>
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  if (loading || !reservation) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Carregando informações da reserva...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <a href="/minhas-reservas" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para minhas reservas
                </a>
              </Button>

              <div className="text-center">
                <h1 className="font-display text-3xl font-bold mb-2">
                  Finalizar Reserva
                </h1>
                <p className="text-muted-foreground">
                  Escolha a forma de pagamento para confirmar sua reserva
                </p>
              </div>
            </div>

            {/* Reservation Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Resumo da Reserva</CardTitle>
                <CardDescription>Confirme os detalhes antes de pagar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-lg">{reservation.room?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(reservation.checkin_date), "dd 'de' MMMM", { locale: ptBR })} até{' '}
                        {format(new Date(reservation.checkout_date), "dd 'de' MMMM", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">R$ {reservation.total_amount?.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span>Hóspedes: {reservation.adults} adultos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Status: <Badge className="bg-blue-100 text-blue-700">Confirmada</Badge></span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
                <CardDescription>Escolha como prefere pagar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pix Option */}
                  <div 
                    className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'pix' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">Pix</h3>
                        <p className="text-sm text-muted-foreground">
                          Pague instantaneamente usando QR Code
                        </p>
                        <p className="text-xs text-primary font-medium">Taxa: R$ 0,00</p>
                      </div>
                    </div>
                    {paymentMethod === 'pix' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Credit Card Option */}
                  <div 
                    className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'credit_card' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('credit_card')}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold text-lg">Cartão de Crédito</h3>
                        <p className="text-sm text-muted-foreground">
                          Pague em até 6x sem juros
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">Taxa: R$ 15,00</p>
                      </div>
                    </div>
                    {paymentMethod === 'credit_card' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Action */}
            {paymentMethod === 'pix' && !pixQrCode && (
              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={generatePixQrCode}
                  className="w-full md:w-auto"
                >
                  Gerar QR Code Pix
                </Button>
              </div>
            )}

            {paymentMethod === 'pix' && pixQrCode && (
              <div className="text-center space-y-6">
                <div className="bg-white p-8 rounded-lg border max-w-sm mx-auto">
                  <div className="mb-4">
                    <QrCode className="w-32 h-32 mx-auto text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Escaneie o QR Code acima</p>
                    <p className="text-sm text-muted-foreground">
                      Ou copie e cole o código Pix:
                    </p>
                    <div className="bg-muted p-3 rounded font-mono text-sm break-all">
                      {pixQrCode}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Expira em: {pixExpiration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={generatePixQrCode}
                    disabled={processing}
                  >
                    Gerar novo QR Code
                  </Button>
                  <Button 
                    onClick={processPix}
                    disabled={processing}
                  >
                    {processing ? 'Processando...' : 'Confirmar Pagamento'}
                  </Button>
                </div>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="text-center space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4">
                    Simulação de formulário de cartão de crédito.
                    Na implementação real, integrar com Stripe ou similar.
                  </p>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Número do cartão"
                      className="w-full p-3 border rounded-lg"
                    />
                    <input 
                      type="text" 
                      placeholder="Nome no cartão"
                      className="w-full p-3 border rounded-lg"
                    />
                    <input 
                      type="text" 
                      placeholder="MM/AA"
                      className="w-full p-3 border rounded-lg"
                    />
                    <input 
                      type="text" 
                      placeholder="CVV"
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    size="lg" 
                    onClick={processCreditCard}
                    disabled={processing}
                    className="w-full md:w-auto"
                  >
                    {processing ? 'Processando pagamento...' : 'Pagar R$ ' + (reservation.total_amount?.toLocaleString('pt-BR') || '0')}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
