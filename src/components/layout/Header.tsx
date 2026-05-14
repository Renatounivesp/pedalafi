import { Zap, Menu, Bell } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/20 backdrop-blur-lg border-b border-white/5 pt-safe">
      <div className="flex items-center justify-between h-14 px-6 max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <Menu className="text-muted-foreground size-5" />
          <h1 className="text-sm font-black italic tracking-tighter text-white uppercase">
            PEDAL<span className="text-primary">AFÍ</span>
          </h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="text-muted-foreground size-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full glow-pink" />
          </div>
          <Link 
            href="/perfil" 
            className="w-8 h-8 rounded-full border border-primary/30 p-0.5 overflow-hidden"
          >
            <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center">
              <Zap size={14} className="text-primary fill-primary" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
