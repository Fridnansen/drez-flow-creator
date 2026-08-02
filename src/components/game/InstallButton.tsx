import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Botón "Instalar aplicación": solo aparece si el navegador ofrece la instalación. */
const InstallButton = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setDeferred(null));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferred) return null;

  return (
    <Button
      variant="ghost"
      className="min-h-11 gap-2 text-muted-foreground"
      onClick={async () => {
        await deferred.prompt();
        await deferred.userChoice;
        setDeferred(null);
      }}
    >
      <Download className="size-4" /> Instalar aplicación
    </Button>
  );
};

export default InstallButton;
