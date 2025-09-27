'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const PWAInstallPrompt = () => {
    const [hideInstallButton, setHideInstallButton] = useState<boolean>(true);
    const installPrompt = useRef<any | undefined>(undefined)

    function disableInAppInstallPrompt() {
        installPrompt.current = null;
        setHideInstallButton(true)
    }

    useEffect(() => {
        const onBefore = (event: Event) => {
            event.preventDefault();
            installPrompt.current = event;
            setHideInstallButton(false)
        }
        window.addEventListener("beforeinstallprompt", onBefore);
        window.addEventListener("appinstalled", disableInAppInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', onBefore)
            window.removeEventListener("appinstalled", disableInAppInstallPrompt);
        }
    }, [])

    const handleInstall = async () => {
        if (!installPrompt.current) {
            return;
        }
        await installPrompt.current.prompt?.();
        disableInAppInstallPrompt();
    }


    return (
        <div className="flex justify-center">
            {hideInstallButton ? null : (
                <div className="flex items-center gap-2 p-4 border border-success/40 rounded shadow-md mt-4 mb-4" >
                    <h2 className="text-xl font-bold text-success">
                        Instale o aplicativo no seu dispositivo:
                    </h2>
                    
                    <Button size="lg" variant="success" disabled={hideInstallButton} onClick={handleInstall}>Instalar App</Button>
                </div>
            )}
        </div>
    );
};

export default PWAInstallPrompt;
