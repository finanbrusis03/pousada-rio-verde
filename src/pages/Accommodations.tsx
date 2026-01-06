import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Users, 
  Bed, 
  ArrowRight, 
  Clock,
  Home
} from "lucide-react";
import { useRooms } from "@/hooks/useSupabase";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton Loader
const RoomCardSkeleton = () => (
  <div className="bg-background rounded-xl shadow-lg overflow-hidden">
    <Skeleton className="h-64 w-full" />
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="text-right">
          <Skeleton className="h-7 w-20 mb-1" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      <div className="flex flex-wrap gap-4 mb-6">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  </div>
);

const AmenityIcon = ({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>, label: string }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </div>
);

export default function Accommodations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { rooms = [], loading, fetchRooms } = useRooms();

  // Carrega os quartos ao montar o componente
  useEffect(() => {
    const loadRooms = async () => {
      try {
        await fetchRooms();
      } catch (err) {
        console.error('Erro ao carregar quartos:', err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as acomodações. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    };
    
    loadRooms();
  }, [fetchRooms, toast]);

  const handleBookNow = (roomId: number) => {
    navigate(`/reservar?room=${roomId}`);
  };

  return (
    <Layout>
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Nossas Acomodações
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Conheça nossos quartos e chalés projetados para proporcionar o máximo de conforto e bem-estar durante sua estadia.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {rooms && rooms.length > 0 ? (
                rooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="h-full flex flex-col bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={room.images?.[0] || '/placeholder-room.jpg'}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            room.status === 'available' 
                              ? 'bg-green-500/90 text-white' 
                              : room.status === 'occupied'
                              ? 'bg-red-500/90 text-white'
                              : 'bg-orange-500/90 text-white'
                          }`}>
                            {room.status === 'available' ? 'Disponível' : 
                             room.status === 'occupied' ? 'Ocupado' : 'Manutenção'}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold text-xl text-foreground">
                              {room.name}
                            </h3>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                R$ {Number(room.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs text-muted-foreground">por diária</p>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-6 line-clamp-3 min-h-[60px]">
                            {room.description || 'Descrição não disponível'}
                          </p>

                          <div className="space-y-3 mb-6">
                            <div className="grid grid-cols-2 gap-3">
                              <AmenityIcon 
                                icon={Users} 
                                label={`${room.capacity || 2} ${room.capacity === 1 ? 'pessoa' : 'pessoas'}`} 
                              />
                              <AmenityIcon 
                                icon={Bed} 
                                label={room.beds || 'Camas não especificadas'} 
                              />
                            </div>
                            
                            {room.min_nights && room.min_nights > 1 && (
                              <AmenityIcon 
                                icon={Clock} 
                                label={`Mínimo de ${room.min_nights} noites`} 
                              />
                            )}
                          </div>
                        </div>

                        <div className="mt-auto pt-4">
                          <Button 
                            onClick={() => handleBookNow(room.id)}
                            className="w-full group-hover:bg-primary/90 transition-colors"
                            disabled={room.status !== 'available'}
                          >
                            {room.status === 'available' ? (
                              <>
                                Reservar Agora
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            ) : (
                              'Indisponível'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Home className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-foreground">Nenhum quarto disponível</h3>
                  <p className="mt-2 text-muted-foreground">
                    Não encontramos acomodações disponíveis no momento.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Não encontrou o que procura?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Entre em contato conosco para mais informações sobre nossas acomodações e pacotes especiais.
            </p>
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/contato">
                Fale Conosco
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}