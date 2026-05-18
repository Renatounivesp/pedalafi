"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Battery, 
  Clock, 
  ArrowLeft, 
  Settings, 
  Zap, 
  Moon, 
  Sun, 
  Palette, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Save,
  MapPin,
  Navigation,
  Activity,
  Flame,
  Gauge
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import FuturisticGauge from "@/components/FuturisticGauge";
import PiPSpeedometer from "@/components/PiPSpeedometer";

// Dynamically import map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/40 rounded-[32px] border border-white/5 min-h-[350px]">
      <span className="text-muted-foreground animate-pulse font-mono text-xs uppercase tracking-widest">
        Sincronizando Satélites...
      </span>
    </div>
  ),
});

const COLORS = [
  { name: "Cyan", value: "#00f2ff" },
  { name: "Pink", value: "#ff007a" },
  { name: "Green", value: "#00ff88" },
  { name: "Gold", value: "#ffcc00" },
];

const STYLES = ["arc", "digital", "radial", "minimal", "racing", "classic", "crg"] as const;

// Haversine formula to calculate distance between two coordinates in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
};

export default function VelocimetroOnly() {
  const router = useRouter();
  const [speed, setSpeed] = useState(0);
  const [battery, setBattery] = useState(100);
  const [time, setTime] = useState(new Date());
  
  // Customization State
  const [isDark, setIsDark] = useState(true);
  const [activeColor, setActiveColor] = useState(COLORS[0].value);
  const [styleIndex, setStyleIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Odometer & Route Tracking State
  const [distance, setDistance] = useState(0); // Daily odometer in km
  const [route, setRoute] = useState<[number, number][]>([]);
  const [trackingStatus, setTrackingStatus] = useState<"idle" | "active" | "paused">("idle");
  const [seconds, setSeconds] = useState(0); // Session duration
  const [activeTab, setActiveTab] = useState<"panel" | "map">("panel");
  const [lastPosition, setLastPosition] = useState<[number, number] | null>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);

  // Refs to avoid stale closures in watchPosition callback
  const statusRef = useRef(trackingStatus);
  const lastPosRef = useRef(lastPosition);

  useEffect(() => {
    statusRef.current = trackingStatus;
    if (trackingStatus !== "active") {
      // Clear last position when pausing or stopping to avoid cross-country straight lines
      setLastPosition(null);
      lastPosRef.current = null;
    }
  }, [trackingStatus]);

  useEffect(() => {
    lastPosRef.current = lastPosition;
  }, [lastPosition]);

  // Battery simulator/fetcher
  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery().then((bat: any) => {
        setBattery(Math.round(bat.level * 100));
        bat.addEventListener("levelchange", () => {
          setBattery(Math.round(bat.level * 100));
        });
      });
    } else {
      // Simple mock decay
      const interval = setInterval(() => {
        setBattery((b) => Math.max(15, b - 1));
      }, 300000);
      return () => clearInterval(interval);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (trackingStatus === "active") {
      timerInterval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [trackingStatus]);

  // Geolocation & speed effect
  useEffect(() => {
    let watchId: number;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed: speedMS } = position.coords;
          const nextPos: [number, number] = [latitude, longitude];
          
          setCurrentPosition(nextPos);
          
          // Speed conversion: m/s to km/h
          const speedKMH = (speedMS || 0) * 3.6;
          setSpeed(speedKMH);

          // Distance tracking logic
          if (statusRef.current === "active") {
            const lastPos = lastPosRef.current;
            if (lastPos) {
              const segmentDistance = calculateDistance(lastPos[0], lastPos[1], latitude, longitude);
              
              // GPS noise filtering: ignore segments under 2 meters, or impossible speed jumps (> 1km/update)
              if (segmentDistance > 0.002 && segmentDistance < 0.8) {
                setDistance((d) => d + segmentDistance);
                setRoute((r) => {
                  // Only add if different coordinate
                  if (r.length > 0 && r[r.length - 1][0] === latitude && r[r.length - 1][1] === longitude) return r;
                  return [...r, nextPos];
                });
              }
            } else {
              // Set starting point
              setRoute((r) => [...r, nextPos]);
            }
            setLastPosition(nextPos);
          }
        },
        (error) => {
          console.error("Erro GPS:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 8000,
        }
      );
    } else {
      console.error("Geolocation não suportada");
    }

    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      clearInterval(clockInterval);
    };
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.remove("light-mode");
    else document.documentElement.classList.add("light-mode");
  }, [isDark]);

  const nextStyle = () => setStyleIndex((i) => (i + 1) % STYLES.length);
  const prevStyle = () => setStyleIndex((i) => (i - 1 + STYLES.length) % STYLES.length);

  // Time formatter helper
  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // average speed calculation
  const avgSpeed = seconds > 0 ? (distance / (seconds / 3600)) : 0;

  // Track Action Handlers
  const handleStartPedal = () => {
    setTrackingStatus("active");
  };

  const handlePausePedal = () => {
    setTrackingStatus("paused");
  };

  const handleResetPedal = () => {
    const confirmReset = confirm("Deseja realmente apagar e zerar a quilometragem e o trajeto de hoje?");
    if (!confirmReset) return;
    
    setDistance(0);
    setRoute([]);
    setSeconds(0);
    setTrackingStatus("idle");
    setLastPosition(null);
  };

  const handleSavePedal = async () => {
    if (route.length < 2) {
      alert("O trajeto percorrido é muito curto para ser gravado no arquivo histórico. Pedale um pouco mais!");
      return;
    }

    const confirmSave = confirm("Deseja realmente finalizar e arquivar este pedal de hoje?");
    if (!confirmSave) return;

    const userId = localStorage.getItem("pedalafi_user_id");
    if (!userId) {
      alert("Usuário não identificado no sistema. Por favor, faça login novamente.");
      return;
    }

    try {
      const { error } = await supabase.from("exploration_logs").insert([
        {
          pilot_id: userId,
          km: distance,
          duration: formatDuration(seconds),
          path: route,
        },
      ]);

      if (error) {
        console.error("Erro ao salvar telemetria:", error);
        alert(`Não foi possível salvar: ${error.message}`);
      } else {
        alert("Exploração arquivada com sucesso!");
        // Clear activity state
        setDistance(0);
        setRoute([]);
        setSeconds(0);
        setTrackingStatus("idle");
        setLastPosition(null);
      }
    } catch (err) {
      console.error("Erro crítico ao enviar para Supabase:", err);
      alert("Ocorreu um erro crítico ao salvar o trajeto.");
    }
  };

  return (
    <div className={`flex flex-col min-h-screen p-4 relative overflow-hidden transition-colors duration-500 pb-24 ${isDark ? 'bg-black text-white' : 'bg-[#f0f2f5] text-black'}`}>
      
      {/* Background Glow */}
      {isDark && (
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-1000 pointer-events-none" 
          style={{ background: `radial-gradient(circle at 50% 50%, ${activeColor}33 0%, transparent 70%)` }}
        />
      )}
      
      {/* Top Status Bar */}
      <header className="flex justify-between items-center z-20 mb-4">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 p-2 glass rounded-2xl border-white/5 text-muted-foreground hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest pr-2">Painel</span>
        </button>
        
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1.5 px-3 py-1 glass rounded-full border-primary/20">
            <Battery className={battery < 20 ? "text-accent animate-pulse" : "text-success"} size={14} />
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

      {/* Dual Tab Navigator (Painel vs Mapa) */}
      <div className="flex justify-center gap-3 mb-6 z-20">
        <button
          onClick={() => setActiveTab("panel")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
            activeTab === "panel"
              ? "text-black shadow-lg"
              : "glass text-muted-foreground hover:text-white"
          }`}
          style={{ 
            backgroundColor: activeTab === "panel" ? activeColor : undefined,
            boxShadow: activeTab === "panel" ? `0 0 15px ${activeColor}88` : undefined
          }}
        >
          <Gauge size={14} />
          Velocímetro
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
            activeTab === "map"
              ? "text-black shadow-lg"
              : "glass text-muted-foreground hover:text-white"
          }`}
          style={{ 
            backgroundColor: activeTab === "map" ? activeColor : undefined,
            boxShadow: activeTab === "map" ? `0 0 15px ${activeColor}88` : undefined
          }}
        >
          <MapPin size={14} />
          Trajeto no Mapa
        </button>
      </div>

      {/* Main Swipeable display & Map display container */}
      <main className="flex-1 flex flex-col items-center justify-center z-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === "panel" ? (
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-full relative"
            >
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none opacity-20">
                <ChevronLeft size={40} className="text-white animate-pulse" />
                <ChevronRight size={40} className="text-white animate-pulse" />
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
                  size={320}
                  style={STYLES[styleIndex]}
                  odometer={distance}
                />
              </motion.div>

              <div className="flex gap-1.5 mt-8 mb-2">
                {STYLES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${styleIndex === i ? 'w-5' : 'w-1.5 bg-white/20'}`} 
                    style={{ backgroundColor: styleIndex === i ? activeColor : undefined }}
                  />
                ))}
              </div>

              <p className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse mt-2">
                Arraste lateralmente para trocar o painel
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg h-[360px] md:h-[450px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative"
            >
              <Map currentPosition={currentPosition} route={route} />
              
              {/* Neon border glow and gradients */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-[32px] border-[2px]" 
                style={{ borderColor: `${activeColor}22` }}
              />
              <div className="absolute top-4 left-4 z-20 glass px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${trackingStatus === 'active' ? 'bg-success' : 'bg-accent'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${trackingStatus === 'active' ? 'bg-success' : 'bg-accent'}`}></span>
                </span>
                <p className="text-[8px] font-mono font-bold text-white tracking-widest uppercase">
                  {trackingStatus === "active" ? "Gravação Ativa" : trackingStatus === "paused" ? "Pausado" : "GPS Pronto"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Odometer stats board */}
        <section className="w-full max-w-lg grid grid-cols-3 gap-3 mt-8 z-20">
          <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-0.5">
            <Navigation size={16} className="text-muted-foreground" style={{ color: activeColor }} />
            <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-1">Odômetro</span>
            <span className="text-base font-black text-white italic mt-0.5">{distance.toFixed(2)} <span className="text-[8px] font-bold text-muted-foreground not-italic uppercase">km</span></span>
          </div>
          
          <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-0.5">
            <Clock size={16} className="text-accent" />
            <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-1">Duração</span>
            <span className="text-base font-black text-white italic mt-0.5">{formatDuration(seconds)}</span>
          </div>

          <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-0.5">
            <Activity size={16} className="text-success" />
            <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-1">Média</span>
            <span className="text-base font-black text-white italic mt-0.5">{avgSpeed.toFixed(1)} <span className="text-[8px] font-bold text-muted-foreground not-italic uppercase">km/h</span></span>
          </div>
        </section>

        {/* Main Controls Panel (Pulse animations, high visibility) */}
        <section className="w-full max-w-lg mt-6 z-20">
          <div className="glass p-4 rounded-3xl border border-white/10 flex items-center justify-center gap-4 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            {trackingStatus === "idle" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartPedal}
                className="flex-1 flex items-center justify-center gap-2 bg-[#00ff88] text-black font-black text-xs py-4 rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all"
              >
                <Play size={16} fill="currentColor" />
                INICIAR NOVO PEDAL
              </motion.button>
            )}

            {trackingStatus === "active" && (
              <div className="flex w-full gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePausePedal}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#ffaa00] text-black font-black text-xs py-4 rounded-2xl shadow-lg transition-all"
                >
                  <Pause size={16} fill="currentColor" />
                  PAUSAR
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResetPedal}
                  className="px-5 bg-white/5 text-[#ff0055] border border-[#ff0055]/20 hover:bg-[#ff0055]/10 font-black text-xs py-4 rounded-2xl transition-all"
                  title="Zerar quilometragem"
                >
                  <RotateCcw size={16} />
                </motion.button>
              </div>
            )}

            {trackingStatus === "paused" && (
              <div className="flex flex-col w-full gap-3">
                <div className="flex w-full gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartPedal}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#00ff88] text-black font-black text-xs py-4 rounded-2xl shadow-lg transition-all"
                  >
                    <Play size={16} fill="currentColor" />
                    RETOMAR
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResetPedal}
                    className="px-5 bg-white/5 text-[#ff0055] border border-[#ff0055]/20 hover:bg-[#ff0055]/10 font-black text-xs py-4 rounded-2xl transition-all"
                    title="Apagar / Reiniciar"
                  >
                    <RotateCcw size={16} />
                  </motion.button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSavePedal}
                  className="w-full flex items-center justify-center gap-2 bg-[#00f2ff] text-black font-black text-xs py-4 rounded-2xl shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_35px_rgba(0,242,255,0.6)] transition-all"
                >
                  <Save size={16} />
                  GRAVAR E CONCLUIR PEDAL
                </motion.button>
              </div>
            )}
          </div>
        </section>
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
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]" style={{ color: activeColor }}>
              Hardware UI: {STYLES[styleIndex].toUpperCase()}
            </p>
            <p className="text-[7px] font-mono uppercase" style={{ color: activeColor }}>
              Active Profile: {trackingStatus === "active" ? "Rastreando" : "Ocioso"}
            </p>
          </div>
        </div>

        {/* Settings Overlay */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-20 left-0 right-0 glass p-6 rounded-3xl border-primary/20 space-y-6 z-50 bg-[#0d0d12]"
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
