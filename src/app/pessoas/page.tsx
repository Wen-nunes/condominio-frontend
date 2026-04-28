"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Users, Edit, Trash2, Plus, 
  User, Fingerprint, Search, ShieldCheck 
} from "lucide-react";

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [form, setForm] = useState({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      const res = await api.get("/pessoas");
      setPessoas(res.data);
    } catch (error) {
      console.error("Erro ao carregar pessoas:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const hoje = new Date();
      const dataCadastro = hoje.toISOString().split('T')[0];
      
      if (editId) {
        await api.put(`/pessoas/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/pessoas", { ...form, DATA_CADASTRO: dataCadastro });
      }
      setForm({ NOME: "", TIPO_PESSOA: "", CPF_CNPJ: "" });
      carregarPessoas();
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Atenção: Excluir esta pessoa pode afetar outros registros (Moradores, Funcionários). Deseja continuar?")) {
      try {
        await api.delete(`/pessoas/${id}`);
        carregarPessoas();
      } catch (error) {
        console.error("Erro ao excluir pessoa:", error);
      }
    }
  };

  const handleEdit = (p: any) => {
    setForm({ NOME: p.NOME, TIPO_PESSOA: p.TIPO_PESSOA, CPF_CNPJ: p.CPF_CNPJ });
    setEditId(p.ID_PESSOA);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <Users className="text-brand-accent" size={32} />
            Base de Cadastros
          </h1>
          <p className="text-brand-sage mt-1">Gerencie as pessoas físicas e jurídicas vinculadas ao condomínio.</p>
        </div>
      </div>

      {/* FORMULÁRIO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Editar Cadastro" : "Novo Cadastro de Pessoa"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1 md:col-span-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Nome Completo / Razão</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="Ex: João Silva" 
                value={form.NOME} 
                onChange={e => setForm({ ...form, NOME: e.target.value })}
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Tipo</label>
            <select 
              className="bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all appearance-none"
              value={form.TIPO_PESSOA}
              onChange={e => setForm({ ...form, TIPO_PESSOA: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              <option value="FISICA">Física</option>
              <option value="JURIDICA">Jurídica</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Documento (CPF/CNPJ)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="000.000.000-00" 
                value={form.CPF_CNPJ} 
                onChange={e => setForm({ ...form, CPF_CNPJ: e.target.value })}
                required
              />
              <Fingerprint size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button className="bg-brand-accent hover:brightness-110 text-brand-dark font-black px-10 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2">
              {editId ? "Atualizar Dados" : "Salvar Cadastro"}
            </button>
          </div>
        </form>
      </div>

      {/* TABELA DE LISTAGEM */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-brand-olive/5 border-b border-brand-olive/20 flex justify-between items-center">
          <h3 className="text-brand-sage text-xs font-black uppercase tracking-widest">Registros Atuais</h3>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">ID</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Nome / Razão Social</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Tipo</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Documento</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((p: any) => (
              <tr key={p.ID_PESSOA} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4 text-brand-olive font-mono text-xs">#{p.ID_PESSOA}</td>
                <td className="p-4">
                  <span className="text-brand-cream font-bold group-hover:text-brand-accent transition-colors">
                    {p.NOME}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-tighter ${
                    p.TIPO_PESSOA === 'FISICA' 
                    ? 'border-brand-sage/20 bg-brand-sage/5 text-brand-sage' 
                    : 'border-brand-cream/20 bg-brand-cream/5 text-brand-cream'
                  }`}>
                    {p.TIPO_PESSOA}
                  </span>
                </td>
                <td className="p-4 text-brand-sage text-sm font-medium">
                  {p.CPF_CNPJ}
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(p)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(p.ID_PESSOA)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {pessoas.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-brand-sage italic text-sm">
                  Nenhum registro encontrado na base de dados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}