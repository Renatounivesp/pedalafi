"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockTodayStats } from "@/lib/mockData";
import { Activity, MapPin, Flame, Clock, Zap, Target, Gauge, Palette, LayoutGrid } from "lucide-react";
import FuturisticGauge from "@/components/FuturisticGauge";

export default function Dashboard() {
  const router = useRouter();
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [activeColor, setActiveColor] = useState("#00f2ff"); // Cyan default
  const [gaugeStyle, setGaugeStyle] = useState<"arc" | "digital" | "radial" | "minimal" | "racing" | "classic" | "crg">("arc");

  const colors = [
    { name: "Cyan", value: "#00f2ff" },
    { name: "Pink", value: "#ff007a" },
    { name: "Green", value: "#39ff14" },
    { name: "Yellow", value: "#fffb00" },
  ];

  const styles = ["arc", "digital", "radial", "minimal", "racing", "classic", "crg"] as const;

  useEffect(() => {
    const isAuth = localStorage.getItem("pedalafi_auth");
    if (!isAuth) {
      router.push("/login");
    }

    // Simulate some movement for the speedometer
    const interval = setInterval(() => {
      const baseSpeed = 25;
      const fluctuation = Math.random() * 5 - 2.5;
      setCurrentSpeed(Math.max(0, baseSpeed + fluctuation));
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex flex-col p-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen pb-24">
      
      {/* Pilot Status Header */}
      <header className="flex justify-between items-start pt-2">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-2">
            <Zap className="text-primary fill-primary size-5" style={{ color: activeColor }} />
            PEDAL<span className="text-white">AFÍ</span> <span className="text-[10px] bg-primary/20 px-1 rounded">CRG EDITION</span>
          </h1>
          {/* v1.0.1-crg */}
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
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] -z-10" style={{ backgroundColor: `${activeColor}11` }} />
        <FuturisticGauge 
          value={currentSpeed} 
          max={40} 
          label="Velocidade Atual" 
          unit="km/h" 
          color={activeColor}
          size={220}
          style={gaugeStyle}
        />
        
        {/* Customization Controls */}
        <div className="mt-4 flex flex-col items-center gap-4 w-full">
          {/* Style Selector */}
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setGaugeStyle(s)}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                  gaugeStyle === s ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-white/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Color Selector */}
          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveColor(c.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  activeColor === c.value ? "scale-125 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "border-transparent opacity-50"
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <div className="px-4 py-2 glass rounded-2xl border-white/5 flex flex-col items-center min-w-[80px]">
            <span className="text-[8px] uppercase text-muted-foreground font-black tracking-widest">Bateria</span>
            <span className="text-xs font-mono text-white font-bold">87%</span>
          </div>
          <div className="px-4 py-2 glass rounded-2xl border-white/5 flex flex-col items-center min-w-[80px]">
            <span className="text-[8px] uppercase text-muted-foreground font-black tracking-widest">Top Speed</span>
            <span className="text-xs font-mono text-white font-bold" style={{ color: activeColor }}>34.2</span>
          </div>
        </div>
      </section>

      {/* Stats Summary Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-3xl border-l-4 relative group overflow-hidden" style={{ borderLeftColor: activeColor }}>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <MapPin size={40} />
          </div>
          <div className="flex items-center gap-2 text-primary mb-2" style={{ color: activeColor }}>
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
          <Gauge size={18} className="text-primary" style={{ color: activeColor }} />
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Média</span>
          <span className="text-lg font-black text-white italic">{mockTodayStats.avgSpeed.toFixed(1)}</span>
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
          <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all rounded-full" style={{ backgroundColor: `${activeColor}33` }} />
          <div className="relative w-full flex items-center justify-center gap-3 bg-primary text-black font-black text-lg py-5 rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all overflow-hidden" style={{ backgroundColor: activeColor }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Gauge className="animate-pulse" size={24} />
            ABRIR VELOCÍMETRO PRO
          </div>
        </Link>
      </section>

    </div>
  );
}
