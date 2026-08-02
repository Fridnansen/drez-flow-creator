import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { LogEntry } from "@/game/types";

interface MoveLogProps {
  log: LogEntry[];
  onClear: () => void;
}

/** Historial de jugadas y eventos de reglas especiales. */
const MoveLog = ({ log, onClear }: MoveLogProps) => (
  <section className="glass-panel flex min-h-0 flex-1 flex-col rounded-xl p-[0.7rem]" aria-label="Historial de la partida">
    <header className="mb-[0.4rem] flex items-center justify-between">
      <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Historial</h2>
      <Button variant="ghost" size="sm" className="h-7 px-2 text-[0.7rem]" onClick={onClear}>
        Limpiar
      </Button>
    </header>
    <ScrollArea className="h-[min(28vh,14rem)] pr-2">
      <ol className="space-y-[0.3rem]">
        {log.length === 0 && <li className="text-[0.75rem] text-muted-foreground">Sin jugadas todavía.</li>}
        {log.map((entry) => (
          <li key={entry.id} className="text-[0.75rem] leading-snug text-foreground/85">
            <span className="mr-1 text-muted-foreground tabular-nums">{entry.time}</span>
            {entry.text}
          </li>
        ))}
      </ol>
    </ScrollArea>
  </section>
);

export default MoveLog;
