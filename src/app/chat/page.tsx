"use client";

import { useEffect, useState, useRef } from "react";
import { Send, User as UserIcon, Shield, Radio, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const id = localStorage.getItem("pedalafi_user_id");
    if (!id) {
      router.push("/login");
      return;
    }
    setUserId(id);

    // Initial fetch
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*, profiles(name, vehicle)')
        .order('created_at', { ascending: true })
        .limit(50);

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages' 
      }, async (payload) => {
        // Fetch the sender info for the new message
        const { data: senderData } = await supabase
          .from('profiles')
          .select('name, vehicle')
          .eq('id', payload.new.sender_id)
          .single();

        const fullMessage = {
          ...payload.new,
          profiles: senderData
        };

        setMessages((prev) => [...prev, fullMessage]);
        setTimeout(scrollToBottom, 100);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    const messageContent = newMessage;
    setNewMessage("");

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{ 
          sender_id: userId, 
          content: messageContent 
        }]);

      if (error) throw error;
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      alert("Falha no envio da mensagem.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em]">Conectando à Rede Neural...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* Chat Header */}
      <header className="p-4 flex items-center justify-between border-b border-white/5 glass sticky top-0 z-10 mx-4 mt-2 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Radio className="text-primary animate-pulse" size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black italic text-white uppercase tracking-tight">Rádio Frequência Global</h2>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Protocolo Seguro Ativo</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-white/5 rounded-md border border-white/10">
             <span className="text-[8px] font-mono text-primary uppercase">32 On-line</span>
          </div>
        </div>
      </header>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg, index) => {
          const isMe = msg.sender_id === userId;
          const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div 
              key={msg.id || index} 
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                {!isMe && (
                  <span className="text-[8px] font-black text-primary uppercase tracking-tighter italic">
                    {msg.profiles?.name || "Piloto Desconhecido"}
                  </span>
                )}
                <span className="text-[7px] font-mono text-muted-foreground uppercase">{time}</span>
              </div>
              
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm relative group ${
                isMe 
                  ? 'bg-primary/10 text-white border-r-4 border-primary rounded-tr-none' 
                  : 'bg-white/5 text-muted-foreground border-l-4 border-white/10 rounded-tl-none'
              }`}>
                {msg.content}
                
                {/* Visual Glitch Decor */}
                <div className={`absolute top-0 ${isMe ? 'right-0' : 'left-0'} w-1 h-full opacity-20 bg-primary group-hover:opacity-100 transition-opacity`} />
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 glass mx-4 mb-4 rounded-2xl border border-white/10">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem de rádio..."
            className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 placeholder-white/20 font-medium"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shadow-[0_0_20px_rgba(0,242,255,0.3)]"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
