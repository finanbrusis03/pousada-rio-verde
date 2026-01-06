import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Ship, Car, Clock, ArrowRight } from "lucide-react";

export function LocationSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14626.084475459341!2d-47.9165086!3d-25.0209605!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94daf1b368f902e5%3A0x82b728e0694645cb!2sIate%20Clube%20Rio%20Verde!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Iate Clube Rio Verde - Av. Intermares, 250"
              />
            </div>
            {/* Floating Info */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-elevated max-w-xs hidden md:block">
              <div className="flex items-start gap-3">
                <Ship className="w-8 h-8 shrink-0" />
                <div>
                  <p className="font-semibold">Próximo à Balsa</p>
                  <p className="text-sm opacity-90">
                    Fácil acesso pela travessia Cananéia – Ilha Comprida
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Localização
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              No Coração do<br />
              Litoral Sul Paulista
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Situado em Ilha Comprida, o Iate Clube Rio Verde oferece acesso 
              privilegiado às belezas naturais da região de Cananéia, patrimônio 
              ambiental reconhecido internacionalmente.
            </p>

            {/* Location Details */}
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Endereço</p>
                  <p className="text-sm text-muted-foreground">
                    Av. Intermares, 250 – Jardim América, Boqueirão Sul<br />
                    Ilha Comprida – SP, CEP 11925-000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Como Chegar</p>
                  <p className="text-sm text-muted-foreground">
                    Acesso pela SP-226 até Cananéia, depois travessia de balsa 
                    (gratuita) para Ilha Comprida.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Distâncias</p>
                  <p className="text-sm text-muted-foreground">
                    São Paulo: ~200km (3h) • Santos: ~120km (2h) • 
                    Curitiba: ~200km (3h)
                  </p>
                </div>
              </div>
            </div>

            <Button variant="default" size="lg" asChild>
              <a 
                href="https://www.google.com/maps/place/Iate+Clube+Rio+Verde/@-25.0253655,-47.908921,15.71z/data=!4m9!3m8!1s0x94daf1b368f902e5:0x82b728e0694645cb!5m2!4m1!1i2!8m2!3d-25.0209605!4d-47.9165086!16s%2Fg%2F11h2ck1f_7?hl=pt-BR&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Ver Mapa Ampliado
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
