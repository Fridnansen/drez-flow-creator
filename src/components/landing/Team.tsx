const team = [
  {
    name: "Francisco Díaz",
    role: "Fundador & CEO",
    text: "Creador de Masterdrez, apasionado por el impacto social del ajedrez en comunidades vulnerables.",
  },
  {
    name: "Simón Dávila",
    role: "Co-fundador",
    text: "Experto en desarrollo tecnológico y estrategias de crecimiento digital.",
  },
  {
    name: "Joa Aldana",
    role: "Co-fundador",
    text: "Especialista en comunidades y ecosistemas educativos gamificados.",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

const Team = () => (
  <section id="equipo" className="border-t border-border/60 bg-card/40 py-20 md:py-28">
    <div className="container">
      <h2 className="text-center font-display text-3xl md:text-4xl">Nuestro Equipo Fundador</h2>
      <ul className="mt-14 grid gap-6 md:grid-cols-3">
        {team.map((m) => (
          <li key={m.name} className="rounded-xl border border-border bg-card p-6 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-silver font-display text-lg text-background">
              {initials(m.name)}
            </span>
            <h3 className="mt-5 text-lg font-semibold">{m.name}</h3>
            <p className="text-sm text-accent">{m.role}</p>
            <p className="mt-3 text-sm text-muted-foreground">{m.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Team;
