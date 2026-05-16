"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, Wifi, Clock, ArrowLeft, Settings, Zap, Moon, Sun, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import FuturisticGauge from "@/components/FuturisticGauge";
import PiPSpeedometer from "@/components/PiPSpeedometer";

const COLORS = [
  { name: "Cyan", value: "#00f2ff" },
  { name: "Pink", value: "#ff007a" },
  { name: "Green", value: "#00ff88" },
  { name: "Gold", value: "#ffcc00" },
];

const STYLES = ["arc", "digital", "radial", "minimal", "racing", "classic", "crg"] as const;

export default function VelocimetroOnly() {
  const router = useRouter();
  const [speed, setSpeed] = useState(0);
  const [battery, setBattery] = useState(87);
  const [time, setTime] = useState(new Date());
  
  // Customization State
  const [isDark, setIsDark] = useState(true);
  const [activeColor, setActiveColor] = useState(COLORS[0].value);
  const [styleIndex, setStyleIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let watchId: number;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          // speed is in m/s, convert to km/h
          const speedMS = position.coords.speed || 0;
          const speedKMH = speedMS * 3.6;
          setSpeed(speedKMH);
        },
        (error) => {
          console.error("Erro GPS:", error);
          // Optional: fallback to mock if desired, but here we'll just log
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000,
        }
      );
    } else {
      console.error("Geolocation não suportada");
    }

    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update clock every minute

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.remove("light-mode");
    else document.documentElement.classList.add("light-mode");
  }, [isDark]);

  const nextStyle = () => setStyleIndex((i) => (i + 1) % STYLES.length);
  const prevStyle = () => setStyleIndex((i) => (i - 1 + STYLES.length) % STYLES.length);

  return (
    <div className={`flex flex-col min-h-screen p-6 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-[#f0f2f5] text-black'}`}>
      
      {/* Background Glow */}
      {isDark && (
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-1000 pointer-events-none" 
          style={{ background: `radial-gradient(circle at 50% 50%, ${activeColor}33 0%, transparent 70%)` }}
        />
      )}
      
      {/* Top Status Bar */}
      <header className="flex justify-between items-center z-20">
        <button 
          onClick={() => router.push("/mode-selection")}
          className="flex items-center gap-2 p-2 glass rounded-2xl border-white/5 text-muted-foreground hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest pr-2">Sair</span>
        </button>
        
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5 px-3 py-1 glass rounded-full border-primary/20">
            <Battery className={battery < 20 ? "text-accent" : "text-success"} size={14} />
            <span className="text-[10px] font-mono font-bold uppercase">{battery}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 glass rounded-full border-primary/20">
            <Clock size={14} className="text-muted-foreground" />
            <span className="text-[10px] font-mono font-bold uppercase">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </header>

      {/* Swipeable Main Display */}
      <main className="flex-1 flex flex-col items-center justify-center z-10 relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none opacity-20">
          <ChevronLeft size={48} className="text-white animate-pulse" />
          <ChevronRight size={48} className="text-white animate-pulse" />
        </div>

        <motion.div 
          key={styleIndex}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) nextStyle();
            else if (info.offset.x > 50) prevStyle();
          }}
          className="relative group cursor-grab active:cursor-grabbing"
        >
          <FuturisticGauge 
            value={speed} 
            max={50} 
            label="VELOCIDADE" 
            unit="KM/H" 
            color={activeColor}
            size={340}
            style={STYLES[styleIndex]}
          />
        </motion.div>

        <div className="absolute bottom-10 flex gap-2">
          {STYLES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${styleIndex === i ? 'w-6 bg-primary' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>

        <p className="absolute bottom-0 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
          Arraste para o lado para trocar o modelo
        </p>
      </main>

      {/* Bottom Control & Customization Panel */}
      <footer className="z-20 pt-4 relative">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-4 glass rounded-2xl border-white/5 transition-all ${showSettings ? 'bg-primary/20 border-primary/40' : ''}`}
          >
            <Settings size={24} className={showSettings ? 'text-primary animate-spin-[3s]' : 'text-muted-foreground'} />
          </button>
          
          <div className="text-right">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">Hardware UI: {STYLES[styleIndex].toUpperCase()}</p>
            <p className="text-[7px] font-mono uppercase" style={{ color: activeColor }}>Active Profile: Optimized</p>
          </div>
        </div>

        {/* Settings Overlay */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-20 left-0 right-0 glass p-6 rounded-3xl border-primary/20 space-y-6 z-50"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-white italic flex items-center gap-2">
                  <Palette size={14} className="text-primary" /> Estilo do Sistema
                </h3>
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 bg-white/5 rounded-xl border border-white/10"
                >
                  {isDark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
                </button>
              </div>

              {/* Color Chooser */}
              <div className="space-y-3">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Esquema de Cores Neon</p>
                <div className="flex gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setActiveColor(c.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${activeColor === c.value ? 'scale-110 border-white' : 'border-transparent opacity-60'}`}
                      style={{ backgroundColor: c.value, boxShadow: activeColor === c.value ? `0 0 15px ${c.value}` : 'none' }}
                    />
                  ))}
                </div>
              </div>

              {/* PiP Mode */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center">Recurso de Multitarefa</p>
                <PiPSpeedometer speed={speed} activeColor={activeColor} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
