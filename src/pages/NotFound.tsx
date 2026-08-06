import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: ruta inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden="true" />
      <div className="relative">
        <p className="font-display text-6xl text-accent md:text-7xl">404</p>
        <h1 className="mt-4 font-display text-2xl md:text-3xl">Página no encontrada</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          La dirección <span className="text-foreground">{location.pathname}</span> no existe en
          Masterdrez. Vuelve al inicio o entra directo al tablero.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/">Ir al inicio</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/game">Jugar ahora</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
