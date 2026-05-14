"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, User, Bike, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EditarPerfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("pedalafi_user_id");
      if (!userId) {
        router.push("/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        if (data) {
          setName(data.name || "");
          setVehicle(data.vehicle || "");
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const userId = localStorage.getItem("pedalafi_user_id");
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name, vehicle })
        .eq('id', userId);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/perfil");
      }, 1500);
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen pb-24">
      <header className="flex items-center gap-4">
        <Link href="/perfil" className="p-2 glass rounded-xl text-muted-foreground hover:text-white">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black italic uppercase tracking-tight text-white">Editar Perfil</h1>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
              Nome do Piloto
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Renato Operador"
                className="block w-full pl-12 pr-4 py-4 glass rounded-2xl border-white/5 text-white placeholder-white/10 focus:ring-2 focus:ring-primary/30 transition-all font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">
              Equipamento / Veículo
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Bike size={18} />
              </div>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 glass rounded-2xl border-white/5 text-white focus:ring-2 focus:ring-primary/30 transition-all font-bold appearance-none"
                required
              >
                <option value="" disabled>Selecione o veículo</option>
                <option value="Bike Elétrica">Bike Elétrica</option>
                <option value="Bike Mecânica">Bike Mecânica</option>
                <option value="Moto Elétrica">Moto Elétrica</option>
                <option value="Scooter">Scooter</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || success}
          className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 ${
            success 
              ? "bg-success text-black" 
              : "bg-primary text-black shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:scale-[1.02] active:scale-95"
          }`}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : success ? (
            <>
              <CheckCircle2 size={20} />
              DADOS SALVOS
            </>
          ) : (
            <>
              <Save size={20} />
              SALVAR ALTERAÇÕES
            </>
          )}
        </button>
      </form>

      <div className="glass p-6 rounded-3xl border border-white/5 mt-auto">
        <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">
          As informações do piloto são públicas no ranking global. Certifique-se de usar um codinome apropriado para o sistema de telemetria.
        </p>
      </div>
    </div>
  );
}
