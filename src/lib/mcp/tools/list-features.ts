import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { features } from "../data";

export default defineTool({
  name: "list_features",
  title: "Listar características",
  description:
    "Lista las características públicas de la plataforma Masterdrez, con filtro opcional por texto.",
  inputSchema: {
    query: z
      .string()
      .optional()
      .describe("Texto opcional para filtrar características por título o descripción."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const q = query?.trim().toLowerCase();
    const items = q
      ? features.filter(
          (f) => f.title.toLowerCase().includes(q) || f.text.toLowerCase().includes(q),
        )
      : features;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
