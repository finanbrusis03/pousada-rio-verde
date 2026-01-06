import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, Star } from "lucide-react";
import heroImage from "@/assets/hero-resort.jpg";

export function CTASection() {
  return (
    <section className="relative py-32">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Iate Clube Rio Verde"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/90 via-forest-900/80 to-forest-900/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-sand-200 text-sm">
                Mais de 500 avaliações positivas
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-5xl font-bold text-sand-50 leading-tight">
              Pronto Para Sua<br />
              <span className="text-accent">Próxima Aventura?</span>
            </h2>

            <p className="text-lg text-sand-200 leading-relaxed">
              Reserve agora e garanta seu lugar no paraíso. Condições especiais 
              para reservas antecipadas e estadias prolongadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/reservar" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Fazer Reserva
                </Link>
              </Button>
              <Button variant="whatsapp" size="xl" asChild>
                <a
                  href="https://wa.me/5513999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-6 text-sand-200 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                Cancelamento flexível
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                Pagamento seguro
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                Confirmação instantânea
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
