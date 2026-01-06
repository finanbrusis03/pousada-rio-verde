import { motion } from "framer-motion";
import { Waves, Utensils, TreePalm, Car, Wifi, Coffee, Anchor, Sun } from "lucide-react";

const features = [
  {
    icon: Waves,
    title: "Piscina ao Ar Livre",
    description: "Relaxe em nossa ampla piscina cercada por jardins tropicais.",
  },
  {
    icon: Utensils,
    title: "Restaurante & Bar",
    description: "Gastronomia regional com vista para a natureza exuberante.",
  },
  {
    icon: TreePalm,
    title: "Jardim Tropical",
    description: "Áreas verdes para descanso e contemplação da natureza.",
  },
  {
    icon: Anchor,
    title: "Esportes Aquáticos",
    description: "Acesso a atividades náuticas e passeios de barco.",
  },
  {
    icon: Car,
    title: "Estacionamento",
    description: "Estacionamento gratuito e seguro para nossos hóspedes.",
  },
  {
    icon: Coffee,
    title: "Café da Manhã",
    description: "Buffet completo com produtos regionais e artesanais.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi Gratuito",
    description: "Internet disponível em todas as áreas comuns.",
  },
  {
    icon: Sun,
    title: "Lounge & Áreas Comuns",
    description: "Espaços confortáveis para relaxar e socializar.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">
            Estrutura
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-4">
            Tudo Para Seu Conforto
          </h2>
          <p className="text-muted-foreground">
            Oferecemos uma estrutura completa para tornar sua estadia inesquecível, 
            em harmonia com a natureza do litoral sul paulista.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
