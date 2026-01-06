import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import Index from "@/pages/Index";
import Accommodations from "@/pages/Accommodations";
import Structure from "@/pages/Structure";
import HowToGetThere from "@/pages/HowToGetThere";
import Contact from "@/pages/Contact";
import Policies from "@/pages/Policies";
import Booking from "@/pages/Booking";
import AuthPage from "@/pages/AuthPage";
import ClientArea from "@/pages/ClientArea";
import AdminLogin from "@/pages/AdminLogin";
import Admin from "@/pages/Admin";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Rotas Públicas com Layout */}
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/acomodacoes" element={<Layout><Accommodations /></Layout>} />
                <Route path="/estrutura" element={<Layout><Structure /></Layout>} />
                <Route path="/como-chegar" element={<Layout><HowToGetThere /></Layout>} />
                <Route path="/contato" element={<Layout><Contact /></Layout>} />
                <Route path="/politicas" element={<Layout><Policies /></Layout>} />
                <Route path="/reservar" element={<Layout><Booking /></Layout>} />
                
                {/* Autenticação */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Áreas Protegidas */}
                <Route path="/minhas-reservas" element={<Layout><ClientArea /></Layout>} />
                <Route path="/admin" element={<Admin />} />
                
                {/* Página não encontrada */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </div>
          </Router>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
