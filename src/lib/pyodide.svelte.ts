import { loadPyodide } from 'pyodide';

// Globális állapot, hogy csak egyszer töltse be a Pythont
let pyInstance = $state<any>(null);
let isLoading = $state(false);

export function usePyodide() {
    async function init() {
        if (pyInstance) return pyInstance;
        if (isLoading) return; // Már folyamatban van a betöltés

        isLoading = true;
        try {
            pyInstance = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.1/full/"
            });
        } finally {
            isLoading = false;
        }
        return pyInstance;
    }

    return { 
        init, 
        get instance() { return pyInstance },
        get loading() { return isLoading }
    };
}