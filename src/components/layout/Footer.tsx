import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest-800 text-sand-100">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-2xl font-bold">Iate Clube</h3>
              <p className="font-display text-xl opacity-90">Rio Verde</p>
            </div>
            <p className="text-sand-200 text-sm leading-relaxed">
              Seu refúgio à beira-mar em Ilha Comprida. Descanso, natureza e 
              momentos inesquecíveis no litoral sul de São Paulo.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-sand-100/10 flex items-center justify-center hover:bg-sand-100/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-sand-100/10 flex items-center justify-center hover:bg-sand-100/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5513999999999"
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#20BD5C] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">Links Rápidos</h4>
            <ul className="space-y-3">
              {[
                { href: "/acomodacoes", label: "Acomodações" },
                { href: "/estrutura", label: "Estrutura" },
                { href: "/como-chegar", label: "Como Chegar" },
                { href: "/politicas", label: "Políticas" },
                { href: "/reservar", label: "Reservar" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sand-200 hover:text-sand-100 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sand-200">
                  Av. Intermares, 250 – Jardim América<br />
                  Boqueirão Sul – Ilha Comprida – SP<br />
                  CEP 11925-000
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href="tel:+5513999999999" className="text-sand-200 hover:text-sand-100">
                  (13) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:contato@rioverde.com.br" className="text-sand-200 hover:text-sand-100">
                  contato@rioverde.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-5">Horários</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sand-200">
                  <p className="font-medium text-sand-100">Check-in</p>
                  <p>A partir das 14:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sand-200">
                  <p className="font-medium text-sand-100">Check-out</p>
                  <p>Até às 12:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MessageCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sand-200">
                  <p className="font-medium text-sand-100">Atendimento</p>
                  <p>24 horas via WhatsApp</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sand-100/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-sand-300">
            <p>© 2024 Iate Clube Rio Verde. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link to="/politicas" className="hover:text-sand-100 transition-colors">
                Políticas de Privacidade
              </Link>
              <Link to="/politicas" className="hover:text-sand-100 transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
