import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Game = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleBack = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "masterdrez:save" }, "*");
    // Pequeña espera para que el tablero guarde antes de navegar
    window.setTimeout(() => navigate("/"), 60);
  };

  return (
    <main className="relative min-h-screen w-full bg-background">
      <h1 className="sr-only">Masterdrez — Tablero de ajedrez para 4 jugadores</h1>
      <Button
        size="sm"
        variant="outline"
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 gap-2 border-border/60 bg-background/80 backdrop-blur-md hover:bg-accent hover:text-accent-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al Inicio
      </Button>
      <iframe
        ref={iframeRef}
        src="/game-app/index.html"
        title="Tablero Masterdrez"
        className="w-full h-screen border-0"
      />
    </main>
  );
};

export default Game;
