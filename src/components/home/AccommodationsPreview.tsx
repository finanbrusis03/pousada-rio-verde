import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Bed, ArrowRight, Wifi, Wind, Coffee } from "lucide-react";
import roomSuite from "@/assets/room-suite.jpg";
import poolArea from "@/assets/pool-area.jpg";
import restaurantBar from "@/assets/restaurant-bar.jpg";

const accommodations = [
  {
    id: 1,
    name: "Suíte Vista Mar",
    description: "Acomodação espaçosa com varanda e vista panorâmica para o oceano.",
    image: roomSuite,
    capacity: "2 adultos + 1 criança",
    beds: "1 cama casal",
    price: 350,
    amenities: ["Wi-Fi", "Ar-condicionado", "Café da manhã"],
  },
  {
    id: 2,
    name: "Chalé Jardim",
    description: "Chalé privativo cercado por jardins tropicais com piscina exclusiva.",
    image: poolArea,
    capacity: "4 adultos + 2 crianças",
    beds: "2 camas casal",
    price: 550,
    amenities: ["Wi-Fi", "Ar-condicionado", "Café da manhã"],
  },
  {
    id: 3,
    name: "Quarto Standard",
    description: "Conforto e praticidade para casais que buscam tranquilidade.",
    image: restaurantBar,
    capacity: "2 adultos",
    beds: "1 cama casal",
    price: 250,
    amenities: ["Wi-Fi", "Ar-condicionado", "Café da manhã"],
  },
];

const amenityIcons: Record<string, React.ElementType> = {
  "Wi-Fi": Wifi,
  "Ar-condicionado": Wind,
  "Café da manhã": Coffee,
};

export function AccommodationsPreview() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Acomodações
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-4">
              Onde Descanso e<br />
              Natureza se Encontram
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Escolha entre nossas opções de hospedagem, todas pensadas para 
              proporcionar conforto e integração com o ambiente natural.
            </p>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/acomodacoes" className="flex items-center gap-2">
              Ver Todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accommodations.map((room, index) => (
            <motion.article
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  R$ {room.price}/noite
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold mb-2">
                  {room.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {room.description}
                </p>

                {/* Details */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{room.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bed className="w-4 h-4" />
                    <span>{room.beds}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Wifi;
                    return (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground"
                      >
                        <Icon className="w-3 h-3" />
                        {amenity}
                      </span>
                    );
                  })}
                </div>

                {/* CTA */}
                <Button variant="default" className="w-full" asChild>
                  <Link to={`/acomodacoes/${room.id}`}>
                    Ver Detalhes
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
