/**
 * Register Service Worker for PWA functionality
 */
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                });

                console.log('✅ Service Worker registered:', registration.scope);

                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000); // Check every hour

                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available
                                console.log('🆕 New version available! Reload to update.');

                                // Optionally show a notification to the user
                                if (confirm('A new version of FujiTracker is available. Reload to update?')) {
                                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                                    window.location.reload();
                                }
                            }
                        });
                    }
                });

                // Listen for controller change (new SW activated)
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('🔄 Service Worker controller changed, reloading...');
                    window.location.reload();
                });

            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        });
    } else {
        console.warn('⚠️ Service Workers are not supported in this browser');
    }
}

/**
 * Unregister all service workers (useful for debugging)
 */
export async function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            await registration.unregister();
        }
        console.log('🗑️ All service workers unregistered');
    }
}
