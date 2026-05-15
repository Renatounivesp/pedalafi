"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map as MapIcon, History, User, MessageSquare } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: "/", label: "PAINEL", icon: LayoutDashboard },
  { href: "/chat", label: "CONVERSA", icon: MessageSquare },
  { href: "/gps", label: "MAPA", icon: MapIcon },
  { href: "/historico", label: "ARQUIVO", icon: History },
  { href: "/perfil", label: "PILOTO", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 glass rounded-2xl border border-white/10 pb-safe shadow-2xl overflow-hidden">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="flex justify-around items-center h-16 max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative",
                isActive ? "text-primary scale-110" : "text-muted hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute -top-1 w-8 h-1 bg-primary rounded-full blur-[4px] glow-cyan" />
              )}
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={cn(isActive && "drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]")}
              />
              <span className={cn(
                "text-[8px] font-black tracking-[0.1em] uppercase transition-all",
                isActive ? "text-primary opacity-100" : "text-muted opacity-60"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
