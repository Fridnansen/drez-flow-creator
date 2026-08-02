import { COLOR_LABEL, COLOR_TOKEN, PIECE_VALUE, pieceAsset } from "@/game/constants";
import type { Color, GameState } from "@/game/types";
import { cn } from "@/lib/utils";

function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface PlayerCardProps {
  color: Color;
  active: boolean;
  seconds: number;
  state: GameState;
}

/** Tarjeta de jugador: color, reloj y piezas capturadas por ese ejército. */
const PlayerCard = ({ color, active, seconds, state }: PlayerCardProps) => {
  const alive = state.board.some((row) => row.some((p) => p?.color === color && p.type === "king"));
  const lost = state.captured.filter((p) => p.color === color);
  const score = lost.reduce((sum, p) => sum + PIECE_VALUE[p.type], 0);

  return (
    <div
      className={cn(
        "glass-panel flex items-center gap-[0.6rem] rounded-xl px-[0.7rem] py-[0.55rem] transition-colors",
        active && "ring-1 ring-[hsl(var(--cyan))] shadow-[0_0_1.5rem_-0.5rem_hsl(var(--cyan))]",
        !alive && "opacity-55",
      )}
    >
      <span
        aria-hidden
        className="size-[0.85rem] shrink-0 rounded-full border border-white/25"
        style={{ background: COLOR_TOKEN[color] }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[clamp(0.7rem,2.4vw,0.85rem)] font-semibold">
          {COLOR_LABEL[color]}
          {!alive && <span className="ml-1 text-muted-foreground">· fuera</span>}
        </p>
        <div className="flex flex-wrap items-center gap-[0.15rem]">
          {lost.slice(0, 10).map((p) => (
            <img key={p.id} src={pieceAsset(p.color, p.type)} alt="" aria-hidden className="size-[0.9rem] opacity-70" />
          ))}
          {score > 0 && <span className="text-[0.65rem] text-muted-foreground">−{score}</span>}
        </div>
      </div>
      <span
        className={cn(
          "tabular-nums text-[clamp(0.8rem,2.6vw,1rem)] font-semibold",
          active ? "text-[hsl(var(--cyan))]" : "text-muted-foreground",
          seconds <= 30 && "text-destructive",
        )}
      >
        {formatClock(seconds)}
      </span>
    </div>
  );
};

export default PlayerCard;
