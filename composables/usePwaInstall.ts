import { ref, onMounted } from 'vue';

export function usePwaInstall() {
    const deferredPrompt = ref<Event | null>(null);
    const showInstallButton = ref(false);

    const installApp = async () => {
        if (!deferredPrompt.value) return;
        const promptEvent = deferredPrompt.value as any;
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
            console.log('PWA installation accepted.');
        } else {
            console.log('PWA installation dismissed.');
        }
        deferredPrompt.value = null;
        showInstallButton.value = false;
    };

    onMounted(() => {
        window.addEventListener('beforeinstallprompt', (event: Event) => {
            event.preventDefault();
            deferredPrompt.value = event;
            showInstallButton.value = true;
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully.');
            showInstallButton.value = false;
        });
    });

    return { showInstallButton, installApp };
}
