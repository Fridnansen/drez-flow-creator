import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#caracteristicas", label: "Características" },
  { href: "#historia", label: "Emprendimiento" },
  { href: "#equipo", label: "Reglas" },
];

const Header = () => (
  <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
    <nav className="container flex h-16 items-center justify-between">
      <a href="#inicio" className="font-display text-xl tracking-wide text-accent">
        MASTERDREZ
      </a>
      <ul className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <Button asChild size="sm">
        <Link to="/game">Jugar Ahora</Link>
      </Button>
    </nav>
  </header>
);

export default Header;
