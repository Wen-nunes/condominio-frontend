"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Truck, Edit, Trash2, Plus, 
  User, Briefcase, Search, HardHat 
} from "lucide-react";

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [form, setForm] = useState({ ID_PESSOA: "", AREA_ATUACAO: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/fornecedores");
      setFornecedores(res.data);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/fornecedores/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/fornecedores", form);
      }
      setForm({ ID_PESSOA: "", AREA_ATUACAO: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este fornecedor do catálogo?")) {
      try {
        await api.delete(`/fornecedores/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
      }
    }
  };

  const handleEdit = (f: any) => {
    setForm({ ID_PESSOA: f.ID_PESSOA, AREA_ATUACAO: f.AREA_ATUACAO });
    setEditId(f.ID_FORNECEDOR);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <Truck className="text-brand-accent" size={32} />
            Catálogo de Fornecedores
          </h1>
          <p className="text-brand-sage mt-1">Gerencie prestadores de serviços e empresas parceiras.</p>
        </div>
      </div>

      {/* FORMULÁRIO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Editar Fornecedor" : "Cadastrar Novo Fornecedor"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">ID da Pessoa</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: 15" 
                value={form.ID_PESSOA} 
                onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1 md:col-span-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Área de Atuação</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: Elétrica, Hidráulica..." 
                value={form.AREA_ATUACAO} 
                onChange={e => setForm({ ...form, AREA_ATUACAO: e.target.value })}
                required
              />
              <Briefcase size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-brand-accent hover:brightness-110 text-brand-dark font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              {editId ? "Atualizar Cadastro" : "Salvar Fornecedor"}
            </button>
          </div>
        </form>
      </div>

      {/* TABELA DE FORNECEDORES */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-brand-olive/5 border-b border-brand-olive/20 flex justify-between items-center">
          <h3 className="text-brand-sage text-xs font-black uppercase tracking-widest">Lista de Parceiros</h3>
          <span className="text-[10px] text-brand-olive font-bold bg-brand-dark px-2 py-1 rounded border border-brand-olive/20">
            {fornecedores.length} CADASTRADOS
          </span>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Fornecedor</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Especialidade</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((f: any) => (
              <tr key={f.ID_FORNECEDOR} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-dark rounded-lg text-brand-olive group-hover:text-brand-accent transition-colors">
                      <HardHat size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-brand-cream font-bold group-hover:text-brand-accent transition-colors">ID Pessoa #{f.ID_PESSOA}</span>
                      <span className="text-brand-sage/60 text-[10px] uppercase tracking-tighter tracking-widest font-bold">Código Fornecedor: {f.ID_FORNECEDOR}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="px-3 py-1 rounded-full border border-brand-olive/30 bg-brand-dark text-brand-cream text-xs font-medium">
                    {f.AREA_ATUACAO}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(f)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(f.ID_FORNECEDOR)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {fornecedores.length === 0 && (
              <tr>
                <td colSpan={3} className="p-10 text-center text-brand-sage italic text-sm">
                  Nenhum fornecedor cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}