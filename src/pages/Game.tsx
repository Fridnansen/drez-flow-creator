import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Home, PanelRightClose, RotateCcw } from "lucide-react";
import Board from "@/components/game/Board";
import MainMenu, { type MenuSection } from "@/components/game/MainMenu";
import MoveLog from "@/components/game/MoveLog";
import PlayerCard from "@/components/game/PlayerCard";
import PromotionDialog from "@/components/game/PromotionDialog";
import SectionDialog from "@/components/game/SectionDialog";
import { Button } from "@/components/ui/button";
import { COLORS, COLOR_LABEL, MODE_LABEL, STYLE_LABEL } from "@/game/constants";
import { useMasterdrez } from "@/hooks/useMasterdrez";

/** Pantalla del videojuego: menú principal y arena de juego. */
const Game = () => {
  const navigate = useNavigate();
  const game = useMasterdrez();
  const [section, setSection] = useState<MenuSection | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  const { state, turn, clocks, selected, highlights } = game;

  const promotionColor = useMemo(() => {
    if (!state?.pendingPromotion) return null;
    const { r, c } = state.pendingPromotion;
    return state.board[r][c]?.color ?? null;
  }, [state]);

  if (!state) {
    return (
      <main className="relative">
        <h1 className="sr-only">Masterdrez — Videojuego de ajedrez para cuatro jugadores</h1>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate("/")}
          className="fixed left-[max(0.75rem,env(safe-area-inset-left))] top-3 z-50 min-h-11 gap-2 backdrop-blur-md"
        >
          <ArrowLeft className="size-4" /> Inicio
        </Button>
        <MainMenu
          hasSave={game.hasSave}
          onPlay={game.newGame}
          onResume={game.resume}
          onOpenSection={setSection}
        />
        <SectionDialog section={section} onOpenChange={(open) => !open && setSection(null)} />
      </main>
    );
  }

  return (
    <main className="arena-bg flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <h1 className="sr-only">Partida de Masterdrez</h1>

      <header className="flex flex-wrap items-center gap-[0.5rem] px-[clamp(0.6rem,3vw,1.5rem)] pb-1 pt-[max(0.6rem,env(safe-area-inset-top))]">
        <Button size="sm" variant="ghost" className="min-h-11 gap-2" onClick={game.quit} aria-label="Volver al menú">
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Menú</span>
        </Button>
        <Button size="sm" variant="ghost" className="min-h-11 gap-2" onClick={() => { game.save(); navigate("/"); }} aria-label="Ir al inicio">
          <Home className="size-4" />
          <span className="hidden sm:inline">Inicio</span>
        </Button>
        <p className="min-w-0 flex-1 truncate text-center text-[clamp(0.72rem,2.4vw,0.85rem)] text-muted-foreground">
          {STYLE_LABEL[state.style]} · {MODE_LABEL[state.mode]}
          {state.message && <span className="ml-2 font-semibold text-[hsl(var(--gold))]">{state.message}</span>}
        </p>
        <Button
          size="sm"
          variant="ghost"
          className="min-h-11 gap-2 lg:hidden"
          onClick={() => setPanelOpen((v) => !v)}
          aria-expanded={panelOpen}
          aria-label={panelOpen ? "Ocultar paneles" : "Mostrar paneles"}
        >
          <PanelRightClose className="size-4" />
        </Button>
      </header>

      <div className="grid flex-1 gap-[clamp(0.5rem,2vw,1rem)] px-[clamp(0.4rem,2vw,1.5rem)] pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]">
        <div className="flex min-w-0 flex-col items-center justify-start gap-[0.5rem]">
          <div
            className="flex items-center gap-[0.5rem] rounded-full border border-border/60 bg-card/60 px-[0.8rem] py-[0.35rem] backdrop-blur"
            aria-live="polite"
          >
            <span
              aria-hidden
              className="size-[0.7rem] rounded-full"
              style={{ background: `var(--army-${turn})` }}
            />
            <span className="text-[clamp(0.75rem,2.6vw,0.9rem)] font-semibold">
              Turno: {turn ? COLOR_LABEL[turn] : "—"}
            </span>
          </div>
          <Board state={state} selected={selected} highlights={highlights} onSelect={game.selectSquare} />
        </div>

        <AnimatePresence initial={false}>
          {panelOpen && (
            <motion.aside
              key="panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22 }}
              className="flex min-h-0 flex-col gap-[0.5rem]"
              aria-label="Paneles de la partida"
            >
              <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-[0.4rem]">
                {COLORS.map((color) => (
                  <PlayerCard key={color} color={color} state={state} seconds={clocks[color]} active={turn === color} />
                ))}
              </div>
              <MoveLog log={state.log} onClear={game.clearLog} />
              <Button variant="outline" className="min-h-11 gap-2" onClick={() => game.newGame(state.style, state.mode)}>
                <RotateCcw className="size-4" /> Reiniciar partida
              </Button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {promotionColor && (
        <PromotionDialog open color={promotionColor} onSelect={game.promote} />
      )}
    </main>
  );
};

export default Game;
