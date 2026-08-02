import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COLOR_LABEL, PIECE_LABEL, pieceAsset } from "@/game/constants";
import type { Color, PieceType } from "@/game/types";

const OPTIONS: PieceType[] = ["queen", "rook", "bishop", "knight"];

interface PromotionDialogProps {
  open: boolean;
  color: Color;
  onSelect: (type: PieceType) => void;
}

/** Diálogo de promoción del peón al alcanzar cualquier borde del tablero. */
const PromotionDialog = ({ open, color, onSelect }: PromotionDialogProps) => (
  <Dialog open={open}>
    <DialogContent className="max-w-[min(92vw,26rem)] [&>button]:hidden">
      <DialogHeader>
        <DialogTitle className="font-display">Promoción — {COLOR_LABEL[color]}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] gap-[0.6rem]">
        {OPTIONS.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            aria-label={`Promover a ${PIECE_LABEL[type]}`}
            className="glass-panel flex min-h-[3.5rem] flex-col items-center gap-1 rounded-xl p-[0.6rem] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--cyan))]"
          >
            <img src={pieceAsset(color, type)} alt="" aria-hidden className="size-[2rem]" />
            <span className="text-[0.7rem] text-muted-foreground">{PIECE_LABEL[type]}</span>
          </button>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default PromotionDialog;
