import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="py-16">
    <div className="container text-center">
      <h2 className="font-display text-3xl md:text-4xl">Es más que un ajedrez</h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Prueba el tablero de cuatro jugadores y vive la estrategia desde una nueva perspectiva.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/game">Jugar Ahora</Link>
      </Button>
      <p className="mt-12 border-t border-border/60 pt-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Masterdrez. Buenos Aires, Argentina.
      </p>
    </div>
  </footer>
);

export default Footer;
