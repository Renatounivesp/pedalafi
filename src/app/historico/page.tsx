"use client";

import dynamic from "next/dynamic";
import { mockHistory } from "@/lib/mockData";
import { Clock, MapPin, Calendar, Activity, Zap, Compass } from "lucide-react";

// Dynamically import map for history previews
const MiniMap = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 animate-pulse" />,
});

export default function Historico() {
  return (
    <div className="flex flex-col p-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header className="space-y-1">
        <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-2">
          <Compass className="text-primary size-5" />
          ARQUIVO DE <span className="text-primary text-glow-cyan">EXPLORAÇÃO</span>
        </h1>
        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Registro visual de trajetos</p>
      </header>

      <div className="space-y-4">
        {mockHistory.map((route, index) => (
          <div 
            key={route.id} 
            className="glass rounded-3xl border-l-4 border-primary/30 p-5 flex flex-col gap-4 relative overflow-hidden group transition-all"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-all" />
            
            {/* Header: Date & ID */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted uppercase tracking-widest">
                <Calendar size={12} className="text-primary" />
                <span>{new Date(route.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              </div>
              <div className="text-[8px] font-mono text-muted-foreground/30 italic">EXP_REF_{route.id.slice(0, 4).toUpperCase()}</div>
            </div>
            
            {/* Map Preview (Actual Route Visualization) */}
            <div className="h-28 w-full bg-black/40 rounded-2xl overflow-hidden relative border border-white/5 shadow-inner">
              <MiniMap 
                currentPosition={null} 
                route={route.path as [number, number][]} 
                zoom={14} 
                interactive={false} 
                hideMarker={true}
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full glow-cyan" />
                <span className="text-[7px] font-black text-white uppercase tracking-[0.2em]">Replay de Trajeto</span>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-primary" />
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Distância</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white tracking-tighter">{route.km.toFixed(1)}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">km</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-accent" />
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Duração</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white tracking-tighter">{route.time.slice(0, 5)}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">min</span>
                </div>
              </div>
            </div>

            {/* Analysis Strip */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <Activity size={10} className="text-success" />
                <span className="text-[8px] font-black text-success uppercase tracking-widest">Eficiência OK</span>
              </div>
              <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 w-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stat */}
      <footer className="mt-4 glass p-6 rounded-3xl border border-white/10 bg-white/5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Métricas de Exploração</p>
            <p className="text-2xl font-black text-white italic tracking-tighter uppercase">Rastro Digital Ativo</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-primary uppercase">Total: 7.3 KM</p>
            <p className="text-[10px] font-mono text-accent uppercase">55 MIN ATIVOS</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
