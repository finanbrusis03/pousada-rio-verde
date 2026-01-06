import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Waves, Utensils, TreePalm, Car, Wifi, Coffee, Anchor, Sun, Wine, Dumbbell, Users, Camera } from "lucide-react";
import poolArea from "@/assets/pool-area.jpg";
import restaurantBar from "@/assets/restaurant-bar.jpg";
import heroImage from "@/assets/hero-resort.jpg";

const mainAreas = [
  {
    title: "Piscina ao Ar Livre",
    description: "Nossa ampla piscina é o coração da pousada. Rodeada por jardins tropicais e espreguiçadeiras confortáveis, é o lugar perfeito para relaxar sob o sol do litoral.",
    image: poolArea,
    icon: Waves,
    features: ["Piscina adulto e infantil", "Espreguiçadeiras", "Bar na piscina", "Jardim tropical"],
  },
  {
    title: "Restaurante & Bar",
    description: "Gastronomia regional com ingredientes frescos e frutos do mar. Nosso bar serve drinks tropicais e petiscos com vista privilegiada para o pôr do sol.",
    image: restaurantBar,
    icon: Utensils,
    features: ["Café da manhã incluso", "Almoço e jantar", "Carta de drinks", "Vista panorâmica"],
  },
  {
    title: "Áreas de Lazer",
    description: "Espaços pensados para todos os gostos: jardins para caminhadas, lounge para leitura, espaço kids e áreas para confraternização.",
    image: heroImage,
    icon: TreePalm,
    features: ["Jardim tropical", "Lounge com TV", "Espaço kids", "Área de jogos"],
  },
];

const amenities = [
  { icon: Wifi, title: "Wi-Fi Grátis", description: "Internet em todas as áreas comuns" },
  { icon: Car, title: "Estacionamento", description: "Gratuito e seguro para hóspedes" },
  { icon: Coffee, title: "Café da Manhã", description: "Buffet com produtos regionais" },
  { icon: Anchor, title: "Esportes Aquáticos", description: "Acesso a passeios de barco" },
  { icon: Sun, title: "Solário", description: "Área de bronzeamento" },
  { icon: Wine, title: "Adega", description: "Seleção de vinhos" },
  { icon: Dumbbell, title: "Academia", description: "Equipamentos básicos" },
  { icon: Users, title: "Salão de Eventos", description: "Para até 50 pessoas" },
  { icon: Camera, title: "Passeios", description: "Roteiros guiados na região" },
];

export default function Structure() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Estrutura do Iate Clube Rio Verde"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-900/70 via-forest-900/50 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto text-sand-50"
          >
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Nossa Estrutura
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
              Conforto em Harmonia<br />com a Natureza
            </h1>
            <p className="text-sand-200 text-lg">
              Cada espaço foi projetado para proporcionar experiências memoráveis, 
              combinando conforto moderno com a beleza natural do litoral sul.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Areas */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {mainAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative">
                    <img
                      src={area.image}
                      alt={area.title}
                      className="rounded-2xl shadow-elevated w-full aspect-[4/3] object-cover"
                    />
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-elevated hidden md:flex">
                      <area.icon className="w-12 h-12 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center md:hidden">
                      <area.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="font-display text-3xl font-bold">{area.title}</h2>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {area.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {area.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 px-4 py-3 bg-muted rounded-lg text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Amenities */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Comodidades
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-4">
              Tudo Para Seu Conforto
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <amenity.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{amenity.title}</h3>
                  <p className="text-sm text-muted-foreground">{amenity.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
