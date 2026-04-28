"use client";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  CalendarDays, Edit, Trash2, Plus, 
  User, MapPin, Clock, Calendar, CheckCircle 
} from "lucide-react";

export default function ReservasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [form, setForm] = useState({ 
    ID_MORADOR: "", 
    ID_AREA_COMUM: "", 
    DATA_RESERVA: "", 
    HR_INICIO: "", 
    HR_FIM: "" 
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      const res = await api.get("/reservas");
      setReservas(res.data);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/reservas/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/reservas", form);
      }
      setForm({ ID_MORADOR: "", ID_AREA_COMUM: "", DATA_RESERVA: "", HR_INICIO: "", HR_FIM: "" });
      carregar();
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja cancelar esta reserva? Esta ação não pode ser desfeita.")) {
      try {
        await api.delete(`/reservas/${id}`);
        carregar();
      } catch (error) {
        console.error("Erro ao excluir reserva:", error);
      }
    }
  };

  const handleEdit = (r: any) => {
    setForm({ 
      ID_MORADOR: r.ID_MORADOR, 
      ID_AREA_COMUM: r.ID_AREA_COMUM, 
      DATA_RESERVA: r.DATA_RESERVA, 
      HR_INICIO: r.HR_INICIO, 
      HR_FIM: r.HR_FIM 
    });
    setEditId(r.ID_RESERVA);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-cream flex items-center gap-3">
            <CalendarDays className="text-brand-accent" size={32} />
            Reservas de Áreas
          </h1>
          <p className="text-brand-sage mt-1">Controle o uso do salão de festas, churrasqueiras e outras áreas.</p>
        </div>
      </div>

      {/* FORMULÁRIO (CARD) */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-brand-cream font-semibold mb-6 flex items-center gap-2">
          {editId ? <Edit size={18} className="text-brand-accent" /> : <Plus size={18} className="text-brand-accent" />}
          {editId ? "Ajustar Agendamento" : "Nova Reserva"}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Morador (ID)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="0" 
                value={form.ID_MORADOR} 
                onChange={e => setForm({ ...form, ID_MORADOR: e.target.value })}
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Espaço (ID)</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10" 
                placeholder="0" 
                value={form.ID_AREA_COMUM} 
                onChange={e => setForm({ ...form, ID_AREA_COMUM: e.target.value })}
                required
              />
              <MapPin size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Data</label>
            <div className="relative">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all pl-10 text-xs" 
                type="date" 
                value={form.DATA_RESERVA} 
                onChange={e => setForm({ ...form, DATA_RESERVA: e.target.value })}
                required
              />
              <Calendar size={18} className="absolute left-3 top-3.5 text-brand-olive" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1">Início / Fim</label>
            <div className="flex items-center gap-2">
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all text-center text-xs" 
                type="time" 
                value={form.HR_INICIO} 
                onChange={e => setForm({ ...form, HR_INICIO: e.target.value })}
                required
              />
              <span className="text-brand-olive">às</span>
              <input 
                className="w-full bg-brand-dark border border-brand-olive/50 rounded-xl p-3 text-brand-cream focus:border-brand-accent outline-none transition-all text-center text-xs" 
                type="time" 
                value={form.HR_FIM} 
                onChange={e => setForm({ ...form, HR_FIM: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-brand-accent hover:brightness-110 text-brand-dark font-black px-4 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              {editId ? "Atualizar" : "Confirmar"}
            </button>
          </div>
        </form>
      </div>

      {/* TABELA DE RESERVAS */}
      <div className="bg-card-bg border border-brand-olive/30 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-olive/10 border-b border-brand-olive/20">
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Onde / Quem</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs">Data Agendada</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-center">Horário</th>
              <th className="p-4 text-brand-sage font-bold uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r: any) => (
              <tr key={r.ID_RESERVA} className="border-b border-brand-olive/10 hover:bg-brand-olive/5 transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-brand-cream font-bold group-hover:text-brand-accent transition-colors flex items-center gap-2">
                      <MapPin size={12} className="text-brand-olive" /> Área #{r.ID_AREA_COMUM}
                    </span>
                    <span className="text-brand-sage/60 text-xs flex items-center gap-1">
                      <User size={10} /> Morador #{r.ID_MORADOR}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-brand-cream font-medium">
                    <Calendar size={14} className="text-brand-accent" />
                    {new Date(r.DATA_RESERVA).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-olive/20 bg-brand-dark text-brand-sage text-xs font-mono">
                    <Clock size={12} />
                    {r.HR_INICIO} — {r.HR_FIM}
                  </div>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(r)} className="p-2 hover:bg-brand-olive/20 rounded-lg text-brand-sage hover:text-brand-cream transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(r.ID_RESERVA)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {reservas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-brand-sage italic text-sm">
                  Não há reservas agendadas para os próximos dias.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}