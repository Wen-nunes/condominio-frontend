"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { MapPin, Edit, Trash2, Plus, Users } from "lucide-react";

export default function AreasComunsPage() {
  const [areas, setAreas] = useState<any[]>([]);
  // NOMENCLATURA CORRIGIDA: NOME e DESCRICAO_AREA (conforme seu SQL)
  const [form, setForm] = useState({ NOME: "", DESCRICAO_AREA: "", CAPACIDADE: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/areas-comuns");
      setAreas(res.data);
    } catch (error) {
      console.error("Erro ao carregar áreas comuns:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/areas-comuns/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/areas-comuns", form);
      }
      setForm({ NOME: "", DESCRICAO_AREA: "", CAPACIDADE: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar área comum:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir esta área comum?")) {
      try {
        await api.delete(`/areas-comuns/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir área comum:", error);
      }
    }
  };

  const handleEdit = (a: any) => {
    // MAPEAMENTO CORRIGIDO PARA EDIÇÃO
    setForm({ 
      NOME: a.NOME, 
      DESCRICAO_AREA: a.DESCRICAO_AREA, 
      CAPACIDADE: a.CAPACIDADE 
    });
    setEditId(a.ID_AREA_COMUM);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <MapPin className="text-brand-accent" size={32} />
            Áreas Comuns
          </h1>
          <p className="text-brand-sage mt-1">Gerencie os espaços compartilhados do condomínio.</p>
        </div>
      </div>

      {/* FORMULÁRIO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-4 flex items-center gap-2">
          {editId ? <Edit size={18} /> : <Plus size={18} />}
          {editId ? "Editar Área" : "Cadastrar Nova Área"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Nome da Área</label>
            <input 
              className="bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all" 
              placeholder="Ex: Salão de Festas" 
              value={form.NOME} 
              onChange={e => setForm({ ...form, NOME: e.target.value })}
              required
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Descrição</label>
            <input 
              className="bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all" 
              placeholder="Ex: Bloco A - Piso 1" 
              value={form.DESCRICAO_AREA} 
              onChange={e => setForm({ ...form, DESCRICAO_AREA: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Capacidade Máx.</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pr-10" 
                type="number" 
                placeholder="0" 
                value={form.CAPACIDADE} 
                onChange={e => setForm({ ...form, CAPACIDADE: e.target.value })}
                required
              />
              <Users size={18} className="absolute right-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end mt-2">
            <button className="bg-brand-accent hover:brightness-110 text-brand-dark font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg">
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
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Área</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Descrição</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Capacidade</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((a: any) => (
              <tr key={a.ID_AREA_COMUM} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors">
                <td className="p-4 text-brand-cream font-medium">{a.NOME}</td>
                <td className="p-4 text-brand-sage text-sm">{a.DESCRICAO_AREA || "---"}</td>
                <td className="p-4 text-center">
                  <span className="bg-brand-dark px-3 py-1 rounded-full border border-brand-olive/30 text-brand-cream text-sm">
                    {a.CAPACIDADE} pessoas
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(a)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(a.ID_AREA_COMUM)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}