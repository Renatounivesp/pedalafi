"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navigation, MapPin, Compass, ShieldAlert } from "lucide-react";

// Dynamically import the map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-card">
      <span className="text-muted-foreground animate-pulse font-mono text-xs uppercase tracking-widest">Sincronizando Satélites...</span>
    </div>
  ),
});

export default function GPSPage() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let watchId: number;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed: speedMS } = position.coords;
          const next: [number, number] = [latitude, longitude];
          
          setPosition(next);
          setRoute((r) => {
            // Only add if coordinate is different
            if (r.length > 0 && r[r.length-1][0] === latitude && r[r.length-1][1] === longitude) return r;
            return [...r, next];
          });
          
          setSpeed((speedMS || 0) * 3.6);
        },
        (error) => console.error("GPS Error:", error),
        { enableHighAccuracy: true, maximumAge: 1000 }
      );
    }

    const timerInterval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] relative overflow-hidden rounded-3xl m-2 border border-white/5 shadow-2xl">
      {/* Map Layer */}
      <div className="absolute inset-0 z-0 grayscale-[0.4] contrast-[1.1] brightness-[0.7]">
        <Map currentPosition={position} route={route} />
      </div>

      {/* Aesthetic Overlays */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/10 rounded-3xl z-10" />
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent z-10" />
      
      {/* Top HUD Stats */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between gap-3">
        <div className="glass px-4 py-3 rounded-2xl flex-1 border-l-2 border-primary/40">
          <div className="flex items-center gap-1.5 mb-1">
            <Navigation size={10} className="text-primary" />
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-black">Distância</p>
          </div>
          <p className="text-xl font-black text-white tracking-tighter">
            {distance.toFixed(1)} <span className="text-[8px] font-bold text-muted-foreground uppercase">km</span>
          </p>
        </div>
        
        <div className="glass px-4 py-3 rounded-2xl flex-1 border-l-2 border-accent/40">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={10} className="text-accent" />
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-black">Velocidade</p>
          </div>
          <p className="text-xl font-black text-white tracking-tighter text-glow-cyan">
            {speed.toFixed(0)} <span className="text-[8px] font-bold text-muted-foreground uppercase">km/h</span>
          </p>
        </div>
      </div>

      {/* Floating Info Panels */}
      <div className="absolute top-24 left-4 z-20 space-y-2">
        <div className="glass px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
          <div className="w-1 h-1 bg-success rounded-full animate-pulse shadow-[0_0_5px_rgba(0,255,136,1)]" />
          <p className="text-[9px] font-mono font-bold text-white tracking-widest">{formatTime(time)}</p>
        </div>
        <div className="glass px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
          <Compass size={12} className="text-primary animate-spin-[20s]" />
          <p className="text-[9px] font-mono font-bold text-white tracking-widest uppercase">NW 312°</p>
        </div>
      </div>

      {/* Discreet Bottom Controls (Emergency only) */}
      <div className="absolute bottom-6 left-4 right-4 z-20 flex justify-center">
        <button 
          className="bg-accent/10 text-accent px-6 py-3 rounded-2xl border border-accent/20 backdrop-blur-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 group"
          onClick={() => alert("Alerta SOS enviado para contatos de emergência.")}
        >
          <ShieldAlert size={16} className="group-hover:animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest">Protocolo SOS</span>
        </button>
      </div>

      {/* Map Attribution / Safe Watermark */}
      <div className="absolute bottom-2 right-4 z-20 opacity-30">
        <p className="text-[6px] font-mono uppercase text-white">Recreational Interface Overlay | v2.4</p>
      </div>
    </div>
  );
}
