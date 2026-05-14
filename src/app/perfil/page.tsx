"use client";

import { mockUser } from "@/lib/mockData";
import { User, Medal, Trophy, Star, Settings, ChevronRight, Zap, Target, LogOut, Shield, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Perfil() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("pedalafi_auth");
    router.push("/login");
  };

  return (
    <div className="flex flex-col p-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      
      {/* Pilot Dossier Header */}
      <section className="relative group">
        <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full" />
        <div className="glass p-6 rounded-3xl border-l-4 border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Shield size={80} />
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl border-2 border-primary/30 p-1 bg-black/40 overflow-hidden shadow-[0_0_20px_rgba(0,242,255,0.2)]">
                <div className="h-full w-full bg-primary/10 rounded-xl flex items-center justify-center text-3xl font-black text-primary italic">
                  {mockUser.name.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-black p-1 rounded-lg shadow-lg">
                <Zap size={14} fill="currentColor" />
              </div>
            </div>
            
            <div className="flex-1 space-y-1">
              <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">CÓDIGO: {mockUser.id.toUpperCase()}</p>
              <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">{mockUser.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-white/5 border border-white/10 text-muted-foreground px-2 py-0.5 rounded-md uppercase">
                  {mockUser.vehicle}
                </span>
                {mockUser.isPremium && (
                  <span className="text-[10px] font-black bg-accent/20 text-accent border border-accent/30 px-2 py-0.5 rounded-md uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(255,0,122,0.2)]">
                    <Star size={10} fill="currentColor" /> Premium
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance & XP */}
      <section className="glass p-6 rounded-3xl space-y-5 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-warning/10 rounded-xl">
              <Trophy className="text-warning" size={20} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-black text-white italic uppercase tracking-tight">Nível {mockUser.level}</h3>
              <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Patente: Especialista</p>
            </div>
          </div>
          <Link href="/ranking" className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            RANKING <ChevronRight size={14} />
          </Link>
        </div>

        {/* Progress bar to next level */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono text-muted uppercase">Experiência</span>
            <span className="text-[10px] font-mono text-white">750 / 1000 XP</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <div className="h-full bg-gradient-to-r from-primary to-accent w-[75%] rounded-full shadow-[0_0_10px_rgba(0,242,255,0.5)]"></div>
          </div>
        </div>

        {/* Medals Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${i <= 2 ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(0,242,255,0.1)]' : 'bg-white/5 text-muted/30 border border-white/5'}`}>
              <Medal size={24} className={i <= 2 ? "drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]" : ""} />
            </div>
          ))}
        </div>
      </section>

      {/* System Settings */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Protocolos do Sistema</h3>
        
        <div className="grid grid-cols-1 gap-3">
          <Link href="/perfil/meta" className="glass p-5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all border border-white/5 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                <Target size={20} className="text-muted-foreground group-hover:text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase italic tracking-tight">Objetivo Diário</p>
                <p className="text-[10px] text-muted-foreground uppercase">Meta Atual: {mockUser.dailyGoalKm} km</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </Link>

          <Link href="/premium" className="glass p-5 rounded-2xl flex items-center justify-between border-accent/20 hover:bg-accent/5 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Star size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-accent uppercase italic tracking-tight">Upgrade de Licença</p>
                <p className="text-[10px] text-accent/60 uppercase">Desbloquear Recursos Pro</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-accent" />
          </Link>

          <Link 
            href="/mode-selection" 
            className="glass p-5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all border border-white/5 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                <LayoutDashboard size={20} className="text-muted-foreground group-hover:text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase italic tracking-tight">Trocar de Modo</p>
                <p className="text-[10px] text-muted-foreground uppercase">Alternar entre Painel e Velocímetro</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </Link>

          <button 
            onClick={handleLogout}
            className="glass p-5 rounded-2xl flex items-center justify-between hover:bg-red-500/10 transition-all border border-red-500/10 group mt-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500/20">
                <LogOut size={20} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-500 uppercase italic tracking-tight">Finalizar Sessão</p>
                <p className="text-[10px] text-red-500/60 uppercase">Encerrar Conexão Segura</p>
              </div>
            </div>
            <Settings size={18} className="text-red-500/40" />
          </button>
        </div>
      </section>

      {/* System Footer */}
      <footer className="text-center py-6 opacity-30">
        <p className="text-[8px] font-mono uppercase tracking-[0.4em]">PedalAfí OS v2.4.0-build.88</p>
      </footer>

    </div>
  );
}
