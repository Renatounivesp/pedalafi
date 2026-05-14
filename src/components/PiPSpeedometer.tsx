"use client";

import React, { useEffect, useRef, useState } from "react";
import { MonitorPlay, XCircle } from "lucide-react";

interface PiPProps {
  speed: number;
  activeColor: string;
}

export default function PiPSpeedometer({ speed, activeColor }: PiPProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPipActive, setIsPipActive] = useState(false);

  // Animation frame to draw speed on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Clear
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Speed
      ctx.fillStyle = activeColor;
      ctx.font = "bold 80px Arial Black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(Math.round(speed).toString(), canvas.width / 2, canvas.height / 2 - 10);

      // Draw Unit
      ctx.font = "bold 20px Arial";
      ctx.fillStyle = "#888888";
      ctx.fillText("KM/H", canvas.width / 2, canvas.height / 2 + 40);

      // Draw border
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, activeColor]);

  const togglePiP = async () => {
    try {
      if (!isPipActive) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        // Capture stream from canvas
        const stream = canvas.captureStream(30);
        video.srcObject = stream;
        await video.play();
        
        // Request PiP
        if (document.pictureInPictureEnabled) {
          await video.requestPictureInPicture();
          setIsPipActive(true);
        }
      } else {
        if (document.exitPictureInPicture) {
          await document.exitPictureInPicture();
          setIsPipActive(false);
        }
      }
    } catch (error) {
      console.error("PiP Error:", error);
      alert("Seu navegador não suporta o modo flutuante nesta página.");
    }
  };

  useEffect(() => {
    const handleExit = () => setIsPipActive(false);
    const video = videoRef.current;
    if (video) {
      video.addEventListener("leavepictureinpicture", handleExit);
    }
    return () => {
      if (video) video.removeEventListener("leavepictureinpicture", handleExit);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Hidden elements for PiP hack */}
      <canvas ref={canvasRef} width={200} height={200} className="hidden" />
      <video ref={videoRef} className="hidden" muted playsInline />

      <button
        onClick={togglePiP}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
          isPipActive 
            ? 'bg-accent text-white shadow-[0_0_15px_rgba(255,0,122,0.4)]' 
            : 'glass text-primary border-primary/20 hover:bg-primary/10'
        }`}
      >
        {isPipActive ? (
          <>
            <XCircle size={16} />
            Fechar Janela Flutuante
          </>
        ) : (
          <>
            <MonitorPlay size={16} />
            Ativar Modo Sobreposto (PiP)
          </>
        )}
      </button>
      <p className="text-[7px] text-muted-foreground uppercase text-center max-w-[150px]">
        Permite ver a velocidade enquanto usa o iFood ou outros apps.
      </p>
    </div>
  );
}
