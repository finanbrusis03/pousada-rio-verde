import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, MapPin, LogOut, User, MessageCircle } from 'lucide-react'
import { useAuth } from '@/contexts/SupabaseAuthContext'

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/acomodacoes", label: "Acomodações" },
  { href: "/estrutura", label: "Estrutura" },
  { href: "/como-chegar", label: "Como Chegar" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";
  const headerBg = isScrolled || !isHomePage
    ? "glass shadow-soft"
    : "bg-transparent";

  const textColor = isScrolled || !isHomePage
    ? "text-foreground"
    : "text-primary-foreground";

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20 px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className={`flex flex-col ${textColor}`}>
                <span className="font-display text-xl font-bold leading-tight">
                  Iate Clube
                </span>
                <span className="font-display text-lg font-medium leading-tight opacity-90">
                  Rio Verde
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`${textColor} font-medium text-sm hover:opacity-80 transition-opacity relative group`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
              {user && user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`${textColor} font-medium text-sm hover:opacity-80 transition-opacity relative group`}
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              )}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <span className={`text-sm ${textColor}`}>
                    Bem-vindo, {user.name || user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-accent/50 text-accent hover:bg-accent hover:text-forest-900 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Link to="/login" className="flex items-center gap-2">
                    Entrar
                  </Link>
                </Button>
              )}
              <Button
                variant="whatsapp"
                size="sm"
                asChild
              >
                <a
                  href="https://wa.me/5513999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </Button>
              <Button
                variant={isScrolled || !isHomePage ? "default" : "heroOutline"}
                size="sm"
                asChild
              >
                <Link to="/reservar">
                  Reservar Agora
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden ${textColor} p-2`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-primary-foreground/10"
          >
            <div 
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-background shadow-elevated flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="font-display text-lg font-bold">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 p-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className="block py-3 px-4 text-foreground font-medium hover:bg-muted rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {user && user.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 6 * 0.1 }}
                  >
                    <Link
                      to="/admin"
                      className="block py-3 px-4 text-foreground font-medium hover:bg-muted rounded-lg transition-colors"
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                )}
              </div>

              <div className="p-6 border-t border-border space-y-3">
                {user ? (
                  <>
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      Logado como: {user.name || user.email}
                    </div>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full justify-start border-accent/50 text-accent hover:bg-accent hover:text-forest-900" asChild>
                    <Link to="/login">
                      Entrar
                    </Link>
                  </Button>
                )}
                <Button variant="whatsapp" className="w-full" asChild>
                  <a
                    href="https://wa.me/5513999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="default" className="w-full" asChild>
                  <Link to="/reservar">Reservar Agora</Link>
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
