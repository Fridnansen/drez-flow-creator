import { defineMcp } from "@lovable.dev/mcp-js";
import getProjectOverview from "./tools/get-project-overview";
import listFeatures from "./tools/list-features";
import getGameRules from "./tools/get-game-rules";
import getPlayLink from "./tools/get-play-link";

export default defineMcp({
  name: "videojuego-masterdrez-2d",
  title: "Videojuego-Masterdrez-2D",
  version: "0.1.0",
  instructions:
    "Herramientas públicas de Masterdrez, el ajedrez para cuatro jugadores. Usa `get_project_overview` para el resumen del proyecto, `list_features` para las características de la plataforma, `get_game_rules` para Estilos, Empates y Modos, y `get_play_link` para el enlace de juego.",
  tools: [getProjectOverview, listFeatures, getGameRules, getPlayLink],
});
