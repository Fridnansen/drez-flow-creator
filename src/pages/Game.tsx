const Game = () => {
  return (
    <main className="min-h-screen w-full bg-background">
      <h1 className="sr-only">Masterdrez — Tablero de ajedrez para 4 jugadores</h1>
      <iframe
        src="/game-app/index.html"
        title="Tablero Masterdrez"
        className="w-full h-screen border-0"
      />
    </main>
  );
};

export default Game;
