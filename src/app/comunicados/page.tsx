"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Megaphone, Edit, Trash2, Plus, 
  Calendar, Clock, Type, AlignLeft, AlertCircle 
} from "lucide-react";

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<any[]>([]);
  const [form, setForm] = useState({ 
    TITULO: "", 
    MENSAGEM: "", 
    DT_COMUNICADO: "", 
    HR_COMUNICADO: "", 
    TIPO: "" 
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/comunicados");
      setComunicados(res.data);
    } catch (error) {
      console.error("Erro ao carregar comunicados:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/comunicados/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/comunicados", form);
      }
      setForm({ TITULO: "", MENSAGEM: "", DT_COMUNICADO: "", HR_COMUNICADO: "", TIPO: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar comunicado:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este comunicado?")) {
      try {
        await api.delete(`/comunicados/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir comunicado:", error);
      }
    }
  };

  const handleEdit = (c: any) => {
    setForm({ 
      TITULO: c.TITULO, 
      MENSAGEM: c.MENSAGEM, 
      DT_COMUNICADO: c.DT_COMUNICADO, 
      HR_COMUNICADO: c.HR_COMUNICADO, 
      TIPO: c.TIPO 
    });
    setEditId(c.ID_COMUNICADO);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lógica de cores para os tipos de comunicados baseada na paleta
  const getTipoStyle = (tipo: string) => {
    switch (tipo) {
      case 'URGENTE': return 'bg-brand-accent/20 text-brand-accent border-brand-accent/30';
      case 'AVISO': return 'bg-brand-olive/20 text-brand-sage border-brand-olive/30';
      case 'NOTIFICAÇÃO': return 'bg-brand-cream/10 text-brand-cream border-brand-cream/20';
      case 'COMUNICADO': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-brand-dark text-brand-sage border-brand-olive/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <Megaphone className="text-brand-accent" size={32} />
            Mural de Comunicados
          </h1>
          <p className="text-brand-sage mt-1">Publique avisos e notificações para todos os moradores.</p>
        </div>
      </div>

      {/* FORMULÁRIO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Editar Mensagem" : "Novo Comunicado"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-sage uppercase ml-1">Título</label>
              <div className="relative">
                <input 
                  className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                  placeholder="Ex: Manutenção no Elevador" 
                  value={form.TITULO} 
                  onChange={e => setForm({ ...form, TITULO: e.target.value })}
                  required
                />
                <Type size={18} className="absolute left-3 top-3.5 text-brand-olive" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-sage uppercase ml-1">Tipo de Aviso</label>
              <select 
                className="bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all appearance-none"
                value={form.TIPO} 
                onChange={e => setForm({ ...form, TIPO: e.target.value })}
                required
              >
                <option value="">Selecione o tipo...</option>
                <option value="AVISO">AVISO</option>
                <option value="COMUNICADO">COMUNICADO</option>
                <option value="NOTIFICAÇÃO">NOTIFICAÇÃO</option>
                <option value="URGENTE">URGENTE</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Mensagem Completa</label>
            <div className="relative">
              <textarea 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10 min-h-[100px]" 
                placeholder="Descreva o comunicado em detalhes..." 
                value={form.MENSAGEM} 
                onChange={e => setForm({ ...form, MENSAGEM: e.target.value })}
                required
              />
              <AlignLeft size={18} className="absolute left-3 top-4 text-brand-olive" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-sage uppercase ml-1">Data da Publicação</label>
              <div className="relative">
                <input 
                  className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                  type="date" 
                  value={form.DT_COMUNICADO} 
                  onChange={e => setForm({ ...form, DT_COMUNICADO: e.target.value })}
                  required
                />
                <Calendar size={18} className="absolute left-3 top-3.5 text-brand-olive" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-sage uppercase ml-1">Horário</label>
              <div className="relative">
                <input 
                  className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                  type="time" 
                  value={form.HR_COMUNICADO} 
                  onChange={e => setForm({ ...form, HR_COMUNICADO: e.target.value })}
                  required
                />
                <Clock size={18} className="absolute left-3 top-3.5 text-brand-olive" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="bg-brand-accent hover:brightness-110 text-brand-dark font-bold px-10 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2">
              {editId ? "Atualizar Comunicado" : "Publicar Agora"}
            </button>
          </div>
        </form>
      </div>

      {/* LISTAGEM (TABELA/CARDS) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Informação</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Tipo</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Publicado em</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {comunicados.map((c: any) => (
              <tr key={c.ID_COMUNICADO} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-brand-cream font-bold group-hover:text-brand-accent transition-colors">{c.TITULO}</span>
                    <span className="text-brand-sage/60 text-xs line-clamp-1">{c.MENSAGEM}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-black tracking-widest ${getTipoStyle(c.TIPO)}`}>
                    {c.TIPO}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col text-xs text-brand-sage">
                    <div className="flex items-center gap-1 font-medium text-brand-cream">
                      <Calendar size={12} /> {new Date(c.DT_COMUNICADO).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} /> {c.HR_COMUNICADO}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(c)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(c.ID_COMUNICADO)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {comunicados.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-brand-sage italic">
                  Nenhum comunicado ativo no mural.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}