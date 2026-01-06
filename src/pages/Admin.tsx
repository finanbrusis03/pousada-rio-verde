import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bed, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  Users, 
  LogOut,
  Home,
  BarChart3,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Building,
  CheckCircle,
  AlertCircle,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useRooms } from "@/hooks/useSupabase";
import { RoomForm } from "@/components/admin/RoomForm";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut, isAdmin } = useAuth();
  const roomsData = useRooms();
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  useEffect(() => {
    console.log('Verificando autenticação:', { user, isAdmin });
    
    if (!user) {
      console.log('Usuário não autenticado, redirecionando para login...');
      navigate("/login", { state: { admin: true } });
    } else if (!isAdmin) {
      console.log('Usuário não é admin, redirecionando para login...');
      console.log('Detalhes do usuário:', {
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin'
      });
      navigate("/login", { state: { admin: true } });
    } else {
      console.log('Usuário autenticado como admin:', user.email);
    }
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => {
    await signOut()
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do painel administrativo.",
    });
    navigate("/");
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsRoomFormOpen(true);
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    setIsRoomFormOpen(true);
  };

  const handleSaveRoom = async (roomData: any) => {
    try {
      if (editingRoom) {
        console.log('Editing room with ID:', editingRoom.id);
        // Usa o ID como está (string UUID)
        await roomsData.updateRoom(editingRoom.id, roomData);
        toast({
          title: "Quarto atualizado",
          description: "O quarto foi atualizado com sucesso.",
        });
      } else {
        await roomsData.createRoom(roomData);
        toast({
          title: "Quarto adicionado",
          description: "O novo quarto foi adicionado com sucesso.",
        });
      }
      setIsRoomFormOpen(false);
      setEditingRoom(null);
      roomsData.fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o quarto.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (confirm('Tem certeza que deseja excluir este quarto?')) {
      try {
        console.log('Deleting room with ID:', roomId);
        // Usa o ID como está (string UUID)
        await roomsData.deleteRoom(roomId);
        toast({
          title: "Quarto excluído",
          description: "O quarto foi excluído com sucesso.",
        });
        roomsData.fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o quarto.",
          variant: "destructive",
        });
      }
    }
  };

  // Dados mockados para demonstração
  const stats = [
    { 
      label: "Reservas Hoje", 
      value: "12", 
      icon: Calendar, 
      color: "text-accent",
      bgColor: "bg-forest-900/60",
      borderColor: "border-accent/50"
    },
    { 
      label: "Check-ins Pendentes", 
      value: "4", 
      icon: Clock, 
      color: "text-orange-400",
      bgColor: "bg-forest-900/60",
      borderColor: "border-orange-400/30"
    },
    { 
      label: "Faturamento Mensal", 
      value: "R$ 45.800", 
      icon: DollarSign, 
      color: "text-green-400",
      bgColor: "bg-forest-900/60",
      borderColor: "border-green-400/30"
    },
    { 
      label: "Taxa de Ocupação", 
      value: "78%", 
      icon: TrendingUp, 
      color: "text-purple-400",
      bgColor: "bg-forest-900/60",
      borderColor: "border-purple-400/30"
    },
  ];

  const rooms = [
    { id: 1, name: "Suíte Master", capacity: 4, price: 450, status: "Disponível", occupancy: 0 },
    { id: 2, name: "Suíte Standard", capacity: 2, price: 280, status: "Ocupado", occupancy: 100 },
    { id: 3, name: "Chalé Família", capacity: 6, price: 650, status: "Disponível", occupancy: 0 },
    { id: 4, name: "Quarto Duplo", capacity: 2, price: 220, status: "Manutenção", occupancy: 0 },
  ];

  const recentReservations = [
    { id: 1, guest: "Maria Silva", room: "Suíte Master", checkin: "10/01/2026", status: "Confirmada", total: "R$ 1.350" },
    { id: 2, guest: "João Santos", room: "Chalé Família", checkin: "12/01/2026", status: "Pendente", total: "R$ 1.950" },
    { id: 3, guest: "Ana Costa", room: "Suíte Standard", checkin: "15/01/2026", status: "Paga", total: "R$ 840" },
  ];

  return (
    <div className="min-h-screen">
      {/* Background igual ao do resort */}
      <div className="fixed inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Resort Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/80 via-forest-900/60 to-forest-900/80" />
      </div>

      {/* Header */}
      <header className="relative z-20 backdrop-blur-sm bg-forest-900/20 border-b border-sand-100/20 sticky top-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent/80 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-forest-900" />
                </div>
                <div>
                  <Link to="/" className="font-display text-xl font-bold text-sand-50">
                    Iate Clube Rio Verde
                  </Link>
                  <p className="text-xs text-sand-200">Painel Administrativo</p>
                </div>
              </motion.div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative text-sand-200 hover:text-sand-50">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-forest-900 text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-sand-200 hover:text-sand-50">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Ver Site
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 border-sand-100/30 text-sand-200 hover:bg-sand-100/10">
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-sand-50 mb-2">Dashboard Administrativo</h1>
            <p className="text-sand-200">Gerencie todas as operações do Iate Clube Rio Verde</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`backdrop-blur-sm ${stat.bgColor} border ${stat.borderColor} hover:shadow-xl transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-sand-300">{stat.label}</p>
                        <p className="text-3xl font-bold text-sand-50 mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center border ${stat.borderColor}`}>
                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="backdrop-blur-sm bg-forest-900/20 border border-sand-100/20 w-full justify-start overflow-x-auto p-1">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-forest-900 text-sand-200">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-forest-900 text-sand-200">
                <Bed className="w-4 h-4" />
                Quartos
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-forest-900 text-sand-200">
                <Calendar className="w-4 h-4" />
                Reservas
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-forest-900 text-sand-200">
                <CreditCard className="w-4 h-4" />
                Pagamentos
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-forest-900 text-sand-200">
                <MessageSquare className="w-4 h-4" />
                Chatbot
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-forest-900 text-sand-200">
                <Users className="w-4 h-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-forest-900 text-sand-200">
                <Settings className="w-4 h-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="backdrop-blur-sm bg-forest-900/20 border-sand-100/20">
                  <CardHeader className="border-b border-sand-100/20">
                    <CardTitle className="text-sand-50">Reservas Recentes</CardTitle>
                    <CardDescription className="text-sand-200">Últimas reservas recebidas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReservations.map((reservation) => (
                        <div key={reservation.id} className="flex items-center justify-between p-3 bg-sand-100/10 rounded-lg border border-sand-100/20">
                          <div>
                            <p className="font-medium text-sand-50">{reservation.guest}</p>
                            <p className="text-sm text-sand-300">{reservation.room} • {reservation.checkin}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reservation.status === "Confirmada" ? "bg-blue-500/20 text-blue-200 border border-blue-500/30" :
                            reservation.status === "Paga" ? "bg-green-500/20 text-green-200 border border-green-500/30" :
                            "bg-orange-500/20 text-orange-200 border border-orange-500/30"
                          }`}>
                            {reservation.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-forest-900/20 border-sand-100/20">
                  <CardHeader className="border-b border-sand-100/20">
                    <CardTitle className="text-sand-50">Ações Rápidas</CardTitle>
                    <CardDescription className="text-sand-200">Acesse as principais funcionalidades</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 border-sand-100/30 text-sand-200 hover:bg-sand-100/10">
                      <Plus className="w-5 h-5" />
                      <span>Nova Reserva</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 border-sand-100/30 text-sand-200 hover:bg-sand-100/10">
                      <Bed className="w-5 h-5" />
                      <span>Adicionar Quarto</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 border-sand-100/30 text-sand-200 hover:bg-sand-100/10">
                      <Calendar className="w-5 h-5" />
                      <span>Bloquear Datas</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 border-sand-100/30 text-sand-200 hover:bg-sand-100/10">
                      <MessageSquare className="w-5 h-5" />
                      <span>Ver Mensagens</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Rooms Tab */}
            <TabsContent value="rooms">
              <Card className="backdrop-blur-sm bg-forest-900/20 border-sand-100/20">
                <CardHeader className="border-b border-sand-100/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sand-50 flex items-center gap-2">
                        <Bed className="w-5 h-5 text-accent" />
                        Gestão de Quartos
                      </CardTitle>
                      <CardDescription className="text-sand-200">Gerencie os quartos e acomodações</CardDescription>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90 text-forest-900 border-accent/50" onClick={handleAddRoom}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Quarto
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {roomsData.loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                      <p className="mt-4 text-sand-300">Carregando quartos...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-sand-100/20">
                            <th className="text-left py-3 px-4 font-medium text-sand-300">Nome</th>
                            <th className="text-left py-3 px-4 font-medium text-sand-300">Capacidade</th>
                            <th className="text-left py-3 px-4 font-medium text-sand-300">Preço/Diária</th>
                            <th className="text-left py-3 px-4 font-medium text-sand-300">Status</th>
                            <th className="text-right py-3 px-4 font-medium text-sand-300">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomsData.rooms.map((room) => (
                            <tr key={room.id} className="border-b border-sand-100/10 last:border-0 hover:bg-sand-100/5 transition-colors">
                              <td className="py-3 px-4 font-medium text-sand-50">{room.name}</td>
                              <td className="py-3 px-4 text-sand-300">{room.capacity} pessoas</td>
                              <td className="py-3 px-4 text-sand-300">R$ {room.price}</td>
                              <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  room.status === "available" ? "bg-green-500/20 text-green-200 border border-green-500/30" :
                                  room.status === "occupied" ? "bg-blue-500/20 text-blue-200 border border-blue-500/30" :
                                  "bg-orange-500/20 text-orange-200 border border-orange-500/30"
                                }`}>
                                  {room.status === "available" ? "Disponível" : 
                                   room.status === "occupied" ? "Ocupado" : "Manutenção"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="icon" className="text-sand-300 hover:text-sand-50 hover:bg-sand-100/10" onClick={() => handleEditRoom(room)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-sand-300 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteRoom(String(room.id))}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Room Form Modal */}
              <RoomForm
                isOpen={isRoomFormOpen}
                room={editingRoom}
                onSave={handleSaveRoom}
                onCancel={() => {
                  setIsRoomFormOpen(false);
                  setEditingRoom(null);
                }}
              />
            </TabsContent>

            {/* Reservations Tab */}
            <TabsContent value="reservations">
              <Card className="backdrop-blur-sm bg-forest-900/20 border-sand-100/20">
                <CardHeader className="border-b border-sand-100/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sand-50 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-accent" />
                        Gestão de Reservas
                      </CardTitle>
                      <CardDescription className="text-sand-200">Visualize e gerencie todas as reservas</CardDescription>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90 text-forest-900 border-accent/50">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Reserva
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-sand-400 opacity-50" />
                    <p className="text-sand-300">Conecte ao Supabase para habilitar o sistema de reservas</p>
                    <Button className="mt-4 bg-accent hover:bg-accent/90 text-forest-900">Configurar Backend</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card className="backdrop-blur-sm bg-forest-900/20 border-sand-100/20">
                <CardHeader className="border-b border-sand-100/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sand-50 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-accent" />
                        Gestão de Pagamentos
                      </CardTitle>
                      <CardDescription className="text-sand-200">Configure métodos de pagamento e visualize transações</CardDescription>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90 text-forest-900 border-accent/50">
                      <Plus className="w-4 h-4 mr-2" />
                      Configurar Stripe
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-sand-400 opacity-50" />
                    <p className="text-sand-300">Integre o Stripe para processar pagamentos</p>
                    <Button className="mt-4 bg-accent hover:bg-accent/90 text-forest-900">Configurar Stripe</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chatbot Tab */}
            <TabsContent value="chatbot">
              <Card className="backdrop-blur-sm bg-forest-900/20 border-sand-100/20">
                <CardHeader className="border-b border-sand-100/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sand-50 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-accent" />
                        Configuração do Chatbot
                      </CardTitle>
                      <CardDescription className="text-sand-200">Configure o atendimento automático via WhatsApp</CardDescription>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90 text-forest-900 border-accent/50">
                      <Plus className="w-4 h-4 mr-2" />
                      Configurar WhatsApp
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-sand-400 opacity-50" />
                    <p className="text-sand-300">Configure a integração com WhatsApp Business API</p>
                    <Button className="mt-4 bg-accent hover:bg-accent/90 text-forest-900">Configurar WhatsApp</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="backdrop-blur-sm bg-forest-900/20 border-sand-100/20">
                <CardHeader className="border-b border-sand-100/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sand-50 flex items-center gap-2">
                        <Users className="w-5 h-5 text-accent" />
                        Gestão de Usuários
                      </CardTitle>
                      <CardDescription className="text-sand-200">Gerencie clientes e administradores</CardDescription>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90 text-forest-900 border-accent/50">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Usuário
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-4 text-sand-400 opacity-50" />
                    <p className="text-sand-300">Conecte ao Supabase para gerenciar usuários</p>
                    <Button className="mt-4 bg-accent hover:bg-accent/90 text-forest-900">Configurar Autenticação</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="backdrop-blur-sm bg-forest-900/20 border-sand-100/20">
                <CardHeader className="border-b border-sand-100/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sand-50 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-accent" />
                        Configurações Gerais
                      </CardTitle>
                      <CardDescription className="text-sand-200">Configure informações da pousada</CardDescription>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90 text-forest-900 border-accent/50">
                      Salvar Configurações
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-sand-200">Nome da Pousada</label>
                      <input 
                        type="text" 
                        defaultValue="Iate Clube Rio Verde"
                        className="w-full px-3 py-2 border border-sand-100/20 rounded-lg bg-forest-900/30 text-sand-50 focus:border-accent/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-sand-200">WhatsApp</label>
                      <input 
                        type="text" 
                        defaultValue="(13) 99999-9999"
                        className="w-full px-3 py-2 border border-sand-100/20 rounded-lg bg-forest-900/30 text-sand-50 focus:border-accent/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-sand-200">Horário Check-in</label>
                      <input 
                        type="time" 
                        defaultValue="14:00"
                        className="w-full px-3 py-2 border border-sand-100/20 rounded-lg bg-forest-900/30 text-sand-50 focus:border-accent/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-sand-200">Horário Check-out</label>
                      <input 
                        type="time" 
                        defaultValue="12:00"
                        className="w-full px-3 py-2 border border-sand-100/20 rounded-lg bg-forest-900/30 text-sand-50 focus:border-accent/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
