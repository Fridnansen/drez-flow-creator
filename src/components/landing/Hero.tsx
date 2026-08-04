import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import marca from "@/assets/masterdrez-marca.png.asset.json";

const stats = [
  { value: "2M+", label: "Usuarios Potenciales" },
  { value: "4", label: "Jugadores Simultáneos" },
  { value: "20min", label: "Recompensas Diarias" },
];

const Hero = () => (
  <section id="inicio" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
    <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden="true" />
    <div className="container relative grid gap-12 md:grid-cols-2 md:items-center">
      <div className="text-center md:text-left">
        <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-accent">
          Nueva Era del Ajedrez
        </span>
        <h1 className="mt-6 font-display text-4xl leading-tight md:text-6xl">
          Ajedrez para{" "}
          <span className="bg-gradient-silver bg-clip-text text-transparent">Cuatro</span> Jugadores
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Descubre una nueva forma de vivir el ajedrez: partidas emocionantes de 4 jugadores,
          estrategia profunda, comunidad global y crecimiento educativo.
        </p>
        <div className="mt-8 flex justify-center md:justify-start">
          <Button asChild size="lg">
            <Link to="/game">Jugar Ahora</Link>
          </Button>
        </div>
        <dl className="mt-12 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-2xl text-accent md:text-3xl">{s.value}</dd>
              <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative">
        <img
          src={marca.url}
          alt="Masterdrez — emblema metálico de la marca, es más que un ajedrez"
          className="w-full rounded-xl shadow-glow"
          loading="eager"
        />
      </div>
    </div>
  </section>
);

export default Hero;
