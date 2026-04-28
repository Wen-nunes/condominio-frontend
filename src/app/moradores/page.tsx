"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  UserCheck, Edit, Trash2, Plus, 
  User, Home, Search, Info 
} from "lucide-react";

export default function MoradoresPage() {
  const [moradores, setMoradores] = useState<any[]>([]);
  const [form, setForm] = useState({ ID_PESSOA: "", ID_UNIDADE: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/moradores");
      setMoradores(res.data);
    } catch (error) {
      console.error("Erro ao carregar moradores:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/moradores/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/moradores", form);
      }
      setForm({ ID_PESSOA: "", ID_UNIDADE: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar morador:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja remover este vínculo de moradia?")) {
      try {
        await api.delete(`/moradores/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir morador:", error);
      }
    }
  };

  const handleEdit = (m: any) => {
    setForm({ ID_PESSOA: m.ID_PESSOA, ID_UNIDADE: m.ID_UNIDADE });
    setEditId(m.ID_MORADOR);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER DA PÁGINA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <UserCheck className="text-brand-accent" size={32} />
            Gestão de Moradores
          </h1>
          <p className="text-brand-sage mt-1">Vincule pessoas cadastradas às unidades do condomínio.</p>
        </div>
      </div>

      {/* CARD DE VÍNCULO (FORMULÁRIO) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Editar Vínculo" : "Vincular Novo Morador"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">ID da Pessoa</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: 10" 
                value={form.ID_PESSOA} 
                onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">ID da Unidade</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: 101" 
                value={form.ID_UNIDADE} 
                onChange={e => setForm({ ...form, ID_UNIDADE: e.target.value })}
                required
              />
              <Home size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-brand-accent hover:brightness-110 text-brand-dark font-black px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              {editId ? "Atualizar" : "Vincular Morador"}
            </button>
          </div>
        </form>
      </div>

      {/* LISTAGEM (TABELA) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-brand-olive/5 border-b border-brand-olive/20 flex justify-between items-center">
          <h3 className="text-brand-sage text-xs font-black uppercase tracking-widest">Moradores Ativos</h3>
          <span className="text-[10px] text-brand-olive font-bold bg-brand-dark px-2 py-1 rounded border border-brand-olive/20 uppercase">
            {moradores.length} Registros
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Pessoa</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Unidade</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {moradores.map((m: any) => (
              <tr key={m.ID_MORADOR} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-dark rounded-lg text-brand-olive group-hover:text-brand-accent transition-colors">
                      <User size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-brand-cream font-bold group-hover:text-brand-accent transition-colors">Cód. Pessoa #{m.ID_PESSOA}</span>
                      <span className="text-[10px] text-brand-sage uppercase tracking-widest font-bold">Registro: {m.ID_MORADOR}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-brand-olive/30 bg-brand-dark text-brand-cream text-sm font-bold">
                    <Home size={14} className="text-brand-accent" />
                    Unidade {m.ID_UNIDADE}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(m)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(m.ID_MORADOR)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {moradores.length === 0 && (
              <tr>
                <td colSpan={3} className="p-10 text-center text-brand-sage italic text-sm">
                  Nenhum morador vinculado até o momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}