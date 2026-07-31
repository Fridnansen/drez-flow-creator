import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { rules } from "../data";

export default defineTool({
  name: "get_game_rules",
  title: "Reglas del juego",
  description:
    "Devuelve las reglas públicas de Masterdrez (Estilos, Empates y Modos). Se puede pedir un tema específico.",
  inputSchema: {
    topic: z
      .enum(["estilos", "empates", "modos"])
      .optional()
      .describe("Tema de reglas a consultar. Si se omite, devuelve todos."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ topic }) => {
    const items = topic ? rules.filter((r) => r.topic === topic) : rules;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
