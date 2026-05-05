"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, UserCheck, Construction, UserPlus, 
  Home, MapPin, CalendarDays, Barcode, 
  Megaphone, FileSignature, CreditCard, 
  ArrowUpCircle, ArrowDownCircle, LayoutDashboard,
  Loader2 // Importei um ícone de carregamento
} from "lucide-react";

// Interface para tipar os dados que vêm da API
interface DashboardStats {
  totalMoradores: number;
  boletosAberto: number;
  reservasHoje: number;
  comunicadosAtivos: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Estado para armazenar os números reais
  const [stats, setStats] = useState<DashboardStats>({
    totalMoradores: 0,
    boletosAberto: 0,
    reservasHoje: 0,
    comunicadosAtivos: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Função para buscar dados do Backend
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:3000/dashboard/stats", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erro ao carregar KPIs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Opcional: Atualiza os dados automaticamente a cada 1 minuto
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, [router]);

  const menuItems = [
    { name: "Pessoas", href: "/pessoas", icon: <Users size={24} />, desc: "Cadastro Geral" },
    { name: "Moradores", href: "/moradores", icon: <UserCheck size={24} />, desc: "Gestão de Residentes" },
    { name: "Funcionários", href: "/funcionarios", icon: <Construction size={24} />, desc: "Equipe Interna" },
    { name: "Fornecedores", href: "/fornecedores", icon: <UserPlus size={24} />, desc: "Prestadores de Serviço" },
    { name: "Visitantes", href: "/visitantes", icon: <MapPin size={24} />, desc: "Controle de Acesso" },
    { name: "Unidades", href: "/unidades", icon: <Home size={24} />, desc: "Apartamentos e Casas" },
    { name: "Áreas Comuns", href: "/areas-comuns", icon: <MapPin size={24} />, desc: "Espaços Disponíveis" },
    { name: "Reservas", href: "/reservas", icon: <CalendarDays size={24} />, desc: "Agendamentos" },
    { name: "Boletos", href: "/boletos", icon: <Barcode size={24} />, desc: "Financeiro Morador" },
    { name: "Comunicados", href: "/comunicados", icon: <Megaphone size={24} />, desc: "Mural de Avisos" },
    { name: "Contratos", href: "/contratos", icon: <FileSignature size={24} />, desc: "Vínculos Jurídicos" },
    { name: "Contas a Pagar", href: "/contas-pagar", icon: <ArrowDownCircle size={24} />, desc: "Saídas de Caixa" },
    { name: "Contas a Receber", href: "/contas-receber", icon: <ArrowUpCircle size={24} />, desc: "Entradas de Caixa" },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
          <LayoutDashboard className="text-brand-accent" size={32} />
          Painel de Controle
        </h2>
        <p className="text-brand-sage">Visão geral do Condomínio New Spring.</p>
      </div>

      {/* CARDS COM DADOS REAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card-bg border border-brand-olive/30 p-6 rounded-2xl shadow-xl group hover:border-brand-accent/50 transition-all">
          <p className="text-brand-sage text-xs font-bold uppercase tracking-widest">Total de Moradores</p>
          <h3 className="text-4xl font-bold text-brand-cream mt-2 group-hover:text-brand-accent transition-colors">
            {stats.totalMoradores.toString().padStart(2, '0')}
          </h3>
        </div>
        
        <div className="bg-card-bg border border-brand-olive/30 p-6 rounded-2xl shadow-xl group hover:border-brand-accent/50 transition-all">
          <p className="text-brand-sage text-xs font-bold uppercase tracking-widest">Boletos em Aberto</p>
          <h3 className="text-4xl font-bold text-brand-accent mt-2">
            {stats.boletosAberto.toString().padStart(2, '0')}
          </h3>
        </div>

        <div className="bg-card-bg border border-brand-olive/30 p-6 rounded-2xl shadow-xl group hover:border-brand-accent/50 transition-all">
          <p className="text-brand-sage text-xs font-bold uppercase tracking-widest">Reservas Hoje</p>
          <h3 className="text-4xl font-bold text-brand-cream mt-2">
          {(stats?.reservasHoje ?? 0).toString().padStart(2, '0')}
          </h3>
        </div>

        <div className="bg-card-bg border border-brand-olive/30 p-6 rounded-2xl shadow-xl group hover:border-brand-accent/50 transition-all">
          <p className="text-brand-sage text-xs font-bold uppercase tracking-widest">Comunicados Ativos</p>
          <h3 className="text-4xl font-bold text-brand-cream mt-2">
            {stats.comunicadosAtivos.toString().padStart(2, '0')}
          </h3>
        </div>
      </div>

      {/* GRADE DE MÓDULOS */}
      <div>
        <h3 className="text-brand-sage font-bold uppercase text-xs tracking-widest mb-6 ml-1">Módulos de Gestão</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="group bg-brand-dark/40 border border-brand-olive/20 p-5 rounded-2xl hover:bg-brand-olive/10 hover:border-brand-accent/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand-dark border border-brand-olive/30 rounded-xl text-brand-accent group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-brand-dark transition-all duration-300">
                  {item.icon}
                </div>
                <div className="w-2 h-2 rounded-full bg-brand-olive/30 group-hover:bg-brand-accent animate-pulse"></div>
              </div>
              
              <h4 className="text-lg font-bold text-brand-cream group-hover:text-brand-accent transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-brand-sage mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}