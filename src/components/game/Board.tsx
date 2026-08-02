import { memo } from "react";
import { COLOR_LABEL, PIECE_LABEL, SIZE, pieceAsset } from "@/game/constants";
import { invalidZone } from "@/game/engine";
import type { Coord, GameState } from "@/game/types";
import { cn } from "@/lib/utils";

interface BoardProps {
  state: GameState;
  selected: Coord | null;
  highlights: Coord[];
  onSelect: (coord: Coord) => void;
}

/**
 * Tablero 16x16 siempre cuadrado (aspect-ratio), sin tamaños fijos.
 * Las casillas se dibujan con CSS Grid y las piezas son sprites SVG.
 */
const Board = ({ state, selected, highlights, onSelect }: BoardProps) => {
  const highlightSet = new Set(highlights.map((h) => `${h.r},${h.c}`));
  const last = state.lastMove;

  return (
    <div className="board-shell">
      <div
        className="board-grid"
        role="grid"
        aria-label="Tablero Masterdrez de 16 por 16"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: SIZE * SIZE }, (_, i) => {
          const r = Math.floor(i / SIZE);
          const c = i % SIZE;
          if (invalidZone(r, c)) return <div key={i} aria-hidden className="board-void" />;

          const piece = state.board[r][c];
          const isSelected = selected?.r === r && selected?.c === c;
          const isTarget = highlightSet.has(`${r},${c}`);
          const isCheck = state.checkSquare?.r === r && state.checkSquare?.c === c;
          const isLast = !!last && ((last.from.r === r && last.from.c === c) || (last.to.r === r && last.to.c === c));
          const label = piece
            ? `${PIECE_LABEL[piece.type]} ${COLOR_LABEL[piece.color]} en fila ${r + 1} columna ${c + 1}`
            : `Casilla vacía fila ${r + 1} columna ${c + 1}`;

          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              aria-label={label}
              aria-pressed={isSelected}
              onClick={() => onSelect({ r, c })}
              className={cn(
                "board-cell",
                (r + c) % 2 ? "board-cell--dark" : "board-cell--light",
                isLast && "board-cell--last",
                isSelected && "board-cell--selected",
                isCheck && "board-cell--check",
              )}
            >
              {isTarget && <span aria-hidden className={piece ? "board-capture" : "board-dot"} />}
              {piece && (
                <img
                  src={pieceAsset(piece.color, piece.type)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className={cn("board-piece", piece.frozen && "opacity-50 saturate-0")}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Board);
