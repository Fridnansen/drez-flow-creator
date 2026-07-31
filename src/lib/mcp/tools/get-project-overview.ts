import { defineTool } from "@lovable.dev/mcp-js";
import { overview } from "../data";

export default defineTool({
  name: "get_project_overview",
  title: "Resumen del proyecto",
  description:
    "Devuelve el resumen público de Masterdrez: propuesta, ubicación, modelo de negocio, métricas y URL para jugar.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(overview, null, 2) }],
    structuredContent: overview,
  }),
});
