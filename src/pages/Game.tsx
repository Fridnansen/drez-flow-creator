import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Game = () => {
  return (
    <main className="relative min-h-screen w-full bg-background">
      <h1 className="sr-only">Masterdrez — Tablero de ajedrez para 4 jugadores</h1>
      <Button
        asChild
        size="sm"
        variant="outline"
        className="fixed top-4 left-4 z-50 gap-2 border-border/60 bg-background/80 backdrop-blur-md hover:bg-accent hover:text-accent-foreground"
      >
        <Link to="/">
          <ArrowLeft className="size-4" />
          Volver al Inicio
        </Link>
      </Button>
      <iframe
        src="/game-app/index.html"
        title="Tablero Masterdrez"
        className="w-full h-screen border-0"
      />
    </main>
  );
};

export default Game;
