import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function PWAPrompt() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log("SW registered:", registration);
    },
    onRegisterError(error) {
      console.error("SW registration error", error);
    },
  });

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setIsInstallable(true);
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  if (!isInstallable && !needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-brand rounded-xl p-4 shadow-lg z-50">
      {isInstallable && (
        <div className="flex items-center justify-between">
          <p className="text-white font-medium">
            ¿Querés instalar la app en tu dispositivo?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsInstallable(false)}
              className="px-4 py-2 text-white hover:text-gray-200"
            >
              No, gracias
            </button>
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-white text-brand rounded-lg hover:bg-gray-100"
            >
              Instalar
            </button>
          </div>
        </div>
      )}

      {needRefresh && (
        <div className="flex items-center justify-between">
          <p className="text-white font-medium">
            ¡Hay una nueva versión disponible!
          </p>
          <button
            onClick={() => updateServiceWorker(true)}
            className="px-4 py-2 bg-white text-brand rounded-lg hover:bg-gray-100"
          >
            Actualizar
          </button>
        </div>
      )}
    </div>
  );
}
