import type { Color, Mode, PieceType, Style } from "./types";

/** Lado del tablero (16x16 con esquinas 4x4 inválidas). */
export const SIZE = 16;

/** Orden de turnos. */
export const COLORS: Color[] = ["white", "blue", "black", "red"];

export const COLOR_LABEL: Record<Color, string> = {
  white: "Blanco",
  blue: "Azul",
  black: "Negro",
  red: "Rojo",
};

/** Token CSS de cada ejército (definido en index.css). */
export const COLOR_TOKEN: Record<Color, string> = {
  white: "var(--army-white)",
  blue: "var(--army-blue)",
  black: "var(--army-black)",
  red: "var(--army-red)",
};

export const PIECE_LABEL: Record<PieceType, string> = {
  pawn: "Peón",
  rook: "Torre",
  knight: "Caballo",
  bishop: "Alfil",
  queen: "Dama",
  king: "Rey",
};

/** Valor relativo, usado para el marcador de capturas. */
export const PIECE_VALUE: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0,
};

const PREFIX: Record<Color, string> = { white: "w", black: "b", blue: "u", red: "r" };
const SUFFIX: Record<PieceType, string> = {
  pawn: "P",
  rook: "R",
  knight: "N",
  bishop: "B",
  queen: "Q",
  king: "K",
};

/** Ruta del sprite SVG de una pieza. */
export function pieceAsset(color: Color, type: PieceType): string {
  return `/game-app/assets/pieces/${PREFIX[color]}${SUFFIX[type]}.svg`;
}

export const STYLE_LABEL: Record<Style, string> = {
  dupla: "Duplas",
  unitario: "Unitario",
};

export const MODE_LABEL: Record<Mode, string> = {
  paz: "Paz",
  esclavo: "Esclavo",
  genocidio: "Genocidio",
  defacto: "De Facto",
};

export const MODE_DESCRIPTION: Record<Mode, string> = {
  paz: "Las piezas del rey capturado quedan congeladas.",
  esclavo: "Las piezas del rey capturado pasan al captor.",
  genocidio: "Las piezas del rey capturado se retiran del tablero.",
  defacto: "Las piezas del rey capturado las mueve quien tenga el turno.",
};
