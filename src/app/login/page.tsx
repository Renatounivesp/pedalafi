"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Zap, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    
    setLoading(true);
    // Simulate auth
    setTimeout(() => {
      localStorage.setItem("pedalafi_auth", "true");
      router.push("/mode-selection");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -z-10" />
      
      <div className="w-full max-w-sm space-y-12">
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center border-primary/30 shadow-[0_0_30px_rgba(0,242,255,0.2)]">
            <Zap className="text-primary fill-primary size-10 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              PEDAL<span className="text-primary">AFÍ</span>
            </h1>
            <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em]">Neural Interface v2.0</p>
          </div>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-4">
              Telefone do Operador
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full pl-12 pr-4 py-5 glass rounded-2xl border-white/5 text-white placeholder-white/20 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-mono tracking-widest"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length < 10}
            className="w-full py-5 rounded-2xl bg-primary text-black font-black text-sm tracking-[0.2em] uppercase shadow-[0_0_40px_rgba(0,242,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                AUTENTICAR
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <footer className="text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Acesso Restrito ao Sistema de Entrega
          </p>
        </footer>
      </div>
    </div>
  );
}
