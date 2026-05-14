"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockTodayStats } from "@/lib/mockData";
import { Activity, MapPin, Flame, Clock, Zap, Target, Gauge } from "lucide-react";
import FuturisticGauge from "@/components/FuturisticGauge";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem("pedalafi_auth");
    if (!isAuth) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col p-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen pb-24">
      
      {/* Pilot Status Header */}
      <header className="flex justify-between items-start pt-2">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-2">
            <Zap className="text-primary fill-primary size-5" />
            PEDAL<span className="text-primary text-glow-cyan">AFÍ</span>
          </h1>
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.2em]">Rec Mode: active</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Hardware Online</span>
          </div>
        </div>
      </header>

      {/* Main Real-time Gauge */}
      <section className="flex flex-col items-center justify-center py-2 relative">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] -z-10" />
        <FuturisticGauge 
          value={Number(mockTodayStats.avgSpeed.toFixed(1))} 
          max={40} 
          label="Média do Dia" 
          unit="km/h" 
          color="var(--color-primary)"
          size={220}
        />
        <div className="mt-[-10px] flex gap-3">
          <div className="px-4 py-2 glass rounded-2xl border-primary/20 flex flex-col items-center min-w-[80px]">
            <span className="text-[8px] uppercase text-muted-foreground font-black tracking-widest">Bateria</span>
            <span className="text-xs font-mono text-primary font-bold">87%</span>
          </div>
          <div className="px-4 py-2 glass rounded-2xl border-accent/20 flex flex-col items-center min-w-[80px]">
            <span className="text-[8px] uppercase text-muted-foreground font-black tracking-widest">Top Speed</span>
            <span className="text-xs font-mono text-accent font-bold">34.2</span>
          </div>
        </div>
      </section>

      {/* Stats Summary Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-3xl border-l-4 border-primary relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <MapPin size={40} />
          </div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <MapPin size={12} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Km Rodados</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white tracking-tighter">{mockTodayStats.km.toFixed(1)}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">km</span>
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border-l-4 border-accent relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Clock size={40} />
          </div>
          <div className="flex items-center gap-2 text-accent mb-2">
            <Clock size={12} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Tempo Total</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white tracking-tighter">{mockTodayStats.timeOnline.slice(0, 5)}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">h</span>
          </div>
        </div>
      </section>

      {/* Recreational Metrics */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1 group">
          <Flame size={18} className="text-accent" />
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Energia</span>
          <span className="text-lg font-black text-white italic">{mockTodayStats.calories}</span>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1 group">
          <Target size={18} className="text-warning" />
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Objetivo</span>
          <span className="text-lg font-black text-white italic">82%</span>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1 group">
          <Activity size={18} className="text-success" />
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Ritmo</span>
          <span className="text-lg font-black text-white italic">PRO</span>
        </div>
      </section>

      {/* Mode Switch Button */}
      <section className="mt-2">
        <Link 
          href="/velocimetro"
          className="relative group flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all rounded-full" />
          <div className="relative w-full flex items-center justify-center gap-3 bg-primary text-black font-black text-lg py-5 rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Gauge className="animate-pulse" size={24} />
            ABRIR VELOCÍMETRO PRO
          </div>
        </Link>
      </section>

    </div>
  );
}
