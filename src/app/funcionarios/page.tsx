"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  UserCog, Edit, Trash2, Plus, 
  User, Briefcase, Calendar, DollarSign, BadgeCheck 
} from "lucide-react";

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [form, setForm] = useState({ 
    ID_PESSOA: "", 
    FUNCAO: "", 
    DATA_ADMISSAO: "", 
    SALARIO: "" 
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/funcionarios");
      setFuncionarios(res.data);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/funcionarios/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/funcionarios", form);
      }
      setForm({ ID_PESSOA: "", FUNCAO: "", DATA_ADMISSAO: "", SALARIO: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja remover este funcionário do quadro da equipe?")) {
      try {
        await api.delete(`/funcionarios/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir funcionário:", error);
      }
    }
  };

  const handleEdit = (f: any) => {
    setForm({ 
      ID_PESSOA: f.ID_PESSOA, 
      FUNCAO: f.FUNCAO, 
      DATA_ADMISSAO: f.DATA_ADMISSAO, 
      SALARIO: f.SALARIO 
    });
    setEditId(f.ID_FUNCIONARIO);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <UserCog className="text-brand-accent" size={32} />
            Quadro de Funcionários
          </h1>
          <p className="text-brand-sage mt-1">Gerencie a equipe interna e prestadores fixos do condomínio.</p>
        </div>
      </div>

      {/* FORMULÁRIO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Editar Registro" : "Adicionar Funcionário"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">ID Pessoa</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="0" 
                value={form.ID_PESSOA} 
                onChange={e => setForm({ ...form, ID_PESSOA: e.target.value })}
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1 md:col-span-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Função / Cargo</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: Zelador, Porteiro..." 
                value={form.FUNCAO} 
                onChange={e => setForm({ ...form, FUNCAO: e.target.value })}
                required
              />
              <Briefcase size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Admissão</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10 text-sm" 
                type="date" 
                value={form.DATA_ADMISSAO} 
                onChange={e => setForm({ ...form, DATA_ADMISSAO: e.target.value })}
                required
              />
              <Calendar size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Salário (R$)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                type="number"
                step="0.01"
                placeholder="0,00" 
                value={form.SALARIO} 
                onChange={e => setForm({ ...form, SALARIO: e.target.value })}
                required
              />
              <DollarSign size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button className="bg-brand-accent hover:brightness-110 text-brand-dark font-bold px-10 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2">
              {editId ? "Atualizar Colaborador" : "Registrar Funcionário"}
            </button>
          </div>
        </form>
      </div>

      {/* LISTAGEM (TABELA) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Funcionário</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Função</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Admissão</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Salário</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((f: any) => (
              <tr key={f.ID_FUNCIONARIO} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-dark border border-brand-olive/30 flex items-center justify-center text-brand-sage group-hover:text-brand-accent transition-colors">
                      <User size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-brand-cream font-bold group-hover:text-brand-accent transition-colors">ID Pessoa #{f.ID_PESSOA}</span>
                      <span className="text-[10px] text-brand-sage uppercase tracking-widest font-bold">Registro: {f.ID_FUNCIONARIO}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full border border-brand-olive/30 bg-brand-dark text-brand-cream text-xs font-medium">
                    {f.FUNCAO}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-brand-sage text-sm">
                    <Calendar size={14} />
                    {new Date(f.DATA_ADMISSAO).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-brand-cream font-mono font-bold">
                    R$ {Number(f.SALARIO).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(f)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(f.ID_FUNCIONARIO)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {funcionarios.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-brand-sage italic text-sm">
                  Nenhum funcionário registrado no quadro atual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}