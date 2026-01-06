import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Bed, Wifi, Wind, Coffee, Tv, Bath, Mountain, ArrowRight, Check, Edit, Trash2, Plus } from "lucide-react";
import { useRooms } from "@/hooks/useSupabase";
import roomSuite from "@/assets/room-suite.jpg";
import poolArea from "@/assets/pool-area.jpg";
import restaurantBar from "@/assets/restaurant-bar.jpg";

export default function Accommodations() {
  const { rooms, loading, fetchRooms } = useRooms();

  return (
    <Layout>
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Acomodações
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça nossos quartos e chalés projetados para seu conforto e bem-estar
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando acomodações...</p>
            </div>
          )}

          {/* Rooms Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={room.images?.[0] || roomSuite}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.status === 'available' 
                            ? 'bg-green-500 text-white' 
                            : room.status === 'occupied'
                            ? 'bg-red-500 text-white'
                            : 'bg-orange-500 text-white'
                        }`}>
                          {room.status === 'available' ? 'Disponível' : 
                           room.status === 'occupied' ? 'Ocupado' : 'Manutenção'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-semibold text-xl">{room.name}</h3>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">R$ {room.price}</p>
                          <p className="text-sm text-muted-foreground">por diária</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6 line-clamp-2">
                        {room.description}
                      </p>

                      {/* Capacity */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {room.capacity} pessoas
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {room.beds || `${room.capacity} camas`}
                          </span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Comodidades</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {room.amenities?.slice(0, 4).map((amenity, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              {amenity === 'Wi-Fi grátis' && <Wifi className="w-4 h-4" />}
                              {amenity === 'Ar-condicionado' && <Wind className="w-4 h-4" />}
                              {amenity === 'Café da manhã' && <Coffee className="w-4 h-4" />}
                              {amenity === 'TV Smart' && <Tv className="w-4 h-4" />}
                              {amenity === 'Banheiro privativo' && <Bath className="w-4 h-4" />}
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          Ver Detalhes
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <Link to={`/reservar?room=${room.id}`}>
                            Reservar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && rooms.length === 0 && (
            <div className="text-center py-12">
              <Bed className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma acomodação disponível</h3>
              <p className="text-muted-foreground">
                No momento não temos quartos disponíveis. Tente novamente mais tarde.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
