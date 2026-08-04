import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Gamepad2,
  GraduationCap,
  Newspaper,
  Play,
  RotateCcw,
  Settings2,
  Trophy,
  User,
} from "lucide-react";
import marca from "@/assets/masterdrez-marca.png.asset.json";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MODE_DESCRIPTION, MODE_LABEL, STYLE_LABEL } from "@/game/constants";
import type { Mode, Style } from "@/game/types";
import InstallButton from "@/components/game/InstallButton";

export type MenuSection = "reglas" | "tutorial" | "ranking" | "perfil" | "noticias" | "ajustes";

interface MainMenuProps {
  hasSave: boolean;
  onPlay: (style: Style, mode: Mode, minutes: number) => void;
  onResume: () => void;
  onOpenSection: (section: MenuSection) => void;
}

const SECTIONS: { id: MenuSection; label: string; icon: typeof Trophy }[] = [
  { id: "tutorial", label: "Tutorial", icon: GraduationCap },
  { id: "reglas", label: "Reglas", icon: BookOpen },
  { id: "ranking", label: "Ranking", icon: Trophy },
  { id: "ajustes", label: "Configuración", icon: Settings2 },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "noticias", label: "Noticias", icon: Newspaper },
];

/** Pantalla principal del videojuego: marca, ajustes rápidos y accesos. */
const MainMenu = ({ hasSave, onPlay, onResume, onOpenSection }: MainMenuProps) => {
  const [style, setStyle] = useState<Style>("dupla");
  const [mode, setMode] = useState<Mode>("genocidio");
  const [minutes, setMinutes] = useState("10");

  return (
    <div className="arena-bg min-h-[100dvh] w-full px-[clamp(1rem,4vw,2.5rem)] py-[clamp(1.5rem,5vh,3rem)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto grid w-full max-w-[75rem] gap-[clamp(1rem,3vw,2rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
      >
        <section className="flex flex-col items-center justify-center gap-[clamp(1rem,3vh,1.75rem)] text-center">
          <img
            src={marca.url}
            alt="Masterdrez — es más que un ajedrez"
            className="w-[min(90%,26rem)] drop-shadow-[0_0_2.5rem_hsl(var(--cyan)/0.25)]"
          />
          <p className="max-w-[38ch] text-[clamp(0.85rem,2.6vw,1rem)] text-muted-foreground">
            Ajedrez en Tablero en Forma de Cruz para cuatro ejércitos. Estilos Duplas y Unitario, con Retorno, Jaque Pase, Aniquilación y Modos tras mate.
          </p>
          <div className="flex w-full max-w-[26rem] flex-col gap-[0.6rem] sm:flex-row">
            <Button size="lg" className="btn-premium min-h-12 flex-1 gap-2 text-base" onClick={() => onPlay(style, mode, Number(minutes))}>
              <Play className="size-5" /> Jugar
            </Button>
            {hasSave && (
              <Button size="lg" variant="outline" className="min-h-12 flex-1 gap-2" onClick={onResume}>
                <RotateCcw className="size-5" /> Continuar
              </Button>
            )}
          </div>
          <InstallButton />
        </section>

        <aside className="glass-panel flex flex-col gap-[0.9rem] rounded-2xl p-[clamp(0.9rem,3vw,1.35rem)]">
          <h2 className="flex items-center gap-2 font-display text-[1.05rem]">
            <Gamepad2 className="size-4 text-[hsl(var(--gold))]" /> Configurar partida
          </h2>

          <div className="grid gap-[0.35rem]">
            <Label htmlFor="style">Estilo</Label>
            <Select value={style} onValueChange={(v) => setStyle(v as Style)}>
              <SelectTrigger id="style" className="min-h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STYLE_LABEL) as Style[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STYLE_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-[0.35rem]">
            <Label htmlFor="mode">Modo tras mate</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <SelectTrigger id="mode" className="min-h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
                  <SelectItem key={m} value={m}>
                    {MODE_LABEL[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[0.72rem] text-muted-foreground">{MODE_DESCRIPTION[mode]}</p>
          </div>

          <div className="grid gap-[0.35rem]">
            <Label htmlFor="clock">Reloj por jugador</Label>
            <Select value={minutes} onValueChange={setMinutes}>
              <SelectTrigger id="clock" className="min-h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["5", "10", "20", "30"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m} minutos
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <nav aria-label="Secciones" className="grid grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-[0.5rem] pt-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant="secondary"
                className="min-h-12 flex-col gap-1 px-2 text-[0.72rem]"
                onClick={() => onOpenSection(id)}
              >
                <Icon className="size-4 text-[hsl(var(--cyan))]" />
                {label}
              </Button>
            ))}
          </nav>
        </aside>
      </motion.div>
    </div>
  );
};

export default MainMenu;
