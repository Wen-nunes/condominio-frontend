"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  FileSignature, Edit, Trash2, Plus, 
  Calendar, DollarSign, Building2, FileText, Clock 
} from "lucide-react";

export default function ContratosPage() {
  const [contratos, setContratos] = useState<any[]>([]);
  const [form, setForm] = useState({ 
    ID_FORNECEDOR: "", 
    DESCRICAO: "", 
    DATA_INICIO: "", 
    DATA_FIM: "", 
    VALOR: "" 
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/contratos");
      setContratos(res.data);
    } catch (error) {
      console.error("Erro ao carregar contratos:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/contratos/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/contratos", form);
      }
      setForm({ ID_FORNECEDOR: "", DESCRICAO: "", DATA_INICIO: "", DATA_FIM: "", VALOR: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar contrato:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este contrato permanentemente?")) {
      try {
        await api.delete(`/contratos/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir contrato:", error);
      }
    }
  };

  const handleEdit = (c: any) => {
    setForm({ 
      ID_FORNECEDOR: c.ID_FORNECEDOR, 
      DESCRICAO: c.DESCRICAO, 
      DATA_INICIO: c.DATA_INICIO, 
      DATA_FIM: c.DATA_FIM, 
      VALOR: c.VALOR 
    });
    setEditId(c.ID_CONTRATO);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para verificar se o contrato está ativo ou expirado
  const getStatusBadge = (dataFim: string) => {
    const hoje = new Date();
    const fim = new Date(dataFim);
    
    if (fim < hoje) {
      return <span className="px-3 py-1 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-tighter">Expirado</span>;
    }
    return <span className="px-3 py-1 rounded-full border border-brand-olive/30 bg-brand-olive/10 text-brand-sage text-[10px] font-black uppercase tracking-tighter">Ativo</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <FileSignature className="text-brand-accent" size={32} />
            Contratos de Prestação
          </h1>
          <p className="text-brand-sage mt-1">Gerencie os vínculos contratuais com fornecedores e terceirizados.</p>
        </div>
      </div>

      {/* FORMULÁRIO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Editar Vínculo" : "Novo Contrato"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1 md:col-span-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Fornecedor (ID)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="0" 
                value={form.ID_FORNECEDOR} 
                onChange={e => setForm({ ...form, ID_FORNECEDOR: e.target.value })}
                required
              />
              <Building2 size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Descrição do Objeto</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: Manutenção Preventiva Bombas de Recalque" 
                value={form.DESCRICAO} 
                onChange={e => setForm({ ...form, DESCRICAO: e.target.value })}
                required
              />
              <FileText size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Início</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10 text-sm" 
                type="date" 
                value={form.DATA_INICIO} 
                onChange={e => setForm({ ...form, DATA_INICIO: e.target.value })}
                required
              />
              <Calendar size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Término</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10 text-sm" 
                type="date" 
                value={form.DATA_FIM} 
                onChange={e => setForm({ ...form, DATA_FIM: e.target.value })}
                required
              />
              <Clock size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Valor Global (R$)</label>
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

          <div className="md:col-span-1 flex items-end">
            <button className="w-full bg-brand-accent hover:brightness-110 text-brand-dark font-bold px-4 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              {editId ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </form>
      </div>

      {/* LISTAGEM (TABELA) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Fornecedor / Objeto</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Vigência</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Investimento</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Status</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contratos.map((c: any) => (
              <tr key={c.ID_CONTRATO} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-brand-cream font-bold group-hover:text-brand-accent transition-colors">{c.DESCRICAO}</span>
                    <span className="text-brand-sage/60 text-xs flex items-center gap-1 uppercase">
                      <Building2 size={10} /> ID Fornecedor: {c.ID_FORNECEDOR}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col items-center text-xs text-brand-sage">
                    <span className="font-mono">{new Date(c.DATA_INICIO).toLocaleDateString('pt-BR')}</span>
                    <span className="text-brand-olive">até</span>
                    <span className="font-mono text-brand-cream">{new Date(c.DATA_FIM).toLocaleDateString('pt-BR')}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-brand-cream font-mono font-bold">
                    R$ {Number(c.VALOR).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {getStatusBadge(c.DATA_FIM)}
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(c)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(c.ID_CONTRATO)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {contratos.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-brand-sage italic text-sm">
                  Nenhum contrato ativo encontrado no sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}