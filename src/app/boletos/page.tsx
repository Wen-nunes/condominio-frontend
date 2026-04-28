"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  FileText, Edit, Trash2, Plus, 
  CircleDollarSign, Calendar, User, Barcode 
} from "lucide-react";

export default function BoletosPage() {
  const [boletos, setBoletos] = useState<any[]>([]);
  // NOMENCLATURA CORRIGIDA: BOLETO_STATUS conforme seu SQL
  const [form, setForm] = useState({ 
    ID_MORADOR: "", 
    VL_BOLETO: "", 
    DT_VENCIMENTO: "", 
    BOLETO_STATUS: "" 
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/boletos");
      setBoletos(res.data);
    } catch (error) {
      console.error("Erro ao carregar boletos:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/boletos/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/boletos", form);
      }
      setForm({ ID_MORADOR: "", VL_BOLETO: "", DT_VENCIMENTO: "", BOLETO_STATUS: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar boleto:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este boleto?")) {
      try {
        await api.delete(`/boletos/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir boleto:", error);
      }
    }
  };

  const handleEdit = (b: any) => {
    setForm({ 
      ID_MORADOR: b.ID_MORADOR, 
      VL_BOLETO: b.VL_BOLETO, 
      DT_VENCIMENTO: b.DT_VENCIMENTO, 
      BOLETO_STATUS: b.BOLETO_STATUS 
    });
    setEditId(b.ID_BOLETO);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para estilizar o Status (estilo uCondo)
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAGO': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'ATRASADO': 
      case 'EXPIRADO': return 'bg-brand-accent/10 text-brand-accent border-brand-accent/20';
      case 'PENDENTE': return 'bg-brand-sage/10 text-brand-sage border-brand-sage/20';
      default: return 'bg-brand-dark text-brand-cream border-brand-olive/30';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <Barcode className="text-brand-accent" size={32} />
            Gestão de Boletos
          </h1>
          <p className="text-brand-sage mt-1">Controle de cobranças e recebimentos dos moradores.</p>
        </div>
      </div>

      {/* FORMULÁRIO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-4 flex items-center gap-2">
          {editId ? <Edit size={18} /> : <Plus size={18} />}
          {editId ? "Editar Boleto" : "Gerar Novo Boleto"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">ID Morador</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="0" 
                value={form.ID_MORADOR} 
                onChange={e => setForm({ ...form, ID_MORADOR: e.target.value })}
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Valor (R$)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                type="number" 
                step="0.01"
                placeholder="0,00" 
                value={form.VL_BOLETO} 
                onChange={e => setForm({ ...form, VL_BOLETO: e.target.value })}
                required
              />
              <CircleDollarSign size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Vencimento</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                type="date" 
                value={form.DT_VENCIMENTO} 
                onChange={e => setForm({ ...form, DT_VENCIMENTO: e.target.value })}
                required
              />
              <Calendar size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Status</label>
            <select 
              className="bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all appearance-none"
              value={form.BOLETO_STATUS} 
              onChange={e => setForm({ ...form, BOLETO_STATUS: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              <option value="PENDENTE">Pendente</option>
              <option value="PAGO">Pago</option>
              <option value="ATRASADO">Atrasado</option>
              <option value="EXPIRADO">Expirado</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end mt-2">
            <button className="bg-brand-accent hover:brightness-110 text-brand-dark font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg">
              {editId ? "Atualizar Boleto" : "Gerar Boleto"}
            </button>
          </div>
        </form>
      </div>

      {/* LISTAGEM (TABELA) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Morador (ID)</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Valor</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Vencimento</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Status</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {boletos.map((b: any) => (
              <tr key={b.ID_BOLETO} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2 text-brand-cream">
                    <User size={14} className="text-brand-sage" />
                    <span>#{b.ID_MORADOR}</span>
                  </div>
                </td>
                <td className="p-4 text-brand-cream font-bold">
                  R$ {Number(b.VL_BOLETO).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-brand-sage text-sm">
                  {new Date(b.DT_VENCIMENTO).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusStyle(b.BOLETO_STATUS)}`}>
                    {b.BOLETO_STATUS}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(b)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(b.ID_BOLETO)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {boletos.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-brand-sage italic">
                  Nenhum boleto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}