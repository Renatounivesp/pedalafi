"use client";

import React from "react";

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
  size?: number;
  style?: "arc" | "digital" | "radial" | "minimal";
}

export default function FuturisticGauge({
  value,
  max,
  label,
  unit,
  color = "#00f2ff",
  size = 200,
  style = "arc",
}: GaugeProps) {
  const radius = size * 0.4;
  const strokeWidth = size * 0.05;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  const arcLength = 0.75; 
  const dashArray = circumference * arcLength;
  const offset = dashArray - (Math.min(value, max) / max) * dashArray;

  if (style === "digital") {
    return (
      <div className="flex flex-col items-center justify-center p-8 glass rounded-[40px] border-2 shadow-2xl" style={{ borderColor: `${color}33`, width: size, height: size }}>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">{label}</div>
        <div className="flex flex-col items-center">
          <span 
            className="text-8xl font-black italic tracking-tighter leading-none"
            style={{ color: color, textShadow: `0 0 30px ${color}88` }}
          >
            {Math.round(value)}
          </span>
          <span className="text-xl font-bold text-muted-foreground mt-2">{unit}</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 mt-8 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500" 
            style={{ width: `${(value/max)*100}%`, backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
          />
        </div>
      </div>
    );
  }

  if (style === "radial") {
    return (
      <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle cx={center} cy={center} r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth * 2} strokeDasharray="4 2" />
          <circle 
            cx={center} cy={center} r={radius} fill="transparent" stroke={color} strokeWidth={strokeWidth * 2} 
            strokeDasharray={`${(value/max) * circumference} ${circumference}`}
            style={{ transition: "stroke-dasharray 0.5s ease", filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black italic text-white">{Math.round(value)}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{unit}</span>
        </div>
      </div>
    );
  }

  if (style === "minimal") {
    return (
      <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
         <div 
          className="text-[120px] font-black tracking-tighter leading-none mb-2"
          style={{ color: color, textShadow: `0 0 40px ${color}44` }}
        >
          {Math.round(value)}
        </div>
        <div className="text-sm font-black text-muted-foreground uppercase tracking-[0.4em]">{unit}</div>
      </div>
    );
  }
  
  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-[225deg]"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashArray} ${circumference}`}
          strokeLinecap="round"
        />
        
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashArray} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
            transition: "stroke-dashoffset 1s ease-in-out",
          }}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span 
            className="text-6xl font-black italic tracking-tighter"
            style={{ color: color, textShadow: `0 0 15px ${color}66` }}
          >
            {Number(value).toFixed(1)}
          </span>
          <span className="text-sm font-bold text-muted-foreground uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
}
