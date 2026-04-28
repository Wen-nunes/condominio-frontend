"use client";
import { useState } from "react";
import api from "../../services/api"; 
import { useRouter } from "next/navigation";
import { Lock, User, LogIn, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ CPF_CNPJ: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const { access_token } = res.data;

      localStorage.setItem("token", access_token);
      router.push("/dashboard");
    } catch (error) {
      alert("Falha no login. Verifique CPF e Senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4 overflow-hidden relative">
      
      {/* Círculos Decorativos de Fundo (Estilo New Spring) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-olive/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl"></div>

      {/* Card de Login */}
      <div className="w-full max-w-md bg-card-bg rounded-[2.5rem] border border-brand-olive/30 shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Header do Card */}
        <div className="px-8 pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-dark font-black text-2xl shadow-lg shadow-brand-accent/20">
              U
            </div>
            <h1 className="text-3xl font-bold text-brand-cream tracking-tighter">
              Ucondo<span className="text-brand-accent">.</span>
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-brand-cream">Acesso Administrativo</h2>
          <p className="text-brand-sage mt-2 text-sm">Insira suas credenciais New Spring.</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="px-10 pb-12 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1 tracking-widest">Documento (CPF/CNPJ)</label>
            <div className="relative">
              <input 
                required
                className="w-full bg-brand-dark border border-brand-olive/50 p-4 rounded-2xl focus:outline-none focus:border-brand-accent transition-all text-brand-cream placeholder:text-brand-olive/50 pl-12" 
                placeholder="000.000.000-00" 
                onChange={e => setForm({...form, CPF_CNPJ: e.target.value})}
              />
              <User size={20} className="absolute left-4 top-4 text-brand-olive" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-sage uppercase ml-1 tracking-widest">Senha de Acesso</label>
            <div className="relative">
              <input 
                required
                type="password" 
                className="w-full bg-brand-dark border border-brand-olive/50 p-4 rounded-2xl focus:outline-none focus:border-brand-accent transition-all text-brand-cream placeholder:text-brand-olive/50 pl-12" 
                placeholder="••••••••" 
                onChange={e => setForm({...form, password: e.target.value})}
              />
              <Lock size={20} className="absolute left-4 top-4 text-brand-olive" />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-brand-accent hover:brightness-110 text-brand-dark font-black py-4 rounded-2xl shadow-xl shadow-brand-accent/10 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 text-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2 italic">
                <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                Autenticando...
              </span>
            ) : (
              <>
                Entrar no Painel
                <LogIn size={20} />
              </>
            )}
          </button>

          <div className="pt-6 text-center border-t border-brand-olive/10">
            <div className="flex items-center justify-center gap-2 text-[10px] text-brand-olive font-black uppercase tracking-[0.2em]">
              <ShieldCheck size={14} />
              Ambiente Seguro e Monitorado
            </div>
          </div>
        </form>
      </div>

      {/* Footer / Copyright */}
      <div className="fixed bottom-6 text-center w-full">
        <p className="text-[10px] text-brand-olive/40 font-medium uppercase tracking-widest">
          © 2026 Condomínio New Spring • Gestão Inteligente
        </p>
      </div>
    </div>
  );
}