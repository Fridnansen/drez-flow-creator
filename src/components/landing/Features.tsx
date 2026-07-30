import {
  Users,
  Timer,
  Gift,
  Swords,
  Bot,
  Globe2,
  MonitorSmartphone,
  GraduationCap,
  Dices,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "4 Jugadores Simultáneos",
    text: "Partidas revolucionarias con hasta 4 jugadores en tiempo real, creando dinámicas únicas de estrategia y alianzas.",
  },
  {
    icon: Timer,
    title: "Partidas Rápidas y Lentas",
    text: "Desde partidas rápidas de 15 minutos hasta torneos de un día completo. Adapta el juego a tu ritmo.",
  },
  {
    icon: Gift,
    title: "Recompensas Diarias",
    text: "Juega al menos 5 minutos diarios y recibe recompensas que mejoran tu experiencia y ranking.",
  },
  {
    icon: Swords,
    title: "Clanes y Torneos",
    text: "Únete a clanes, participa en torneos épicos y compite en campañas con narrativa envolvente.",
  },
  {
    icon: Bot,
    title: "IA Integrada",
    text: "Entrena con nuestra IA avanzada, forma equipos mixtos o practica estrategias complejas.",
  },
  {
    icon: Globe2,
    title: "Comunidad Global",
    text: "Conecta con jugadores de todo el mundo, especialmente en Latinoamérica. Invita amigos desde redes sociales.",
  },
  {
    icon: MonitorSmartphone,
    title: "Multiplataforma",
    text: "Disponible en móviles, tablets y PC. Tu progreso se sincroniza en todos tus dispositivos.",
  },
  {
    icon: GraduationCap,
    title: "Contenido Educativo",
    text: "Videos instructivos, libros digitales y material educativo para mejorar tu nivel estratégico.",
  },
  {
    icon: Dices,
    title: "Juego de Mesa Físico",
    text: "Versión física de Masterdrez para disfrutar en casa con familia y amigos.",
  },
];

const Features = () => (
  <section id="caracteristicas" className="border-y border-border/60 bg-card/40 py-20 md:py-28">
    <div className="container">
      <header className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl md:text-4xl">Características Revolucionarias</h2>
        <p className="mt-4 text-muted-foreground">
          Masterdrez reimagina el ajedrez clásico con innovaciones que crean engagement real y
          hábitos positivos a través del juego estratégico.
        </p>
      </header>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/60"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-accent/15 group-hover:text-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        Modelo Freemium: acceso gratuito con opciones premium
      </p>
    </div>
  </section>
);

export default Features;
