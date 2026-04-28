"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  TrendingUp, Edit, Trash2, Plus, 
  Calendar, DollarSign, User, FileText, CheckCircle2 
} from "lucide-react";

export default function ContasReceberPage() {
  const [contas, setContas] = useState<any[]>([]);
  const [form, setForm] = useState({ 
    ID_MORADOR: "", 
    DESCRICAO: "", 
    VALOR: "", 
    DATA_VENCIMENTO: "", 
    STATUS: "" 
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/contas-receber");
      setContas(res.data);
    } catch (error) {
      console.error("Erro ao carregar contas a receber:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/contas-receber/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/contas-receber", form);
      }
      setForm({ ID_MORADOR: "", DESCRICAO: "", VALOR: "", DATA_VENCIMENTO: "", STATUS: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar conta a receber:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este lançamento de receita?")) {
      try {
        await api.delete(`/contas-receber/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir conta a receber:", error);
      }
    }
  };

  const handleEdit = (c: any) => {
    setForm({ 
      ID_MORADOR: c.ID_MORADOR, 
      DESCRICAO: c.DESCRICAO, 
      VALOR: c.VALOR, 
      DATA_VENCIMENTO: c.DATA_VENCIMENTO, 
      STATUS: c.STATUS 
    });
    setEditId(c.ID_CONTA_RECEBER);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para cores de status (Receitas)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGO': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'ATRASADO': return 'bg-brand-accent/20 text-brand-accent border-brand-accent/30';
      case 'ABERTO': return 'bg-brand-sage/10 text-brand-sage border-brand-sage/20';
      default: return 'bg-brand-dark text-brand-cream border-brand-olive/30';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <TrendingUp className="text-green-400" size={32} />
            Contas a Receber
          </h1>
          <p className="text-brand-sage mt-1">Monitore as receitas, taxas condominiais e entradas previstas.</p>
        </div>
      </div>

      {/* FORMULÁRIO DE LANÇAMENTO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Editar Lançamento" : "Novo Lançamento de Receita"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Morador (ID)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="ID do Morador" 
                value={form.ID_MORADOR} 
                onChange={e => setForm({ ...form, ID_MORADOR: e.target.value })}
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Descrição da Receita</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: Taxa de Condomínio - Unidade 101" 
                value={form.DESCRICAO} 
                onChange={e => setForm({ ...form, DESCRICAO: e.target.value })}
                required
              />
              <FileText size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Valor Previsto (R$)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                type="number"
                step="0.01"
                placeholder="0,00" 
                value={form.VALOR} 
                onChange={e => setForm({ ...form, VALOR: e.target.value })}
                required
              />
              <DollarSign size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Data de Vencimento</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                type="date" 
                value={form.DATA_VENCIMENTO} 
                onChange={e => setForm({ ...form, DATA_VENCIMENTO: e.target.value })}
                required
              />
              <Calendar size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Status da Receita</label>
            <select 
              className="bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all appearance-none"
              value={form.STATUS} 
              onChange={e => setForm({ ...form, STATUS: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              <option value="ABERTO">Aberto</option>
              <option value="PAGO">Pago</option>
              <option value="ATRASADO">Atrasado</option>
            </select>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button className="bg-brand-accent hover:brightness-110 text-brand-dark font-bold px-10 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2">
              {editId ? "Atualizar Receita" : "Registrar Receita"}
            </button>
          </div>
        </form>
      </div>

      {/* TABELA DE RECEBIMENTOS */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Descrição / Morador</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Vencimento</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Valor</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Status</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contas.map((c: any) => (
              <tr key={c.ID_CONTA_RECEBER} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-brand-cream font-bold group-hover:text-brand-accent transition-colors">{c.DESCRICAO}</span>
                    <span className="text-brand-sage/60 text-xs flex items-center gap-1">
                      <User size={10} /> ID Morador: {c.ID_MORADOR}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-brand-sage text-sm">
                    <Calendar size={14} />
                    {new Date(c.DATA_VENCIMENTO).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-green-400 font-mono font-bold">
                    R$ {Number(c.VALOR).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-black tracking-widest ${getStatusColor(c.STATUS)}`}>
                    {c.STATUS}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(c)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(c.ID_CONTA_RECEBER)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {contas.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-brand-sage italic">
                  Nenhuma conta a receber registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}