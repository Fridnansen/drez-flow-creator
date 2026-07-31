import { defineTool } from "@lovable.dev/mcp-js";
import { SITE_URL, overview } from "../data";

export default defineTool({
  name: "get_play_link",
  title: "Enlace para jugar",
  description:
    "Devuelve el enlace público para jugar al tablero de Masterdrez de cuatro jugadores en el navegador.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const data = { site: SITE_URL, play: overview.playUrl };
    return {
      content: [{ type: "text", text: `Juega en ${data.play}` }],
      structuredContent: data,
    };
  },
});
