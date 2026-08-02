/**
 * Registro del service worker.
 *
 * Solo se registra en producción real: nunca en desarrollo, dentro de un
 * iframe ni en las previsualizaciones de Lovable. En esos contextos, además,
 * se elimina cualquier registro previo para evitar contenido cacheado.
 */
const SW_URL = "/sw.js";

function isRefusedContext(): boolean {
  if (!import.meta.env.PROD) return true;
  if (typeof window === "undefined") return true;
  if (window.self !== window.top) return true;

  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
  if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;
  if (new URLSearchParams(window.location.search).has("sw")) {
    return new URLSearchParams(window.location.search).get("sw") === "off";
  }
  return false;
}

async function unregisterExisting() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((reg) => reg.active?.scriptURL.endsWith(SW_URL) || reg.installing?.scriptURL.endsWith(SW_URL))
      .map((reg) => reg.unregister()),
  );
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (isRefusedContext()) {
    await unregisterExisting();
    return;
  }
  try {
    const { registerSW } = await import("virtual:pwa-register");
    registerSW({ immediate: true });
  } catch {
    /* el service worker no está disponible en este build */
  }
}
