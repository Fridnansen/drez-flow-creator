// Contenido público de Masterdrez expuesto por el servidor MCP.

export const SITE_URL = "https://masterdrez.com";

export const overview = {
  name: "Masterdrez",
  tagline: "Es más que un ajedrez",
  description:
    "Masterdrez es una plataforma de ajedrez para cuatro jugadores: un emprendimiento de base tecnológica de Buenos Aires, Argentina, que combina videojuego, juego de mesa, educación y eSports.",
  location: "Buenos Aires, Argentina",
  model: "Freemium: acceso gratuito con opciones premium",
  playUrl: `${SITE_URL}/game`,
  stats: [
    { value: "2M+", label: "Usuarios Potenciales" },
    { value: "4", label: "Jugadores Simultáneos" },
    { value: "10min", label: "Recompensas Diarias" },
  ],
};

export const features = [
  { title: "4 Jugadores Simultáneos", text: "Partidas revolucionarias con hasta 4 jugadores en tiempo real, creando dinámicas únicas de estrategia y alianzas." },
  { title: "Partidas Rápidas y Lentas", text: "Desde partidas rápidas de 15 minutos hasta torneos de un día completo." },
  { title: "Recompensas Diarias", text: "Juega al menos 10 minutos diarios y recibe recompensas que mejoran tu experiencia y ranking." },
  { title: "Clanes y Torneos", text: "Únete a clanes, participa en torneos épicos y compite en campañas con narrativa envolvente." },
  { title: "IA Integrada", text: "Entrena con una IA avanzada, forma equipos mixtos o practica estrategias complejas." },
  { title: "Comunidad Global", text: "Conecta con jugadores de todo el mundo, especialmente en Latinoamérica." },
  { title: "Multiplataforma", text: "Disponible en móviles, tablets y PC, con progreso sincronizado." },
  { title: "Contenido Educativo", text: "Videos instructivos, libros digitales y material educativo." },
  { title: "Juego de Mesa (Físico)", text: "Versión física de Masterdrez para disfrutar en casa con familia y amigos." },
];

export const rules = [
  {
    topic: "estilos",
    title: "Estilos",
    count: 2,
    options: ["Dupla", "Unitario"],
    text: "Cada Estilo se debe anunciar al inicio de la partida y se realiza una vez comenzado el juego.",
  },
  {
    topic: "empates",
    title: "Empates",
    count: 3,
    options: ["Mastertablas", "Tritablas", "Tablas"],
    text: "El empate puede ser de 4 (Mastertablas), 3 (Tritablas) o 2 (Tablas) jugadores.",
  },
  {
    topic: "modos",
    title: "Modos",
    count: 5,
    options: ["Prócer", "Paz", "Esclavo", "Genocidio", "De Facto"],
    text: "Cada Modo se debe anunciar al inicio de la partida y se realiza una vez dado el Mate al primer Rey.",
  },
];
