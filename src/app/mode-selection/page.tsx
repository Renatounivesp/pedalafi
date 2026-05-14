"use client";

import { useRouter } from "next/navigation";
import { Gauge, LayoutDashboard, Battery, Zap, ShieldCheck } from "lucide-react";

export default function ModeSelection() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen p-6 pt-16 gap-8 relative overflow-hidden">
      {/* Scanline and Grid already in layout */}
      
      <header className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-widest mb-2">
          <ShieldCheck size={12} />
          Identidade Verificada
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
          SELECIONE O <span className="text-primary">MODO</span>
        </h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Configuração de Hardware e Energia</p>
      </header>

      <div className="grid grid-cols-1 gap-6 flex-1 max-w-sm mx-auto w-full">
        {/* Speedometer Only Mode */}
        <button
          onClick={() => router.push("/velocimetro")}
          className="glass p-8 rounded-3xl border-l-4 border-primary group hover:bg-primary/5 transition-all text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
            <Gauge size={120} />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <Gauge size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Velocímetro Pro</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Foco total na performance. GPS desativado para economia extrema de bateria.
              </p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5">
                <Battery className="text-success" size={14} />
                <span className="text-[10px] font-bold text-success uppercase">Economia Máxima</span>
              </div>
            </div>
          </div>
        </button>

        {/* Full Access Mode */}
        <button
          onClick={() => router.push("/")}
          className="glass p-8 rounded-3xl border-l-4 border-accent group hover:bg-accent/5 transition-all text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
            <LayoutDashboard size={120} />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Painel de Exploração</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Acesso a mapas, telemetria detalhada, histórico de atividades e métricas de desempenho.
              </p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5">
                <Zap className="text-primary" size={14} />
                <span className="text-[10px] font-bold text-primary uppercase">Experiência Completa</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      <footer className="text-center pb-8">
        <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-loose">
          A alteração do modo pode ser feita<br/>a qualquer momento nas configurações do sistema.
        </p>
      </footer>
    </div>
  );
}
