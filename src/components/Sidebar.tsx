'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  CalendarDays, 
  Megaphone, 
  ChevronDown, 
  ChevronRight,
  LogOut,
  MapPin // Ícone para Áreas Comuns
} from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  const [openMoradores, setOpenMoradores] = useState(false);
  const [openFinanceiro, setOpenFinanceiro] = useState(false);
  const [openReservas, setOpenReservas] = useState(false); // Novo estado para Reservas

  return (
    <aside className="w-72 border-r border-brand-olive/30 flex flex-col bg-brand-dark h-screen transition-all">
      {/* LOGO */}
      <div className="p-8">
        <h1 className="text-brand-accent font-bold text-3xl tracking-tighter">
          UniCondo<span className="text-brand-cream">.</span>
        </h1>
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        
        {/* DASHBOARD */}
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-brand-sage hover:bg-brand-olive/10 hover:text-brand-accent rounded-xl transition-all group">
          <LayoutDashboard size={20} />
          <span className="font-medium">Menu</span>
        </Link>

        {/* MENU: MORADORES */}
        <div className="space-y-1">
          <button 
            onClick={() => setOpenMoradores(!openMoradores)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${openMoradores ? 'text-brand-accent bg-brand-olive/5' : 'text-brand-sage hover:bg-brand-olive/10 hover:text-brand-accent'}`}
          >
            <div className="flex items-center gap-3">
              <Users size={20} />
              <span className="font-medium">Moradores</span>
            </div>
            {openMoradores ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {openMoradores && (
            <div className="ml-9 flex flex-col border-l border-brand-olive/20 space-y-1 mt-1">
              <Link href="/fornecedores" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Fornecedores</Link>
              <Link href="/funcionarios" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Funcionários</Link>
              <Link href="/moradores" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Moradores</Link>
              <Link href="/pessoas" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Pessoas</Link>
              <Link href="/unidades" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Unidades</Link>
              <Link href="/visitantes" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Visitantes</Link>
            </div>
          )}
        </div>

        {/* MENU: FINANCEIRO */}
        <div className="space-y-1">
          <button 
            onClick={() => setOpenFinanceiro(!openFinanceiro)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${openFinanceiro ? 'text-brand-accent bg-brand-olive/5' : 'text-brand-sage hover:bg-brand-olive/10 hover:text-brand-accent'}`}
          >
            <div className="flex items-center gap-3">
              <DollarSign size={20} />
              <span className="font-medium">Financeiro</span>
            </div>
            {openFinanceiro ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {openFinanceiro && (
            <div className="ml-9 flex flex-col border-l border-brand-olive/20 space-y-1 mt-1">
              <Link href="/boletos" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Boletos</Link>
              <Link href="/contas-pagar" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Contas a Pagar</Link>
              <Link href="/contas-receber" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Contas a Receber</Link>
              <Link href="/contratos" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">Contratos</Link>
            </div>
          )}
        </div>

        {/* MENU: RESERVAS (SUBITENS ADICIONADOS AQUI) */}
        <div className="space-y-1">
          <button 
            onClick={() => setOpenReservas(!openReservas)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${openReservas ? 'text-brand-accent bg-brand-olive/5' : 'text-brand-sage hover:bg-brand-olive/10 hover:text-brand-accent'}`}
          >
            <div className="flex items-center gap-3">
              <CalendarDays size={20} />
              <span className="font-medium">Reservas</span>
            </div>
            {openReservas ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {openReservas && (
            <div className="ml-9 flex flex-col border-l border-brand-olive/20 space-y-1 mt-1">
              <Link href="/reservas" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">
                Nova Reserva
              </Link>
              <Link href="/areas-comuns" className="px-4 py-2 text-sm text-brand-sage/80 hover:text-brand-accent">
                Áreas Comuns
              </Link>
            </div>
          )}
        </div>

        {/* COMUNICADOS */}
        <Link href="/comunicados" className="flex items-center gap-3 px-4 py-3 text-brand-sage hover:bg-brand-olive/10 hover:text-brand-accent rounded-xl transition-all group">
          <Megaphone size={20} />
          <span className="font-medium">Comunicados</span>
        </Link>

      </nav>

      {/* RODAPÉ: PERFIL */}
      <div className="p-4 border-t border-brand-olive/10 bg-brand-dark/50">
        <div className="flex items-center justify-between p-2 hover:bg-brand-olive/5 rounded-lg transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-accent to-brand-olive flex items-center justify-center text-brand-dark font-bold">
              W
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-brand-cream">Wendel Rodrigues</span>
              <span className="text-xs text-brand-sage/60">Administrador</span>
            </div>
          </div>
          <button title="Sair" className="text-brand-sage/40 hover:text-brand-accent transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}