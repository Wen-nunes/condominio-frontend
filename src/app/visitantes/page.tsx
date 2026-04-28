"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  UserPlus, Edit, Trash2, Plus, 
  User, Fingerprint, Search, ShieldAlert 
} from "lucide-react";

export default function VisitantesPage() {
  const [visitantes, setVisitantes] = useState<any[]>([]);
  const [form, setForm] = useState({ ID_PESSOA: "", DOCUMENTO: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/visitantes");
      setVisitantes(res.data);
    } catch (error) {
      console.error("Erro ao carregar visitantes:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/visitantes/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/visitantes", form);
      }
      setForm({ ID_PESSOA: "", DOCUMENTO: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar visitante:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja remover este registro de visitante?")) {
      try {
        await api.delete(`/visitantes/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir visitante:", error);
      }
    }
  };

  const handleEdit = (v: any) => {
    setForm({ ID_PESSOA: v.ID_PESSOA, DOCUMENTO: v.DOCUMENTO });
    setEditId(v.ID_VISITANTE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <UserPlus className="text-brand-accent" size={32} />
            Controle de Visitantes
          </h1>
          <p className="text-brand-sage mt-1">Registre e gerencie o acesso de pessoas externas ao condomínio.</p>
        </div>
      </div>

      {/* CARD DE FORMULÁRIO */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Editar Visitante" : "Registrar Novo Visitante"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">ID da Pessoa</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: 42" 
                value={form.ID_PESSOA} 
                onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Documento (RG/CPF)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="00.000.000-0" 
                value={form.DOCUMENTO} 
                onChange={e => setForm({ ...form, DOCUMENTO: e.target.value })}
                required
              />
              <Fingerprint size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-brand-accent hover:brightness-110 text-brand-dark font-black px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              {editId ? "Atualizar" : "Salvar Registro"}
            </button>
          </div>
        </form>
      </div>

      {/* TABELA DE LISTAGEM */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-brand-olive/5 border-b border-brand-olive/20 flex justify-between items-center">
          <h3 className="text-brand-sage text-xs font-black uppercase tracking-widest">Visitantes Recentes</h3>
          <div className="flex items-center gap-2 text-[10px] text-brand-accent font-bold px-2 py-1 bg-brand-dark rounded border border-brand-olive/20">
            <ShieldAlert size={12} />
            ACESSO MONITORADO
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Identificação</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Documento</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {visitantes.map((v: any) => (
              <tr key={v.ID_VISITANTE} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-dark rounded-lg text-brand-olive group-hover:text-brand-accent transition-colors">
                      <User size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-brand-cream font-bold group-hover:text-brand-accent transition-colors">Pessoa #{v.ID_PESSOA}</span>
                      <span className="text-[10px] text-brand-sage uppercase font-black tracking-tighter">ID Visitante: {v.ID_VISITANTE}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="px-3 py-1 rounded-full border border-brand-olive/30 bg-brand-dark text-brand-cream font-mono text-sm">
                    {v.DOCUMENTO}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(v)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(v.ID_VISITANTE)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {visitantes.length === 0 && (
              <tr>
                <td colSpan={3} className="p-10 text-center text-brand-sage italic text-sm">
                  Nenhum visitante registrado no momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}