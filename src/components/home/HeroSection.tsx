import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star } from "lucide-react";
import heroImage from "@/assets/hero-resort.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Vista aérea do Iate Clube Rio Verde"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/60 via-forest-900/40 to-forest-900/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-0 -mt-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sand-100/10 backdrop-blur-sm border border-sand-100/20 text-sand-100"
            >
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Ilha Comprida – Cananéia, SP</span>
            </motion.div>

            {/* Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-sand-50 leading-tight">
              Seu Refúgio <br />
              <span className="text-accent">à Beira-Mar</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-sand-200 max-w-xl leading-relaxed">
              Descubra a tranquilidade do litoral sul paulista. Piscina, restaurante, 
              bar e acesso exclusivo às belezas naturais da região.
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sand-100">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-sm">Avaliação dos hóspedes</span>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 relative z-10"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/reservar" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Reservar Agora
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/acomodacoes">
                  Ver Acomodações
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Quick Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute top-full left-0 right-0 z-20 mt-16"
        >
          <div className="max-w-4xl mx-auto px-4">
            <div className="glass-dark rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sand-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-sand-300">Check-in / Check-out</p>
                  <p className="font-semibold text-sm">14:00 / 12:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-sand-300">Localização</p>
                  <p className="font-semibold text-sm">Próximo à Balsa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-sand-300">Estrutura Completa</p>
                  <p className="font-semibold text-sm">Piscina • Bar • Restaurante</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
