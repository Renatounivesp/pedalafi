"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { Clock, MapPin, Calendar, Activity, Compass, Zap } from "lucide-react";

// Dynamically import map for history previews
const MiniMap = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 animate-pulse" />,
});

export default function Historico() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const userId = localStorage.getItem("pedalafi_user_id");
      if (!userId) return;

      const { data, error } = await supabase
        .from('exploration_logs')
        .select('*')
        .eq('pilot_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error("Erro ao buscar logs:", error);
      } else {
        setLogs(data || []);
      }
      setLoading(false);
    }

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <Zap className="text-primary animate-pulse size-12" />
        <p className="mt-4 text-[10px] font-mono text-muted uppercase tracking-widest">Sincronizando Banco de Dados...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header className="space-y-1">
        <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-2">
          <Compass className="text-primary size-5" />
          ARQUIVO DE <span className="text-primary text-glow-cyan">EXPLORAÇÃO</span>
        </h1>
        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Registro real de trajetos</p>
      </header>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="glass p-10 rounded-3xl text-center border-dashed border-white/10">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Nenhum log de telemetria encontrado.</p>
            <p className="text-[8px] text-muted-foreground/50 mt-2">Saia para sua primeira exploração para registrar dados.</p>
          </div>
        ) : (
          logs.map((route, index) => (
            <div 
              key={route.id} 
              className="glass rounded-3xl border-l-4 border-primary/30 p-5 flex flex-col gap-4 relative overflow-hidden group transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-all" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted uppercase tracking-widest">
                  <Calendar size={12} className="text-primary" />
                  <span>{new Date(route.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="text-[8px] font-mono text-muted-foreground/30 italic">EXP_ID_{route.id.slice(0, 4).toUpperCase()}</div>
              </div>
              
              <div className="h-28 w-full bg-black/40 rounded-2xl overflow-hidden relative border border-white/5 shadow-inner">
                <MiniMap 
                  currentPosition={null} 
                  route={route.path || []} 
                  zoom={14} 
                  interactive={false} 
                  hideMarker={true}
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full glow-cyan" />
                  <span className="text-[7px] font-black text-white uppercase tracking-[0.2em]">Trajeto Registrado</span>
                </div>
              </div>
              
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
                    <span className="text-xl font-black text-white tracking-tighter">{route.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {logs.length > 0 && (
        <footer className="mt-4 glass p-6 rounded-3xl border border-white/10 bg-white/5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Total Consolidado</p>
              <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{logs.reduce((acc, curr) => acc + curr.km, 0).toFixed(1)} KM</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-primary uppercase">{logs.length} ENTRADAS</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
