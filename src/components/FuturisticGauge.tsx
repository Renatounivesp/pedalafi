"use client";

import React from "react";

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
  size?: number;
  style?: "arc" | "digital" | "radial" | "minimal" | "racing" | "classic" | "crg";
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
      <div className="flex flex-col items-center justify-center p-8 glass rounded-[40px] border-2 shadow-2xl transition-all duration-500" style={{ borderColor: `${color}33`, width: size, height: size }}>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">{label}</div>
        <div className="flex flex-col items-center">
          <span 
            className="text-8xl font-black italic tracking-tighter leading-none transition-all duration-300"
            style={{ color: color, textShadow: `0 0 30px ${color}88` }}
          >
            {Math.round(value)}
          </span>
          <span className="text-xl font-bold text-muted-foreground mt-2">{unit}</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 mt-8 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-700 ease-out" 
            style={{ width: `${(value/max)*100}%`, backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
          />
        </div>
      </div>
    );
  }

  if (style === "radial") {
    return (
      <div className="relative flex flex-col items-center justify-center transition-all duration-500" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle cx={center} cy={center} r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth * 2} strokeDasharray="4 2" />
          <circle 
            cx={center} cy={center} r={radius} fill="transparent" stroke={color} strokeWidth={strokeWidth * 2} 
            strokeDasharray={`${(value/max) * circumference} ${circumference}`}
            style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.5s ease", filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black italic text-white transition-all duration-300">{Math.round(value)}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{unit}</span>
        </div>
      </div>
    );
  }

  if (style === "minimal") {
    return (
      <div className="flex flex-col items-center justify-center transition-all duration-500" style={{ width: size, height: size }}>
         <div 
          className="text-[120px] font-black tracking-tighter leading-none mb-2 transition-all duration-300"
          style={{ color: color, textShadow: `0 0 40px ${color}44` }}
        >
          {Math.round(value)}
        </div>
        <div className="text-sm font-black text-muted-foreground uppercase tracking-[0.4em]">{unit}</div>
      </div>
    );
  }

  if (style === "racing") {
    const bars = 20;
    const activeBars = Math.round((value / max) * bars);
    return (
      <div className="flex flex-col items-center justify-center gap-4" style={{ width: size, height: size }}>
        <div className="flex items-end gap-1 h-32">
          {Array.from({ length: bars }).map((_, i) => (
            <div 
              key={i} 
              className="w-2 rounded-full transition-all duration-300"
              style={{ 
                height: `${20 + (i * 4)}%`,
                backgroundColor: i < activeBars ? color : "rgba(255,255,255,0.05)",
                boxShadow: i < activeBars ? `0 0 10px ${color}` : "none",
                opacity: i < activeBars ? 1 : 0.3
              }}
            />
          ))}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-black italic text-white leading-none">{Math.round(value)}</span>
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{unit}</span>
        </div>
      </div>
    );
  }

  if (style === "classic") {
    const angle = (value / max) * 270 - 135;
    return (
      <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Scale Marks */}
          {Array.from({ length: 11 }).map((_, i) => {
            const markAngle = (i / 10) * 270 - 135;
            const x1 = center + (radius - 10) * Math.cos((markAngle - 90) * (Math.PI / 180));
            const y1 = center + (radius - 10) * Math.sin((markAngle - 90) * (Math.PI / 180));
            const x2 = center + radius * Math.cos((markAngle - 90) * (Math.PI / 180));
            const y2 = center + radius * Math.sin((markAngle - 90) * (Math.PI / 180));
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            );
          })}
          {/* Needle */}
          <line 
            x1={center} y1={center} 
            x2={center + radius * Math.cos((angle - 90) * (Math.PI / 180))}
            y2={center + radius * Math.sin((angle - 90) * (Math.PI / 180))}
            stroke={color} strokeWidth="4" strokeLinecap="round"
            style={{ transition: "all 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67)", filter: `drop-shadow(0 0 5px ${color})` }}
          />
          <circle cx={center} cy={center} r="6" fill={color} />
        </svg>
        <div className="absolute bottom-10 flex flex-col items-center">
          <span className="text-4xl font-black italic text-white">{Math.round(value)}</span>
          <span className="text-[8px] font-bold text-muted-foreground uppercase">{unit}</span>
        </div>
      </div>
    );
  }

  if (style === "crg") {

    const angle = (value / max) * 270 - 135;
    return (
      <div className="relative flex flex-col items-center justify-center p-4 bg-black rounded-full shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#1a1a1a]" style={{ width: size, height: size }}>
        {/* Outer Ring Glow */}
        <div className="absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />
        
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="z-10">
          {/* Background Arc - Shadow/Depth */}
          <path
            d={`M ${center + radius * Math.cos(225 * Math.PI / 180)} ${center + radius * Math.sin(225 * Math.PI / 180)} A ${radius} ${radius} 0 1 1 ${center + radius * Math.cos(-45 * Math.PI / 180)} ${center + radius * Math.sin(-45 * Math.PI / 180)}`}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth * 1.5}
            strokeLinecap="round"
          />

          {/* Rainbow Arc */}
          <defs>
            <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff00" />
              <stop offset="30%" stopColor="#ffff00" />
              <stop offset="60%" stopColor="#ff8800" />
              <stop offset="100%" stopColor="#ff0000" />
            </linearGradient>
          </defs>
          
          {/* Tick Marks & Numbers */}
          {Array.from({ length: 16 }).map((_, i) => {
            const markValue = (i / 15) * max;
            const markAngle = (i / 15) * 270 - 135;
            const isLarge = i % 2 === 0;
            const length = isLarge ? 15 : 8;
            const radAngle = (markAngle - 90) * (Math.PI / 180);
            
            const x1 = center + (radius - 5) * Math.cos(radAngle);
            const y1 = center + (radius - 5) * Math.sin(radAngle);
            const x2 = center + (radius - 5 - length) * Math.cos(radAngle);
            const y2 = center + (radius - 5 - length) * Math.sin(radAngle);
            
            // Text position
            const tx = center + (radius - 35) * Math.cos(radAngle);
            const ty = center + (radius - 35) * Math.sin(radAngle);

            // Determine color based on progress
            const tickColor = i / 15 < 0.4 ? "#00ff00" : i / 15 < 0.7 ? "#ffff00" : i / 15 < 0.9 ? "#ff8800" : "#ff0000";

            return (
              <g key={i}>
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke={tickColor} 
                  strokeWidth={isLarge ? "3" : "1.5"} 
                  className="transition-all duration-300"
                  style={{ opacity: value >= markValue ? 1 : 0.3, filter: value >= markValue ? `drop-shadow(0 0 3px ${tickColor})` : 'none' }}
                />
                {isLarge && (
                  <text 
                    x={tx} y={ty} 
                    fill="white" 
                    fontSize={size * 0.04} 
                    fontWeight="900" 
                    textAnchor="middle" 
                    alignmentBaseline="middle"
                    className="font-mono italic"
                    style={{ opacity: 0.8 }}
                  >
                    {Math.round(markValue)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Main Rainbow Progress Bar */}
          <circle
            cx={center} cy={center} r={radius}
            fill="transparent"
            stroke="url(#rainbow-gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${(value/max) * (radius * 2 * Math.PI * 0.75)} ${radius * 2 * Math.PI}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform={`rotate(135 ${center} ${center})`}
            style={{ transition: "all 0.5s ease-out", filter: `drop-shadow(0 0 5px #ff0000)` }}
          />

          {/* Needle */}
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${center}px ${center}px`, transition: "all 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67)" }}>
            <path 
              d={`M ${center - 2} ${center} L ${center + 2} ${center} L ${center} ${center - radius + 10} Z`} 
              fill="#ff0000" 
              style={{ filter: "drop-shadow(0 0 8px #ff0000)" }}
            />
            <circle cx={center} cy={center} r="8" fill="#111" stroke="#ff0000" strokeWidth="2" />
          </g>
        </svg>

        {/* Central Logo: Bike Boys CRG */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <div className="relative mt-8 flex flex-col items-center">
            {/* Orange Glow/Background for logo */}
            <div className="absolute inset-0 bg-orange-600/20 blur-xl scale-150 rounded-full" />
            
            <div className="relative">
              <h2 className="text-4xl font-[900] italic tracking-tighter leading-none text-white drop-shadow-[0_4px_0_#000] filter" style={{ fontFamily: '"Arial Black", sans-serif', WebkitTextStroke: '1px #000' }}>
                Bike<span className="text-white">Boys</span>
              </h2>
              <div className="absolute -inset-1 bg-orange-500/30 -z-10 blur-[2px] rounded-lg rotate-2" />
            </div>

            <div className="flex justify-center -mt-1 z-10">
              <span className="px-4 py-0.5 bg-[#44ff00] text-black font-[1000] text-[14px] italic transform -skew-x-12 border-[3px] border-black shadow-[0_4px_0_#000]">
                CRG
              </span>
            </div>

            {/* Spray/Graffiti effects using divs */}
            <div className="absolute -left-8 top-2 w-4 h-4 rounded-full bg-orange-500/40 blur-[4px] animate-pulse" />
            <div className="absolute -right-6 top-0 w-3 h-3 rounded-full bg-yellow-400/30 blur-[3px]" />
            <div className="absolute left-4 -bottom-4 w-2 h-2 rounded-full bg-[#44ff00]/40 blur-[2px]" />
          </div>
        </div>

        {/* Bottom Digital Display */}
        <div className="absolute bottom-[18%] z-20 flex flex-col items-center">
          <div className="glass-dark border border-white/10 px-6 py-2 rounded-xl flex flex-col items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <span className="text-[8px] font-black text-cyan-400 tracking-[0.3em] mb-1">KM/H</span>
            <div className="flex items-baseline gap-1">
               <span className="text-4xl font-mono font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {Math.round(value).toString().padStart(3, '0')}
              </span>
            </div>
            <div className="mt-1 pt-1 border-t border-white/5 w-full flex justify-center">
               <span className="text-[7px] font-mono text-muted-foreground tracking-widest">
                ODO <span className="text-white">123456</span> KM
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="relative flex flex-col items-center justify-center transition-all duration-500" style={{ width: size, height: size }}>
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
            transition: "stroke-dashoffset 1s ease-in-out, stroke 0.5s ease",
          }}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span 
            className="text-6xl font-black italic tracking-tighter transition-all duration-300"
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
