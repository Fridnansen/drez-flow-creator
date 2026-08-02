import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COLORS } from "@/game/constants";
import {
  canControl,
  createInitialState,
  currentColor,
  legalMoves,
  promote as promotePiece,
  tryMove,
} from "@/game/engine";
import type { Color, Coord, GameState, Mode, PieceType, Style } from "@/game/types";

const SAVE_KEY = "masterdrez:game:v2";

interface SavedGame {
  v: 2;
  state: GameState;
  clocks: Record<Color, number>;
  savedAt: number;
}

function loadSaved(): SavedGame | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedGame;
    if (data?.v !== 2 || !data.state?.board) return null;
    return data;
  } catch {
    return null;
  }
}

const initialClocks = (seconds: number): Record<Color, number> => ({
  white: seconds,
  blue: seconds,
  black: seconds,
  red: seconds,
});

/**
 * Hook que conecta la UI con el motor puro: selección, reloj, persistencia
 * y acciones de partida. La lógica de reglas vive en `src/game/engine.ts`.
 */
export function useMasterdrez(defaultMinutes = 10) {
  const [state, setState] = useState<GameState | null>(null);
  const [clocks, setClocks] = useState<Record<Color, number>>(() => initialClocks(defaultMinutes * 60));
  const [selected, setSelected] = useState<Coord | null>(null);
  const [hasSave, setHasSave] = useState(false);
  const stateRef = useRef<GameState | null>(null);
  stateRef.current = state;

  useEffect(() => {
    setHasSave(!!loadSaved());
  }, []);

  const persist = useCallback((next: GameState | null, nextClocks: Record<Color, number>) => {
    try {
      if (!next) localStorage.removeItem(SAVE_KEY);
      else localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, state: next, clocks: nextClocks, savedAt: Date.now() }));
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  const save = useCallback(() => {
    persist(stateRef.current, clocks);
  }, [clocks, persist]);

  useEffect(() => {
    const handler = () => save();
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, [save]);

  const newGame = useCallback(
    (style: Style, mode: Mode, minutes = defaultMinutes) => {
      const next = createInitialState(style, mode);
      const nextClocks = initialClocks(minutes * 60);
      setState(next);
      setClocks(nextClocks);
      setSelected(null);
      persist(next, nextClocks);
      setHasSave(true);
    },
    [defaultMinutes, persist],
  );

  const resume = useCallback(() => {
    const saved = loadSaved();
    if (!saved) return false;
    setState(saved.state);
    setClocks(saved.clocks ?? initialClocks(defaultMinutes * 60));
    setSelected(null);
    return true;
  }, [defaultMinutes]);

  const quit = useCallback(() => {
    save();
    setState(null);
    setSelected(null);
  }, [save]);

  const turn = state ? currentColor(state) : null;

  // Cronómetro: descuenta solo el color en turno mientras la partida sigue viva.
  useEffect(() => {
    if (!state || state.finished || !turn) return;
    const id = window.setInterval(() => {
      setClocks((prev) => ({ ...prev, [turn]: Math.max(0, prev[turn] - 1) }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [state, turn]);

  const highlights = useMemo(() => {
    if (!state || !selected) return [] as Coord[];
    return legalMoves(state, selected);
  }, [state, selected]);

  const selectSquare = useCallback(
    (coord: Coord) => {
      if (!state || state.pendingPromotion) return;
      const piece = state.board[coord.r][coord.c];

      if (selected) {
        const isTarget = highlights.some((h) => h.r === coord.r && h.c === coord.c);
        if (isTarget) {
          const next = tryMove(state, selected, coord);
          if (next) {
            setState(next);
            setSelected(null);
            persist(next, clocks);
            return;
          }
        }
        if (selected.r === coord.r && selected.c === coord.c) {
          setSelected(null);
          return;
        }
      }
      if (piece && canControl(state, piece)) setSelected(coord);
      else setSelected(null);
    },
    [state, selected, highlights, clocks, persist],
  );

  const promote = useCallback(
    (type: PieceType) => {
      if (!state) return;
      const next = promotePiece(state, type);
      setState(next);
      persist(next, clocks);
    },
    [state, clocks, persist],
  );

  const clearLog = useCallback(() => {
    setState((prev) => (prev ? { ...prev, log: [] } : prev));
  }, []);

  return {
    state,
    turn,
    clocks,
    selected,
    highlights,
    hasSave,
    colors: COLORS,
    newGame,
    resume,
    quit,
    save,
    selectSquare,
    promote,
    clearLog,
  };
}
