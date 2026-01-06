import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Car, Ship, Plane, Bus, Clock, Navigation, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const routes = [
  {
    from: "São Paulo (Capital)",
    distance: "~200 km",
    time: "3 a 3h30",
    icon: Car,
    description: "Pegue a Rodovia Régis Bittencourt (BR-116) sentido Curitiba. Após Registro, siga pela SP-226 até Cananéia. Atravesse a balsa para Ilha Comprida.",
    highlight: true,
  },
  {
    from: "Santos / Baixada Santista",
    distance: "~120 km",
    time: "2 a 2h30",
    icon: Car,
    description: "Siga pela SP-055 (Rodovia Padre Manoel da Nóbrega) até Iguape. Continue pela SP-222 até Cananéia e atravesse a balsa.",
  },
  {
    from: "Curitiba",
    distance: "~200 km",
    time: "3 a 3h30",
    icon: Car,
    description: "Pegue a BR-116 sentido São Paulo. Após Registro, siga pela SP-226 até Cananéia e atravesse a balsa para Ilha Comprida.",
  },
  {
    from: "Aeroporto de Congonhas (CGH)",
    distance: "~210 km",
    time: "3h30",
    icon: Plane,
    description: "Do aeroporto, alugue um carro e siga pela Régis Bittencourt (BR-116) sentido Curitiba, depois SP-226 até Cananéia.",
  },
];

const tips = [
  {
    icon: Ship,
    title: "Travessia de Balsa",
    description: "A balsa Cananéia-Ilha Comprida opera 24h e é gratuita para veículos. Tempo de travessia: ~10 minutos.",
  },
  {
    icon: Clock,
    title: "Melhor Horário",
    description: "Evite sair de SP em sextas-feiras à tarde ou retornar em domingos à noite. O trânsito na Régis pode triplicar o tempo.",
  },
  {
    icon: Navigation,
    title: "GPS",
    description: "Coloque no GPS: 'Balsa Cananéia-Ilha Comprida'. Após a travessia, seguimos pela Av. Intermares.",
  },
];

export default function HowToGetThere() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Localização
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
              Como Chegar
            </h1>
            <p className="text-muted-foreground text-lg">
              Localizado em Ilha Comprida, com acesso pela travessia de balsa 
              a partir de Cananéia. Uma viagem inesquecível até o paraíso.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Address & Map */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14626.084475459341!2d-47.9165086!3d-25.0209605!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94daf1b368f902e5%3A0x82b728e0694645cb!2sIate%20Clube%20Rio%20Verde!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Iate Clube Rio Verde"
                />
              </div>
            </motion.div>

            {/* Address Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-8"
            >
              <div className="bg-card rounded-2xl p-8 border border-border">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-2">Endereço</h2>
                    <p className="text-muted-foreground">
                      Av. Intermares, 250<br />
                      Jardim América / Boqueirão Sul<br />
                      Ilha Comprida – SP<br />
                      CEP 11925-000
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="default" className="flex-1" asChild>
                    <a
                      href="https://www.google.com/maps/place/Iate+Clube+Rio+Verde/@-25.0253655,-47.908921,15.71z/data=!4m9!3m8!1s0x94daf1b368f902e5:0x82b728e0694645cb!5m2!4m1!1i2!8m2!3d-25.0209605!4d-47.9165086!16s%2Fg%2F11h2ck1f_7?hl=pt-BR&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver Mapa Ampliado
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href="tel:+5513999999999" className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Ligar para Suporte
                    </a>
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="space-y-4">
                {tips.map((tip) => (
                  <div
                    key={tip.title}
                    className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                      <tip.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Routes */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              Rotas de Acesso
            </h2>
            <p className="text-muted-foreground">
              Confira as principais rotas para chegar ao Iate Clube Rio Verde.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routes.map((route, index) => (
              <motion.div
                key={route.from}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border ${
                  route.highlight
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    route.highlight ? "bg-primary-foreground/20" : "bg-primary/10"
                  }`}>
                    <route.icon className={`w-6 h-6 ${
                      route.highlight ? "text-primary-foreground" : "text-primary"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{route.from}</h3>
                      <div className={`flex gap-2 text-sm ${
                        route.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}>
                        <span>{route.distance}</span>
                        <span>•</span>
                        <span>{route.time}</span>
                      </div>
                    </div>
                    <p className={`text-sm ${
                      route.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}>
                      {route.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Transport */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Bus className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold mb-2">Transporte Público</h3>
                  <p className="text-muted-foreground">
                    É possível chegar de ônibus a partir do Terminal Rodoviário de São Paulo 
                    (Tietê) com destino a Cananéia. Da rodoviária de Cananéia, táxis e 
                    aplicativos levam até a balsa. Consulte horários na{" "}
                    <a 
                      href="#" 
                      className="text-primary underline hover:no-underline"
                    >
                      Viação Intersul
                    </a>
                    .
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                <strong>Dica:</strong> Entre em contato conosco antes da viagem. 
                Podemos ajudar a organizar transfer da rodoviária até a pousada.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Ainda com dúvidas?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Nossa equipe está à disposição para ajudá-lo com informações sobre 
            rotas, melhores horários e dicas de viagem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/contato">Entrar em Contato</Link>
            </Button>
            <Button variant="whatsapp" size="xl" asChild>
              <a
                href="https://wa.me/5513999999999"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
