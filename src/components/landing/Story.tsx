import { HeartHandshake, Globe, Users2, MapPin } from "lucide-react";

const pillars = [
  {
    icon: HeartHandshake,
    title: "Impacto Social",
    text: "Formamos disciplina, lógica y respeto a través del ajedrez estratégico en comunidades vulnerables.",
  },
  {
    icon: Globe,
    title: "Visión Global",
    text: "Crear una red de embajadores del ajedrez moderno en toda Latinoamérica y expandir al mundo.",
  },
  {
    icon: Users2,
    title: "Comunidad",
    text: "Incentivamos la constancia, colaboración y construcción de vínculos significativos entre jugadores.",
  },
];

const Story = () => (
  <section id="historia" className="py-20 md:py-28">
    <div className="container">
      <header className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl md:text-4xl">Nuestra Historia</h2>
        <p className="mt-4 text-muted-foreground">
          Desde las calles de Trujillo, Venezuela, hasta una plataforma global que transforma vidas.
        </p>
      </header>

      <div className="mt-14 rounded-xl border border-border bg-card p-8 md:p-12">
        <span className="inline-flex items-center gap-2 text-sm text-accent">
          <MapPin className="h-4 w-4" aria-hidden="true" /> Trujillo, Venezuela
        </span>
        <h3 className="mt-4 text-2xl font-semibold">
          De Fundación Social a Plataforma Global
        </h3>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>
            Masterdrez nació como una fundación dedicada a enseñar ajedrez a niños y jóvenes en
            riesgo social en Trujillo, Venezuela, con un 5% de impacto directo en la comunidad.
          </p>
          <p>
            Descubrimos que el ajedrez no solo forma mentes ágiles, también construye disciplina,
            lógica, respeto y comunidad. Estos valores se convirtieron en los pilares de nuestra
            misión global.
          </p>
          <p>
            Hoy, evolucionamos hacia una plataforma digital que lleva la magia del ajedrez
            estratégico a millones de jugadores en todo el mundo, comenzando con Latinoamérica.
          </p>
        </div>
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {pillars.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-xl border border-border bg-card/60 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Story;
