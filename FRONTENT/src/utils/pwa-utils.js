/**
 * Detects if the app is running in standalone mode (installed as PWA)
 * @returns {boolean}
 */
export function isStandalone() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        document.referrer.includes('android-app://')
    );
}

/**
 * Utility to manage the PWA installation prompt
 */
let deferredPrompt = null;

export function setDeferredPrompt(e) {
    deferredPrompt = e;
}

export function getDeferredPrompt() {
    return deferredPrompt;
}

export function clearDeferredPrompt() {
    deferredPrompt = null;
}

/**
 * Triggers the PWA install prompt
 * @returns {Promise<string>} result - 'accepted' or 'dismissed'
 */
export async function presentInstallPrompt() {
    if (!deferredPrompt) {
        return 'not-available';
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome;
}
