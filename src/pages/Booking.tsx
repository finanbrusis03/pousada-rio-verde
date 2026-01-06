import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Bed, ArrowLeft, MessageCircle, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useRooms } from '@/hooks/useSupabase';
import { format, addDays, differenceInDays, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestDocument, setGuestDocument] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  const { user } = useAuth();
  const { rooms } = useRooms();
  const navigate = useNavigate();

  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
    setStep(2);
  };

  const checkRoomAvailability = async () => {
    if (!selectedRoom || !checkinDate || !checkoutDate) return;
    
    setCheckingAvailability(true);
    try {
      const isAvailable = await useRooms().checkAvailability(
        selectedRoom.id,
        checkinDate,
        checkoutDate
      );
      
      if (isAvailable) {
        setStep(3);
        toast.success('Quarto disponível! Continue com os dados.');
      } else {
        toast.error('Quarto não disponível para as datas selecionadas.');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Erro ao verificar disponibilidade. Tente novamente.');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        // Create reservation for guest (not logged in)
        const reservationData = {
          room_id: selectedRoom.id,
          client_id: null, // Will be created/linked later
          checkin_date: checkinDate,
          checkout_date: checkoutDate,
          adults,
          children,
          total_amount: calculateTotal(),
          status: 'pending'
        };

        // Simulação - na implementação real, salvaria no Supabase
        console.log('Reservation data:', reservationData);
        
        toast.success('Reserva solicitada! Você receberá a confirmação por e-mail e WhatsApp.');
        setStep(3);
      } else {
        // Create reservation for logged in user
        const reservationData = {
          room_id: selectedRoom.id,
          client_id: user.id,
          checkin_date: checkinDate,
          checkout_date: checkoutDate,
          adults,
          children,
          total_amount: calculateTotal(),
          status: 'pending'
        };

        // Simulação - na implementação real, salvaria no Supabase
        console.log('Reservation data for user:', reservationData);
        
        toast.success('Reserva criada! Redirecionando para pagamento...');
        navigate(`/pagamento/${selectedRoom.id}`);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Erro ao criar reserva. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedRoom || !checkinDate || !checkoutDate) return 0;
    
    const nights = differenceInDays(new Date(checkoutDate), new Date(checkinDate));
    const basePrice = selectedRoom.price || 0;
    return basePrice * nights;
  };

  const isDateValid = (date: string) => {
    const today = new Date();
    const selectedDate = new Date(date);
    return isAfter(selectedDate, today);
  };

  const minCheckoutDate = checkinDate ? format(addDays(new Date(checkinDate), 1), 'yyyy-MM-dd') : '';

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>

            <div className="text-center">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Reservas
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
                Faça Sua Reserva
              </h1>
              <p className="text-muted-foreground text-lg">
                Reserve diretamente conosco e garanta as melhores condições.
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center gap-4 mt-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className={`text-sm hidden sm:block ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                    {s === 1 && "Acomodação"}
                    {s === 2 && "Datas"}
                    {s === 3 && "Confirmacao"}
                  </span>
                  {s < 3 && <div className="w-8 h-0.5 bg-muted" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Step 1: Select Room */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="font-display text-2xl font-bold">
                  Escolha sua acomodação
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <Card 
                      key={room.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedRoom?.id === room.id 
                          ? 'ring-2 ring-primary' 
                          : 'hover:border-primary'
                      }`}
                      onClick={() => handleRoomSelect(room)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Até {room.capacity} pessoas
                              </span>
                              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                R$ {room.price}/noite
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Bed className="w-6 h-6 text-primary mb-2" />
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {room.description}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Dates */}
            {step === 2 && selectedRoom && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">
                    Selecione as Datas
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Alterar acomodação
                  </button>
                </div>

                {/* Selected Room Summary */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{selectedRoom.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          A partir de R$ {selectedRoom.price}/noite
                        </p>
                      </div>
                      <Bed className="w-6 h-6 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <form onSubmit={checkRoomAvailability} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkin">Data de Check-in</Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={checkinDate}
                        onChange={(e) => setCheckinDate(e.target.value)}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkout">Data de Check-out</Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={checkoutDate}
                        onChange={(e) => setCheckoutDate(e.target.value)}
                        min={minCheckoutDate}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adults">Adultos</Label>
                      <Input
                        id="adults"
                        type="number"
                        min="1"
                        max={selectedRoom.capacity}
                        value={adults}
                        onChange={(e) => setAdults(parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="children">Crianças</Label>
                      <Input
                        id="children"
                        type="number"
                        min="0"
                        max={selectedRoom.capacity - adults}
                        value={children}
                        onChange={(e) => setChildren(parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  {!user && (
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Dados do Hóspede</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome completo</Label>
                          <Input
                            id="name"
                            placeholder="Seu nome"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">WhatsApp</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(00) 00000-0000"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="document">CPF</Label>
                          <Input
                            id="document"
                            placeholder="000.000.000-00"
                            value={guestDocument}
                            onChange={(e) => setGuestDocument(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit" 
                      variant="default" 
                      size="lg" 
                      className="flex-1"
                      disabled={loading || checkingAvailability}
                    >
                      {checkingAvailability ? 'Verificando...' : loading ? 'Processando...' : 'Verificar Disponibilidade'}
                    </Button>
                    {!user && (
                      <Button 
                        type="button"
                        variant="outline" 
                        size="lg" 
                        onClick={() => {
                          if (guestEmail) {
                            navigate('/login?redirect=booking')
                          } else {
                            toast.error('Preencha seu e-mail para continuar.');
                          }
                        }}
                      >
                        Já tenho conta
                      </Button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-4">
                  {user ? 'Reserva Criada!' : 'Solicitação Enviada!'}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {user 
                    ? 'Sua reserva foi criada com sucesso! Você será redirecionado para o pagamento.'
                    : 'Recebemos sua solicitação de reserva. Nossa equipe entrará em contato em até 2 horas para confirmar a disponibilidade e enviar o link de pagamento.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="default" size="lg" asChild>
                    <Link to="/">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar ao Início
                    </Link>
                  </Button>
                  <Button variant="whatsapp" size="lg" asChild>
                    <a
                      href="https://wa.me/5513999999999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Falar no WhatsApp
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Info Box */}
      {step < 3 && (
        <section className="pb-16 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <CardHeader>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Informações Importantes
                </h3>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Check-in: a partir das 14:00 | Check-out: até 12:00</li>
                  <li>• Pagamento: Pix ou cartão de crédito (até 6x sem juros)</li>
                  <li>• Cancelamento gratuito até 7 dias antes do check-in</li>
                  <li>• Dúvidas? Fale conosco pelo WhatsApp: (13) 99999-9999</li>
                  {selectedRoom && (
                    <li>• {selectedRoom.name}: Capacidade máxima de {selectedRoom.capacity} pessoas</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </Layout>
  );
}
