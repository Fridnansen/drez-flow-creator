import { COLORS, COLOR_LABEL, SIZE } from "./constants";
import type {
  Board,
  Color,
  Coord,
  GameState,
  Mode,
  MoveSpecial,
  Piece,
  PieceType,
  Style,
  ValidationResult,
} from "./types";

/* ------------------------------------------------------------------ */
/* Geometría del tablero                                               */
/* ------------------------------------------------------------------ */

/** Las cuatro esquinas 4x4 no forman parte del tablero jugable. */
export function invalidZone(r: number, c: number): boolean {
  const cut = 4;
  return (
    (r < cut && c < cut) ||
    (r < cut && c >= SIZE - cut) ||
    (r >= SIZE - cut && c < cut) ||
    (r >= SIZE - cut && c >= SIZE - cut)
  );
}

export function inside(r: number, c: number): boolean {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE && !invalidZone(r, c);
}

export function pieceAt(board: Board, r: number, c: number): Piece | null {
  return inside(r, c) ? board[r][c] : null;
}

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null));
}

function piecesOf(board: Board, color: Color) {
  const out: { piece: Piece; r: number; c: number }[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (p && p.color === color) out.push({ piece: p, r, c });
    }
  }
  return out;
}

export function findKing(board: Board, color: Color): (Coord & { piece: Piece }) | null {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (p && p.color === color && p.type === "king") return { r, c, piece: p };
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Estado inicial                                                      */
/* ------------------------------------------------------------------ */

const MAJORS: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
const MAJORS_ALT: PieceType[] = ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"];

export function createInitialState(style: Style, mode: Mode): GameState {
  const board = emptyBoard();
  let nextId = 1;
  const put = (type: PieceType, color: Color, r: number, c: number) => {
    if (!inside(r, c)) return;
    board[r][c] = { id: nextId++, type, color };
  };

  for (let c = 3; c < SIZE - 3; c++) put("pawn", "white", SIZE - 2, c);
  for (let c = 3; c < SIZE - 3; c++) put("pawn", "black", 1, c);
  for (let r = 3; r < SIZE - 3; r++) put("pawn", "blue", r, SIZE - 2);
  for (let r = 3; r < SIZE - 3; r++) put("pawn", "red", r, 1);

  for (let i = 0; i < 8; i++) {
    put(MAJORS_ALT[i], "white", SIZE - 1, i + 4);
    put(MAJORS[i], "black", 0, i + 4);
    put(MAJORS_ALT[i], "blue", i + 4, SIZE - 1);
    put(MAJORS[i], "red", i + 4, 0);
  }

  const state: GameState = {
    board,
    turnIndex: Math.floor(Math.random() * COLORS.length),
    nextId,
    logId: 1,
    style,
    mode,
    pairs: { A: ["white", "black"], B: ["blue", "red"] },
    enPassants: [],
    moved: {},
    specialTurn: null,
    log: [],
    message: "",
    captured: [],
    lastMove: null,
    checkSquare: null,
    pendingPromotion: null,
    finished: false,
    moveCount: 0,
  };
  pushLog(state, "Partida iniciada");
  return state;
}

export function cloneState(state: GameState): GameState {
  return {
    ...state,
    board: state.board.map((row) => row.map((cell) => (cell ? { ...cell } : null))),
    pairs: { A: [...state.pairs.A], B: [...state.pairs.B] },
    enPassants: state.enPassants.map((e) => ({ ...e, capture: { ...e.capture } })),
    moved: { ...state.moved },
    specialTurn: state.specialTurn ? { ...state.specialTurn, sequence: [...state.specialTurn.sequence] } : null,
    log: [...state.log],
    captured: [...state.captured],
    lastMove: state.lastMove ? { from: { ...state.lastMove.from }, to: { ...state.lastMove.to } } : null,
    checkSquare: state.checkSquare ? { ...state.checkSquare } : null,
    pendingPromotion: state.pendingPromotion ? { ...state.pendingPromotion } : null,
  };
}

export function pushLog(state: GameState, text: string) {
  state.log = [
    { id: state.logId++, time: new Date().toLocaleTimeString(), text },
    ...state.log,
  ].slice(0, 120);
}

/* ------------------------------------------------------------------ */
/* Turnos y alianzas                                                   */
/* ------------------------------------------------------------------ */

export function currentColor(state: GameState): Color {
  return COLORS[state.turnIndex % COLORS.length];
}

export function areAllies(state: GameState, a?: Color | null, b?: Color | null): boolean {
  if (!a || !b) return false;
  if (state.style !== "dupla") return false;
  if (state.pairs.A.includes(a) && state.pairs.A.includes(b)) return true;
  if (state.pairs.B.includes(a) && state.pairs.B.includes(b)) return true;
  return false;
}

function expireOldEnPassants(state: GameState) {
  state.enPassants = state.enPassants.filter((rec) => {
    const age = ((state.turnIndex - rec.createdTurn) % COLORS.length + COLORS.length) % COLORS.length;
    return age !== 0;
  });
}

function advanceTurn(state: GameState) {
  const st = state.specialTurn;
  if (st && st.sequence?.length) {
    st.cursor = (st.cursor + 1) % st.sequence.length;
    const next = st.sequence[st.cursor];
    const idx = COLORS.indexOf(next);
    state.turnIndex = idx >= 0 ? idx : (state.turnIndex + 1) % COLORS.length;
  } else {
    state.turnIndex = (state.turnIndex + 1) % COLORS.length;
  }
  expireOldEnPassants(state);
}

/* ------------------------------------------------------------------ */
/* Validación de movimientos                                           */
/* ------------------------------------------------------------------ */

const pawnDir: Record<Color, { f: [number, number]; diags: [number, number][] }> = {
  white: { f: [-1, 0], diags: [[-1, -1], [-1, 1]] },
  black: { f: [1, 0], diags: [[1, -1], [1, 1]] },
  blue: { f: [0, -1], diags: [[-1, -1], [1, -1]] },
  red: { f: [0, 1], diags: [[-1, 1], [1, 1]] },
};

function singleStepsFor(color: Color): [number, number][] {
  const f = pawnDir[color].f;
  const lateral: [number, number][] =
    color === "white" || color === "black" ? [[0, 1], [0, -1]] : [[1, 0], [-1, 0]];
  return [f, ...lateral];
}

function pathClear(board: Board, fr: number, fc: number, tr: number, tc: number, stepR: number, stepC: number) {
  let r = fr + stepR;
  let c = fc + stepC;
  while (r !== tr || c !== tc) {
    if (!inside(r, c) || board[r][c]) return false;
    r += stepR;
    c += stepC;
  }
  return true;
}

function validateRook(board: Board, fr: number, fc: number, tr: number, tc: number) {
  if (fr !== tr && fc !== tc) return false;
  const stepR = tr > fr ? 1 : tr < fr ? -1 : 0;
  const stepC = tc > fc ? 1 : tc < fc ? -1 : 0;
  return pathClear(board, fr, fc, tr, tc, stepR, stepC);
}

function validateBishop(board: Board, fr: number, fc: number, tr: number, tc: number) {
  if (Math.abs(tr - fr) !== Math.abs(tc - fc) || tr === fr) return false;
  const stepR = tr > fr ? 1 : -1;
  const stepC = tc > fc ? 1 : -1;
  return pathClear(board, fr, fc, tr, tc, stepR, stepC);
}

function validateKnight(fr: number, fc: number, tr: number, tc: number) {
  const dr = Math.abs(tr - fr);
  const dc = Math.abs(tc - fc);
  return ((dr === 2 && dc === 1) || (dr === 1 && dc === 2)) && inside(tr, tc);
}

function isInitialKingPos(color: Color, r: number, c: number) {
  if (color === "white") return r === SIZE - 1 && c === 7;
  if (color === "black") return r === 0 && c === 8;
  if (color === "blue") return c === SIZE - 1 && r === 7;
  if (color === "red") return c === 0 && r === 8;
  return false;
}

const movedKey = (color: Color, type: PieceType, r: number, c: number) => `${color}:${type}:${r},${c}`;

function findCastlingRook(board: Board, color: Color, fr: number, fc: number, stepR: number, stepC: number) {
  let r = fr + stepR;
  let c = fc + stepC;
  while (inside(r, c)) {
    const p = board[r][c];
    if (p) return p.color === color && p.type === "rook" ? { r, c } : null;
    r += stepR;
    c += stepC;
  }
  return null;
}

/** Enroque: el rey avanza dos casillas hacia una torre sin mover. */
function validateKingMove(state: GameState, piece: Piece, fr: number, fc: number, tr: number, tc: number): ValidationResult {
  const { board } = state;
  const dr = tr - fr;
  const dc = tc - fc;
  if (Math.max(Math.abs(dr), Math.abs(dc)) === 1) return { legal: true, special: null };

  if ((dr === 0 && Math.abs(dc) === 2) || (dc === 0 && Math.abs(dr) === 2)) {
    const col = piece.color;
    const stepR = dr === 0 ? 0 : tr > fr ? 1 : -1;
    const stepC = dc === 0 ? 0 : tc > fc ? 1 : -1;
    if (!isInitialKingPos(col, fr, fc)) return { legal: false };
    if (state.moved[movedKey(col, "king", fr, fc)]) return { legal: false };
    const rookInfo = findCastlingRook(board, col, fr, fc, stepR, stepC);
    if (!rookInfo) return { legal: false };
    if (state.moved[movedKey(col, "rook", rookInfo.r, rookInfo.c)]) return { legal: false };
    if (!pathClear(board, fr, fc, rookInfo.r, rookInfo.c, stepR, stepC)) return { legal: false };
    const path: Coord[] = [];
    let r = fr;
    let c = fc;
    for (let i = 0; i < 2; i++) {
      r += stepR;
      c += stepC;
      path.push({ r, c });
    }
    if (r !== tr || c !== tc) return { legal: false };
    for (const sq of [{ r: fr, c: fc }, ...path]) {
      if (isSquareUnderAttack(state, sq.r, sq.c, col)) return { legal: false };
    }
    const special: MoveSpecial = {
      type: stepR + stepC > 0 ? "castle-short" : "castle-long",
      rook: rookInfo,
      stepR,
      stepC,
    };
    return { legal: true, special };
  }
  return { legal: false };
}

function enPassantPriority(state: GameState, createdTurn: number) {
  const n = COLORS.length;
  return ((state.turnIndex - createdTurn) % n + n) % n || n;
}

/** Peón: avance frontal y lateral, doble paso, captura en diagonal y en passant persistente. */
function validatePawnMove(state: GameState, piece: Piece, fr: number, fc: number, tr: number, tc: number): ValidationResult {
  const { board } = state;
  const col = piece.color;
  const { diags } = pawnDir[col];
  const singles = singleStepsFor(col);
  const dr = tr - fr;
  const dc = tc - fc;

  for (const [sr, sc] of singles) {
    if (dr === sr && dc === sc && !pieceAt(board, tr, tc)) return { legal: true, special: null };
  }
  for (const [sr, sc] of singles) {
    const midR = fr + sr;
    const midC = fc + sc;
    if (dr === 2 * sr && dc === 2 * sc && inside(midR, midC) && !pieceAt(board, midR, midC) && !pieceAt(board, tr, tc)) {
      return { legal: true, special: { type: "double-step", mid: { r: midR, c: midC } } };
    }
  }
  for (const [adr, adc] of diags) {
    if (fr + adr === tr && fc + adc === tc) {
      const target = pieceAt(board, tr, tc);
      if (target && target.color !== col) {
        if (areAllies(state, col, target.color)) return { legal: false };
        return { legal: true, special: null };
      }
    }
  }
  // En passant persistente: la captura sigue disponible varios turnos, con prioridad al más inmediato.
  const candidates: { rec: (typeof state.enPassants)[number]; delta: number }[] = [];
  for (const rec of state.enPassants) {
    if (rec.r !== tr || rec.c !== tc) continue;
    const victim = pieceAt(board, rec.capture.r, rec.capture.c);
    if (!victim || victim.id !== rec.pid || victim.type !== "pawn") continue;
    for (const [adr, adc] of diags) {
      if (fr + adr === tr && fc + adc === tc && !pieceAt(board, tr, tc)) {
        const delta = enPassantPriority(state, rec.createdTurn);
        if (delta < COLORS.length) candidates.push({ rec, delta });
      }
    }
  }
  if (candidates.length) {
    candidates.sort((a, b) => a.delta - b.delta);
    const pick = candidates[0].rec;
    return {
      legal: true,
      special: {
        type: "enpassant",
        capture: { ...pick.capture },
        recPid: pick.pid,
        chosenKey: `${pick.r},${pick.c}:${pick.pid}`,
      },
    };
  }
  return { legal: false };
}

function validate(state: GameState, piece: Piece, fr: number, fc: number, tr: number, tc: number): ValidationResult {
  switch (piece.type) {
    case "pawn":
      return validatePawnMove(state, piece, fr, fc, tr, tc);
    case "rook":
      return { legal: validateRook(state.board, fr, fc, tr, tc), special: null };
    case "bishop":
      return { legal: validateBishop(state.board, fr, fc, tr, tc), special: null };
    case "queen":
      return {
        legal: validateRook(state.board, fr, fc, tr, tc) || validateBishop(state.board, fr, fc, tr, tc),
        special: null,
      };
    case "knight":
      return { legal: validateKnight(fr, fc, tr, tc), special: null };
    case "king":
      return validateKingMove(state, piece, fr, fc, tr, tc);
    default:
      return { legal: false };
  }
}

/* ------------------------------------------------------------------ */
/* Ataques y jaque                                                     */
/* ------------------------------------------------------------------ */

const KNIGHT_MOVES: [number, number][] = [
  [2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2],
];
const DIAGONALS: [number, number][] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ORTHOGONALS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function attacksSquare(board: Board, from: Coord, piece: Piece, r: number, c: number): boolean {
  const { r: pr, c: pc } = from;
  if (piece.type === "pawn") {
    return pawnDir[piece.color].diags.some(([dr, dc]) => pr + dr === r && pc + dc === c);
  }
  if (piece.type === "knight") {
    return KNIGHT_MOVES.some(([dr, dc]) => pr + dr === r && pc + dc === c && inside(r, c));
  }
  if (piece.type === "king") {
    return Math.max(Math.abs(pr - r), Math.abs(pc - c)) === 1;
  }
  const dirs =
    piece.type === "bishop" ? DIAGONALS : piece.type === "rook" ? ORTHOGONALS : [...DIAGONALS, ...ORTHOGONALS];
  for (const [dr, dc] of dirs) {
    let rr = pr + dr;
    let cc = pc + dc;
    while (inside(rr, cc)) {
      if (rr === r && cc === c) return true;
      if (board[rr][cc]) break;
      rr += dr;
      cc += dc;
    }
  }
  return false;
}

export function isSquareUnderAttack(state: GameState, r: number, c: number, defender: Color): boolean {
  if (state.mode === "paz") return false;
  for (const col of COLORS) {
    if (col === defender) continue;
    if (areAllies(state, col, defender)) continue;
    for (const { piece, r: pr, c: pc } of piecesOf(state.board, col)) {
      if (attacksSquare(state.board, { r: pr, c: pc }, piece, r, c)) return true;
    }
  }
  return false;
}

function findAttackersOfSquare(state: GameState, r: number, c: number) {
  const attackers: Coord[] = [];
  for (const col of COLORS) {
    for (const { piece, r: pr, c: pc } of piecesOf(state.board, col)) {
      if (attacksSquare(state.board, { r: pr, c: pc }, piece, r, c)) attackers.push({ r: pr, c: pc });
    }
  }
  return attackers;
}

/* ------------------------------------------------------------------ */
/* Aplicación de movimientos                                           */
/* ------------------------------------------------------------------ */

function removePiece(state: GameState, r: number, c: number, record: boolean) {
  const piece = state.board[r][c];
  if (!piece) return;
  state.board[r][c] = null;
  if (record) state.captured.push({ id: piece.id, type: piece.type, color: piece.color });
}

interface MoveInput {
  from: Coord;
  to: Coord;
  special: MoveSpecial;
}

function applyMove(state: GameState, { from, to, special }: MoveInput, simulate: boolean) {
  const piece = state.board[from.r][from.c];
  if (!piece) return;

  if (special && special.type === "enpassant") {
    removePiece(state, special.capture.r, special.capture.c, !simulate);
    state.enPassants = state.enPassants.filter((rec) => `${rec.r},${rec.c}:${rec.pid}` !== special.chosenKey);
  }

  const target = state.board[to.r][to.c];
  if (target && areAllies(state, piece.color, target.color)) return;

  let capturedKingSquare: Coord | null = null;
  let capturedKingColor: Color | null = null;
  if (target) {
    if (target.type === "king") {
      capturedKingSquare = { r: to.r, c: to.c };
      capturedKingColor = target.color;
      if (!simulate) {
        pushLog(state, `Rey ${COLOR_LABEL[target.color]} capturado por ${COLOR_LABEL[piece.color]}`);
      }
    }
    removePiece(state, to.r, to.c, !simulate);
  }

  state.board[from.r][from.c] = null;
  state.board[to.r][to.c] = piece;

  if (special && (special.type === "castle-short" || special.type === "castle-long")) {
    const rook = state.board[special.rook.r][special.rook.c];
    if (rook) {
      state.board[special.rook.r][special.rook.c] = null;
      const rr = to.r - special.stepR;
      const rc = to.c - special.stepC;
      if (state.board[rr][rc]) removePiece(state, rr, rc, !simulate);
      state.board[rr][rc] = rook;
      if (!simulate) state.moved[movedKey(piece.color, "rook", special.rook.r, special.rook.c)] = true;
    }
  }

  if (!simulate && special && special.type === "double-step") {
    state.enPassants.push({
      r: special.mid.r,
      c: special.mid.c,
      capture: { r: to.r, c: to.c },
      pid: piece.id,
      createdTurn: state.turnIndex,
      byColor: piece.color,
    });
  }

  if (!simulate) {
    if (piece.type === "king") state.moved[movedKey(piece.color, "king", from.r, from.c)] = true;
    else if (piece.type === "rook") state.moved[movedKey(piece.color, "rook", from.r, from.c)] = true;
    state.enPassants = state.enPassants.filter((rec) => {
      const p = pieceAt(state.board, rec.capture.r, rec.capture.c);
      return !!p && p.id === rec.pid && p.type === "pawn";
    });
    if (capturedKingSquare && capturedKingColor) {
      handleAfterKingCapture(state, capturedKingColor, piece.color, capturedKingSquare);
    }
  }
}

/** Aplica el Modo elegido, el Soplo y activa Retorno cuando corresponde. */
function handleAfterKingCapture(state: GameState, capturedColor: Color, captorColor: Color, square: Coord) {
  const affected = piecesOf(state.board, capturedColor);
  if (state.mode === "genocidio") {
    for (const { r, c } of affected) removePiece(state, r, c, true);
    pushLog(state, `Modo Genocidio: piezas de ${COLOR_LABEL[capturedColor]} retiradas.`);
  } else if (state.mode === "paz") {
    for (const { piece } of affected) piece.frozen = true;
    pushLog(state, `Modo Paz: piezas de ${COLOR_LABEL[capturedColor]} congeladas.`);
  } else if (state.mode === "esclavo") {
    for (const { piece } of affected) piece.color = captorColor;
    pushLog(state, `Modo Esclavo: piezas de ${COLOR_LABEL[capturedColor]} pasan a ${COLOR_LABEL[captorColor]}.`);
  } else if (state.mode === "defacto") {
    for (const { piece } of affected) piece.defacto = true;
    pushLog(state, `Modo De Facto: piezas de ${COLOR_LABEL[capturedColor]} las mueve quien tenga el turno.`);
  }

  // Soplo: se retiran las piezas que amenazaban la casilla del rey capturado.
  for (const { r, c } of findAttackersOfSquare(state, square.r, square.c)) {
    const p = state.board[r][c];
    if (!p) continue;
    removePiece(state, r, c, true);
    pushLog(state, `Soplo: se retira ${COLOR_LABEL[p.color]} ${p.type}`);
  }

  const alive = COLORS.filter((c) => !!findKing(state.board, c));
  pushLog(state, `Reyes vivos: ${alive.map((x) => COLOR_LABEL[x]).join(", ") || "ninguno"}`);

  if (state.style === "dupla" && alive.length === 3) {
    let pair: Color[] | null = null;
    for (const a of alive) for (const b of alive) if (a !== b && areAllies(state, a, b)) pair = [a, b];
    if (pair) {
      const lone = alive.find((x) => !pair!.includes(x));
      if (lone) {
        state.specialTurn = { type: "retorno", sequence: [pair[0], lone, pair[1]], cursor: 0 };
        pushLog(state, `Retorno activado: ${pair.map((p) => COLOR_LABEL[p]).join(" & ")} vs ${COLOR_LABEL[lone]}`);
      }
    }
  }
  checkEndConditions(state);
}

function checkEndConditions(state: GameState) {
  const alive = COLORS.filter((c) => !!findKing(state.board, c));
  if (state.style === "unitario") {
    if (alive.length === 1) {
      state.message = `Victoria unitaria: ${COLOR_LABEL[alive[0]]}`;
      state.finished = true;
      pushLog(state, state.message);
    } else if (alive.length === 2) state.message = "Tablas (dos reyes)";
    else if (alive.length === 3) state.message = "Tritablas (tres reyes)";
  } else {
    const aAlive = state.pairs.A.some((c) => !!findKing(state.board, c));
    const bAlive = state.pairs.B.some((c) => !!findKing(state.board, c));
    if (aAlive && !bAlive) {
      state.message = `Victoria Dupla: ${state.pairs.A.map((c) => COLOR_LABEL[c]).join(" / ")}`;
      state.finished = true;
      pushLog(state, state.message);
    } else if (bAlive && !aAlive) {
      state.message = `Victoria Dupla: ${state.pairs.B.map((c) => COLOR_LABEL[c]).join(" / ")}`;
      state.finished = true;
      pushLog(state, state.message);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Legalidad y movimientos disponibles                                 */
/* ------------------------------------------------------------------ */

function moveLeavesKingSafe(state: GameState, from: Coord, to: Coord, special: MoveSpecial, color: Color) {
  const draft = cloneState(state);
  applyMove(draft, { from, to, special }, true);
  const king = findKing(draft.board, color);
  return king ? !isSquareUnderAttack(draft, king.r, king.c, color) : true;
}

/** Todos los destinos legales de la pieza situada en `from`. */
export function legalMoves(state: GameState, from: Coord): Coord[] {
  const piece = pieceAt(state.board, from.r, from.c);
  if (!piece) return [];
  const out: Coord[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!inside(r, c)) continue;
      if (r === from.r && c === from.c) continue;
      const target = state.board[r][c];
      if (target && (target.color === piece.color || areAllies(state, piece.color, target.color))) continue;
      const { legal, special } = validate(state, piece, from.r, from.c, r, c);
      if (!legal) continue;
      if (!moveLeavesKingSafe(state, from, { r, c }, special ?? null, piece.color)) continue;
      out.push({ r, c });
    }
  }
  return out;
}

function hasAnyLegalMove(state: GameState, color: Color): boolean {
  if (state.mode === "paz") return false;
  for (const { r, c } of piecesOf(state.board, color)) {
    if (legalMoves(state, { r, c }).length) return true;
  }
  return false;
}

function onEdge(r: number, c: number) {
  return (r === 0 || r === SIZE - 1 || c === 0 || c === SIZE - 1) && inside(r, c);
}

function postMoveChecks(state: GameState, color: Color) {
  state.checkSquare = null;
  const king = findKing(state.board, color);
  if (!king) {
    state.message = `¡${COLOR_LABEL[color]} eliminado!`;
    return;
  }
  if (isSquareUnderAttack(state, king.r, king.c, color)) {
    state.checkSquare = { r: king.r, c: king.c };
    state.message = hasAnyLegalMove(state, color)
      ? `Jaque a ${COLOR_LABEL[color]}`
      : `Jaque mate a ${COLOR_LABEL[color]}`;
  } else {
    state.message = hasAnyLegalMove(state, color) ? "" : `Ahogado de ${COLOR_LABEL[color]} (tablas)`;
  }
}

/** ¿Puede el jugador en turno mover esta pieza? (incluye Modo De Facto) */
export function canControl(state: GameState, piece: Piece): boolean {
  if (piece.frozen) return false;
  if (piece.defacto) return true;
  return piece.color === currentColor(state);
}

/**
 * Intenta mover una pieza. Devuelve un nuevo estado si el movimiento es legal,
 * o `null` si no lo es. No muta el estado recibido.
 */
export function tryMove(state: GameState, from: Coord, to: Coord): GameState | null {
  if (state.finished || state.pendingPromotion) return null;
  const piece = pieceAt(state.board, from.r, from.c);
  if (!piece || !canControl(state, piece)) return null;
  if (!inside(to.r, to.c)) return null;
  const target = pieceAt(state.board, to.r, to.c);
  if (target && (target.color === piece.color || areAllies(state, piece.color, target.color))) return null;

  const { legal, special } = validate(state, piece, from.r, from.c, to.r, to.c);
  if (!legal) return null;
  if (!moveLeavesKingSafe(state, from, to, special ?? null, piece.color)) return null;

  const next = cloneState(state);
  applyMove(next, { from, to, special: special ?? null }, false);
  next.lastMove = { from: { ...from }, to: { ...to } };
  next.moveCount += 1;
  pushLog(next, `${COLOR_LABEL[piece.color]} ${piece.type}: ${coordLabel(from)} → ${coordLabel(to)}`);

  const moved = next.board[to.r][to.c];
  if (moved && moved.type === "pawn" && onEdge(to.r, to.c)) {
    next.pendingPromotion = { r: to.r, c: to.c };
  }

  advanceTurn(next);
  if (!next.finished) postMoveChecks(next, currentColor(next));
  return next;
}

/** Resuelve la promoción pendiente. */
export function promote(state: GameState, type: PieceType): GameState {
  if (!state.pendingPromotion) return state;
  const next = cloneState(state);
  const { r, c } = next.pendingPromotion!;
  const piece = next.board[r][c];
  if (piece) {
    piece.type = type;
    pushLog(next, `Promoción: ${COLOR_LABEL[piece.color]} corona ${type}`);
  }
  next.pendingPromotion = null;
  return next;
}

export function coordLabel({ r, c }: Coord): string {
  return `${String.fromCharCode(97 + c)}${SIZE - r}`;
}
