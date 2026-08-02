/**
 * Tipos del motor de Masterdrez (ajedrez 16x16 para 4 jugadores).
 * El motor es puro: no toca el DOM ni React.
 */

export type Color = "white" | "blue" | "black" | "red";

export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

/** Estilos de juego: Dupla (2v2) o Unitario (todos contra todos). */
export type Style = "dupla" | "unitario";

/** Modos que se aplican cuando un Rey es capturado. */
export type Mode = "paz" | "esclavo" | "genocidio" | "defacto";

export interface Piece {
  id: number;
  type: PieceType;
  color: Color;
  /** Modo Paz: la pieza queda congelada y no puede moverse. */
  frozen?: boolean;
  /** Modo De Facto: la pieza puede ser movida por quien tenga el turno. */
  defacto?: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Coord {
  r: number;
  c: number;
}

export interface EnPassantRecord {
  r: number;
  c: number;
  capture: Coord;
  pid: number;
  createdTurn: number;
  byColor: Color;
}

export interface SpecialTurn {
  type: "retorno" | "jaque-pase";
  sequence: Color[];
  cursor: number;
}

export interface LogEntry {
  id: number;
  time: string;
  text: string;
}

export interface CapturedPiece {
  id: number;
  type: PieceType;
  color: Color;
}

export type MoveSpecial =
  | { type: "double-step"; mid: Coord }
  | { type: "enpassant"; capture: Coord; recPid: number; chosenKey: string }
  | { type: "castle-short" | "castle-long"; rook: Coord; stepR: number; stepC: number }
  | null;

export interface ValidationResult {
  legal: boolean;
  special?: MoveSpecial;
}

export interface GameState {
  board: Board;
  turnIndex: number;
  nextId: number;
  logId: number;
  style: Style;
  mode: Mode;
  pairs: { A: Color[]; B: Color[] };
  enPassants: EnPassantRecord[];
  moved: Record<string, boolean>;
  specialTurn: SpecialTurn | null;
  log: LogEntry[];
  message: string;
  captured: CapturedPiece[];
  lastMove: { from: Coord; to: Coord } | null;
  checkSquare: Coord | null;
  pendingPromotion: Coord | null;
  finished: boolean;
  moveCount: number;
}
