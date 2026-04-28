"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Home, Edit, Trash2, Plus, 
  Hash, Layers, Layout, Maximize, Building 
} from "lucide-react";

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<any[]>([]);
  const [form, setForm] = useState({ NUM_UNIDADE: "", BLOCO: "", TIPO: "", AREA_TOTAL: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/unidades");
      setUnidades(res.data);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/unidades/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/unidades", form);
      }
      setForm({ NUM_UNIDADE: "", BLOCO: "", TIPO: "", AREA_TOTAL: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir esta unidade? Isso pode afetar moradores vinculados.")) {
      try {
        await api.delete(`/unidades/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir unidade:", error);
      }
    }
  };

  const handleEdit = (u: any) => {
    setForm({ 
      NUM_UNIDADE: u.NUM_UNIDADE, 
      BLOCO: u.BLOCO, 
      TIPO: u.TIPO, 
      AREA_TOTAL: u.AREA_TOTAL 
    });
    setEditId(u.ID_UNIDADE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <Home className="text-brand-accent" size={32} />
            Gestão de Unidades
          </h1>
          <p className="text-brand-sage mt-1">Organize os blocos, apartamentos e casas do condomínio.</p>
        </div>
      </div>

      {/* FORMULÁRIO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Editar Unidade" : "Cadastrar Nova Unidade"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Número</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: 101" 
                value={form.NUM_UNIDADE} 
                onChange={e => setForm({ ...form, NUM_UNIDADE: e.target.value })}
                required
              />
              <Hash size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Bloco</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: A" 
                value={form.BLOCO} 
                onChange={e => setForm({ ...form, BLOCO: e.target.value })}
                required
              />
              <Layers size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Tipo</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: Apartamento" 
                value={form.TIPO} 
                onChange={e => setForm({ ...form, TIPO: e.target.value })}
                required
              />
              <Layout size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Área Total (m²)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                type="number"
                placeholder="0" 
                value={form.AREA_TOTAL} 
                onChange={e => setForm({ ...form, AREA_TOTAL: e.target.value })}
                required
              />
              <Maximize size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button className="bg-brand-accent hover:brightness-110 text-brand-dark font-black px-10 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2">
              {editId ? "Atualizar Unidade" : "Salvar Unidade"}
            </button>
          </div>
        </form>
      </div>

      {/* LISTAGEM (TABELA) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Unidade / Bloco</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Tipo</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Área Útil</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {unidades.map((u: any) => (
              <tr key={u.ID_UNIDADE} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-dark border border-brand-olive/30 flex items-center justify-center text-brand-accent shadow-inner">
                      <Building size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-brand-cream font-bold text-lg group-hover:text-brand-accent transition-colors">
                        {u.NUM_UNIDADE}
                      </span>
                      <span className="text-[10px] text-brand-sage uppercase font-black tracking-widest">
                        Bloco {u.BLOCO}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full border border-brand-olive/20 bg-brand-dark text-brand-sage text-xs">
                    {u.TIPO}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-brand-cream font-mono font-bold">
                    {u.AREA_TOTAL} m²
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(u)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(u.ID_UNIDADE)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {unidades.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-brand-sage italic text-sm">
                  Nenhuma unidade cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}