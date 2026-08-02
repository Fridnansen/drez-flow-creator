import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MenuSection } from "@/components/game/MainMenu";

const RULES: { title: string; body: string }[] = [
  { title: "Tablero", body: "16×16 casillas con las cuatro esquinas 4×4 fuera de juego. Cuatro ejércitos: Blanco, Azul, Negro y Rojo." },
  { title: "Estilos", body: "Duplas (Blanco+Negro vs Azul+Rojo) o Unitario (cada jugador por su cuenta)." },
  { title: "Retorno", body: "Cuando quedan tres reyes en Duplas, el orden de turnos se reordena entre la dupla y el jugador solitario." },
  { title: "Jaque Pase", body: "El jaque reordena la secuencia de turnos entre el jugador en jaque, el atacante y su aliado." },
  { title: "En Passant Persistente", body: "La captura al paso sigue disponible durante la vuelta completa; tiene prioridad el turno más inmediato." },
  { title: "Enroque", body: "El rey avanza dos casillas hacia una torre sin mover, con el camino libre y sin cruzar casillas atacadas." },
  { title: "Soplo", body: "Al capturar un rey se retiran las piezas que amenazaban su casilla." },
  { title: "Promoción", body: "El peón corona al alcanzar cualquier borde del tablero." },
  { title: "Genocidio", body: "Las piezas del rey capturado se retiran del tablero." },
  { title: "Paz", body: "Las piezas del rey capturado quedan congeladas." },
  { title: "Esclavo", body: "Las piezas del rey capturado pasan a manos del captor." },
  { title: "De Facto", body: "Las piezas del rey capturado las mueve quien tenga el turno." },
];

const TUTORIAL = [
  "Toca una pieza de tu color para seleccionarla: se marcan los destinos legales.",
  "Toca un punto resaltado para mover; el anillo indica captura.",
  "Los peones avanzan hacia el centro y también lateralmente una casilla.",
  "El reloj corre solo para el color en turno; el historial registra cada jugada y regla especial.",
  "Al pulsar Salir la partida se guarda y podrás continuarla desde el menú.",
];

const SOON: Record<string, string> = {
  ranking: "El ranking global con ELO Masterdrez llegará con el modo online.",
  perfil: "El perfil con estadísticas y logros estará disponible al activar cuentas.",
  noticias: "Aquí verás novedades, torneos y actualizaciones del juego.",
  ajustes: "Los ajustes de partida están en el menú principal; pronto añadiremos sonido, tema e idioma.",
};

const TITLES: Record<MenuSection, string> = {
  reglas: "Reglas de Masterdrez",
  tutorial: "Cómo jugar",
  ranking: "Ranking",
  perfil: "Perfil",
  noticias: "Noticias",
  ajustes: "Configuración",
};

interface SectionDialogProps {
  section: MenuSection | null;
  onOpenChange: (open: boolean) => void;
}

/** Diálogo único reutilizado por todas las secciones del menú. */
const SectionDialog = ({ section, onOpenChange }: SectionDialogProps) => (
  <Dialog open={!!section} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[min(94vw,40rem)]">
      <DialogHeader>
        <DialogTitle className="font-display">{section ? TITLES[section] : ""}</DialogTitle>
        {section && SOON[section] && <DialogDescription>{SOON[section]}</DialogDescription>}
      </DialogHeader>
      {section === "reglas" && (
        <ScrollArea className="max-h-[60vh] pr-3">
          <dl className="space-y-[0.75rem]">
            {RULES.map((rule) => (
              <div key={rule.title}>
                <dt className="text-[0.85rem] font-semibold text-[hsl(var(--gold))]">{rule.title}</dt>
                <dd className="text-[0.82rem] text-muted-foreground">{rule.body}</dd>
              </div>
            ))}
          </dl>
        </ScrollArea>
      )}
      {section === "tutorial" && (
        <ol className="space-y-[0.6rem]">
          {TUTORIAL.map((step, i) => (
            <li key={step} className="flex gap-[0.6rem] text-[0.85rem] text-muted-foreground">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.75rem] font-semibold text-foreground">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}
    </DialogContent>
  </Dialog>
);

export default SectionDialog;
