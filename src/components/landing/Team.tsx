const team = [
  {
    name: "Estilos",
    role: "Dupla o Unitario",
    text: "Cada Estilo se debe anunciar al inicio de la partida y\nse realiza una vez comenzado el juego.",
    number: "2",
  },
  {
    name: "Empates",
    role: "Mastertablas, Tritablas y Tablas",
    text: "El empate puede ser de 4 (Mastertablas) ,\n3 (Tritablas) o 2 (Tablas) jugadores.",
    number: "3",
  },
  {
    name: "Modos",
    role: "Prócer, Paz, Esclavo, Genocidio y De Facto",
    text: "Cada Modo se debe anunciar al inicio de la partida y\nse realiza una vez dado el Mate al primer Rey",
    number: "5",
  },
];

const Team = () => (
  <section id="equipo" className="border-t border-border/60 bg-card/40 py-20 md:py-28">
    <div className="container">
      <h2 className="text-center font-display text-3xl md:text-4xl text-accent">Reglas de Juego</h2>
      <ul className="mt-14 grid gap-6 md:grid-cols-3">
        {team.map((m) => (
          <li key={m.name} className="rounded-xl border border-border bg-card p-6 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-silver font-display text-lg text-background">
              {m.number}
            </span>
            <h3 className="mt-5 text-lg font-semibold">{m.name}</h3>
            <p className="text-sm text-accent">{m.role}</p>
            <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{m.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Team;
