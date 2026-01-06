import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Clock, Calendar, XCircle, CreditCard, Users, Baby, Dog, Cigarette, Volume2, AlertTriangle } from "lucide-react";

const policies = [
  {
    icon: Clock,
    title: "Horários de Check-in e Check-out",
    items: [
      "Check-in: a partir das 14:00",
      "Check-out: até às 12:00",
      "Early check-in e late check-out: consulte disponibilidade e valores adicionais",
      "Chegadas após as 22:00: favor avisar com antecedência",
    ],
  },
  {
    icon: XCircle,
    title: "Política de Cancelamento",
    items: [
      "Cancelamento gratuito: até 7 dias antes da data de check-in",
      "Cancelamento entre 3 e 7 dias: reembolso de 50% do valor pago",
      "Cancelamento com menos de 72 horas: sem reembolso",
      "No-show (não comparecimento): cobrança integral",
      "Alterações de data: sujeitas à disponibilidade, sem custo adicional se solicitadas com 7 dias de antecedência",
    ],
  },
  {
    icon: CreditCard,
    title: "Formas de Pagamento",
    items: [
      "Pix: pagamento à vista com confirmação imediata",
      "Cartão de crédito: parcelamento em até 6x sem juros",
      "Cartão de débito: pagamento à vista",
      "Sinal de reserva: 30% do valor total no momento da reserva",
      "Saldo restante: pode ser pago no check-in ou antecipadamente",
    ],
  },
  {
    icon: Users,
    title: "Ocupação e Hóspedes Adicionais",
    items: [
      "Respeitar a capacidade máxima de cada acomodação",
      "Hóspedes adicionais: R$ 100,00 por pessoa/noite (sujeito a disponibilidade)",
      "Visitas: não são permitidas pernoites de não hóspedes",
      "Identificação: todos os hóspedes devem apresentar documento no check-in",
    ],
  },
  {
    icon: Baby,
    title: "Crianças",
    items: [
      "Crianças até 5 anos: hospedagem gratuita (mesma cama dos pais)",
      "Crianças de 6 a 12 anos: 50% da tarifa de adulto",
      "Berços disponíveis mediante solicitação prévia",
      "Supervisão de menores é responsabilidade dos pais/responsáveis",
    ],
  },
  {
    icon: Dog,
    title: "Animais de Estimação",
    items: [
      "Aceitamos pets de pequeno porte (até 10kg)",
      "Taxa pet-friendly: R$ 50,00 por noite",
      "Animais devem estar vacinados e vermifugados",
      "Pets não são permitidos nas áreas de piscina e restaurante",
      "O hóspede é responsável por eventuais danos causados pelo animal",
    ],
  },
];

const houseRules = [
  { icon: Cigarette, rule: "Proibido fumar em áreas internas", description: "Áreas externas designadas para fumantes" },
  { icon: Volume2, rule: "Silêncio após as 22:00", description: "Respeito ao descanso de todos os hóspedes" },
  { icon: AlertTriangle, rule: "Uso da piscina", description: "Crianças sempre acompanhadas; horário: 8h às 22h" },
];

export default function Policies() {
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
              Regulamento
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4">
              Políticas e Regras
            </h1>
            <p className="text-muted-foreground text-lg">
              Conheça nossas políticas de reserva, cancelamento e regras de convivência 
              para garantir uma estadia tranquila e agradável.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policies Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <policy.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-bold">{policy.title}</h2>
                </div>
                <ul className="space-y-3">
                  {policy.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* House Rules */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              Regras da Casa
            </h2>
            <p className="text-muted-foreground">
              Para garantir o conforto e segurança de todos os hóspedes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {houseRules.map((rule, index) => (
              <motion.div
                key={rule.rule}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 text-center border border-border"
              >
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <rule.icon className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">{rule.rule}</h3>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-8"
            >
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                Tarifas e Temporadas
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Os valores das diárias podem variar de acordo com a temporada:
                </p>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2" />
                    <span><strong>Alta temporada:</strong> Dezembro a Março, feriados prolongados e férias escolares</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2" />
                    <span><strong>Baixa temporada:</strong> Abril a Novembro (exceto feriados)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2" />
                    <span><strong>Mínimo de noites:</strong> pode haver exigência de estadia mínima em feriados e alta temporada</span>
                  </li>
                </ul>
                <p className="text-sm">
                  Consulte os valores atualizados ao fazer sua reserva ou entre em contato 
                  para condições especiais em estadias prolongadas.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
